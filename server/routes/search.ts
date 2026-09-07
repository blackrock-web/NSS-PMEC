import { Router } from 'express';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import type {
  EventItem,
  Activity,
  Achievement,
  GalleryPhoto,
  ReportItem,
  TeamMember,
  GlobalSearchResult,
  ApiResponse,
} from '../../src/types/index.js';

export const searchRouter = Router();

searchRouter.get('/', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    const collegeId = (req.headers['x-college-id'] as string) || SERVER_CONFIG.defaultCollegeId;

    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] } as ApiResponse<GlobalSearchResult[]>);
    }

    const [events, activities, achievements, gallery, reports, team] = await Promise.all([
      SheetsService.getRecords<EventItem & { collegeId: string }>('Events', collegeId),
      SheetsService.getRecords<Activity & { collegeId: string }>('Activities', collegeId),
      SheetsService.getRecords<Achievement & { collegeId: string }>('Achievements', collegeId),
      SheetsService.getRecords<GalleryPhoto & { collegeId: string }>('Gallery', collegeId),
      SheetsService.getRecords<ReportItem & { collegeId: string }>('Reports', collegeId),
      SheetsService.getRecords<TeamMember & { collegeId: string }>('Team', collegeId),
    ]);

    const results: GlobalSearchResult[] = [];

    // Search Events
    events.forEach((e) => {
      if (
        e.title.toLowerCase().includes(q) ||
        e.shortDescription.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: e.id,
          title: e.title,
          category: e.category,
          type: 'event',
          link: `/events/${e.slug}`,
          snippet: e.shortDescription,
          date: e.date,
        });
      }
    });

    // Search Activities
    activities.forEach((a) => {
      if (
        a.title.toLowerCase().includes(q) ||
        a.shortDescription.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: a.id,
          title: a.title,
          category: a.category,
          type: 'activity',
          link: `/activities/${a.slug}`,
          snippet: a.shortDescription,
          date: a.date,
        });
      }
    });

    // Search Achievements
    achievements.forEach((ach) => {
      if (
        ach.title.toLowerCase().includes(q) ||
        ach.description.toLowerCase().includes(q) ||
        ach.awardingBody.toLowerCase().includes(q)
      ) {
        results.push({
          id: ach.id,
          title: ach.title,
          category: ach.category,
          type: 'achievement',
          link: '/achievements',
          snippet: `${ach.awardingBody} (${ach.year}) - ${ach.description}`,
          date: ach.year,
        });
      }
    });

    // Search Reports
    reports.forEach((r) => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: r.id,
          title: r.title,
          category: r.category,
          type: 'report',
          link: '/reports',
          snippet: r.description,
          date: r.datePublished,
        });
      }
    });

    // Search Team
    team.forEach((t) => {
      if (
        t.name.toLowerCase().includes(q) ||
        t.designation.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q)
      ) {
        results.push({
          id: t.id,
          title: t.name,
          category: t.designation,
          type: 'team',
          link: '/team',
          snippet: `${t.department}: ${t.bio}`,
        });
      }
    });

    // Search Gallery
    gallery.forEach((g) => {
      if (
        g.title.toLowerCase().includes(q) ||
        g.caption.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: g.id,
          title: g.title,
          category: g.category,
          type: 'gallery',
          link: '/gallery',
          snippet: `${g.caption} • ${g.location}`,
          date: g.date,
        });
      }
    });

    return res.json({ success: true, data: results.slice(0, 20) } as ApiResponse<GlobalSearchResult[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Search query failed';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});
