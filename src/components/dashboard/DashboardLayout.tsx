import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  UserCheck,
  Image,
  FileText,
  Users,
  Settings,
  History,
  Building2,
  HardDrive,
  LogOut,
  ExternalLink,
  Menu,
  X,
  TrendingUp,
  UserCog,
  Bell,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { NssLogo } from '../common/NssLogo';

export type DashboardTab =
  | 'overview'
  | 'users'
  | 'analytics'
  | 'events'
  | 'activities'
  | 'volunteers'
  | 'gallery'
  | 'reports'
  | 'team'
  | 'notifications'
  | 'profile'
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

  const navGroups = [
    {
      group: 'Core Administration',
      items: [
        { id: 'overview' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
        { id: 'users' as DashboardTab, label: 'User Management', icon: UserCog },
        { id: 'analytics' as DashboardTab, label: 'Analytics & Impact', icon: TrendingUp },
        {
          id: 'volunteers' as DashboardTab,
          label: 'Volunteer Queue',
          icon: UserCheck,
          badge: pendingVolunteersCount,
        },
      ],
    },
    {
      group: 'Programs & Operations',
      items: [
        { id: 'events' as DashboardTab, label: 'Events & Drives', icon: Calendar },
        { id: 'activities' as DashboardTab, label: 'Activities & Shramdaan', icon: Sparkles },
        { id: 'gallery' as DashboardTab, label: 'Media Archive', icon: Image },
        { id: 'reports' as DashboardTab, label: 'Official Reports (PDF)', icon: FileText },
        { id: 'team' as DashboardTab, label: 'Officers & Cadre', icon: Users },
      ],
    },
    {
      group: 'System & Security',
      items: [
        { id: 'notifications' as DashboardTab, label: 'Notifications', icon: Bell, badge: 2 },
        { id: 'profile' as DashboardTab, label: 'Profile & Security', icon: ShieldCheck },
        { id: 'settings' as DashboardTab, label: 'Unit Configuration', icon: Settings },
        { id: 'audit' as DashboardTab, label: 'Activity Logs', icon: History },
        ...(isSuperadmin
          ? [{ id: 'tenants' as DashboardTab, label: 'Tenant Units', icon: Building2 }]
          : []),
      ],
    },
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
              aria-label="Toggle navigation menu"
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
                  <span className="text-emerald-400 font-semibold">Verified Admin Portal</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-colors rounded-sm"
            >
              <span>View Public Portal</span>
              <ExternalLink size={12} />
            </a>

            {/* Notification Bell Shortcut */}
            <button
              onClick={() => onSelectTab('notifications')}
              className={`p-1.5 rounded-md transition-colors relative ${
                activeTab === 'notifications'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C8102E] rounded-full ring-2 ring-[#0B1528]" />
            </button>

            {/* User Pill */}
            <button
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-2.5 pl-3 border-l border-white/15 text-left hover:opacity-90 transition-opacity"
              title="Manage Profile & Security"
            >
              <div className="w-8 h-8 rounded-full bg-[#C8102E] text-white font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white leading-tight">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-[#F97316] font-semibold uppercase tracking-wider">
                  {role === 'superadmin' ? 'Superadmin' : 'Programme Officer'}
                </div>
              </div>
            </button>

            <button
              onClick={logout}
              title="Sign out of Admin Portal"
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-[#E5E7EB] p-4 shadow-xs sticky top-24 space-y-5 rounded-lg">
            {navGroups.map((grp) => (
              <div key={grp.group}>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5 px-3">
                  {grp.group}
                </div>
                <nav className="space-y-0.5">
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide transition-colors rounded-md ${
                          isActive
                            ? 'bg-[#0B1528] text-white'
                            : 'text-gray-700 hover:bg-[#F3F4F6] hover:text-[#0B1528]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={15} className={isActive ? 'text-[#F97316]' : 'text-gray-400'} />
                          <span>{item.label}</span>
                        </div>
                        {Boolean(item.badge && item.badge > 0) && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#C8102E] text-white rounded-xs">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}

            {/* Cloud Storage Status Card */}
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <HardDrive size={14} className="text-blue-600" />
                <span>Backend Storage</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Google Sheets data store & Google Drive media active.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>RBAC: Server Enforced</span>
                <span className="text-emerald-600 font-bold">2FA Active</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex">
            <div className="w-72 bg-white h-full p-4 flex flex-col justify-between shadow-xl overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                    Admin Navigation
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X size={18} />
                  </button>
                </div>

                {navGroups.map((grp) => (
                  <div key={grp.group}>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-3">
                      {grp.group}
                    </div>
                    <nav className="space-y-0.5">
                      {grp.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onSelectTab(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md ${
                              isActive
                                ? 'bg-[#0B1528] text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon size={16} />
                              <span>{item.label}</span>
                            </div>
                            {Boolean(item.badge && item.badge > 0) && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#C8102E] text-white rounded-xs">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="w-full py-2 px-3 flex items-center justify-center gap-2 bg-red-50 text-[#C8102E] font-bold text-xs hover:bg-red-100 rounded-md"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
