import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Tag, CheckCircle2, 
  Download, Users, HeartHandshake, Image as ImageIcon, Share2, 
  Printer, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { EVENTS_DATA } from '../data/events';
import { ACTIVITIES_DATA } from '../data/activities';
import { SITE_CONFIG } from '../data/config';
import { Lightbox } from '../components/ui/Lightbox';
import { ReportDownloadModal } from '../components/ui/ReportDownloadModal';
import { GalleryPhoto, ReportItem } from '../types';

interface EventDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onViewEvent: (slug: string) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  slug,
  onNavigate,
  onViewEvent
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [downloadModalReport, setDownloadModalReport] = useState<ReportItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const event = EVENTS_DATA.find((e) => e.slug === slug) || EVENTS_DATA[0];

  // Related events or activities
  const relatedEvents = EVENTS_DATA.filter((e) => e.slug !== event.slug).slice(0, 2);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenDownload = () => {
    setDownloadModalReport({
      id: `rep-${event.id}`,
      title: `${event.title} - Official Event Dossier`,
      academicYear: '2025–26',
      category: event.category.includes('Blood') ? 'Blood Donation' : 'Annual',
      datePublished: event.date,
      fileSize: '3.2 MB',
      pages: 14,
      preparedBy: 'Event Coordination Committee & Programme Officer',
      description: `Comprehensive activity log, attendance roll, and medical/civic metrics for ${event.title}.`,
      downloadUrl: '#'
    });
  };

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen pb-20">
      {/* Back to Events Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/events')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0B1F3A] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events Calendar</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Event'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Print Event Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner with Image & Event Info */}
      <section className="relative bg-[#0B1F3A] text-white">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={event.heroImage}
            alt={event.title}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/70 to-transparent" />
          
          <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#E63946] text-white shadow-xs">
                {event.category}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10 backdrop-blur-xs text-slate-200 border border-white/15">
                {event.status === 'upcoming' ? 'Scheduled Event' : 'Archived Event'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Metadata Bar */}
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 font-semibold text-[11px] uppercase">Date</div>
                  <div className="font-bold text-[#0B1F3A]">{event.date}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 font-semibold text-[11px] uppercase">Time Schedule</div>
                  <div className="font-bold text-[#0B1F3A]">{event.time}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 font-semibold text-[11px] uppercase">Location</div>
                  <div className="font-bold text-[#0B1F3A] leading-snug">{event.location}</div>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold text-[#0B1F3A] mb-4 uppercase tracking-wider text-xs font-mono text-slate-400">
                Detailed Scope & Event Narrative
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {event.fullDescription}
              </p>
            </div>

            {/* Core Objectives */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">
                Operational Objectives
              </h2>
              <div className="space-y-3">
                {event.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities Conducted (if past event) */}
            {event.activitiesConducted && event.activitiesConducted.length > 0 && (
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">
                  Field Schedule & Activities Conducted
                </h2>
                <div className="space-y-2.5">
                  {event.activitiesConducted.map((act, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-[#0B1F3A] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery (if available) */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <h2 className="text-lg font-bold text-[#0B1F3A] mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#E63946]" />
                  Photographic Records
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.gallery.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        setSelectedPhoto({
                          id: `evt-img-${i}`,
                          title: event.title,
                          category: 'Events',
                          imageUrl: imgUrl,
                          aspectRatio: 'landscape',
                          date: event.date,
                          location: event.location,
                          caption: `Field capture from ${event.title}.`,
                          eventAssociated: event.title
                        })
                      }
                      className="h-32 sm:h-40 rounded-lg overflow-hidden bg-slate-100 cursor-pointer group relative"
                    >
                      <img
                        src={imgUrl}
                        alt={`Record ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        View Photo
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Impact Metrics Block */}
            {event.impactStats && event.impactStats.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
                  Event Parameters & Metrics
                </h3>
                <div className="space-y-4">
                  {event.impactStats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <span className="text-xs text-slate-600">{stat.label}</span>
                      <span className="font-bold text-sm text-[#0B1F3A]">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registration CTA (if upcoming) */}
            {event.status === 'upcoming' && (
              <div className="bg-[#0B1F3A] text-white rounded-xl p-6 shadow-md border border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-[#E63946] mb-1">
                  Volunteer Mobilization
                </div>
                <h3 className="font-bold text-lg text-white mb-2">
                  Volunteer for this Event
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  Are you an enrolled NSS volunteer interested in serving on the on-ground coordination squad for this event?
                </p>
                <button
                  onClick={() => onNavigate('/join-nss')}
                  className="w-full py-3 bg-[#E63946] hover:bg-[#C92A37] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow flex items-center justify-center gap-2 transition-colors"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Register as Volunteer</span>
                </button>
              </div>
            )}

            {/* Official Report Download Box */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-[#0B1F3A] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Documentation & Dossier</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Download the verified field activity record, sign-off logs, and official university submission copy.
              </p>
              <button
                onClick={handleOpenDownload}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0B1F3A] text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[#E63946]" />
                <span>Download Event Report</span>
              </button>
            </div>

            {/* Related Events */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
                Other NSS Activities
              </h3>
              <div className="space-y-4">
                {relatedEvents.map((re) => (
                  <div
                    key={re.id}
                    onClick={() => onViewEvent(re.slug)}
                    className="group cursor-pointer pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="text-[10px] font-bold text-[#E63946] uppercase">
                      {re.date} • {re.category}
                    </div>
                    <h4 className="font-semibold text-xs text-slate-900 group-hover:text-[#0B1F3A] mt-0.5 line-clamp-1">
                      {re.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for gallery images */}
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
