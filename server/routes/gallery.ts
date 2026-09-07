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

// Public: Get featured top-picks gallery photos for homepage slideshow
galleryRouter.get('/featured', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const photos = await SheetsService.getRecords<GalleryPhoto & { collegeId: string }>('Gallery', collegeId);
    let featured = photos.filter((p) => (p as any).isFeatured || (p as any).featured);

    // Fallback to top 5 if none flagged
    if (featured.length === 0) {
      featured = photos.slice(0, 5);
    }

    return res.json({ success: true, data: featured, total: featured.length } as ApiResponse<GalleryPhoto[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch featured gallery items';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Add photo
galleryRouter.post('/', requireRole('coordinator', 'admin', 'super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
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
      isFeatured: z.boolean().optional(),
      featuredOrder: z.number().optional(),
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

// Admin: Update photo (e.g. toggle featured status)
galleryRouter.put('/:id', requireRole('coordinator', 'admin', 'super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const updated = await SheetsService.updateRecord('Gallery', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Photo not found' } as ApiResponse);
    }
    await AuditLogger.log(req, 'GALLERY_PHOTO_UPDATED', 'gallery', `Updated photo ${id}`);
    return res.json({ success: true, data: updated, message: 'Photo updated' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update photo';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Delete photo
galleryRouter.delete('/:id', requireRole('admin', 'super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
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
