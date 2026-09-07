import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ActivityCard } from '../components/activities/ActivityCard';
import { ActivityModal } from '../components/activities/ActivityModal';
import { ACTIVITIES_DATA } from '../data/activities';
import { api } from '../lib/api';
import { Activity } from '../types';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(6);

  useEffect(() => {
    async function loadActivities() {
      try {
        const res = await api.activities.list();
        if (res.success && res.data && res.data.length > 0) {
          setActivities(res.data);
        }
      } catch (e) {
        console.error('Failed to load dynamic activities:', e);
      }
    }
    loadActivities();
  }, []);

  const categories = [
    'All',
    'Environment',
    'Health & Wellbeing',
    'Education',
    'Community Development',
    'Social Awareness',
    'National Integration'
  ];

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchCat =
        selectedCategory === 'All' ||
        act.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchQuery =
        !searchQuery.trim() ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activities, selectedCategory, searchQuery]);

  const visibleActivities = filteredActivities.slice(0, displayCount);

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#0B1F3A] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FCA5A5] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMUNITY INITIATIVES ARCHIVE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              NSS Activities & Social Drives
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Explore our regular volunteer actions across environmental conservation, community health, literacy outreach, and civil sensitization.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar & Search */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none text-xs">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setDisplayCount(6);
                }}
                className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(6);
              }}
              placeholder="Search activities..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1F3A]"
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
          <span>
            Showing <strong>{visibleActivities.length}</strong> of <strong>{filteredActivities.length}</strong> activities
            {selectedCategory !== 'All' && <span> in &quot;{selectedCategory}&quot;</span>}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#E63946] hover:underline font-semibold"
            >
              Clear search filter
            </button>
          )}
        </div>

        {/* Grid of Activity Cards */}
        {visibleActivities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">No activities match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleActivities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onReadReport={(activity) => setSelectedActivity(activity)}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {displayCount < filteredActivities.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 6)}
              className="px-6 py-3 rounded-lg bg-white border border-slate-300 hover:border-[#0B1F3A] text-[#0B1F3A] font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Load More Activities ({filteredActivities.length - displayCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Activity Details Modal */}
      <ActivityModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};
