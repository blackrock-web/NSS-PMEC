import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout, type DashboardTab } from '../components/dashboard/DashboardLayout';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { VolunteerQueue } from '../components/dashboard/VolunteerQueue';
import { EventsManager } from '../components/dashboard/EventsManager';
import { ActivitiesManager } from '../components/dashboard/ActivitiesManager';
import { GalleryManager } from '../components/dashboard/GalleryManager';
import { ReportsManager } from '../components/dashboard/ReportsManager';
import { TeamManager } from '../components/dashboard/TeamManager';
import { SettingsTab } from '../components/dashboard/SettingsTab';
import { AuditLogTab } from '../components/dashboard/AuditLogTab';
import { TenantsManager } from '../components/dashboard/TenantsManager';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import { useTenant } from '../context/TenantContext';

export const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, openLogin } = useAuth();
  const { config } = useTenant();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-md w-full bg-white border border-[#E5E7EB] shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-[#0B1528] text-white flex items-center justify-center mx-auto mb-5 border-b-2 border-[#C8102E]">
            <Lock size={28} />
          </div>

          <div className="text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            Restricted Area
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight mb-2">
            NSS Cell Administration
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-6">
            Access to the volunteer verification queue, Google Drive document repository, and institutional site controls requires authenticated Programme Officer or Administrator credentials.
          </p>

          <button
            onClick={openLogin}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0B1528] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#1E3A8A] transition-colors"
          >
            <span>Sign In to Institutional Admin</span>
            <ArrowRight size={14} />
          </button>

          <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400">
            {config.collegeName} • {config.unitNumber}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'overview' && <OverviewTab onNavigateTab={setActiveTab} />}
      {activeTab === 'volunteers' && <VolunteerQueue />}
      {activeTab === 'events' && <EventsManager />}
      {activeTab === 'activities' && <ActivitiesManager />}
      {activeTab === 'gallery' && <GalleryManager />}
      {activeTab === 'reports' && <ReportsManager />}
      {activeTab === 'team' && <TeamManager />}
      {activeTab === 'settings' && <SettingsTab />}
      {activeTab === 'audit' && <AuditLogTab />}
      {activeTab === 'tenants' && <TenantsManager />}
    </DashboardLayout>
  );
};
