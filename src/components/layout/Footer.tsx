import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, ArrowUpRight, Heart, ShieldCheck, Award, Sparkles, Flag } from 'lucide-react';
import { NssLogo } from '../common/NssLogo';
import { SITE_CONFIG } from '../../data/config';
import { useTenant } from '../../context/TenantContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { config, cmsContent } = useTenant();

  const collegeFullName = cmsContent?.collegeFullName || config.collegeFullName || SITE_CONFIG.collegeFullName;
  const unitNumber = cmsContent?.unitNumber || config.unitNumber || 'Unit 04 & 05';
  const mottoEnglish = cmsContent?.motto || 'NOT ME, BUT YOU';
  const mottoHindi = cmsContent?.hindiMotto || SITE_CONFIG.hindiMotto || 'न मे, अपितु भवते';

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1F3A] text-slate-300 border-t border-slate-800">
      {/* Top Banner with Motto - Upgraded Institutional Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-[#061222] to-[#08172c] overflow-hidden">
        {/* Subtle decorative top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#C8102E] via-[#E63946] to-[#0B1528]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Institutional Brand Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <div className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center shrink-0">
                <NssLogo size={52} />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight font-serif">
                    NATIONAL SERVICE SCHEME
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-200 border border-white/15">
                    {unitNumber}
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
                  {collegeFullName}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Govt. of India Scheme</span>
                  </span>
                  <span>•</span>
                  <span>Youth & Community Outreach Cell</span>
                </div>
              </div>
            </div>

            {/* Official National Motto Showcase Card */}
            <div className="group relative bg-gradient-to-r from-white/[0.08] to-white/[0.03] hover:from-white/[0.12] hover:to-white/[0.05] border border-white/15 rounded-xl p-4 sm:px-6 sm:py-3.5 shadow-sm backdrop-blur-xs transition-all duration-300 text-center sm:text-right min-w-[280px]">
              {/* Left Accent Stripe */}
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#C8102E] rounded-r-full hidden sm:block" />

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-end gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#E63946] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>National NSS Motto</span>
                </div>
                <div className="text-white font-serif font-black italic text-lg sm:text-xl tracking-wide">
                  &ldquo;{mottoEnglish}&rdquo;
                </div>
                <div className="text-xs sm:text-sm text-amber-200/90 font-medium tracking-wide">
                  {mottoHindi}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: NSS */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.25em] mb-5 border-l-2 border-[#E63946] pl-2.5">
              NSS Overview
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  About NSS & Symbol
                </a>
              </li>
              <li>
                <a
                  href="/about#unit"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Our College Unit
                </a>
              </li>
              <li>
                <a
                  href="/team"
                  onClick={(e) => handleLinkClick(e, '/team')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Unit Team & Leadership
                </a>
              </li>
              <li>
                <a
                  href="/activities"
                  onClick={(e) => handleLinkClick(e, '/activities')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Community Activities
                </a>
              </li>
              <li>
                <a
                  href="/about#vision"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Vision & Mission
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.25em] mb-5 border-l-2 border-[#E63946] pl-2.5">
              Explore
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a
                  href="/events"
                  onClick={(e) => handleLinkClick(e, '/events')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Upcoming & Past Events
                </a>
              </li>
              <li>
                <a
                  href="/special-camp"
                  onClick={(e) => handleLinkClick(e, '/special-camp')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  7-Day Special Camp
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  onClick={(e) => handleLinkClick(e, '/gallery')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Photo & Field Gallery
                </a>
              </li>
              <li>
                <a
                  href="/achievements"
                  onClick={(e) => handleLinkClick(e, '/achievements')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Unit Achievements & Honors
                </a>
              </li>
              <li>
                <a
                  href="/reports"
                  onClick={(e) => handleLinkClick(e, '/reports')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Annual Activity Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Get Involved */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.25em] mb-5 border-l-2 border-[#E63946] pl-2.5">
              Get Involved
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a
                  href="/join-nss"
                  onClick={(e) => handleLinkClick(e, '/join-nss')}
                  className="text-white font-bold hover:text-[#E63946] flex items-center gap-1.5"
                >
                  <span>Join NSS (Enrollment)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E63946]" />
                </a>
              </li>
              <li>
                <a
                  href="/volunteer"
                  onClick={(e) => handleLinkClick(e, '/volunteer')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Volunteer Cadre Portal
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  onClick={(e) => handleLinkClick(e, '/admin')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Programme Officer Portal
                </a>
              </li>
              <li>
                <a
                  href="/directorate"
                  onClick={(e) => handleLinkClick(e, '/directorate')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Regional Directorate Portal
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Contact NSS Office
                </a>
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2 font-black">
                NSS Affiliations
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ministry of Youth Affairs & Sports, Govt. of India • {SITE_CONFIG.universityAffiliation}
              </p>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.25em] mb-5 border-l-2 border-[#E63946] pl-2.5">
              NSS Office Contact
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-[#E63946] shrink-0 mt-1" />
                <span className="text-xs leading-relaxed">
                  {SITE_CONFIG.collegeAddress}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-[#E63946] shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-xs hover:text-white truncate">
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-[#E63946] shrink-0" />
                <a href={`tel:${SITE_CONFIG.officialPhone}`} className="text-xs hover:text-white">
                  {SITE_CONFIG.officialPhone}
                </a>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <a
                href={SITE_CONFIG.socialLinks.collegeWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span>Visit Main College Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Institutional Bar */}
      <div className="border-t border-white/10 bg-[#050e1a] text-xs text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            © {new Date().getFullYear()} National Service Scheme (NSS) Unit • {SITE_CONFIG.collegeName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Institutional Portal</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#E63946]" />
              <span>Govt. of India Scheme</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
