import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { Activity, ApiResponse } from '../../src/types/index.js';

export const activitiesRouter = Router();

const activitySchema = z.object({
  title: z.string().min(3),
  category: z.enum([
    'Environment',
    'Health & Wellbeing',
    'Education',
    'Community Development',
    'Social Awareness',
    'National Integration',
    'Special Camp',
  ]),
  date: z.string(),
  location: z.string(),
  shortDescription: z.string(),
  fullDescription: z.string(),
  image: z.string(),
  volunteersInvolved: z.number().nonnegative(),
  beneficiaries: z.string(),
  highlights: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

// Public: List activities
activitiesRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const { category, featured } = req.query;

    let activities = await SheetsService.getRecords<Activity & { collegeId: string }>('Activities', collegeId);

    if (category && category !== 'All') {
      activities = activities.filter((a) => a.category === category);
    }
    if (featured === 'true') {
      activities = activities.filter((a) => a.featured);
    }

    return res.json({ success: true, data: activities, total: activities.length } as ApiResponse<Activity[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch activities';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Public: Get single activity
activitiesRouter.get('/:idOrSlug', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const { idOrSlug } = req.params;
    const activities = await SheetsService.getRecords<Activity & { collegeId: string }>('Activities', collegeId);
    const activity = activities.find((a) => a.id === idOrSlug || a.slug === idOrSlug);

    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' } as ApiResponse);
    }

    return res.json({ success: true, data: activity } as ApiResponse<Activity>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch activity';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Create activity
activitiesRouter.post('/', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = activitySchema.parse(req.body);
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;
    const slug = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newActivity: Activity & { collegeId: string } = {
      id: `act-${Date.now()}`,
      collegeId,
      slug,
      ...parsed,
      highlights: parsed.highlights || [],
      featured: parsed.featured ?? false,
    };

    const saved = await SheetsService.addRecord('Activities', newActivity);
    await AuditLogger.log(req, 'ACTIVITY_CREATED', 'activities', `Created activity: "${newActivity.title}"`);

    return res.status(201).json({ success: true, data: saved, message: 'Activity recorded successfully' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create activity';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Update activity
activitiesRouter.put('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const updated = await SheetsService.updateRecord('Activities', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Activity not found' } as ApiResponse);
    }
    await AuditLogger.log(req, 'ACTIVITY_UPDATED', 'activities', `Updated activity ID ${id}`);
    return res.json({ success: true, data: updated, message: 'Activity updated successfully' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update activity';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Delete activity
activitiesRouter.delete('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await SheetsService.deleteRecord('Activities', id);
    await AuditLogger.log(req, 'ACTIVITY_DELETED', 'activities', `Deleted activity ID ${id}`);
    return res.json({ success: true, message: 'Activity deleted successfully' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete activity';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});
