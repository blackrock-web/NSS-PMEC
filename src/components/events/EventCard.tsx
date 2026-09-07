import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { EventItem } from '../../types';

interface EventCardProps {
  event: EventItem;
  onViewEvent: (slug: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewEvent }) => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-sm overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group h-full">
      {/* Top Image (if present) or Date Header Bar */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden shrink-0">
        <img
          src={event.heroImage}
          alt={event.title}
          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-[#0B1F3A]/30 group-hover:bg-transparent transition-colors" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-transparent to-transparent" />

        {/* Date Badge overlay */}
        <div className="absolute top-3 left-3 bg-[#0B1F3A] text-white rounded-sm p-2 text-center shadow-md border border-white/10 min-w-[50px]">
          <div className="text-lg font-black leading-none">
            {event.day}
          </div>
          <div className="text-[10px] font-bold text-[#FCA5A5] uppercase tracking-widest mt-0.5">
            {event.month}
          </div>
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-white text-[#0B1F3A] shadow-xs">
            {event.category}
          </span>
        </div>

        {/* Status Badge */}
        {event.status === 'upcoming' && event.registrationOpen && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest bg-[#E63946] text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Open for Enrollment
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-black text-[#0B1F3A] text-base group-hover:text-[#E63946] transition-colors leading-snug line-clamp-2">
            {event.title}
          </h3>

          <p className="text-xs text-[#6B7280] line-clamp-2 mt-2 leading-relaxed">
            {event.shortDescription}
          </p>

          {/* Time & Venue */}
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-5 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
            {event.status === 'upcoming' ? 'Upcoming Event' : 'Archived Event'}
          </span>
          <button
            onClick={() => onViewEvent(event.slug)}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0B1F3A] border-b border-[#0B1F3A] pb-0.5 group-hover:text-[#E63946] group-hover:border-[#E63946] transition-all"
          >
            <span>View Event &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
