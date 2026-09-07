import { Router } from 'express';
import multer from 'multer';
import { SERVER_CONFIG } from '../config.js';
import { DriveService } from '../google/drive.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { ApiResponse, StorageQuota } from '../../src/types/index.js';

export const uploadsRouter = Router();

// Configure Multer with memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: SERVER_CONFIG.maxUploadSizeBytes,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only JPEG, PNG, WEBP, SVG and PDF files are allowed.'));
    }
  },
});

// Admin: Upload image to Google Drive
uploadsRouter.post(
  '/image',
  requireRole('admin', 'superadmin'),
  upload.single('file') as any,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' } as ApiResponse);
      }

      const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;
      const subfolder = (req.body.subfolder as 'images' | 'gallery') || 'images';

      const uploadResult = await DriveService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        collegeId,
        subfolder
      );

      await AuditLogger.log(
        req,
        'FILE_UPLOADED_DRIVE',
        'gallery',
        `Uploaded ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB) to Drive subfolder /${subfolder}`
      );

      return res.status(201).json({
        success: true,
        data: uploadResult,
        message: 'Image uploaded successfully to Google Drive',
      } as ApiResponse);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'File upload failed';
      return res.status(500).json({ success: false, error: msg } as ApiResponse);
    }
  }
);

// Admin: Upload PDF report to Google Drive
uploadsRouter.post(
  '/pdf',
  requireRole('admin', 'superadmin'),
  upload.single('file') as any,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No PDF file uploaded' } as ApiResponse);
      }

      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, error: 'File must be a PDF document' } as ApiResponse);
      }

      const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;

      const uploadResult = await DriveService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        collegeId,
        'reports'
      );

      // Estimate page count from PDF buffer by counting "/Type /Page" markers
      const pdfString = req.file.buffer.toString('binary');
      const pageMatches = pdfString.match(/\/Type\s*\/Page[^s]/g);
      const estimatedPages = pageMatches ? pageMatches.length : Math.max(1, Math.round(req.file.size / 75000));

      const sizeInMb = (req.file.size / (1024 * 1024)).toFixed(1);
      const fileSize = `${sizeInMb} MB`;

      await AuditLogger.log(
        req,
        'PDF_REPORT_UPLOADED_DRIVE',
        'reports',
        `Uploaded official PDF ${req.file.originalname} (${fileSize}) to Google Drive`
      );

      return res.status(201).json({
        success: true,
        data: {
          ...uploadResult,
          fileSize,
          pages: estimatedPages,
        },
        message: 'Official report uploaded successfully to Google Drive',
      } as ApiResponse);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'PDF upload failed';
      return res.status(500).json({ success: false, error: msg } as ApiResponse);
    }
  }
);

// Admin: Get Google Drive storage usage
uploadsRouter.get('/storage', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;
    const usage = await DriveService.getStorageUsage(collegeId);
    return res.json({ success: true, data: usage } as ApiResponse<StorageQuota>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query storage usage';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});
