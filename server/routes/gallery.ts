import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { GalleryPhoto, ApiResponse } from '../../src/types/index.js';

export const galleryRouter = Router();

// Public: List gallery photos
galleryRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const { category } = req.query;

    let photos = await SheetsService.getRecords<GalleryPhoto & { collegeId: string }>('Gallery', collegeId);

    if (category && category !== 'All') {
      photos = photos.filter((p) => p.category === category);
    }

    return res.json({ success: true, data: photos, total: photos.length } as ApiResponse<GalleryPhoto[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch gallery';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Add photo
galleryRouter.post('/', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const schema = z.object({
      title: z.string().min(2),
      category: z.enum(['Events', 'Special Camp', 'Community', 'Environment', 'Volunteers', 'Celebrations']),
      imageUrl: z.string(),
      aspectRatio: z.enum(['landscape', 'portrait', 'square']).default('landscape'),
      date: z.string().default('2026'),
      location: z.string().default('College Campus'),
      caption: z.string().default(''),
      eventAssociated: z.string().optional(),
    });

    const parsed = schema.parse(req.body);
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;

    const newPhoto: GalleryPhoto & { collegeId: string } = {
      id: `gal-${Date.now()}`,
      collegeId,
      ...parsed,
    };

    const saved = await SheetsService.addRecord('Gallery', newPhoto);
    await AuditLogger.log(req, 'GALLERY_PHOTO_ADDED', 'gallery', `Added photo: "${newPhoto.title}"`);

    return res.status(201).json({ success: true, data: saved, message: 'Photo added to archive' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to add photo';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Delete photo
galleryRouter.delete('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await SheetsService.deleteRecord('Gallery', id);
    await AuditLogger.log(req, 'GALLERY_PHOTO_DELETED', 'gallery', `Deleted photo ID ${id}`);
    return res.json({ success: true, message: 'Photo removed from gallery' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete photo';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});
