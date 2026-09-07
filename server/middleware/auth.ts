import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import type { User, Role, AuditLogEntry } from '../../src/types/index.js';

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
    if (decoded.role !== 'superadmin' && decoded.collegeId) {
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
