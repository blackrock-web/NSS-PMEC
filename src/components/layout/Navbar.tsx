import React, { useState, useEffect } from 'react';
import { Menu, X, Search, HeartHandshake, ChevronRight, Phone, Mail, Shield, User, LogIn } from 'lucide-react';
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
  onOpenSearch
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, openLogin } = useAuth();
  const { config } = useTenant();

  const activeConfig = config || SITE_CONFIG;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    { label: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Institutional Bar */}
      <div className="bg-[#0B1F3A] text-white/90 text-xs border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold tracking-wide text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E63946] inline-block animate-pulse"></span>
              National Service Scheme (NSS) • Unit 04 & 05
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/80">{SITE_CONFIG.collegeFullName}</span>
          </div>
          <div className="flex items-center gap-5 text-white/80">
            <span className="text-white/60 italic font-serif">Motto: &quot;{SITE_CONFIG.motto}&quot;</span>
            <div className="flex items-center gap-3">
              <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#E63946]" />
                <span>{SITE_CONFIG.email}</span>
              </a>
              <span className="text-white/30">•</span>
              <a href={`tel:${SITE_CONFIG.officialPhone}`} className="hover:text-white flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                <span>{SITE_CONFIG.officialPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-[#E5E7EB] py-2.5'
            : 'bg-white border-b border-[#E5E7EB] py-3 lg:py-0 lg:h-20 flex items-center'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* Brand Logo & College */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F3A]"
            aria-label="NSS Home"
          >
            <div className="w-11 h-11 bg-[#0B1F3A] flex items-center justify-center p-1.5 rounded-sm shrink-0 shadow-xs group-hover:bg-[#E63946] transition-colors">
              <NssLogo size={34} />
            </div>
            <div className="flex flex-col">
              <span className="text-[#0B1F3A] font-black text-sm tracking-tight leading-tight">
                NATIONAL SERVICE SCHEME
              </span>
              <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest truncate max-w-[200px] sm:max-w-xs">
                {SITE_CONFIG.collegeFullName}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center space-x-6 text-[13px] font-bold uppercase tracking-wider text-[#111827]">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`transition-all py-1 border-b-2 tracking-wider ${
                    isActive
                      ? 'text-[#E63946] border-[#E63946]'
                      : 'border-transparent text-[#111827] hover:text-[#0B1F3A] hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-sm transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Search website (Ctrl + K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="text-slate-400 border border-[#E5E7EB] text-[10px] px-1 py-0.5 rounded-xs font-mono">⌘K</span>
            </button>

            {isAuthenticated && user ? (
              <button
                onClick={() => handleNavClick('/admin')}
                className={`px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                  currentPath === '/admin'
                    ? 'bg-[#C8102E] text-white border-[#C8102E]'
                    : 'bg-[#0B1528] text-white border-[#0B1528] hover:bg-[#1E3A8A]'
                }`}
                title={`Signed in as ${user.email}`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Portal</span>
              </button>
            ) : (
              <button
                onClick={openLogin}
                className="px-3 py-2 border border-gray-300 hover:border-[#0B1528] text-[#0B1528] hover:bg-gray-50 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                title="Programme Officer & Cell Login"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>PO Login</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('/join-nss')}
              className="bg-[#C8102E] text-white px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#9B0D22] shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Join NSS</span>
            </button>
          </div>

          {/* Mobile Actions: Search + Hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-sm"
              aria-label="Search website"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[60px] z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <NssLogo size={36} />
                <div>
                  <div className="font-bold text-[#0B1F3A] text-sm">NSS | {SITE_CONFIG.collegeName}</div>
                  <div className="text-[10px] text-[#E63946] font-semibold">NOT ME BUT YOU</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1 flex-1">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#0B1F3A] text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#0B1F3A]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Footer CTA */}
            <div className="pt-6 border-t border-slate-100 mt-6 space-y-3">
              {isAuthenticated && user ? (
                <button
                  onClick={() => handleNavClick('/admin')}
                  className="w-full py-2.5 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Open Admin Portal</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogin();
                  }}
                  className="w-full py-2.5 border border-slate-300 text-[#0B1528] text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Programme Officer Login</span>
                </button>
              )}

              <button
                onClick={() => handleNavClick('/join-nss')}
                className="w-full py-3 bg-[#C8102E] hover:bg-[#9B0D22] text-white text-sm font-bold uppercase tracking-wider rounded-sm shadow flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Join NSS Volunteers</span>
              </button>
              <div className="text-center text-xs text-slate-500">
                <span>Official Helpline: </span>
                <a href={`tel:${activeConfig.officialPhone || activeConfig.phone}`} className="text-[#0B1528] font-semibold underline">
                  {activeConfig.officialPhone || activeConfig.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
