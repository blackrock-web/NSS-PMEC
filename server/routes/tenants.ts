import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService, mockSiteCmsContent } from '../google/sheets.js';
import { DriveService } from '../google/drive.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type {
  TenantConfig,
  SiteCmsContent,
  ExternalDataSource,
  AuditTrailDiff,
  ApiResponse,
} from '../../src/types/index.js';

export const tenantsRouter = Router();

// ====================================================
// Public: Dynamic Website CMS & Content
// ====================================================

/**
 * GET /api/tenant/cms
 * Returns the centralized, dynamic CMS configuration used by the public website.
 */
tenantsRouter.get('/cms', async (req: AuthenticatedRequest, res) => {
  try {
    return res.json({
      success: true,
      data: mockSiteCmsContent,
    } as ApiResponse<SiteCmsContent>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch website CMS content';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

/**
 * PUT /api/tenant/cms
 * Super Admin Level 2 Exclusive: Dynamically update website content, headers, announcements, mottos, and footer.
 * Strictly enforced on the server; creates granular audit diffs.
 */
tenantsRouter.put('/cms', requireRole('super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const updates: Partial<SiteCmsContent> = req.body;
    const actorEmail = req.user?.email || 'owner@college.edu.in';
    const clientIp = req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1';

    // Track field changes and create audit diffs
    const diffEntries: AuditTrailDiff[] = [];
    Object.keys(updates).forEach((key) => {
      const fieldKey = key as keyof SiteCmsContent;
      const prevVal = mockSiteCmsContent[fieldKey];
      const newVal = updates[fieldKey];

      if (JSON.stringify(prevVal) !== JSON.stringify(newVal)) {
        diffEntries.push({
          id: `diff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toISOString(),
          actorEmail,
          actorRole: 'super_admin_2',
          section: 'Website Control Center',
          fieldChanged: String(key),
          previousValue: typeof prevVal === 'object' ? JSON.stringify(prevVal).slice(0, 100) : String(prevVal ?? ''),
          newValue: typeof newVal === 'object' ? JSON.stringify(newVal).slice(0, 100) : String(newVal ?? ''),
          ipAddress: clientIp,
        });
      }
    });

    // Save diffs to database
    for (const diff of diffEntries) {
      await SheetsService.addRecord('AuditTrailDiffs', diff);
    }

    // Apply updates
    Object.assign(mockSiteCmsContent, updates);

    await AuditLogger.log(
      req,
      'CMS_CONTENT_UPDATED',
      'settings',
      `Super Admin Level 2 updated website configuration (${diffEntries.length} fields changed)`
    );

    return res.json({
      success: true,
      message: 'Website CMS content updated successfully across all public views.',
      data: mockSiteCmsContent,
    } as ApiResponse<SiteCmsContent>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update CMS content';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// ====================================================
// Super Admin Level 2: External Data Sources & Drive Links
// ====================================================

/**
 * GET /api/tenant/data-sources
 */
tenantsRouter.get('/data-sources', requireRole('super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const sources = await SheetsService.getRecords<ExternalDataSource>('ExternalDataSources');
    return res.json({ success: true, data: sources } as ApiResponse<ExternalDataSource[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch data sources';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

/**
 * POST /api/tenant/data-sources
 */
tenantsRouter.post('/data-sources', requireRole('super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const newSource: ExternalDataSource = {
      id: `src-${Date.now()}`,
      name: req.body.name,
      url: req.body.url,
      description: req.body.description,
      type: req.body.type || 'google_drive',
      isActive: req.body.isActive ?? true,
      priority: Number(req.body.priority) || 1,
      folderId: req.body.folderId,
      lastVerifiedAt: new Date().toISOString(),
    };

    const saved = await SheetsService.addRecord('ExternalDataSources', newSource);
    await AuditLogger.log(req, 'DATA_SOURCE_CREATED', 'settings', `Added data source: ${newSource.name}`);

    return res.status(201).json({ success: true, data: saved } as ApiResponse<ExternalDataSource>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create data source';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

/**
 * PUT /api/tenant/data-sources/:id
 */
tenantsRouter.put('/data-sources/:id', requireRole('super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const updated = await SheetsService.updateRecord<ExternalDataSource>('ExternalDataSources', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Data source not found' } as ApiResponse);
    }
    await AuditLogger.log(req, 'DATA_SOURCE_UPDATED', 'settings', `Updated data source: ${id}`);
    return res.json({ success: true, data: updated } as ApiResponse<ExternalDataSource>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update data source';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

/**
 * DELETE /api/tenant/data-sources/:id
 */
tenantsRouter.delete('/data-sources/:id', requireRole('super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    await SheetsService.deleteRecord('ExternalDataSources', id);
    await AuditLogger.log(req, 'DATA_SOURCE_DELETED', 'settings', `Deleted data source: ${id}`);
    return res.json({ success: true, message: 'Data source deleted' } as ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete data source';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// ====================================================
// Super Admin Level 2: Master Audit Diffs
// ====================================================

/**
 * GET /api/tenant/audit-diffs
 */
tenantsRouter.get('/audit-diffs', requireRole('super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const diffs = await SheetsService.getRecords<AuditTrailDiff>('AuditTrailDiffs');
    return res.json({ success: true, data: diffs } as ApiResponse<AuditTrailDiff[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch audit diffs';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// ====================================================
// Legacy Tenant Routes
// ====================================================

// Public: Get current tenant site config
tenantsRouter.get('/config', async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.collegeId || SERVER_CONFIG.defaultCollegeId;
    const tenants = await SheetsService.getRecords<TenantConfig>('Tenants');
    const tenant = tenants.find((t) => t.id === collegeId) || tenants[0];

    if (!tenant) {
      return res.status(404).json({ success: false, error: 'Tenant configuration not found' } as ApiResponse);
    }

    return res.json({ success: true, data: tenant } as ApiResponse<TenantConfig>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch tenant configuration';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Admin: Update tenant site config
tenantsRouter.put('/config', requireRole('admin', 'super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.user?.collegeId || SERVER_CONFIG.defaultCollegeId;

    const updated = await SheetsService.updateRecord<TenantConfig>('Tenants', collegeId, req.body);
    if (!updated) {
      const created = await SheetsService.addRecord<TenantConfig>('Tenants', { ...req.body, id: collegeId });
      await AuditLogger.log(req, 'CONFIG_CREATED', 'settings', `Created configuration for college ${collegeId}`);
      return res.json({ success: true, data: created, message: 'Settings initialized successfully' } as ApiResponse<TenantConfig>);
    }

    await AuditLogger.log(req, 'CONFIG_UPDATED', 'settings', `Updated configuration for college ${collegeId}`);
    return res.json({ success: true, data: updated, message: 'Institutional settings updated successfully' } as ApiResponse<TenantConfig>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update configuration';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});

// Superadmin: List all colleges / tenants
tenantsRouter.get('/admin/tenants', requireRole('super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const tenants = await SheetsService.getRecords<TenantConfig>('Tenants');
    return res.json({ success: true, data: tenants, total: tenants.length } as ApiResponse<TenantConfig[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to list tenants';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Superadmin: Provision new college unit tenant
tenantsRouter.post('/admin/tenants', requireRole('super_admin_1', 'superadmin', 'super_admin_2'), async (req: AuthenticatedRequest, res) => {
  try {
    const schema = z.object({
      id: z.string().min(3),
      collegeName: z.string().min(3),
      collegeFullName: z.string().min(5),
      universityAffiliation: z.string().min(3),
      programmeOfficerName: z.string().min(3),
      email: z.string().email(),
      phone: z.string(),
    });

    const parsed = schema.parse(req.body);

    const driveFolderId = await DriveService.ensureFolder(
      `NSS-${parsed.id}`,
      SERVER_CONFIG.google.driveRootFolderId || undefined
    );
    await DriveService.ensureFolder('images', driveFolderId);
    await DriveService.ensureFolder('reports', driveFolderId);
    await DriveService.ensureFolder('gallery', driveFolderId);
    await DriveService.ensureFolder('documents', driveFolderId);

    const newTenant: TenantConfig = {
      ...parsed,
      unitNumber: 'Unit No. 01',
      motto: 'NOT ME BUT YOU',
      hindiMotto: 'न मे परंतू भवान्',
      foundedYear: '1969',
      collegeAddress: `${parsed.collegeName} Campus, NSS Office`,
      programmeOfficerTitle: 'Assistant Professor & Programme Officer, NSS',
      officialPhone: parsed.phone,
      bloodHelpline: '+91 98765 43210',
      officeLocation: 'Room 101, Student Welfare Cell',
      address: `${parsed.collegeName} Campus`,
      officeHours: 'Monday – Friday: 9:00 AM – 5:00 PM',
      workingHours: 'Monday – Friday: 9:00 AM – 5:00 PM',
      socialLinks: {
        instagram: 'https://instagram.com',
        twitter: 'https://x.com',
        youtube: 'https://youtube.com',
        linkedin: 'https://linkedin.com',
        collegeWebsite: 'https://college.edu.in',
      },
      impactStats: [
        { label: 'Enrolled Volunteers', value: 100, suffix: '+', note: 'Active regular volunteers' },
        { label: 'Community Activities', value: 10, suffix: '+', note: 'Annual initiatives completed' },
        { label: 'Communities Reached', value: 3, suffix: '+', note: 'Adopted & outreach villages' },
        { label: 'Citizens Impacted', value: 500, suffix: '+', note: 'Direct beneficiaries served' },
      ],
      announcements: [
        {
          id: `ann-${Date.now()}`,
          title: 'Welcome to our newly provisioned NSS Unit Portal!',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          isNew: true,
          link: '/about',
        },
      ],
      driveFolderId,
    };

    const created = await SheetsService.addRecord<TenantConfig>('Tenants', newTenant);
    await AuditLogger.log(req, 'TENANT_PROVISIONED', 'system', `Provisioned new college tenant ${parsed.collegeName} (${parsed.id})`);

    return res.status(201).json({
      success: true,
      data: created,
      message: 'College unit successfully provisioned with Google Drive storage hierarchy',
    } as ApiResponse<TenantConfig>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to provision tenant';
    return res.status(400).json({ success: false, error: msg } as ApiResponse);
  }
});
