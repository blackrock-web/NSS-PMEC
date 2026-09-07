import { Router } from 'express';
import { z } from 'zod';
import { SERVER_CONFIG } from '../config.js';
import { SheetsService } from '../google/sheets.js';
import { DriveService } from '../google/drive.js';
import { requireRole, AuthenticatedRequest, AuditLogger } from '../middleware/auth.js';
import type { TenantConfig, ApiResponse } from '../../src/types/index.js';

export const tenantsRouter = Router();

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
tenantsRouter.put('/config', requireRole('admin', 'superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const collegeId = req.user?.role === 'superadmin' && req.body.id ? req.body.id : (req.user?.collegeId || SERVER_CONFIG.defaultCollegeId);

    const updated = await SheetsService.updateRecord<TenantConfig>('Tenants', collegeId, req.body);
    if (!updated) {
      // If it didn't exist, create it
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
tenantsRouter.get('/admin/tenants', requireRole('superadmin'), async (req: AuthenticatedRequest, res) => {
  try {
    const tenants = await SheetsService.getRecords<TenantConfig>('Tenants');
    return res.json({ success: true, data: tenants, total: tenants.length } as ApiResponse<TenantConfig[]>);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to list tenants';
    return res.status(500).json({ success: false, error: msg } as ApiResponse);
  }
});

// Superadmin: Provision new college unit tenant
tenantsRouter.post('/admin/tenants', requireRole('superadmin'), async (req: AuthenticatedRequest, res) => {
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

    // Auto-provision Google Drive root subfolders for this college
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
