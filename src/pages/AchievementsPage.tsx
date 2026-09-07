import React, { useState, useMemo } from 'react';
import { Award, Trophy, Star, Filter, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { AchievementItem } from '../types';

export const AchievementsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  const categories = [
    'All',
    'State Awards',
    'University Honors',
    'Volunteer Honors',
    'Community Recognition',
    'Camp Accolades'
  ];

  const years = ['All', '2026', '2025', '2024'];

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS_DATA.filter((item) => {
      const matchCat =
        selectedCategory === 'All' ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchYear = selectedYear === 'All' || item.year.includes(selectedYear);
      return matchCat && matchYear;
    });
  }, [selectedCategory, selectedYear]);

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-[#0B1F3A] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FCA5A5] mb-4">
              <Trophy className="w-3.5 h-3.5" />
              <span>RECOGNITION OF EXCELLENCE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Achievements & Honors
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Celebrating institutional awards, university citations, and volunteer distinctions conferred for exemplary civic service.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

          {/* Year Filter */}
          <div className="flex items-center gap-2 text-xs w-full md:w-auto justify-end">
            <span className="text-slate-500 font-medium">Session:</span>
            {years.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  selectedYear === yr
                    ? 'bg-[#E63946] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="text-xs text-slate-500 mb-6 font-medium">
          Showing <strong>{filteredAchievements.length}</strong> recorded honors
        </div>

        {/* Achievements Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#0B1F3A] text-white">
                    {ach.category}
                  </span>
                  <span className="text-xs font-bold text-[#E63946] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ach.year}</span>
                  </span>
                </div>

                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-[#E63946] group-hover:text-white transition-colors">
                  <Trophy className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-[#0B1F3A] mb-1.5 leading-snug group-hover:text-[#E63946] transition-colors">
                  {ach.title}
                </h3>

                <div className="text-xs text-slate-500 font-semibold mb-3">
                  Conferred by: <strong className="text-slate-800">{ach.awardingBody}</strong>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {ach.citation && (
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{ach.citation}</span>
                </div>
              )}

              {/* Red bottom accent border */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#E63946] group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
