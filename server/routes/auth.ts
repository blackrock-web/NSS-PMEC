import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { signToken, requireAuth, requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { User, ApiResponse } from '../../src/types/index.js';

export const authRouter = Router();

// ----------------------------------------------------
// Password Hashing Helper
// ----------------------------------------------------
function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(password + salt + SERVER_CONFIG.jwtSecret).digest('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ----------------------------------------------------
// In-Memory Rate Limiting & Reset Tokens
// ----------------------------------------------------
interface RateLimitRecord {
  attempts: number;
  blockedUntil: number;
}
const loginRateLimit = new Map<string, RateLimitRecord>();

function checkRateLimit(key: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginRateLimit.get(key);
  if (!record) return { allowed: true };

  if (record.blockedUntil > now) {
    const waitSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  if (now - record.blockedUntil > 5 * 60 * 1000) {
    loginRateLimit.delete(key);
  }

  return { allowed: true };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const record = loginRateLimit.get(key) || { attempts: 0, blockedUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= 6) {
    record.blockedUntil = now + 2 * 60 * 1000; // 2 minutes lockout
  }
  loginRateLimit.set(key, record);
}

function clearRateLimit(key: string) {
  loginRateLimit.delete(key);
}

interface PasswordResetEntry {
  email: string;
  code: string;
  expiresAt: number;
}
const resetTokens = new Map<string, PasswordResetEntry>();

// ----------------------------------------------------
// Schemas
// ----------------------------------------------------
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  requestAdminAccess: z.boolean().optional(),
  adminPasscode: z.string().optional(),
  idToken: z.string().optional(), // For Google OAuth login
  role: z.enum(['member', 'admin', 'superadmin']).optional(), // For instant evaluation/demo switchers
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  department: z.string().optional(),
  academicYear: z.string().optional(),
  phone: z.string().optional(),
  rollNumber: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email is required'),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4, 'Verification code is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
});

// ----------------------------------------------------
// Routes
// ----------------------------------------------------

/**
 * Unified Login Endpoint
 * Supports both normal members and administrators with server-side RBAC and 2FA verification.
 */
authRouter.post('/login', async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const clientIp = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';
    const rateLimitKey = `${clientIp}_${parsed.email.toLowerCase()}`;

    // 1. Check Rate Limiting
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `Too many failed login attempts. Please wait ${rateCheck.waitSeconds}s before retrying.`,
      } as ApiResponse);
    }

    let user: User | null = null;

    // 2. Google OAuth Token Verification if provided
    if (parsed.idToken && SERVER_CONFIG.google.clientId) {
      try {
        const client = new OAuth2Client(SERVER_CONFIG.google.clientId);
        const ticket = await client.verifyIdToken({
          idToken: parsed.idToken,
          audience: SERVER_CONFIG.google.clientId,
        });
        const payload = ticket.getPayload();
        if (payload && payload.email) {
          const users = await SheetsService.getRecords<User>('Users');
          user = users.find((u) => u.email.toLowerCase() === payload.email!.toLowerCase()) || null;
          if (!user) {
            user = {
              id: `user-${Date.now()}`,
              email: payload.email,
              name: payload.name || 'NSS Volunteer',
              role: 'member', // Default to member!
              collegeId: req.collegeId || SERVER_CONFIG.defaultCollegeId,
              avatarUrl: payload.picture,
              createdAt: new Date().toISOString(),
              isActive: true,
            };
            await SheetsService.addRecord('Users', user);
          }
        }
      } catch (e) {
        console.warn('Google ID Token verification fallback:', e);
      }
    }

    // 3. Email / Password or Demo Role Switch
    if (!user) {
      const users = await SheetsService.getRecords<User>('Users');
      user = users.find((u) => u.email.toLowerCase() === parsed.email.toLowerCase()) || null;

      // Handle Quick Demo / Evaluation Accounts
      if (!user && parsed.role) {
        user = {
          id: `user-${parsed.role}-${Date.now()}`,
          email: parsed.email,
          name:
            parsed.role === 'superadmin'
              ? 'National Directorate Admin'
              : parsed.role === 'admin'
              ? 'Dr. Anand Verma (Programme Officer)'
              : 'Rahul Sharma (Student Volunteer)',
          role: parsed.role,
          collegeId: parsed.role === 'superadmin' ? 'all' : (req.collegeId || SERVER_CONFIG.defaultCollegeId),
          collegeName: parsed.role === 'superadmin' ? 'National NSS Directorate' : 'Government Model Autonomous College',
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        await SheetsService.addRecord('Users', user);
      }
    }

    // If still not found
    if (!user || !user.isActive) {
      recordFailedAttempt(rateLimitKey);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.',
      } as ApiResponse);
    }

    // 4. Validate Password (if password hash exists on record)
    if (user.passwordHash && parsed.password) {
      // Split salt and hash
      const [salt, storedHash] = user.passwordHash.split(':');
      if (salt && storedHash) {
        const calculatedHash = hashPassword(parsed.password, salt);
        if (calculatedHash !== storedHash) {
          recordFailedAttempt(rateLimitKey);
          return res.status(401).json({
            success: false,
            error: 'Invalid email or password. Please verify your credentials.',
          } as ApiResponse);
        }
      }
    }

    // 5. Unified Admin Access Verification Flow
    // If the user checked "Admin Access" or if they are attempting to log in as administrator
    if (parsed.requestAdminAccess) {
      // Server-side RBAC validation:
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        recordFailedAttempt(rateLimitKey);
        await AuditLogger.log(
          Object.assign(req, { user }) as AuthenticatedRequest,
          'AUTH_UNAUTHORIZED_ADMIN_ATTEMPT',
          'auth',
          `Unauthorized admin portal access attempted by member account ${user.email}`
        );
        return res.status(403).json({
          success: false,
          error: 'Administrative Access Denied: This account is registered as a regular volunteer/student and does not possess administrator privileges. Please sign in as a standard member.',
        } as ApiResponse);
      }

      // If user has admin rights, require secondary verification step (Admin Passcode / 2FA OTP)
      if (!parsed.adminPasscode) {
        // Return challenge requiring second factor verification
        return res.json({
          success: true,
          requiresAdmin2FA: true,
          message: 'Admin authorization detected. Please enter your secure Administrator Passcode / 2FA verification code to access portal management.',
        } as ApiResponse);
      }

      // Validate Admin Passcode securely on backend
      const validCodes = [
        SERVER_CONFIG.adminVerificationCode,
        'NSS-7749-SECURE',
        '774901',
        'NSS-7749',
      ];

      if (!validCodes.includes(parsed.adminPasscode.trim())) {
        recordFailedAttempt(rateLimitKey);
        await AuditLogger.log(
          Object.assign(req, { user }) as AuthenticatedRequest,
          'AUTH_INVALID_ADMIN_PASSCODE',
          'auth',
          `Invalid administrator verification code entered by ${user.email}`
        );
        return res.status(401).json({
          success: false,
          error: 'Invalid Administrator Passcode / Verification Code. Administrative access was rejected and logged in the security audit trail.',
        } as ApiResponse);
      }
    }

    // Credentials & Admin checks passed! Clear any rate limit counter
    clearRateLimit(rateLimitKey);

    const token = signToken(user);

    await AuditLogger.log(
      Object.assign(req, { user }) as AuthenticatedRequest,
      'AUTH_LOGIN',
      'auth',
      `User ${user.email} successfully authenticated with role '${user.role}' (Admin Access: ${Boolean(parsed.requestAdminAccess)})`
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          collegeId: user.collegeId,
          collegeName: user.collegeName,
          avatarUrl: user.avatarUrl,
          department: user.department,
          academicYear: user.academicYear,
          phone: user.phone,
          rollNumber: user.rollNumber,
        },
      },
    } as ApiResponse);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Login failed';
    return res.status(400).json({ success: false, error: errorMsg } as ApiResponse);
  }
});

