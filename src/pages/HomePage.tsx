import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, HeartHandshake, Calendar, ChevronDown, 
  Trees, HeartPulse, GraduationCap, Building2, ShieldAlert, Flag,
  Sparkles, CheckCircle2, Award, Quote, Image as ImageIcon,
  Clock, MapPin, Compass
} from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { StatCard } from '../components/ui/StatCard';
import { EventCard } from '../components/events/EventCard';
import { ActivityCard } from '../components/activities/ActivityCard';
import { Lightbox } from '../components/ui/Lightbox';
import { ActivityModal } from '../components/activities/ActivityModal';
import { SITE_CONFIG } from '../data/config';
import { ACTIVITIES_DATA } from '../data/activities';
import { EVENTS_DATA } from '../data/events';
import { GALLERY_DATA } from '../data/gallery';
import { ACHIEVEMENTS_DATA } from '../data/achievements';
import { SPECIAL_CAMP_CONFIG } from '../data/specialCamp';
import { Activity, GalleryPhoto, EventItem } from '../types';
import { useTenant } from '../context/TenantContext';
import { api } from '../lib/api';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onViewEvent: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onViewEvent }) => {
  const { config } = useTenant();
  const activeConfig = config || SITE_CONFIG;

  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(GALLERY_DATA);
  const [eventsList, setEventsList] = useState<EventItem[]>(EVENTS_DATA);
  const [activitiesList, setActivitiesList] = useState<Activity[]>(ACTIVITIES_DATA);

  useEffect(() => {
    async function loadDynamicHomeData() {
      try {
        const [evts, acts, gals] = await Promise.all([
          api.events.list().catch(() => ({ success: false, data: [] })),
          api.activities.list().catch(() => ({ success: false, data: [] })),
          api.gallery.list().catch(() => ({ success: false, data: [] })),
        ]);
        if (evts.success && evts.data && evts.data.length > 0) {
          setEventsList(evts.data);
        }
        if (acts.success && acts.data && acts.data.length > 0) {
          setActivitiesList(acts.data);
        }
        if (gals.success && gals.data && gals.data.length > 0) {
          setGalleryPhotos(gals.data);
        }
      } catch (e) {
        console.error('Failed to load dynamic homepage content:', e);
      }
    }
    loadDynamicHomeData();
  }, []);

  // Gallery preview slice (first 6 photos)
  const previewPhotos = galleryPhotos.slice(0, 6);
  // Upcoming events (first 3)
  const upcomingEvents = eventsList.filter(e => e.status === 'upcoming').slice(0, 3);
  // Recent activities (first 3)
  const recentActivities = activitiesList.slice(0, 3);

  const handleOpenLightbox = (photo: GalleryPhoto, index: number) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
  };

  const handlePrevPhoto = () => {
    const nextIdx = (selectedPhotoIndex - 1 + previewPhotos.length) % previewPhotos.length;
    setSelectedPhotoIndex(nextIdx);
    setSelectedPhoto(previewPhotos[nextIdx]);
  };

  const handleNextPhoto = () => {
    const nextIdx = (selectedPhotoIndex + 1) % previewPhotos.length;
    setSelectedPhotoIndex(nextIdx);
    setSelectedPhoto(previewPhotos[nextIdx]);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 5. HERO SECTION (GEOMETRIC BALANCE SPLIT LAYOUT) */}
      <section className="relative w-full bg-[#F7F8FA] border-b border-[#E5E7EB] overflow-hidden">
        <div className="flex flex-col lg:flex-row w-full min-h-[580px] lg:min-h-[640px]">
          {/* Left Column: Geometric Structured Typography & CTAs (55%) */}
          <div className="w-full lg:w-[55%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#F7F8FA] border-b lg:border-b-0 lg:border-r border-[#E5E7EB]">
            {/* Geometric Accent Block */}
            <div className="mb-6 border-l-4 border-[#E63946] pl-6">
              <p className="text-[#E63946] text-xs font-black uppercase tracking-[0.3em] mb-2">
                The Official Unit • {SITE_CONFIG.collegeName.toUpperCase()}
              </p>
              <h2 className="text-[#0B1F3A] text-3xl sm:text-4xl lg:text-5xl font-black italic leading-tight">
                &quot;{SITE_CONFIG.motto}&quot;
              </h2>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] leading-[0.98] tracking-tight mb-8">
              Developing Character <br />
              Through Service.
            </h1>

            {/* Subtitle */}
            <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
              Building a sense of social responsibility in students since 1969. 
              Join a legacy of community impact, environmental stewardship, and youth civic leadership.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <button
                onClick={() => onNavigate('/activities')}
                className="bg-[#E63946] text-white px-8 sm:px-10 py-4 font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-red-500/20 rounded-sm hover:bg-[#C92A37] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('/join-nss')}
                className="border-2 border-[#0B1F3A] text-[#0B1F3A] px-8 sm:px-10 py-4 font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-[#0B1F3A] hover:text-white transition-all rounded-sm flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Join NSS Volunteers</span>
              </button>
            </div>

            {/* Geometric Notice Callout */}
            <div className="mt-10 inline-flex items-center gap-3 p-3 rounded-sm bg-white border border-[#E5E7EB] text-xs text-slate-700 max-w-lg shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E63946] inline-block animate-pulse shrink-0"></span>
              <span className="font-bold text-[#0B1F3A] uppercase tracking-wider text-[11px] shrink-0">Notice:</span>
              <span className="truncate text-slate-600">{SITE_CONFIG.announcements[0].title}</span>
              <button
                onClick={() => onNavigate(SITE_CONFIG.announcements[0].link)}
                className="text-[#E63946] hover:underline font-bold text-xs shrink-0 ml-auto"
              >
                Apply &rarr;
              </button>
            </div>
          </div>

          {/* Right Column: High-Contrast Monochromatic Photo with Geometric Overlay (45%) */}
          <div className="w-full lg:w-[45%] relative min-h-[380px] lg:min-h-full bg-[#0B1F3A] overflow-hidden flex items-end">
            <div className="absolute inset-0 bg-[#0B1F3A] opacity-20 z-10" />
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
              alt="NSS Community Fieldwork"
              className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/30 to-transparent" />

            {/* Overlapping Floating Geometric Card */}
            <div className="relative z-20 m-6 sm:m-10 lg:m-12 bg-white p-8 sm:p-10 border-l-8 border-[#E63946] shadow-2xl rounded-sm max-w-md w-full">
              <span className="block text-[#E63946] text-xs font-black uppercase tracking-widest mb-2">
                Featured Camp 2026
              </span>
              <h3 className="text-[#0B1F3A] text-xl sm:text-2xl font-bold mb-3 leading-tight">
                {SPECIAL_CAMP_CONFIG.theme}
              </h3>
              <p className="text-[#6B7280] text-xs sm:text-sm mb-6 leading-relaxed">
                A seven-day residential camp focused on watershed check dams, rural health clinics, and sustainable village development.
              </p>
              <button
                onClick={() => onNavigate('/special-camp')}
                className="inline-flex items-center text-[#0B1F3A] font-bold text-xs uppercase tracking-widest border-b border-[#0B1F3A] pb-1 hover:text-[#E63946] hover:border-[#E63946] transition-all"
              >
                <span>View Full Report &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. IMPACT STATISTICS & NEXT EVENT (GEOMETRIC 4-COLUMN BAR) */}
      <section className="bg-white border-b border-[#E5E7EB] w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB]">
          {/* Stat 1 */}
          <div className="flex flex-col justify-center items-center text-center p-8 border-b lg:border-b-0 border-[#E5E7EB]">
            <span className="text-4xl lg:text-5xl font-black text-[#0B1F3A] tracking-tight">500+</span>
            <span className="text-[10px] text-[#6B7280] font-black uppercase tracking-[0.2em] mt-2">
              Active Volunteers
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col justify-center items-center text-center p-8 border-b lg:border-b-0 border-[#E5E7EB]">
            <span className="text-4xl lg:text-5xl font-black text-[#E63946] tracking-tight">25+</span>
            <span className="text-[10px] text-[#6B7280] font-black uppercase tracking-[0.2em] mt-2">
              Annual Drives
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col justify-center items-center text-center p-8 border-b sm:border-b-0 border-[#E5E7EB]">
            <span className="text-4xl lg:text-5xl font-black text-[#0B1F3A] tracking-tight">10+</span>
            <span className="text-[10px] text-[#6B7280] font-black uppercase tracking-[0.2em] mt-2">
              Adopted Villages
            </span>
          </div>

          {/* Next Event Ticker Card */}
          <div className="p-8 flex flex-col justify-center bg-white hover:bg-slate-50 transition-colors">
            <p className="text-[#111827] text-[11px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E63946] rounded-full animate-pulse"></span>
              <span>Next Event</span>
            </p>
            {upcomingEvents[0] && (
              <div 
                onClick={() => onViewEvent(upcomingEvents[0].slug)}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div className="bg-[#0B1F3A] text-white p-2 rounded-sm shrink-0 min-w-[50px] text-center group-hover:bg-[#E63946] transition-colors">
                  <span className="block text-[10px] font-bold opacity-75">{upcomingEvents[0].month}</span>
                  <span className="block text-lg font-black leading-none">{upcomingEvents[0].day}</span>
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-[12px] font-black text-[#0B1F3A] leading-snug truncate group-hover:text-[#E63946] transition-colors">
                    {upcomingEvents[0].title}
                  </h4>
                  <p className="text-[10px] text-[#6B7280] truncate mt-0.5">
                    {upcomingEvents[0].time} • {upcomingEvents[0].location}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. ABOUT NSS PREVIEW */}
      <section className="py-20 sm:py-28 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Image with Geometric Institutional Frame */}
            <div className="relative">
              <div className="relative rounded-sm overflow-hidden shadow-xl border border-[#E5E7EB] bg-[#0B1F3A]">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80"
                  alt="NSS volunteers planting trees in community initiative"
                  className="w-full h-[380px] sm:h-[460px] object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xs uppercase tracking-[0.25em] text-[#FCA5A5] font-black mb-1">
                    Student Civic Engagement
                  </div>
                  <div className="text-lg font-black text-white">
                    Transforming youth energy into sustainable community assets.
                  </div>
                </div>
              </div>

              {/* Floating Mini Citation */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-5 rounded-sm shadow-xl border border-[#E5E7EB] border-l-4 border-[#E63946] hidden sm:block max-w-xs">
                <div className="text-xs font-black text-[#0B1F3A] uppercase tracking-widest">
                  Established 1969
                </div>
                <div className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                  Launched during Mahatma Gandhi centenary year under Ministry of Youth Affairs.
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Text */}
            <div>
              <div className="mb-4 border-l-4 border-[#E63946] pl-4">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#E63946]">ABOUT NSS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1F3A] tracking-tight leading-tight">
                Beyond the classroom, <br />
                <span className="text-[#E63946]">into the community.</span>
              </h2>

              <p className="mt-5 text-[#6B7280] text-sm sm:text-base leading-relaxed">
                The National Service Scheme (NSS) is a flagship public service program sponsored by the Ministry of Youth Affairs and Sports, Government of India. It aims to instill the spirit of voluntary community service among college students, linking academic education directly with social transformation.
              </p>

              <p className="mt-3 text-[#6B7280] text-sm sm:text-base leading-relaxed">
                At <strong>{SITE_CONFIG.collegeName}</strong>, our unit provides undergraduate students with practical platforms to address real-world rural challenges: water scarcity, health disparity, digital literacy, and environmental regeneration, shaping compassionate, disciplined, and responsible citizens.
              </p>

              {/* Core Pillars List */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                  <span>Grassroots Village Adoption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                  <span>Emergency Blood Bank Registry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                  <span>Afforestation & Environmental Care</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                  <span>Certified 120-Hour Service Diploma</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => onNavigate('/about')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm bg-[#0B1F3A] hover:bg-[#E63946] text-white text-xs font-bold uppercase tracking-widest transition-all group shadow-sm"
                >
                  <span>Learn More About Our Unit</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHAT WE DO (6 ACTIVITY CATEGORIES) */}
      <section className="py-20 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="AREAS OF ENGAGEMENT"
            title="What We Do"
            subtitle="Our volunteers mobilize across six focused socio-civic pillars designed to address immediate community needs and long-term societal resilience."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Category 1: Environment */}
            <div className="p-8 rounded-sm border border-[#E5E7EB] bg-white hover:border-[#0B1F3A] hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#0B1F3A] text-white flex items-center justify-center mb-5 group-hover:bg-[#E63946] transition-colors duration-200">
                  <Trees className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-[#0B1F3A] mb-2 group-hover:text-[#E63946] transition-colors">
                  Environment
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  Native tree plantation drives, Swachhata cleanliness campaigns, watershed restoration, single-use plastic reduction, and renewable energy sensitization.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/activities')}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0B1F3A] border-b border-[#0B1F3A] pb-0.5 inline-flex items-center gap-1 group-hover:text-[#E63946] group-hover:border-[#E63946] w-fit"
              >
                <span>View Drives &rarr;</span>
              </button>
            </div>

            {/* Category 2: Health & Wellbeing */}
            <div className="p-8 rounded-sm border border-[#E5E7EB] bg-white hover:border-[#0B1F3A] hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#0B1F3A] text-white flex items-center justify-center mb-5 group-hover:bg-[#E63946] transition-colors duration-200">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-[#0B1F3A] mb-2 group-hover:text-[#E63946] transition-colors">
                  Health & Wellbeing
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  Voluntary blood donation camps, free rural ophthalmology and general health clinics, thalassemia screening, and Yoga Day assemblies.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/activities')}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0B1F3A] border-b border-[#0B1F3A] pb-0.5 inline-flex items-center gap-1 group-hover:text-[#E63946] group-hover:border-[#E63946] w-fit"
              >
                <span>View Healthcare &rarr;</span>
              </button>
            </div>

            {/* Category 3: Education */}
            <div className="p-8 rounded-sm border border-[#E5E7EB] bg-white hover:border-[#0B1F3A] hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#0B1F3A] text-white flex items-center justify-center mb-5 group-hover:bg-[#E63946] transition-colors duration-200">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-[#0B1F3A] mb-2 group-hover:text-[#E63946] transition-colors">
                  Education
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  Project Gyaan remedial teaching in primary schools, village community library setup, stationary distributions, and digital literacy for rural elders.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/activities')}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0B1F3A] border-b border-[#0B1F3A] pb-0.5 inline-flex items-center gap-1 group-hover:text-[#E63946] group-hover:border-[#E63946] w-fit"
              >
                <span>View Literacy &rarr;</span>
              </button>
            </div>

            {/* Category 4: Community Development */}
            <div className="p-8 rounded-sm border border-[#E5E7EB] bg-white hover:border-[#0B1F3A] hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#0B1F3A] text-white flex items-center justify-center mb-5 group-hover:bg-[#E63946] transition-colors duration-200">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-[#0B1F3A] mb-2 group-hover:text-[#E63946] transition-colors">
                  Community Development
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  Adopted village revitalization, soak-pit construction, socioeconomic household audits, infrastructure repair, and village elder interactions.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/activities')}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0B1F3A] border-b border-[#0B1F3A] pb-0.5 inline-flex items-center gap-1 group-hover:text-[#E63946] group-hover:border-[#E63946] w-fit"
              >
                <span>View Community &rarr;</span>
              </button>
            </div>

            {/* Category 5: Social Awareness */}
            <div className="p-8 rounded-sm border border-[#E5E7EB] bg-white hover:border-[#0B1F3A] hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#0B1F3A] text-white flex items-center justify-center mb-5 group-hover:bg-[#E63946] transition-colors duration-200">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-[#0B1F3A] mb-2 group-hover:text-[#E63946] transition-colors">
                  Social Awareness
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  Street plays (Nukkad Natak), road safety advocacy, anti-substance abuse campaigns, women empowerment workshops, and voter education (SVEEP).
                </p>
              </div>
              <button
                onClick={() => onNavigate('/activities')}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0B1F3A] border-b border-[#0B1F3A] pb-0.5 inline-flex items-center gap-1 group-hover:text-[#E63946] group-hover:border-[#E63946] w-fit"
              >
                <span>View Campaigns &rarr;</span>
              </button>
            </div>

            {/* Category 6: National Integration */}
            <div className="p-8 rounded-sm border border-[#E5E7EB] bg-white hover:border-[#0B1F3A] hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-sm bg-[#0B1F3A] text-white flex items-center justify-center mb-5 group-hover:bg-[#E63946] transition-colors duration-200">
                  <Flag className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-[#0B1F3A] mb-2 group-hover:text-[#E63946] transition-colors">
                  National Integration
                </h3>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  National Unity Day marches, Constitution Day pledge ceremonies, regional cultural exchange exhibitions, and interstate National Integration Camp delegations.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/activities')}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0B1F3A] border-b border-[#0B1F3A] pb-0.5 inline-flex items-center gap-1 group-hover:text-[#E63946] group-hover:border-[#E63946] w-fit"
              >
                <span>View Integration &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FEATURED ACTIVITY (ASYMMETRICAL EDITORIAL LAYOUT) */}
      <section className="py-20 bg-[#F7F8FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="FEATURED INITIATIVE"
            title="7-Day Special Camp 2026"
            subtitle="Our flagship residential immersion where 50 volunteers lived in the adopted village to execute water conservation structures and community surveys."
          />

          <div className="bg-white rounded-sm border border-[#E5E7EB] overflow-hidden shadow-lg border-l-8 border-[#E63946]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Large Editorial Image (7 Cols) */}
              <div className="lg:col-span-7 relative min-h-[350px] sm:min-h-[440px] bg-[#0B1F3A]">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
                  alt="Special Camp 2026 village shramdaan"
                  className="w-full h-full object-cover grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#FCA5A5] mb-1">
                    <MapPin className="w-4 h-4 text-[#E63946]" />
                    <span>{SPECIAL_CAMP_CONFIG.villageName}, {SPECIAL_CAMP_CONFIG.district}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {SPECIAL_CAMP_CONFIG.theme}
                  </h3>
                </div>
              </div>

              {/* Information & Metrics (5 Cols) */}
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-white">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-800 mb-4">
                    <span>18 Jan – 24 Jan 2026</span>
                    <span>•</span>
                    <span className="text-[#E63946]">Residential Immersion</span>
                  </div>

                  <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-6">
                    {SPECIAL_CAMP_CONFIG.overview}
                  </p>

                  {/* Highlights Grid */}
                  <div className="space-y-3 border-t border-[#E5E7EB] pt-5">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-sm bg-[#0B1F3A] text-white shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E63946]" />
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700">
                        <strong>35-meter Check Dam</strong> built by manual shramdaan along the local watershed nullah.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-sm bg-[#0B1F3A] text-white shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E63946]" />
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700">
                        <strong>102 Rural Households</strong> mapped for healthcare, sanitation, and child immunization.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-sm bg-[#0B1F3A] text-white shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E63946]" />
                      </div>
                      <div className="text-xs sm:text-sm text-slate-700">
                        <strong>280 Free Health Checkups</strong> conducted with district doctors and ophthalmologists.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="text-xs text-[#6B7280]">
                    Squad: <strong className="text-[#0B1F3A]">50 Volunteers</strong> (26 Male / 24 Female)
                  </div>
                  <button
                    onClick={() => onNavigate('/special-camp')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#0B1F3A] hover:bg-[#E63946] text-white text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    <span>Explore Camp &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. UPCOMING EVENTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="DIARY OF SERVICE"
            title="Upcoming Events"
            subtitle="Participate in our upcoming campus blood donation drives, national commemorations, and rural clinics."
            action={
              <button
                onClick={() => onNavigate('/events')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 hover:border-[#0B1F3A] text-[#0B1F3A] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>View All Events ({EVENTS_DATA.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewEvent={onViewEvent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 11. RECENT ACTIVITIES */}
      <section className="py-20 bg-[#F7F8FA] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="FIELD ARCHIVE"
            title="Recent Activities"
            subtitle="A curated glimpse into recent on-ground social drives, environmental preservation tasks, and health initiatives."
            action={
              <button
                onClick={() => onNavigate('/activities')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 hover:border-[#0B1F3A] text-[#0B1F3A] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Browse All Activities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {recentActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onReadReport={(act) => setSelectedActivity(act)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 12. IMPACT STORY (HUMAN CENTRIC STORYTELLING) */}
      <section className="py-24 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[#0B1F3A] rounded-sm border border-[#E5E7EB] overflow-hidden text-white shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Text Side */}
              <div className="lg:col-span-7 p-8 sm:p-14 z-10">
                <div className="mb-4 border-l-4 border-[#E63946] pl-4">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FCA5A5]">VOICES FROM THE FIELD</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white mb-6">
                  MORE THAN AN ACTIVITY. <br />
                  <span className="text-[#E63946]">A MEMORY. A CONNECTION. AN IMPACT.</span>
                </h2>

                <blockquote className="text-slate-300 text-sm sm:text-base leading-relaxed italic mb-6">
                  &quot;When we arrived in the village for our 7-Day camp, water was scarce and villagers had to walk over a kilometer to fetch clean water. Together with village youth and local elders, we carried stones under the January sun to construct a percolation bund across the dry stream. Two months later, when the water table in nearby wells rose significantly, an elderly farmer held our volunteer coordinator&apos;s hands with tears of gratitude. That moment taught us more about leadership and empathy than any textbook ever could.&quot;
                </blockquote>

                <div className="flex items-center gap-4 pt-4 border-t border-white/15">
                  <div className="w-11 h-11 rounded-sm bg-[#E63946] text-white font-black flex items-center justify-center text-sm">
                    NV
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">[STUDENT VOLUNTEER NAME]</div>
                    <div className="text-xs text-slate-400">Final Year NSS Cadet & Special Camp Squad Lead</div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => onNavigate('/special-camp')}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm bg-[#E63946] hover:bg-[#C92A37] text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all"
                  >
                    <span>Read The Special Camp Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Image Side */}
              <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[380px] bg-[#0B1F3A]">
                <img
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80"
                  alt="NSS volunteers and rural community members gathered together"
                  className="w-full h-full object-cover grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-black/30 to-[#0B1F3A]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. SPECIAL CAMP PREVIEW (DARK NAVY BACKGROUND) */}
      <section className="py-24 bg-[#0B1F3A] text-white relative overflow-hidden border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-white/10 text-xs font-black uppercase tracking-[0.3em] text-slate-200">
              <span>SPECIAL CAMP 2026</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              Seven days. <br />
              One community. <br />
              <span className="text-[#E63946]">Countless stories.</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Living, working, and learning together in adopted village {SPECIAL_CAMP_CONFIG.villageName}. 
              Experience the 7-day vertical timeline from Day 01 Inauguration through community outreach, shramdaan, healthcare, education, and cultural harmony.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('/special-camp')}
                className="px-8 py-3.5 rounded-sm bg-[#E63946] hover:bg-[#C92A37] text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all"
              >
                Explore Camp Timeline (Day 1 – 7)
              </button>
              <button
                onClick={() => onNavigate('/reports')}
                className="px-8 py-3.5 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest border border-white/20 transition-all"
              >
                View Camp Reports
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 14. GALLERY PREVIEW ("OUR MOMENTS") */}
      <section className="py-20 bg-[#F7F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="PHOTO ARCHIVE"
            title="Our Moments"
            subtitle="Candid photography documenting voluntary service, campus drives, village life, and student camaraderie."
            action={
              <button
                onClick={() => onNavigate('/gallery')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm border-2 border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white text-[#0B1F3A] text-xs font-black uppercase tracking-widest transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Explore Full Gallery ({GALLERY_DATA.length})</span>
              </button>
            }
          />

          {/* Asymmetric Editorial Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewPhotos.map((photo, index) => {
              // Create editorial visual rhythm by spanning columns
              const isLarge = index === 0 || index === 5;
              return (
                <div
                  key={photo.id}
                  onClick={() => handleOpenLightbox(photo, index)}
                  className={`group relative overflow-hidden rounded-sm bg-[#0B1F3A] border border-[#E5E7EB] cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 ${
                    isLarge ? 'col-span-2 row-span-2 h-[340px] sm:h-[400px]' : 'h-[165px] sm:h-[192px]'
                  }`}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-white" />
                  
                  <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white z-10 pointer-events-none">
                    <span className="self-start px-2 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-widest bg-[#E63946]">
                      {photo.category}
                    </span>
                    <div>
                      <h4 className="font-black text-sm leading-snug">{photo.title}</h4>
                      <p className="text-[11px] text-slate-200 line-clamp-1">{photo.location}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 15. ACHIEVEMENTS PREVIEW */}
      <section className="py-20 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="MERIT & HONORS"
            title="Our Achievements"
            subtitle="Honors, state awards, and university citations conferred upon our NSS unit and student volunteers."
            action={
              <button
                onClick={() => onNavigate('/achievements')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm border-2 border-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white text-[#0B1F3A] text-xs font-black uppercase tracking-widest transition-all"
              >
                <span>View All Achievements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACHIEVEMENTS_DATA.slice(0, 3).map((ach) => (
              <div
                key={ach.id}
                className="bg-white border border-[#E5E7EB] rounded-sm p-7 hover:border-[#0B1F3A] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest bg-[#0B1F3A] text-white">
                      {ach.category}
                    </span>
                    <span className="text-xs font-black text-[#E63946]">{ach.year}</span>
                  </div>

                  <h3 className="font-black text-base text-[#0B1F3A] leading-snug mb-2">
                    {ach.title}
                  </h3>

                  <div className="text-xs text-[#6B7280] font-medium mb-3">
                    Awarded by: {ach.awardingBody}
                  </div>

                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {ach.citation && (
                  <div className="mt-4 pt-3 border-t border-[#E5E7EB] text-[11px] font-mono text-slate-400 truncate">
                    {ach.citation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. JOIN NSS CTA BANNER */}
      <section className="py-20 bg-[#0B1F3A] text-white relative overflow-hidden border-t border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 border-l-4 border-[#E63946] pl-4 text-xs font-black uppercase tracking-[0.3em] text-[#FCA5A5]">
            <HeartHandshake className="w-4 h-4 text-[#E63946]" />
            <span>ENROLMENT OPEN FOR 2026–27</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            READY TO SERVE?
          </h2>

          <p className="text-base sm:text-xl font-bold text-slate-200 mb-2">
            Be part of something bigger than yourself.
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Join the NSS volunteer fraternity. Earn a government-recognized 240-hour Certificate of Merit, 
            develop lifelong leadership, and create direct grassroots impact in local communities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/join-nss')}
              className="w-full sm:w-auto px-10 py-4 rounded-sm bg-[#E63946] hover:bg-[#C92A37] text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>JOIN NSS (APPLY ONLINE)</span>
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto px-8 py-4 rounded-sm bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-widest border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Contact NSS Cell</span>
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
      />

      {/* Activity Details Modal */}
      <ActivityModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};
