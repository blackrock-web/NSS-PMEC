import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Role, Permission, ROLE_PERMISSIONS } from '../../src/types/index.js';

export function checkPermission(role: Role, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}

export function requirePermission(...requiredPermissions: Permission[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in.',
      });
    }

    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasAll = requiredPermissions.every((p) => userPermissions.includes(p));
    if (!hasAll) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: Missing permissions [${requiredPermissions.join(', ')}]. Current role: ${userRole}`,
      });
    }

    next();
  };
}

export function requireSuperAdminLevel2(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.',
    });
  }

  if (req.user.role !== 'super_admin_2') {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Super Admin Level 2 authorization required.',
    });
  }

  next();
}

export function requireSuperAdminLevel1OrAbove(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.',
    });
  }

  const allowed: Role[] = ['super_admin_1', 'superadmin', 'super_admin_2'];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Super Admin Level 1 or higher authorization required.',
    });
  }

  next();
}

export function requireAdminOrAbove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.',
    });
  }

  const allowed: Role[] = ['admin', 'super_admin_1', 'superadmin', 'super_admin_2'];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Admin authorization required.',
    });
  }

  next();
}

export function requireCoordinatorOrAbove(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.',
    });
  }

  const allowed: Role[] = ['coordinator', 'admin', 'super_admin_1', 'superadmin', 'super_admin_2'];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Coordinator or Admin authorization required.',
    });
  }

  next();
}
