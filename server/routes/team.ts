import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { TeamMember, ApiResponse } from '../../src/types/index.js';

export const teamRouter = Router();

const teamSchema = z.object({
  name: z.string().min(2),
  designation: z.string().min(2),
  roleType: z.enum(['leadership', 'programme_officer', 'student_coordinator']),
  department: z.string(),
  bio: z.string(),
  image: z.string(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  badge: z.string().optional(),
});

teamRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const team = await SheetsService.getRecords<TeamMember & { collegeId: string }>('Team', collegeId);
    return res.json({ success: true, data: team, total: team.length } as ApiResponse<TeamMember[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch team members';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

teamRouter.post('/', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = teamSchema.parse(req.body);
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;

    const newMember: TeamMember & { collegeId: string } = {
      id: `tm-${Date.now()}`,
      collegeId,
      ...parsed,
    };

    const saved = await SheetsService.addRecord('Team', newMember);
    await AuditLogger.log(req, 'TEAM_MEMBER_ADDED', 'team', `Added team member: "${newMember.name}"`);

    return res.status(201).json({ success: true, data: saved, message: 'Team member added' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to add team member';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

teamRouter.put('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const updated = await SheetsService.updateRecord('Team', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Team member not found' } as ApiResponse);
    }
    await AuditLogger.log(req, 'TEAM_MEMBER_UPDATED', 'team', `Updated team member ID ${id}`);
    return res.json({ success: true, data: updated, message: 'Team member updated' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update team member';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

teamRouter.delete('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await SheetsService.deleteRecord('Team', id);
    await AuditLogger.log(req, 'TEAM_MEMBER_DELETED', 'team', `Deleted team member ID ${id}`);
    return res.json({ success: true, message: 'Team member removed' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete team member';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});
