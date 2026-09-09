import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';
import type { TenantConfig, SiteCmsContent } from '../types';

interface TenantContextType {
  config: TenantConfig;
  cmsContent: SiteCmsContent | null;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  refreshCms: () => Promise<void>;
  updateConfig: (newConfig: Partial<TenantConfig>) => Promise<{ success: boolean; error?: string }>;
  updateCms: (newCms: Partial<SiteCmsContent>) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_FALLBACK_CONFIG: TenantConfig = {
  id: 'unit-04-05',
  collegeName: 'Government Model Autonomous College',
  collegeFullName: 'Government Model Autonomous College of Arts, Science & Technology',
  universityAffiliation: 'Affiliated to State Central University • Approved by UGC & Govt. of Higher Education',
  unitNumber: 'Unit No. 04 & 05 (Combined Wing)',
  motto: 'NOT ME BUT YOU',
  hindiMotto: 'न मे परंतू भवान्',
  foundedYear: '1969',
  collegeAddress: 'NSS Institutional Cell, Student Welfare Block, Model Autonomous Campus, MG Road, District Central, New Delhi - 110001',
  programmeOfficerName: 'Dr. Anand Verma, Ph.D.',
  programmeOfficerTitle: 'Assistant Professor & Programme Officer, NSS Units 04 & 05',
  email: 'nss.cell@modelautonomous.edu.in',
  phone: '+91 11 2345 6789',
  officialPhone: '+91 11 2345 6789',
  bloodHelpline: '+91 98765 43210 (24/7 Red Cross / NSS Registry)',
  officeLocation: 'Room 104, Student Welfare Block, College Main Campus',
  address: 'Administrative Block, Model Autonomous College Campus, New Delhi - 110001',
  officeHours: 'Monday – Friday: 9:00 AM – 5:00 PM',
  workingHours: 'Monday – Friday: 9:00 AM – 5:00 PM',
  socialLinks: {
    instagram: 'https://instagram.com/nss_modelcollege',
    twitter: 'https://x.com/nss_modelcollege',
    youtube: 'https://youtube.com/@nss_modelcollege',
    linkedin: 'https://linkedin.com/company/nss-modelcollege',
    collegeWebsite: 'https://modelautonomous.edu.in'
  },
  impactStats: [
    { label: 'Enrolled Volunteers', value: 500, suffix: '+', note: 'Active regular volunteers' },
    { label: 'Community Activities', value: 25, suffix: '+', note: 'Annual initiatives completed' },
    { label: 'Communities Reached', value: 10, suffix: '+', note: 'Adopted & outreach villages' },
    { label: 'Citizens Impacted', value: 2500, suffix: '+', note: 'Direct beneficiaries served' },
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Volunteer Enrolment for Academic Session 2026–27 is now OPEN',
      date: 'Sept 05, 2026',
      isNew: true,
      link: '/join-nss'
    },
    {
      id: 'ann-2',
      title: 'Annual 7-Day Special Winter Camp Schedule announced for Adopted Village',
      date: 'Aug 28, 2026',
      isNew: false,
      link: '/special-camp'
    }
  ]
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { collegeId } = useAuth();
  const [config, setConfig] = useState<TenantConfig>(DEFAULT_FALLBACK_CONFIG);
  const [cmsContent, setCmsContent] = useState<SiteCmsContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.tenant.getConfig();
      if (res.success && res.data) {
        setConfig(res.data);
        setError(null);
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load tenant configuration');
    } finally {
      setLoading(false);
    }
  }, [collegeId]);

  const refreshCms = useCallback(async () => {
    try {
      const res = await api.tenant.getCms();
      if (res.success && res.data) {
        setCmsContent(res.data);
      }
    } catch (err: unknown) {
      console.warn('Failed to load dynamic CMS content:', err);
    }
  }, []);

  useEffect(() => {
    refreshConfig();
    refreshCms();
  }, [refreshConfig, refreshCms]);

  const updateConfig = async (newConfig: Partial<TenantConfig>) => {
    const res = await api.tenant.updateConfig(newConfig);
    if (res.success && res.data) {
      setConfig(res.data);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to update configuration' };
  };

  const updateCms = async (newCms: Partial<SiteCmsContent>) => {
    const res = await api.tenant.updateCms(newCms);
    if (res.success && res.data) {
      setCmsContent(res.data);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to update CMS content' };
  };

  return (
    <TenantContext.Provider
      value={{
        config,
        cmsContent,
        loading,
        error,
        refreshConfig,
        refreshCms,
        updateConfig,
        updateCms,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
