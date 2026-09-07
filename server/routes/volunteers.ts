import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { VolunteerApplication, ApiResponse } from '../../src/types/index.js';

export const volunteersRouter = Router();

const enrollmentSchema = z.object({
  fullName: z.string().min(3),
  dob: z.string().min(6),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(10),
  email: z.string().email(),
  rollNumber: z.string().min(2),
  department: z.string().min(2),
  academicYear: z.enum(['1st Year', '2nd Year', '3rd Year', '4th Year']),
  semester: z.string(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
  previousExperience: z.string().default(''),
  skills: z.array(z.string()).default([]),
  motivation: z.string().min(10),
  agreeToPledge: z.literal(true),
});

// Public: Submit volunteer enrollment application
volunteersRouter.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = enrollmentSchema.parse(req.body);
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;

    // Prevent duplicate submission with same email / roll number for this college
    const existing = await SheetsService.getRecords<VolunteerApplication>('Volunteers', collegeId);
    const duplicate = existing.find(
      (v) => v.email.toLowerCase() === parsed.email.toLowerCase() || v.rollNumber.toLowerCase() === parsed.rollNumber.toLowerCase()
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: 'An enrollment application with this email or roll number already exists for this unit.',
      } as ApiResponse);
    }

    const newApplication: VolunteerApplication = {
      id: `vol-${Date.now()}`,
      collegeId,
      ...parsed,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const saved = await SheetsService.addRecord('Volunteers', newApplication);
    await AuditLogger.log(
      req,
      'VOLUNTEER_ENROLLMENT_SUBMITTED',
      'volunteers',
      `New volunteer application submitted by ${saved.fullName} (${saved.rollNumber})`
    );

    return res.status(201).json({
      success: true,
      data: saved,
      message: 'Your NSS Volunteer Enrollment has been successfully registered! Check your email for confirmation.',
    } as ApiResponse<VolunteerApplication>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid enrollment application data';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: List all applications
volunteersRouter.get('/admin', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.user?.role === 'superadmin' ? undefined : (req.user?.collegeId || SERVER_CONFIG.defaultCollegeId);
    const { status, search, department, academicYear } = req.query;

    let applications = await SheetsService.getRecords<VolunteerApplication>('Volunteers', collegeId);

    if (status && status !== 'all') {
      applications = applications.filter((v) => v.status === status);
    }
    if (department && department !== 'all') {
      applications = applications.filter((v) => v.department === department);
    }
    if (academicYear && academicYear !== 'all') {
      applications = applications.filter((v) => v.academicYear === academicYear);
    }
    if (search) {
      const q = String(search).toLowerCase();
      applications = applications.filter(
        (v) =>
          v.fullName.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q) ||
          v.rollNumber.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      data: applications,
      total: applications.length,
    } as ApiResponse<VolunteerApplication[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch volunteer applications';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Update status (Approve / Reject)
volunteersRouter.put('/admin/:id/status', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' } as ApiResponse);
    }

    const updated = await SheetsService.updateRecord<VolunteerApplication>('Volunteers', id, {
      status,
      reviewNotes: reviewNotes || '',
      reviewedBy: req.user?.name || 'Programme Officer',
      reviewedAt: new Date().toISOString(),
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Application not found' } as ApiResponse);
    }

    await AuditLogger.log(
      req,
      `VOLUNTEER_${status.toUpperCase()}`,
      'volunteers',
      `${status === 'approved' ? 'Approved' : 'Rejected'} volunteer application for ${updated.fullName} (${updated.rollNumber})`
    );

    return res.json({
      success: true,
      data: updated,
      message: `Volunteer application successfully ${status}`,
    } as ApiResponse<VolunteerApplication>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update application status';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});
