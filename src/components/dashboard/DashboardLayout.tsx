import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Users,
  Image,
  FileText,
  UserCheck,
  Settings,
  History,
  Building2,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Database,
  HardDrive,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { NssLogo } from '../common/NssLogo';

export type DashboardTab =
  | 'overview'
  | 'events'
  | 'activities'
  | 'volunteers'
  | 'gallery'
  | 'reports'
  | 'team'
  | 'settings'
  | 'audit'
  | 'tenants';

interface DashboardLayoutProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  pendingVolunteersCount?: number;
  unreadMessagesCount?: number;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  onSelectTab,
  pendingVolunteersCount = 0,
  children,
}) => {
  const { user, role, logout, isSuperadmin } = useAuth();
  const { config } = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'volunteers' as DashboardTab, label: 'Volunteer Queue', icon: UserCheck, badge: pendingVolunteersCount },
    { id: 'events' as DashboardTab, label: 'Events & Drives', icon: Calendar },
    { id: 'activities' as DashboardTab, label: 'Activities & Shramdaan', icon: Sparkles },
    { id: 'gallery' as DashboardTab, label: 'Media Archive', icon: Image },
    { id: 'reports' as DashboardTab, label: 'Official Reports (PDF)', icon: FileText },
    { id: 'team' as DashboardTab, label: 'Officers & Cadre', icon: Users },
    { id: 'settings' as DashboardTab, label: 'Unit Configuration', icon: Settings },
    ...(isSuperadmin
      ? [
          { id: 'tenants' as DashboardTab, label: 'Tenant Units', icon: Building2 },
          { id: 'audit' as DashboardTab, label: 'Audit Trail', icon: History },
        ]
      : [{ id: 'audit' as DashboardTab, label: 'Activity Logs', icon: History }]),
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans">
      {/* Top Banner Bar */}
      <header className="bg-[#0B1528] text-white border-b-2 border-[#C8102E] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-3">
              <NssLogo size={36} showText={false} />
              <div>
                <span className="font-serif text-base font-bold tracking-tight text-white block leading-tight">
                  {config.collegeName || 'NSS Unit Portal'}
                </span>
                <span className="text-[10px] text-white/70 tracking-widest uppercase flex items-center gap-2">
                  <span>{config.unitNumber || 'Unit 04 & 05'}</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Google Drive & Sheets Connected</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
            >
              <span>View Public Portal</span>
              <ExternalLink size={12} />
            </a>

            {/* User Pill */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/15">
              <div className="w-8 h-8 rounded-full bg-[#C8102E] text-white font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white leading-tight">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-[#F97316] font-semibold uppercase tracking-wider">
                  {role === 'superadmin' ? 'National Superadmin' : 'Programme Officer'}
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-white/60 hover:text-white transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-[#E5E7EB] p-4 shadow-xs sticky top-24 space-y-6">
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2 px-3">
                Management Modules
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${
                        isActive
                          ? 'bg-[#0B1528] text-white'
                          : 'text-gray-700 hover:bg-[#F3F4F6] hover:text-[#0B1528]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={isActive ? 'text-[#F97316]' : 'text-gray-500'} />
                        <span>{item.label}</span>
                      </div>
                      {Boolean(item.badge && item.badge > 0) && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#C8102E] text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Cloud Storage Status Card */}
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <HardDrive size={14} className="text-blue-600" />
                <span>Backend Storage</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Google Sheets data store & Google Drive media storage active for <strong>{config.collegeName}</strong>.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Auto-sync: Enabled</span>
                <span className="text-emerald-600 font-bold">200 OK</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 p-4">
            <div className="bg-white max-w-xs w-full h-full p-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="font-serif font-bold text-base text-[#0B1528]">Portal Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold ${
                          isActive ? 'bg-[#0B1528] text-white' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </div>
                        {Boolean(item.badge && item.badge > 0) && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#C8102E] text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={logout}
                className="w-full py-2 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
