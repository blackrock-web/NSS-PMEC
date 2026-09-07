import { Router } from 'express';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { signToken, requireAuth, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { User, ApiResponse } from '../../src/types/index.js';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  idToken: z.string().optional(), // For Google OAuth login
  role: z.enum(['admin', 'superadmin']).optional(), // For instant local demo sign-in
});

authRouter.post('/login', async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    let user: User | null = null;

    // 1. Google OAuth Token Verification if provided
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
            // Auto-provision standard admin for college email domain or default
            user = {
              id: `user-${Date.now()}`,
              email: payload.email,
              name: payload.name || 'NSS Officer',
              role: 'admin',
              collegeId: req.collegeId || SERVER_CONFIG.defaultCollegeId,
              avatarUrl: payload.picture,
              createdAt: new Date().toISOString(),
              isActive: true,
            };
            await SheetsService.addRecord('Users', user);
          }
        }
      } catch (e) {
        console.warn('Google ID Token verification failed, fallback to credential auth:', e);
      }
    }

    // 2. Email / Password or Demo Role Switch
    if (!user) {
      const users = await SheetsService.getRecords<User>('Users');
      user = users.find((u) => u.email.toLowerCase() === parsed.email.toLowerCase()) || null;

      // If user not found but role specified in login payload (e.g. quick admin login from dashboard)
      if (!user && parsed.role) {
        user = {
          id: `user-${parsed.role}-${Date.now()}`,
          email: parsed.email,
          name: parsed.role === 'superadmin' ? 'National Directorate Admin' : 'Dr. Anand Verma (Programme Officer)',
          role: parsed.role,
          collegeId: parsed.role === 'superadmin' ? 'all' : (req.collegeId || SERVER_CONFIG.defaultCollegeId),
          collegeName: parsed.role === 'superadmin' ? 'National NSS Directorate' : 'Government Model Autonomous College',
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        await SheetsService.addRecord('Users', user);
      }
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or inactive user account.',
      } as ApiResponse);
    }

    const token = signToken(user);

    await AuditLogger.log(
      Object.assign(req, { user }) as AuthenticatedRequest,
      'AUTH_LOGIN',
      'auth',
      `User ${user.email} signed in successfully with role ${user.role}`
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
        },
      },
    } as ApiResponse);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Login failed';
    return res.status(400).json({ success: false, error: errorMsg } as ApiResponse);
  }
});

authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  return res.json({
    success: true,
    data: {
      user: req.user,
    },
  } as ApiResponse);
});

authRouter.post('/logout', requireAuth, async (req: AuthenticatedRequest, res) => {
  await AuditLogger.log(req, 'AUTH_LOGOUT', 'auth', `User ${req.user?.email} logged out`);
  return res.json({ success: true, message: 'Logged out successfully' } as ApiResponse);
});
