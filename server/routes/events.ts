import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { EventItem, ApiResponse } from '../../src/types/index.js';

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

// Admin: Create event
eventsRouter.post('/', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
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
eventsRouter.put('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
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
eventsRouter.delete('/:id', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
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
