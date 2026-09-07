import React from 'react';
import { ArrowRight, Calendar, Users, MapPin } from 'lucide-react';
import { Activity } from '../../types';

interface ActivityCardProps {
  activity: Activity;
  onReadReport: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onReadReport
}) => {
  return (
    <article className="bg-white border border-[#E5E7EB] rounded-sm overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group h-full">
      {/* Large Image */}
      <div className="relative h-52 w-full bg-slate-900 overflow-hidden shrink-0">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#0B1F3A]/30 group-hover:bg-transparent transition-colors" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/85 via-transparent to-transparent opacity-80" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest bg-[#0B1F3A] text-white border border-white/10 shadow-xs">
            {activity.category}
          </span>
        </div>

        {/* Date */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center gap-1.5 drop-shadow">
          <Calendar className="w-3.5 h-3.5 text-[#E63946]" />
          <span className="tracking-wide">{activity.date}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#6B7280] font-medium mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>

          <h3 className="font-black text-[#0B1F3A] text-lg group-hover:text-[#E63946] transition-colors leading-snug line-clamp-2">
            {activity.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#6B7280] line-clamp-3 mt-2.5 leading-relaxed">
            {activity.shortDescription}
          </p>

          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center gap-3 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-[#0B1F3A]" />
              <span>{activity.volunteersInvolved} Enrolled Volunteers</span>
            </span>
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-5 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            onClick={() => onReadReport(activity)}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0B1F3A] border-b border-[#0B1F3A] pb-0.5 group-hover:text-[#E63946] group-hover:border-[#E63946] transition-all"
          >
            <span>Read Report &rarr;</span>
          </button>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
            {activity.id}
          </span>
        </div>
      </div>
    </article>
  );
};
