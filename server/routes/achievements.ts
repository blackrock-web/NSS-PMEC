import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { Achievement, ApiResponse } from '../../src/types/index.js';

export const achievementsRouter = Router();

const achievementSchema = z.object({
  title: z.string().min(3),
  year: z.string(),
  category: z.enum(['Award', 'Recognition', 'Certificate', 'Milestone']),
  awardingBody: z.string(),
  description: z.string(),
  image: z.string(),
  citation: z.string().optional(),
});

achievementsRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const achievements = await SheetsService.getRecords<Achievement & { collegeId: string }>('Achievements', collegeId);
    return res.json({ success: true, data: achievements, total: achievements.length } as ApiResponse<Achievement[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch achievements';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

achievementsRouter.post('/', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = achievementSchema.parse(req.body);
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;

    const newAch: Achievement & { collegeId: string } = {
      id: `ach-${Date.now()}`,
      collegeId,
      ...parsed,
    };

    const saved = await SheetsService.addRecord('Achievements', newAch);
    await AuditLogger.log(req, 'ACHIEVEMENT_CREATED', 'settings', `Created achievement: "${newAch.title}"`);

    return res.status(201).json({ success: true, data: saved, message: 'Achievement recorded' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save achievement';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

achievementsRouter.put('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const updated = await SheetsService.updateRecord('Achievements', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Achievement not found' } as ApiResponse);
    }
    await AuditLogger.log(req, 'ACHIEVEMENT_UPDATED', 'settings', `Updated achievement ID ${id}`);
    return res.json({ success: true, data: updated, message: 'Achievement updated' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update achievement';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

achievementsRouter.delete('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await SheetsService.deleteRecord('Achievements', id);
    await AuditLogger.log(req, 'ACHIEVEMENT_DELETED', 'settings', `Deleted achievement ID ${id}`);
    return res.json({ success: true, message: 'Achievement deleted' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete achievement';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});