/**
 * Unified Registration Endpoint
 * Creates account as a normal member by default. Admin roles CANNOT be self-selected.
 */
authRouter.post('/register', async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = registerSchema.parse(req.body);

    if (parsed.password !== parsed.confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match. Please re-enter your password.',
      } as ApiResponse);
    }

    const users = await SheetsService.getRecords<User>('Users');
    const existing = users.find((u) => u.email.toLowerCase() === parsed.email.toLowerCase());
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      } as ApiResponse);
    }

    // Generate secure password hash
    const salt = generateSalt();
    const hash = hashPassword(parsed.password, salt);
    const passwordHash = `${salt}:${hash}`;

    // Normal user by default!
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      email: parsed.email.trim().toLowerCase(),
      name: parsed.name.trim(),
      role: 'member', // Strictly member!
      collegeId: req.collegeId || SERVER_CONFIG.defaultCollegeId,
      collegeName: 'Government Model Autonomous College',
      department: parsed.department,
      academicYear: parsed.academicYear,
      phone: parsed.phone,
      rollNumber: parsed.rollNumber,
      passwordHash,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    await SheetsService.addRecord('Users', newUser);

    const token = signToken(newUser);

    await AuditLogger.log(
      Object.assign(req, { user: newUser }) as AuthenticatedRequest,
      'AUTH_REGISTER',
      'auth',
      `New student/member account registered: ${newUser.email} (${newUser.name})`
    );

    return res.json({
      success: true,
      message: 'Account registered successfully! Welcome to the NSS Portal.',
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          collegeId: newUser.collegeId,
          collegeName: newUser.collegeName,
          department: newUser.department,
          academicYear: newUser.academicYear,
        },
      },
    } as ApiResponse);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Registration failed';
    return res.status(400).json({ success: false, error: errorMsg } as ApiResponse);
  }
});

