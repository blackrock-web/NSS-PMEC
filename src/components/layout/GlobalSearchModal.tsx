import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, FileText, Compass, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { ACTIVITIES_DATA } from '../../data/activities';
import { EVENTS_DATA } from '../../data/events';
import { REPORTS_DATA } from '../../data/reports';
import { SITE_CONFIG } from '../../data/config';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Activities' | 'Events' | 'Reports' | 'Announcements'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const matchedActivities = ACTIVITIES_DATA.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.shortDescription.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
  );

  const matchedEvents = EVENTS_DATA.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.shortDescription.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
  );

  const matchedReports = REPORTS_DATA.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.academicYear.toLowerCase().includes(q)
  );

  const matchedAnnouncements = SITE_CONFIG.announcements.filter((an) =>
    an.title.toLowerCase().includes(q)
  );

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalResults =
    (selectedFilter === 'All' || selectedFilter === 'Activities' ? matchedActivities.length : 0) +
    (selectedFilter === 'All' || selectedFilter === 'Events' ? matchedEvents.length : 0) +
    (selectedFilter === 'All' || selectedFilter === 'Reports' ? matchedReports.length : 0) +
    (selectedFilter === 'All' || selectedFilter === 'Announcements' ? matchedAnnouncements.length : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities, events, reports, camps..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-white border-b border-slate-100 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Filter:
          </span>
          {(['All', 'Activities', 'Events', 'Reports', 'Announcements'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#0B1F3A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 divide-y divide-slate-100 space-y-4">
          {totalResults === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">No results found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for &apos;blood donation&apos;, &apos;special camp&apos;, &apos;tree plantation&apos;, or &apos;annual report&apos;.
              </p>
            </div>
          ) : (
            <>
              {/* Events Section */}
              {(selectedFilter === 'All' || selectedFilter === 'Events') && matchedEvents.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#E63946]" />
                    Events ({matchedEvents.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedEvents.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => handleSelect(`/events/${evt.slug}`)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start justify-between group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-[#E63946] uppercase">
                            {evt.date} • {evt.category}
                          </div>
                          <div className="font-medium text-slate-900 group-hover:text-[#0B1F3A] text-sm">
                            {evt.title}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {evt.location}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0B1F3A] shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities Section */}
              {(selectedFilter === 'All' || selectedFilter === 'Activities') && matchedActivities.length > 0 && (
                <div className="pt-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Activities ({matchedActivities.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedActivities.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => handleSelect('/activities')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start justify-between group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-500 uppercase">
                            {act.category} • {act.date}
                          </div>
                          <div className="font-medium text-slate-900 group-hover:text-[#0B1F3A] text-sm">
                            {act.title}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {act.shortDescription}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0B1F3A] shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports Section */}
              {(selectedFilter === 'All' || selectedFilter === 'Reports') && matchedReports.length > 0 && (
                <div className="pt-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Reports & Dossiers ({matchedReports.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedReports.map((rep) => (
                      <button
                        key={rep.id}
                        onClick={() => handleSelect('/reports')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start justify-between group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-emerald-600 uppercase">
                            {rep.academicYear} • {rep.category} Report • {rep.fileSize}
                          </div>
                          <div className="font-medium text-slate-900 group-hover:text-[#0B1F3A] text-sm">
                            {rep.title}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0B1F3A] shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Announcements Section */}
              {(selectedFilter === 'All' || selectedFilter === 'Announcements') && matchedAnnouncements.length > 0 && (
                <div className="pt-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Official Announcements
                  </div>
                  <div className="space-y-1.5">
                    {matchedAnnouncements.map((ann) => (
                      <button
                        key={ann.id}
                        onClick={() => handleSelect(ann.link)}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start justify-between group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-[#E63946] uppercase">
                            Notice • {ann.date}
                          </div>
                          <div className="font-medium text-slate-900 text-sm">
                            {ann.title}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0B1F3A] shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {totalResults} items matching your criteria
          </span>
          <span className="text-[11px] text-slate-400">
            Press ESC to close
          </span>
        </div>
      </div>
    </div>
  );
};
