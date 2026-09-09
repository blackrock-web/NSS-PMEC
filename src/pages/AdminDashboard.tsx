import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout, type DashboardTab } from '../components/dashboard/DashboardLayout';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { UserManagementTab } from '../components/dashboard/UserManagementTab';
import { AnalyticsTab } from '../components/dashboard/AnalyticsTab';
import { NotificationsTab } from '../components/dashboard/NotificationsTab';
import { ProfileTab } from '../components/dashboard/ProfileTab';
import { VolunteerQueue } from '../components/dashboard/VolunteerQueue';
import { EventsManager } from '../components/dashboard/EventsManager';
import { ActivitiesManager } from '../components/dashboard/ActivitiesManager';
import { GalleryManager } from '../components/dashboard/GalleryManager';
import { ReportsManager } from '../components/dashboard/ReportsManager';
import { TeamManager } from '../components/dashboard/TeamManager';
import { SettingsTab } from '../components/dashboard/SettingsTab';
import { AuditLogTab } from '../components/dashboard/AuditLogTab';
import { TenantsManager } from '../components/dashboard/TenantsManager';
import { Shield, Lock, ArrowRight, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useTenant } from '../context/TenantContext';

interface AdminDashboardProps {
  onNavigate?: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, isAdmin, openLogin, logout } = useAuth();
  const { config } = useTenant();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Case 1: Unauthenticated -> Prompt Unified Sign In
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-md w-full bg-white border border-slate-200 shadow-xl p-8 text-center rounded-2xl">
          <div className="w-16 h-16 bg-[#0B1528] text-white flex items-center justify-center mx-auto mb-5 rounded-2xl border-2 border-[#C8102E] shadow-sm">
            <Lock size={26} />
          </div>

          <div className="text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            Restricted Access
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight mb-2">
            NSS Unit Admin Portal
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Volunteer queue approvals, attendance verification, and operations management require authorized Programme Officer or Cadre Coordinator clearance.
          </p>

          <button
            onClick={openLogin}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0B1528] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#1E3A8A] transition-colors rounded-xl shadow-xs"
          >
            <span>Sign In to Institutional Admin</span>
            <ArrowRight size={14} />
          </button>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            {config.collegeName} • {config.unitNumber}
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Authenticated as a normal member, but not authorized for Admin Dashboard
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-md w-full bg-white border border-amber-200 shadow-xl p-8 text-center rounded-2xl space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 flex items-center justify-center mx-auto rounded-2xl border border-amber-200 shadow-xs">
            <ShieldAlert size={28} />
          </div>

          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              Elevated Privileges Required
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Administrative Access Restricted
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              You are signed in as <strong>{user.name}</strong> with <span className="font-mono font-bold text-blue-600 uppercase">Volunteer</span> permissions. The administrative console is restricted to Programme Officers and Coordinators.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/volunteer');
                } else {
                  window.location.href = '#/volunteer';
                }
              }}
              className="w-full py-2.5 px-4 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-2"
            >
              <span>Go to My Volunteer Portal</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/');
                } else {
                  window.location.href = '#/';
                }
              }}
              className="w-full py-2 px-4 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Fully Authorized Admin/Superadmin
  return (
    <DashboardLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'overview' && <OverviewTab onNavigateTab={setActiveTab} />}
      {activeTab === 'users' && <UserManagementTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'profile' && <ProfileTab />}
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
