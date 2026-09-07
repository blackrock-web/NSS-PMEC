import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireAuth, requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { EventItem, EventRegistration, ApiResponse } from '../../src/types/index.js';

export const eventsRouter = Router();

const eventSchema = z.object({
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
  time: z.string(),
  location: z.string(),
  status: z.enum(['upcoming', 'past']),
  heroImage: z.string(),
  shortDescription: z.string(),
  fullDescription: z.string(),
  objectives: z.array(z.string()).optional(),
  registrationOpen: z.boolean().optional(),
  reportAvailable: z.boolean().optional(),
});

// Public: List events for the college
eventsRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const { status, category } = req.query;

    let events = await SheetsService.getRecords<EventItem & { collegeId: string }>('Events', collegeId);

    if (status && status !== 'all') {
      events = events.filter((e) => e.status === status);
    }
    if (category && category !== 'All') {
      events = events.filter((e) => e.category === category);
    }

    return res.json({ success: true, data: events, total: events.length } as ApiResponse<EventItem[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch events';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// User: View current user's registered events
eventsRouter.get('/my/registrations', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    const allRegs = await SheetsService.getRecords<EventRegistration>('EventRegistrations');
    const userRegs = allRegs.filter((r) => (userId && r.userId === userId) || (userEmail && r.userEmail === userEmail));

    return res.json({ success: true, data: userRegs } as ApiResponse<EventRegistration[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch registrations';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Public: Get single event by id or slug
eventsRouter.get('/:idOrSlug', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const { idOrSlug } = req.params;
    const events = await SheetsService.getRecords<EventItem & { collegeId: string }>('Events', collegeId);
    const event = events.find((e) => e.id === idOrSlug || e.slug === idOrSlug);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' } as ApiResponse);
    }

    return res.json({ success: true, data: event } as ApiResponse<EventItem>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch event';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// User: Register for an event
eventsRouter.post('/:id/register', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const event = await SheetsService.getRecordById<EventItem & { collegeId: string }>('Events', id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' } as ApiResponse);
    }

    // Check if already registered
    const allRegs = await SheetsService.getRecords<EventRegistration>('EventRegistrations');
    const existing = allRegs.find(
      (r) => r.eventId === id && (r.userId === user.id || r.userEmail.toLowerCase() === user.email.toLowerCase())
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'You are already registered for this event.',
        data: existing,
      } as ApiResponse);
    }

    const newReg: EventRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      eventId: event.id,
      eventTitle: event.title,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      phone: user.phone || req.body.phone,
      rollNumber: user.rollNumber || req.body.rollNumber,
      department: user.department || req.body.department,
      status: 'registered',
      registeredAt: new Date().toISOString(),
    };

    await SheetsService.addRecord('EventRegistrations', newReg);
    await AuditLogger.log(req, 'EVENT_REGISTER', 'events', `User ${user.email} registered for "${event.title}"`);

    return res.json({
      success: true,
      message: `Registration confirmed for "${event.title}"!`,
      data: newReg,
    } as ApiResponse<EventRegistration>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Event registration failed';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Coordinator & Admin: Get attendees registered for an event
eventsRouter.get('/:id/registrations', requireRole('coordinator', 'admin', 'super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const allRegs = await SheetsService.getRecords<EventRegistration>('EventRegistrations');
    const eventRegs = allRegs.filter((r) => r.eventId === id);

    return res.json({ success: true, data: eventRegs } as ApiResponse<EventRegistration[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch attendees';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Coordinator & Admin: Mark attendance for an event attendee
eventsRouter.put('/:id/attendance/:regId', requireRole('coordinator', 'admin', 'super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const { regId } = req.params;
    const { status, coordinatorNotes } = req.body;

    if (status !== 'attended' && status !== 'absent' && status !== 'registered') {
      return res.status(400).json({ success: false, error: 'Status must be attended, absent, or registered' });
    }

    const updated = await SheetsService.updateRecord<EventRegistration>('EventRegistrations', regId, {
      status,
      coordinatorNotes,
      attendedAt: status === 'attended' ? new Date().toISOString() : undefined,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Registration record not found' });
    }

    await AuditLogger.log(
      req,
      'ATTENDANCE_MARKED',
      'events',
      `Marked attendance for registration ${regId} as ${status}`
    );

    return res.json({ success: true, message: 'Attendance status updated', data: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update attendance';
    return res.status(500).json({ success: false, error: msg });
  }
});

// Admin: Create event
eventsRouter.post('/', requireRole('admin', 'super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = eventSchema.parse(req.body);
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;

    const eventDate = new Date(parsed.date);
    const day = isNaN(eventDate.getDate()) ? '15' : String(eventDate.getDate()).padStart(2, '0');
    const month = isNaN(eventDate.getMonth()) ? 'SEP' : eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = isNaN(eventDate.getFullYear()) ? '2026' : String(eventDate.getFullYear());
    const slug = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newEvent: EventItem & { collegeId: string } = {
      id: `ev-${Date.now()}`,
      collegeId,
      slug,
      ...parsed,
      day,
      month,
      year,
      objectives: parsed.objectives || [],
      registrationOpen: parsed.registrationOpen ?? (parsed.status === 'upcoming'),
      reportAvailable: parsed.reportAvailable ?? false,
    };

    const saved = await SheetsService.addRecord('Events', newEvent);
    await AuditLogger.log(req, 'EVENT_CREATED', 'events', `Created event: "${newEvent.title}"`);

    return res.status(201).json({ success: true, data: saved, message: 'Event published successfully' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create event';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Update event
eventsRouter.put('/:id', requireRole('coordinator', 'admin', 'super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const updated = await SheetsService.updateRecord('Events', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Event not found' } as ApiResponse);
    }
    await AuditLogger.log(req, 'EVENT_UPDATED', 'events', `Updated event ID ${id}`);
    return res.json({ success: true, data: updated, message: 'Event updated successfully' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update event';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Delete event
eventsRouter.delete('/:id', requireRole('admin', 'super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await SheetsService.deleteRecord('Events', id);
    await AuditLogger.log(req, 'EVENT_DELETED', 'events', `Deleted event ID ${id}`);
    return res.json({ success: true, message: 'Event deleted successfully' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete event';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});
