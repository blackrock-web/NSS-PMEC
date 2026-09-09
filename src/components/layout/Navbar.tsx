import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Search,
  HeartHandshake,
  ChevronRight,
  Phone,
  Mail,
  Shield,
  ShieldAlert,
  HeartPulse,
  User as UserIcon,
  LogIn,
  LogOut,
  Bell,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronDown,
  Settings as SettingsIcon,
  PhoneCall,
  Flame,
} from 'lucide-react';
import { NssLogo } from '../common/NssLogo';
import { SITE_CONFIG } from '../../data/config';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyMenuOpen, setEmergencyMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { user, isAuthenticated, isAdmin, logout, openLogin } = useAuth();
  const { config } = useTenant();

  const emergencyRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const activeConfig = config || SITE_CONFIG;

  // Scroll detection for header backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (emergencyRef.current && !emergencyRef.current.contains(target)) {
        setEmergencyMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Activities', path: '/activities' },
    { label: 'Events', path: '/events' },
    { label: 'Special Camp', path: '/special-camp' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Achievements', path: '/achievements' },
    { label: 'Reports', path: '/reports' },
    { label: 'Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setEmergencyMenuOpen(false);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const recentNotifications = [
    {
      id: 'n-1',
      title: 'Mega Blood Donation Drive 2026',
      time: 'Today • 09:00 AM',
      unread: true,
      category: 'Blood Registry',
    },
    {
      id: 'n-2',
      title: 'Special Winter Camp Enrollment Open',
      time: 'Yesterday',
      unread: true,
      category: 'Special Camp',
    },
    {
      id: 'n-3',
      title: 'Service Hours Verification Cycle Initiated',
      time: '3 days ago',
      unread: false,
      category: 'Admin Notice',
    },
  ];

  return (
    <header
      id="main-unified-header"
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs'
          : 'bg-white border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[70px] gap-2 lg:gap-4">
          {/* 1. BRAND & INSTITUTIONAL IDENTITY */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1528] rounded-md py-1"
              aria-label="National Service Scheme Home"
            >
              <div className="w-10 h-10 bg-[#0B1528] flex items-center justify-center p-1 rounded-md shrink-0 shadow-2xs group-hover:bg-[#C8102E] transition-colors">
                <NssLogo size={32} showText={false} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm tracking-tight leading-none group-hover:text-[#C8102E] transition-colors">
                    NATIONAL SERVICE SCHEME
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium tracking-normal truncate max-w-[170px] sm:max-w-[240px] md:max-w-xs mt-0.5">
                  {activeConfig.collegeName || 'Government Model College'} • {activeConfig.unitNumber || 'Unit 04 & 05'}
                </span>
              </div>
            </button>
          </div>

          {/* 2. DESKTOP NAVIGATION LINKS */}
          <nav
            className="hidden xl:flex items-center space-x-1 text-xs font-semibold text-slate-700"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-2.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-100 text-[#0B1528] font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* 3. RIGHT CONTROLS: Emergency Helplines, Search, Notifications, Profile/Auth */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* EMERGENCY HELPLINES DROPDOWN */}
            <div className="relative" ref={emergencyRef}>
              <button
                type="button"
                onClick={() => setEmergencyMenuOpen(!emergencyMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all border ${
                  emergencyMenuOpen
                    ? 'bg-red-50 border-red-300 text-red-700 ring-2 ring-red-200'
                    : 'bg-red-50/60 hover:bg-red-50 border-red-200 text-red-700'
                }`}
                title="Emergency Helplines & Blood Donor Registry"
                aria-expanded={emergencyMenuOpen}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <HeartPulse size={14} className="text-[#C8102E]" />
                <span className="hidden sm:inline">Emergency</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${emergencyMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Emergency Popover */}
              {emergencyMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <ShieldAlert size={15} className="text-[#C8102E]" />
                      <span>24/7 Emergency Helplines</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-semibold uppercase">
                      Urgent
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Blood Helpline */}
                    <div className="p-2.5 bg-red-50/60 rounded-md border border-red-100 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-red-900 flex items-center gap-1">
                          <HeartPulse size={13} className="text-red-600" />
                          <span>Blood Donor Helpline</span>
                        </div>
                        <a
                          href={`tel:${(activeConfig.bloodHelpline || '9876543210').replace(/[^0-9+]/g, '')}`}
                          className="text-xs font-mono font-bold text-red-700 hover:underline block mt-0.5"
                        >
                          {activeConfig.bloodHelpline || '+91 98765 43210'}
                        </a>
                      </div>
                      <button
                        onClick={() => copyToClipboard(activeConfig.bloodHelpline || '+91 98765 43210', 'blood')}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Copy phone number"
                      >
                        {copiedKey === 'blood' ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>

                    {/* NSS Unit Line */}
                    <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                          <PhoneCall size={13} className="text-slate-600" />
                          <span>NSS Unit Hotline</span>
                        </div>
                        <a
                          href={`tel:${(activeConfig.officialPhone || activeConfig.phone || '07122580011').replace(/[^0-9+]/g, '')}`}
                          className="text-xs font-mono font-bold text-slate-700 hover:underline block mt-0.5"
                        >
                          {activeConfig.officialPhone || activeConfig.phone || '0712-2580011'}
                        </a>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            activeConfig.officialPhone || activeConfig.phone || '0712-2580011',
                            'hotline'
                          )
                        }
                        className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                        title="Copy phone number"
                      >
                        {copiedKey === 'hotline' ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>

                    {/* National Helplines */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href="tel:108"
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-center block transition-colors"
                      >
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Ambulance</div>
                        <div className="text-xs font-mono font-bold text-slate-900">108</div>
                      </a>
                      <a
                        href="tel:112"
                        className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-center block transition-colors"
                      >
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">National Emergency</div>
                        <div className="text-xs font-mono font-bold text-slate-900">112</div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GLOBAL SEARCH SHORTCUT */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
              title="Search website (Ctrl + K / ⌘K)"
              aria-label="Search"
            >
              <Search size={14} />
              <span className="hidden md:inline font-medium text-slate-500">Search</span>
              <kbd className="hidden md:inline text-[10px] font-mono text-slate-400 bg-slate-50 px-1 py-0.5 rounded-xs border border-slate-200 ml-1">
                ⌘K
              </kbd>
            </button>

            {/* NOTIFICATIONS CENTER */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative ${
                  notificationsOpen ? 'bg-slate-100 text-slate-900' : ''
                }`}
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8102E] rounded-full ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Bell size={14} />
                      <span>Unit Notifications</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">2 New</span>
                  </div>

                  <div className="space-y-2">
                    {recentNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-md text-xs transition-colors ${
                          notif.unread ? 'bg-blue-50/50 border border-blue-100' : 'bg-slate-50 border border-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span className="font-semibold text-slate-700">{notif.category}</span>
                          <span>{notif.time}</span>
                        </div>
                        <div className="font-semibold text-slate-800 leading-tight">{notif.title}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => handleNavClick('/events')}
                      className="text-[11px] font-bold text-[#0B1528] hover:text-[#C8102E] transition-colors"
                    >
                      View All Announcements →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AUTHENTICATION / PROFILE / ADMIN CTA */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                  aria-label="User profile menu"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0B1528] text-white flex items-center justify-center text-[10px] font-bold uppercase">
                    {user.name ? user.name.slice(0, 2) : 'US'}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-none truncate max-w-[110px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-mono text-[#C8102E] uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      <div className="mt-1 inline-block px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-xs text-[10px] font-mono font-bold uppercase">
                        Role: {user.role}
                      </div>
                    </div>

                    <div className="py-1">
                      {(user.role === 'super_admin_1' || user.role === 'superadmin') ? (
                        <>
                          <button
                            onClick={() => handleNavClick('/directorate')}
                            className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                          >
                            <Shield size={14} className="text-[#C8102E]" />
                            <span>Directorate Portal</span>
                          </button>
                          <button
                            onClick={() => handleNavClick('/admin')}
                            className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                          >
                            <Shield size={14} className="text-amber-500" />
                            <span>College Operations</span>
                          </button>
                        </>
                      ) : (user.role === 'admin' || user.role === 'coordinator') ? (
                        <button
                          onClick={() => handleNavClick('/admin')}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                        >
                          <Shield size={14} className="text-amber-500" />
                          <span>Admin Portal</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleNavClick('/volunteer')}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                        >
                          <UserIcon size={14} className="text-blue-500" />
                          <span>Volunteer Portal</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleNavClick('/contact')}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                      >
                        <SettingsIcon size={14} className="text-slate-500" />
                        <span>Support & Contact</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={async () => {
                          await logout();
                          setUserMenuOpen(false);
                          onNavigate('/');
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0B1528] bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md transition-colors"
                title="Unified Sign In for Volunteers & Officers"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>
            )}

            {/* JOIN NSS PRIMARY CTA BUTTON */}
            <button
              onClick={() => handleNavClick('/join-nss')}
              className="hidden sm:flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#9B0D22] text-white px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow transition-all"
            >
              <HeartHandshake size={14} />
              <span>Join NSS</span>
            </button>

            {/* MOBILE HAMBURGER TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B1528]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SLIDE-OUT DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[65px] z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <NssLogo size={32} showText={false} />
                <div>
                  <div className="font-bold text-[#0B1528] text-xs">
                    {activeConfig.collegeName || 'NSS Unit'}
                  </div>
                  <div className="text-[10px] text-[#C8102E] font-semibold tracking-wider uppercase">
                    Not Me, But You
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Emergency Helplines Callout */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-red-900 mb-1">
                <div className="flex items-center gap-1.5">
                  <HeartPulse size={14} className="text-[#C8102E]" />
                  <span>24/7 Emergency Dial</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-red-200 text-red-800 rounded-xs">Toll-Free</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <a
                  href={`tel:${(activeConfig.bloodHelpline || '9876543210').replace(/[^0-9+]/g, '')}`}
                  className="flex-1 py-1.5 px-2 bg-white border border-red-200 text-center rounded-md text-[11px] font-bold text-red-700 hover:bg-red-50"
                >
                  Blood Helpline
                </a>
                <a
                  href={`tel:${(activeConfig.officialPhone || activeConfig.phone || '07122580011').replace(/[^0-9+]/g, '')}`}
                  className="flex-1 py-1.5 px-2 bg-white border border-slate-200 text-center rounded-md text-[11px] font-bold text-slate-800 hover:bg-slate-50"
                >
                  Unit Hotline
                </a>
              </div>
            </div>

            {/* Navigation Routes */}
            <div className="space-y-1 flex-1">
              {navLinks.map((link) => {
                const isActive =
                  currentPath === link.path ||
                  (link.path !== '/' && currentPath.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#0B1528] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth & CTA Buttons */}
            <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
              {isAuthenticated && user ? (
                <>
                  {(user.role === 'super_admin_1' || user.role === 'superadmin') ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleNavClick('/directorate')}
                        className="py-2.5 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Shield size={14} className="text-[#C8102E]" />
                        <span>Directorate</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('/admin')}
                        className="py-2.5 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Shield size={14} className="text-amber-400" />
                        <span>College Admin</span>
                      </button>
                    </div>
                  ) : (user.role === 'admin' || user.role === 'coordinator') ? (
                    <button
                      onClick={() => handleNavClick('/admin')}
                      className="w-full py-2.5 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs flex items-center justify-center gap-2"
                    >
                      <Shield size={14} className="text-amber-400" />
                      <span>Admin Portal Dashboard</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick('/volunteer')}
                      className="w-full py-2.5 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs flex items-center justify-center gap-2"
                    >
                      <UserIcon size={14} className="text-blue-400" />
                      <span>My Volunteer Portal</span>
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      await logout();
                      setMobileMenuOpen(false);
                      onNavigate('/');
                    }}
                    className="w-full py-2 border border-slate-200 text-red-600 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-red-50 flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogin();
                  }}
                  className="w-full py-2.5 border border-slate-300 text-[#0B1528] text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <LogIn size={14} />
                  <span>Unified Sign In (Student / Officer)</span>
                </button>
              )}

              <button
                onClick={() => handleNavClick('/join-nss')}
                className="w-full py-2.5 bg-[#C8102E] hover:bg-[#9B0D22] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs flex items-center justify-center gap-2"
              >
                <HeartHandshake size={14} />
                <span>Join NSS Volunteer Cadre</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
