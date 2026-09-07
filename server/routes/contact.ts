import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { ContactMessageRecord, ApiResponse } from '../../src/types/index.js';

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  category: z.enum(['General Inquiry', 'Volunteer Enrollment', 'Event Collaboration', 'Report Verification']),
  message: z.string().min(10),
});

contactRouter.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = contactSchema.parse(req.body);
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;

    const newMsg: ContactMessageRecord = {
      id: `msg-${Date.now()}`,
      collegeId,
      ...parsed,
      status: 'unread',
      submittedAt: new Date().toISOString(),
    };

    const saved = await SheetsService.addRecord('ContactMessages', newMsg);
    await AuditLogger.log(req, 'CONTACT_MESSAGE_RECEIVED', 'system', `Message received from ${saved.name} (${saved.email})`);

    return res.status(201).json({
      success: true,
      data: saved,
      message: 'Your inquiry has been received by the NSS Cell. Our coordinators will respond promptly.',
    } as ApiResponse<ContactMessageRecord>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid contact message submission';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

contactRouter.get('/admin', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.user?.role === 'superadmin' ? undefined : (req.user?.collegeId || SERVER_CONFIG.defaultCollegeId);
    const { status } = req.query;

    let messages = await SheetsService.getRecords<ContactMessageRecord>('ContactMessages', collegeId);

    if (status && status !== 'all') {
      messages = messages.filter((m) => m.status === status);
    }

    return res.json({ success: true, data: messages, total: messages.length } as ApiResponse<ContactMessageRecord[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch contact messages';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

contactRouter.put('/admin/:id/reply', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { replyNotes, status } = req.body;

    const updated = await SheetsService.updateRecord<ContactMessageRecord>('ContactMessages', id, {
      status: status || 'replied',
      replyNotes: replyNotes || '',
      repliedAt: new Date().toISOString(),
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Message not found' } as ApiResponse);
    }

    await AuditLogger.log(req, 'CONTACT_REPLY_RECORDED', 'system', `Replied to contact message from ${updated.name}`);

    return res.json({ success: true, data: updated, message: 'Reply status saved' } as ApiResponse<ContactMessageRecord>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to record reply';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});