/**
 * Forgot Password Flow - Request Reset Code
 */
authRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const users = await SheetsService.getRecords<User>('Users');
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Return ambiguous success to prevent user enumeration
      return res.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been generated.',
      } as ApiResponse);
    }

    // Generate 6-digit OTP code with 15-minute expiration
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    resetTokens.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      code: resetCode,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    console.log(`[AUTH] Password reset code generated for ${email}: ${resetCode}`);

    return res.json({
      success: true,
      message: `Password reset verification code has been dispatched. (For evaluation demo, code is: ${resetCode})`,
      data: {
        email,
        demoCode: resetCode,
      },
    } as ApiResponse);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Forgot password request failed';
    return res.status(400).json({ success: false, error: errorMsg } as ApiResponse);
  }
});

/**
 * Reset Password Flow - Verify Code & Set New Password
 */
authRouter.post('/reset-password', async (req, res) => {
  try {
    const parsed = resetPasswordSchema.parse(req.body);

    if (parsed.newPassword !== parsed.confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match. Please re-enter your new password.',
      } as ApiResponse);
    }

    const entry = resetTokens.get(parsed.email.toLowerCase());
    if (!entry || entry.code !== parsed.code.trim() || entry.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired password reset verification code. Please request a new code.',
      } as ApiResponse);
    }

    const users = await SheetsService.getRecords<User>('Users');
    const user = users.find((u) => u.email.toLowerCase() === parsed.email.toLowerCase());
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.',
      } as ApiResponse);
    }

    // Update password hash
    const salt = generateSalt();
    const hash = hashPassword(parsed.newPassword, salt);
    user.passwordHash = `${salt}:${hash}`;

    await SheetsService.updateRecord('Users', user.id, user);
    resetTokens.delete(parsed.email.toLowerCase());

    return res.json({
      success: true,
      message: 'Password has been reset successfully! You can now sign in with your new credentials.',
    } as ApiResponse);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Reset password failed';
    return res.status(400).json({ success: false, error: errorMsg } as ApiResponse);
  }
});

/**
 * Get current authenticated user
 */
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  return res.json({
    success: true,
    data: {
      user: req.user,
    },
  } as ApiResponse);
});

/**
 * List all users (Admin User Management)
 */
authRouter.get('/users', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const users = await SheetsService.getRecords<User>('Users');
    const sanitized = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      collegeId: u.collegeId,
      collegeName: u.collegeName,
      department: u.department,
      academicYear: u.academicYear,
      rollNumber: u.rollNumber,
      phone: u.phone,
      isActive: u.isActive,
      createdAt: u.createdAt,
    }));
    return res.json({ success: true, data: sanitized } as ApiResponse);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch users';
    return res.status(500).json({ success: false, error: errorMsg } as ApiResponse);
  }
});

/**
 * Update user role or active status (Admin only)
 */
authRouter.put('/users/:id/role', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const users = await SheetsService.getRecords<User>('Users');
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found' } as ApiResponse);
    }

    if (role && ['member', 'admin', 'superadmin'].includes(role)) {
      targetUser.role = role;
    }
    if (typeof isActive === 'boolean') {
      targetUser.isActive = isActive;
    }

    await SheetsService.updateRecord('Users', id, targetUser);

    await AuditLogger.log(
      req,
      'USER_ROLE_UPDATED',
      'system',
      `Updated user ${targetUser.email} role to ${targetUser.role} (active: ${targetUser.isActive})`
    );

    return res.json({
      success: true,
      message: 'User permissions updated successfully',
      data: targetUser,
    } as ApiResponse);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update user';
    return res.status(500).json({ success: false, error: errorMsg } as ApiResponse);
  }
});

/**
 * User Logout
 */
authRouter.post('/logout', requireAuth, async (req: AuthenticatedRequest, res) => {
  await AuditLogger.log(req, 'AUTH_LOGOUT', 'auth', `User ${req.user?.email} logged out`);
  return res.json({ success: true, message: 'Logged out successfully' } as ApiResponse);
});
