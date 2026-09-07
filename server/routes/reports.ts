import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { ReportItem, ApiResponse } from '../../src/types/index.js';

export const reportsRouter = Router();

const reportSchema = z.object({
  title: z.string().min(3),
  academicYear: z.enum(['2025–26', '2024–25']),
  category: z.enum(['Annual', 'Special Camp', 'Blood Donation', 'Environment', 'Social Drive']),
  datePublished: z.string(),
  fileSize: z.string(),
  pages: z.number().nonnegative(),
  preparedBy: z.string(),
  description: z.string(),
  downloadUrl: z.string(),
});

reportsRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const reports = await SheetsService.getRecords<ReportItem & { collegeId: string }>('Reports', collegeId);
    return res.json({ success: true, data: reports, total: reports.length } as ApiResponse<ReportItem[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch reports';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

reportsRouter.post('/', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = reportSchema.parse(req.body);
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;

    const newReport: ReportItem & { collegeId: string } = {
      id: `rep-${Date.now()}`,
      collegeId,
      ...parsed,
    };

    const saved = await SheetsService.addRecord('Reports', newReport);
    await AuditLogger.log(req, 'REPORT_UPLOADED', 'reports', `Uploaded official report: "${newReport.title}"`);

    return res.status(201).json({ success: true, data: saved, message: 'Report published' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save report';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

reportsRouter.delete('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await SheetsService.deleteRecord('Reports', id);
    await AuditLogger.log(req, 'REPORT_DELETED', 'reports', `Deleted report ID ${id}`);
    return res.json({ success: true, message: 'Report removed' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete report';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});
