import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, ArrowUpRight, Heart, ShieldCheck, Award } from 'lucide-react';
import { NssLogo } from '../common/NssLogo';
import { SITE_CONFIG } from '../../data/config';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1F3A] text-slate-300 border-t border-slate-800">
      {/* Top Banner with Motto */}
      <div className="border-b border-white/10 bg-[#071526]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <NssLogo size={56} />
            <div>
              <div className="text-white font-extrabold text-xl tracking-tight">
                NATIONAL SERVICE SCHEME
              </div>
              <div className="text-slate-400 text-sm">
                Unit 04 & 05 • {SITE_CONFIG.collegeFullName}
              </div>
            </div>
          </div>

          {/* Official Motto Banner */}
          <div className="bg-white/5 border border-white/15 border-l-4 border-[#E63946] rounded-sm px-6 py-3 text-center md:text-right">
            <div className="text-xs uppercase tracking-[0.25em] text-[#E63946] font-black">
              National NSS Motto
            </div>
            <div className="text-white font-black italic text-lg tracking-wide">
              &quot;NOT ME, BUT YOU&quot;
            </div>
            <div className="text-xs text-slate-400">
              {SITE_CONFIG.hindiMotto}
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
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="hover:text-white hover:translate-x-1 inline-block transition-transform"
                >
                  Contact NSS Office
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-400 block pt-2 leading-relaxed">
                  Open to all 1st & 2nd year undergraduate students across all academic departments.
                </span>
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
