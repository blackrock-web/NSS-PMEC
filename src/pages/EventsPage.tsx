import React, { useState, useMemo } from 'react';
import { Calendar, Search, Filter, Clock, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { EventCard } from '../components/events/EventCard';
import { EVENTS_DATA } from '../data/events';

interface EventsPageProps {
  onViewEvent: (slug: string) => void;
  onNavigate: (path: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onViewEvent, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Health & Wellbeing',
    'National Integration',
    'Community Development',
    'Special Camp'
  ];

  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter((evt) => {
      const matchTab = activeTab === 'all' || evt.status === activeTab;
      const matchCat =
        selectedCategory === 'All' ||
        evt.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchQuery =
        !searchQuery.trim() ||
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchCat && matchQuery;
    });
  }, [activeTab, selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#0B1F3A] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FCA5A5] mb-4">
              <Calendar className="w-3.5 h-3.5" />
              <span>NSS SERVICE CALENDAR</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              NSS Events & Camps
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Stay updated with scheduled community drives, voluntary blood camps, commemorations, and past event archives.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Tabs (Upcoming vs Past) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-[#0B1F3A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Upcoming Events ({EVENTS_DATA.filter((e) => e.status === 'upcoming').length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'past'
                  ? 'bg-[#0B1F3A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Past Events ({EVENTS_DATA.filter((e) => e.status === 'past').length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#0B1F3A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All
            </button>
          </div>

          <div className="hidden sm:block text-xs text-slate-500 font-medium">
            Academic Session 2026–27
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0B1F3A] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title or venue..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1F3A]"
            />
          </div>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">No events found</h3>
            <p className="text-xs text-slate-500 mt-1">Try switching tabs or clearing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewEvent={onViewEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
