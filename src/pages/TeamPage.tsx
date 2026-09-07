import React from 'react';
import { Mail, Phone, ShieldCheck, Users, Award, BookOpen } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TEAM_DATA } from '../data/team';
import { SITE_CONFIG } from '../data/config';
import { TeamMember } from '../types';

interface TeamPageProps {
  onNavigate: (path: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onNavigate }) => {
  const leadership = TEAM_DATA.filter((m) => m.roleType === 'leadership');
  const programmeOfficers = TEAM_DATA.filter((m) => m.roleType === 'programme_officer');
  const studentCoordinators = TEAM_DATA.filter((m) => m.roleType === 'student_coordinator');

  const renderMemberCard = (member: TeamMember) => (
    <div
      key={member.id}
      className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
    >
      <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
        
        {member.badge && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#0B1F3A]/90 text-white backdrop-blur-xs border border-white/15">
              {member.badge}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs font-semibold text-[#E63946] uppercase tracking-wider mb-1">
            {member.department}
          </div>
          <h3 className="font-bold text-[#0B1F3A] text-lg leading-snug">
            {member.name}
          </h3>
          <div className="text-xs font-semibold text-slate-700 mt-0.5 mb-3">
            {member.designation}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {member.bio}
          </p>
        </div>

        {(member.email || member.phone) && (
          <div className="mt-5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
            {member.email && (
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                <a href={`mailto:${member.email}`} className="hover:text-[#0B1F3A] truncate">
                  {member.email}
                </a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                <span>{member.phone}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen">
      {/* Page Hero */}
      <section className="bg-[#0B1F3A] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FCA5A5] mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>ORGANIZATIONAL HIERARCHY</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              NSS Unit Leadership & Team
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Meet the faculty directors, institutional patrons, and student coordinators driving grassroots community service at {SITE_CONFIG.collegeName}.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Section 1: College Leadership */}
        <div>
          <SectionHeading
            badge="COLLEGE LEADERSHIP"
            title="Institutional Patrons"
            subtitle="Providing strategic vision and administrative governance for extension and social outreach programs."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {leadership.map(renderMemberCard)}
          </div>
        </div>

        {/* Section 2: NSS Programme Officers */}
        <div>
          <SectionHeading
            badge="OPERATIONAL HEADS"
            title="NSS Programme Officers"
            subtitle="Certified faculty leaders trained at the Empanelled Training Institution (ETI), executing regular activities and camp curricula."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {programmeOfficers.map(renderMemberCard)}
          </div>
        </div>

        {/* Section 3: Student Coordinators */}
        <div>
          <SectionHeading
            badge="STUDENT EXECUTIVE COUNCIL"
            title="Student Coordinators (2026–27)"
            subtitle="Elected senior student volunteers heading field operations, community liaison, quartermaster logistics, and digital documentation."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentCoordinators.map(renderMemberCard)}
          </div>
        </div>

        {/* Advisory Guidelines Notice */}
        <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="font-bold text-base text-[#0B1F3A] mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              NSS Advisory Committee Meeting Schedule
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The College NSS Advisory Committee meets bi-annually with representatives from the State NSS Cell, Affiliating University, Local Panchayat, and voluntary NGOs to ratify the annual action plan and financial audit.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/reports')}
            className="px-5 py-2.5 rounded-lg bg-[#0B1F3A] hover:bg-[#071526] text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            View Advisory Reports
          </button>
        </div>
      </div>
    </div>
  );
};
