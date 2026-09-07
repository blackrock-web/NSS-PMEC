import React, { useState } from 'react';
import { 
  MapPin, Calendar, Users, Award, Download, CheckCircle2, 
  Quote, HeartHandshake, Compass, Trees, HeartPulse, Sparkles, 
  Printer, ArrowRight 
} from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Lightbox } from '../components/ui/Lightbox';
import { ReportDownloadModal } from '../components/ui/ReportDownloadModal';
import { SPECIAL_CAMP_CONFIG } from '../data/specialCamp';
import { SITE_CONFIG } from '../data/config';
import { GalleryPhoto, ReportItem } from '../types';

interface SpecialCampPageProps {
  onNavigate: (path: string) => void;
}

export const SpecialCampPage: React.FC<SpecialCampPageProps> = ({ onNavigate }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [downloadModalReport, setDownloadModalReport] = useState<ReportItem | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  const handleDownloadReport = () => {
    setDownloadModalReport({
      id: 'rep-camp-2026',
      title: '7-Day Special Camp 2026 - Comprehensive Village Dossier',
      academicYear: '2025–26',
      category: 'Special Camp',
      datePublished: 'January 2026',
      fileSize: '8.4 MB',
      pages: 42,
      preparedBy: 'Camp Quartermaster & Programme Officer',
      description: 'Comprehensive 42-page dossier recording the shramdaan check dam, socioeconomic survey of 102 households, and village health clinics.',
      downloadUrl: '#'
    });
  };

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen pb-20">
      {/* Editorial Hero */}
      <section className="relative bg-[#071526] text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1920&q=80"
            alt="NSS volunteers engaged in shramdaan during Special Camp"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/80 to-[#071526]/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-semibold text-[#FCA5A5] mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>FLAGSHIP ANNUAL RESIDENTIAL IMMERSION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            7-Day Special Camp 2026
          </h1>

          <div className="text-base sm:text-xl font-serif italic text-slate-200 mb-6 max-w-2xl">
            &quot;{SPECIAL_CAMP_CONFIG.theme}&quot;
          </div>

          <p className="max-w-3xl text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            {SPECIAL_CAMP_CONFIG.overview}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E63946]" />
              <span>Village {SPECIAL_CAMP_CONFIG.villageName}, {SPECIAL_CAMP_CONFIG.district}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E63946]" />
              <span>{SPECIAL_CAMP_CONFIG.dates}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E63946]" />
              <span>{SPECIAL_CAMP_CONFIG.volunteersEnrolled} Volunteers (Residential)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadReport}
              className="px-6 py-3 rounded-lg bg-[#E63946] hover:bg-[#C92A37] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Camp Dossier</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('timeline-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition-all"
            >
              Explore Day-Wise Journey
            </button>
          </div>
        </div>
      </section>

      {/* Camp Objectives & Scope */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="CAMP CHARTER"
            title="Educational & Community Objectives"
            subtitle="The 7-Day residential camp represents 50% of the mandatory practical requirement for NSS certification."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPECIAL_CAMP_CONFIG.objectives.map((obj, i) => (
              <div
                key={i}
                className="bg-[#F7F8FA] p-6 rounded-xl border border-slate-200/80 flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-[#0B1F3A] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  0{i + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {obj}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vertical Interactive Day-wise Timeline (Day 1 to Day 7) */}
      <section id="timeline-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="DAY-BY-DAY CHRONICLE"
          title="The 7-Day Residential Timeline"
          subtitle="Follow the narrative of our volunteers living in the village, building infrastructure, and fostering community solidarity."
        />

        {/* Day Selector Quick Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {SPECIAL_CAMP_CONFIG.timeline.map((day, idx) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeDayIndex === idx
                  ? 'bg-[#0B1F3A] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Day 0{day.dayNumber}: {day.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Active Day Detail Editorial Card */}
        {(() => {
          const currentDay = SPECIAL_CAMP_CONFIG.timeline[activeDayIndex];
          return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Photo Column (5 cols) */}
                <div className="lg:col-span-5 relative min-h-[320px] bg-slate-900">
                  <img
                    src={currentDay.image}
                    alt={currentDay.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-[#E63946] text-white">
                      Day 0{currentDay.dayNumber} of 07
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-bold text-[#FCA5A5] mb-1">{currentDay.date}</div>
                    <h3 className="text-xl font-bold leading-snug">{currentDay.title}</h3>
                  </div>
                </div>

                {/* Day Content (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Diary & Daily Log
                    </div>

                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6">
                      {currentDay.description}
                    </p>

                    {/* Key Activities Conducted */}
                    <div className="space-y-3 mb-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Field Activities Executed:
                      </div>
                      <div className="space-y-2">
                        {currentDay.activities.map((act, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact Metric */}
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                      <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                          Community Impact / Outcome
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-emerald-950 mt-0.5">
                          {currentDay.impact}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation controls between days */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      disabled={activeDayIndex === 0}
                      onClick={() => setActiveDayIndex((prev) => Math.max(0, prev - 1))}
                      className="text-xs font-bold text-slate-600 hover:text-[#0B1F3A] disabled:opacity-30 disabled:pointer-events-none"
                    >
                      ← Previous Day
                    </button>
                    <span className="text-xs text-slate-400 font-medium">
                      Day {currentDay.dayNumber} / 7
                    </span>
                    <button
                      disabled={activeDayIndex === SPECIAL_CAMP_CONFIG.timeline.length - 1}
                      onClick={() => setActiveDayIndex((prev) => Math.min(SPECIAL_CAMP_CONFIG.timeline.length - 1, prev + 1))}
                      className="text-xs font-bold text-[#0B1F3A] hover:text-[#E63946] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                    >
                      <span>Next Day</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Camp Outcomes Summary */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="TANGIBLE ASSETS"
            title="Permanent Outcomes of the Special Camp"
            subtitle="Leaving lasting value in adopted village through infrastructure, community goodwill, and student maturity."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPECIAL_CAMP_CONFIG.outcomes.map((out, i) => (
              <div
                key={i}
                className="bg-[#F7F8FA] p-6 rounded-xl border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Trees className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base text-[#0B1F3A] mb-2">{out.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{out.description}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/70 text-xs font-extrabold text-[#E63946]">
                  {out.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Voices from the Camp */}
      <section className="py-20 bg-[#F7F8FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="REFLECTIONS"
            title="Voices from the Community & Volunteers"
            subtitle="Unfiltered impressions from local village leaders and enrolled student participants."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SPECIAL_CAMP_CONFIG.testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#E63946] mb-4 opacity-75" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    &quot;{t.quote}&quot;
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#0B1F3A]">{t.author}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0B1F3A] font-bold text-xs flex items-center justify-center">
                    NSS
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Download Full Camp Report Callout */}
          <div className="mt-14 p-8 bg-[#0B1F3A] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#E63946] font-bold mb-1">
                Official University Archive
              </div>
              <h3 className="text-xl font-bold text-white">
                Download the Complete 7-Day Special Camp Dossier
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Includes socioeconomic survey charts, volunteer muster rolls, check dam civil schematics, and health diagnosis statistics.
              </p>
            </div>
            <button
              onClick={handleDownloadReport}
              className="px-6 py-3 rounded-lg bg-[#E63946] hover:bg-[#C92A37] text-white text-xs font-bold uppercase tracking-wider shadow shrink-0 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Camp Dossier (PDF)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox for preview */}
      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Report Download Modal */}
      <ReportDownloadModal
        report={downloadModalReport}
        onClose={() => setDownloadModalReport(null)}
      />
    </div>
  );
};
