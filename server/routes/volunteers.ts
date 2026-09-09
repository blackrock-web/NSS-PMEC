import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireAuth, requirePermission, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { VolunteerApplication, ApiResponse, EventItem, Activity, User } from '../../src/types/index.js';

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

// Volunteer: Get current authenticated user's volunteer application status
volunteersRouter.get('/my-status', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userEmail = req.user?.email.toLowerCase();
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;

    const applications = await SheetsService.getRecords<VolunteerApplication>('Volunteers', collegeId);
    const myApp = applications.find(
      (v) => v.email.toLowerCase() === userEmail || (req.user?.rollNumber && v.rollNumber.toLowerCase() === req.user.rollNumber.toLowerCase())
    );

    return res.json({
      success: true,
      data: myApp || null,
    } as ApiResponse<VolunteerApplication | null>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve application status';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Volunteer: Update own volunteer profile information
volunteersRouter.put('/my-profile', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userEmail = req.user?.email.toLowerCase();
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;

    const applications = await SheetsService.getRecords<VolunteerApplication>('Volunteers', collegeId);
    const myApp = applications.find(
      (v) => v.email.toLowerCase() === userEmail || (req.user?.rollNumber && v.rollNumber.toLowerCase() === req.user.rollNumber.toLowerCase())
    );

    const allowedUpdates = {
      phone: req.body.phone,
      department: req.body.department,
      academicYear: req.body.academicYear,
      semester: req.body.semester,
      bloodGroup: req.body.bloodGroup,
      skills: req.body.skills,
      motivation: req.body.motivation,
      previousExperience: req.body.previousExperience,
    };

    let updatedApp: VolunteerApplication | null = null;
    if (myApp) {
      updatedApp = await SheetsService.updateRecord<VolunteerApplication>('Volunteers', myApp.id, allowedUpdates);
    }

    // Also update Users sheet profile if exists
    if (req.user?.id) {
      await SheetsService.updateRecord<User>('Users', req.user.id, {
        phone: req.body.phone,
        department: req.body.department,
        academicYear: req.body.academicYear,
      });
    }

    await AuditLogger.log(
      req,
      'VOLUNTEER_PROFILE_UPDATED',
      'volunteers',
      `Volunteer ${req.user?.name} updated profile details.`
    );

    return res.json({
      success: true,
      data: updatedApp,
      message: 'Profile updated successfully.',
    } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update volunteer profile';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Volunteer: Get personal activity history, enrolled tasks, and available opportunities
volunteersRouter.get('/my-activities', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;
    const allEvents = await SheetsService.getRecords<EventItem>('Events', collegeId);
    const allActivities = await SheetsService.getRecords<Activity>('Activities', collegeId);

    // Compute volunteer statistics based on user's registered/attended events
    const assignedIds = req.user?.assignedEventIds || [];
    const enrolledEvents = allEvents.filter((e) => assignedIds.includes(e.id) || assignedIds.includes(e.slug));
    const upcomingOpportunities = allEvents.filter((e) => e.status === 'upcoming');

    return res.json({
      success: true,
      data: {
        enrolledEvents,
        upcomingOpportunities,
        recentActivities: allActivities.slice(0, 5),
        totalCompletedEvents: enrolledEvents.filter((e) => e.status === 'past').length,
        estimatedServiceHours: enrolledEvents.filter((e) => e.status === 'past').length * 4 + 12, // Baseline active hours
      },
    } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch personal volunteer activities';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Volunteer: Register for an upcoming event / community drive
volunteersRouter.post('/register-event', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ success: false, error: 'Event ID is required' } as ApiResponse);
    }

    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;
    const allEvents = await SheetsService.getRecords<EventItem>('Events', collegeId);
    const targetEvent = allEvents.find((e) => e.id === eventId || e.slug === eventId);

    if (!targetEvent) {
      return res.status(404).json({ success: false, error: 'Event not found' } as ApiResponse);
    }

    // Add to user's assigned events
    const user = req.user!;
    const currentAssigned = user.assignedEventIds || [];
    if (!currentAssigned.includes(targetEvent.id)) {
      currentAssigned.push(targetEvent.id);
      await SheetsService.updateRecord<User>('Users', user.id, {
        assignedEventIds: currentAssigned,
      });
    }

    await AuditLogger.log(
      req,
      'VOLUNTEER_EVENT_ENROLLED',
      'events',
      `Volunteer ${user.name} enrolled for event "${targetEvent.title}"`
    );

    return res.json({
      success: true,
      message: `Enrolled successfully for "${targetEvent.title}"!`,
    } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to enroll in event';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: List all applications (enforces 'volunteers.view' permission)
volunteersRouter.get('/admin', requirePermission('volunteers.view'), async (req: AuthenticatedRequest, res) => {
  try {
    const isSuperTier = req.user?.role === 'superadmin' || req.user?.role === 'super_admin_1' || req.user?.role === 'super_admin_2';
    const collegeId = isSuperTier ? undefined : (req.user?.collegeId || SERVER_CONFIG.defaultCollegeId);
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

// Admin: Update status (Approve / Reject) (enforces 'volunteers.approve' permission)
volunteersRouter.put('/admin/:id/status', requirePermission('volunteers.approve'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    if (!['pending', 'approved', 'rejected', 'action_required'].includes(status)) {
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
