import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { type User, type Role, type AuditLogEntry, type Permission, ROLE_PERMISSIONS } from '../../src/types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
  collegeId?: string;
}

export function signToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      collegeId: user.collegeId,
      collegeName: user.collegeName,
    },
    SERVER_CONFIG.jwtSecret,
    { expiresIn: '7d' }
  );
}

export function signTempToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      stage: '2fa_pending',
    },
    SERVER_CONFIG.jwtSecret,
    { expiresIn: '10m' }
  );
}

export function verifyTempToken(token: string): { id: string; email: string; role: Role; stage: string } | null {
  try {
    const decoded = jwt.verify(token, SERVER_CONFIG.jwtSecret) as { id: string; email: string; role: Role; stage: string };
    if (decoded.stage === '2fa_pending') {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || (req.headers['x-auth-token'] as string);
  
  // Also detect collegeId from header or query or fallback to default
  const requestedCollegeId = (req.headers['x-college-id'] as string) || (req.query.collegeId as string) || SERVER_CONFIG.defaultCollegeId;
  req.collegeId = requestedCollegeId;

  if (!authHeader) {
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, SERVER_CONFIG.jwtSecret) as User;
    req.user = decoded;
    const isSuperAdminTier = decoded.role === 'superadmin' || decoded.role === 'super_admin_1' || decoded.role === 'super_admin_2';
    if (!isSuperAdminTier && decoded.collegeId) {
      req.collegeId = decoded.collegeId;
    }
  } catch {
    // Invalid/expired token - continue as unauthenticated
  }

  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to continue.',
    });
  }
  next();
}

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}

/**
 * Enforce fine-grained permission-based access control.
 * Checks both the role's canonical permission map and any user-specific assigned permissions.
 */
export function requirePermission(...requiredPermissions: Permission[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in.',
      });
    }

    const userRole = req.user.role;
    const rolePerms = ROLE_PERMISSIONS[userRole] || [];
    const customPerms = req.user.permissions || [];
    const allPerms = new Set<string>([...rolePerms, ...customPerms]);

    const missingPerms = requiredPermissions.filter((perm) => !allPerms.has(perm));
    if (missingPerms.length > 0) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required permission(s) missing: ${missingPerms.join(', ')}`,
      });
    }

    next();
  };
}

export class AuditLogger {
  public static async log(
    req: AuthenticatedRequest,
    action: string,
    domain: AuditLogEntry['domain'],
    details: string
  ) {
    try {
      const entry: AuditLogEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        actorEmail: req.user ? req.user.email : 'public_user',
        actorRole: req.user ? req.user.role : 'public',
        collegeId: req.collegeId || SERVER_CONFIG.defaultCollegeId,
        action,
        domain,
        details,
        ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1',
      };
      await SheetsService.addRecord('AuditLogs', entry);
    } catch (e) {
      console.warn('Audit logging failed:', e);
    }
  }
}
