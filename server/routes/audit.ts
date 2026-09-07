import { Router } from 'express';
import { SheetsService } from '../google/sheets.js';
import { requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import type { AuditLogEntry, ApiResponse } from '../../src/types/index.js';

export const auditRouter = Router();

// Superadmin: View audit logs
auditRouter.get('/', requireRole('superadmin', 'admin'), async (req: AuthenticatedRequest, res) => {
  try {
    const isSuperadmin = req.user?.role === 'superadmin';
    const collegeId = isSuperadmin ? undefined : req.user?.collegeId;

    const logs = await SheetsService.getRecords<AuditLogEntry>('AuditLogs', collegeId);
    return res.json({ success: true, data: logs, total: logs.length } as ApiResponse<AuditLogEntry[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve audit logs';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});
