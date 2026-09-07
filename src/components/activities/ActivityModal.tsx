import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Users, HeartHandshake, CheckCircle2, Download, Printer } from 'lucide-react';
import { Activity } from '../../types';
import { SITE_CONFIG } from '../../data/config';
import { NssLogo } from '../common/NssLogo';

interface ActivityModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (activity) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activity, onClose]);

  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Image with Overlay */}
        <div className="relative h-60 sm:h-72 w-full bg-slate-900 shrink-0">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#E63946] inline-block mb-2 shadow-xs">
              {activity.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {activity.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#E63946]" />
              <span className="font-semibold text-slate-900">{activity.date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E63946]" />
              <span>{activity.location}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#0B1F3A]" />
              <span>{activity.volunteersInvolved} Volunteers Enlisted</span>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
              Activity Overview & Background
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {activity.fullDescription}
            </p>
          </div>

          {/* Key Deliverables / Highlights */}
          {activity.highlights && activity.highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Outputs & Field Milestones
              </h3>
              <ul className="space-y-2.5">
                {activity.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Impact & Beneficiaries */}
          <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#E63946] font-bold">
                Community Reach & Impact
              </div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {activity.beneficiaries}
              </div>
            </div>
            <HeartHandshake className="w-8 h-8 text-[#E63946] shrink-0" />
          </div>

          {/* Institutional Sign-off */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Certified by: <strong className="text-slate-700">{SITE_CONFIG.programmeOfficerName}</strong> (Programme Officer)
            </div>
            <NssLogo size={28} />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded hover:bg-white flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0B1F3A] hover:bg-[#071526] rounded shadow"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
