import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import type { GalleryPhoto } from '../../types';

interface GalleryGlimpseProps {
  photos: GalleryPhoto[];
  onOpenLightbox?: (photo: GalleryPhoto, index: number) => void;
  onExploreMore?: () => void;
}

export const GalleryGlimpse: React.FC<GalleryGlimpseProps> = ({
  photos,
  onOpenLightbox,
  onExploreMore,
}) => {
  // Use top-tier / featured photos or fallback to slice
  const featuredPhotos = photos.length > 0 ? photos : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isHovered, setIsHovered] = useState(false);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(featuredPhotos.map((p) => p.category)))];

  const filteredPhotos =
    activeCategory === 'all'
      ? featuredPhotos
      : featuredPhotos.filter((p) => p.category === activeCategory);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || isHovered || filteredPhotos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, filteredPhotos.length]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const handleNext = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length);
  }, [filteredPhotos.length]);

  const handlePrev = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [filteredPhotos.length]);

  if (filteredPhotos.length === 0) {
    return null;
  }

  const currentPhoto = filteredPhotos[currentIndex] || filteredPhotos[0];

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Header & Filter Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Gallery Glimpse & Top Picks</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B1528]">
            Archived Moments from Voluntary Service
          </h3>
        </div>

        {/* Categories / Tags Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-[#0B1528] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feature Display Stage */}
      <div className="relative aspect-16/9 md:aspect-21/9 min-h-[320px] max-h-[500px] w-full bg-[#0B1528] overflow-hidden group">
        <img
          key={currentPhoto.id}
          src={currentPhoto.imageUrl}
          alt={currentPhoto.title}
          className="w-full h-full object-cover transition-all duration-700 ease-out"
        />

        {/* Ambient Dark Gradient for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-[#0B1528]/40 to-transparent pointer-events-none" />

        {/* Pause-on-Hover Badge */}
        {isHovered && isPlaying && (
          <div className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white/90 text-[11px] font-medium rounded flex items-center gap-1.5">
            <Pause size={12} />
            <span>Autoplay Paused</span>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl text-white space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#C8102E] text-white shadow-xs">
              <span>{currentPhoto.category}</span>
            </div>
            <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif leading-snug">
              {currentPhoto.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
              {currentPhoto.description || 'Verified archival documentation from NSS Unit activity.'}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
              {currentPhoto.date && (
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  <span>{currentPhoto.date}</span>
                </span>
              )}
              {currentPhoto.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  <span>{currentPhoto.location}</span>
                </span>
              )}
            </div>
          </div>

          {/* Action buttons on slide */}
          <div className="flex items-center gap-2.5 self-start md:self-end shrink-0">
            {onOpenLightbox && (
              <button
                onClick={() => onOpenLightbox(currentPhoto, currentIndex)}
                className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs rounded text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-colors"
                title="View Full Resolution in Lightbox"
              >
                <Maximize2 size={13} />
                <span className="hidden sm:inline">Inspect Photo</span>
              </button>
            )}
            {onExploreMore && (
              <button
                onClick={onExploreMore}
                className="px-4 py-2 bg-[#C8102E] hover:bg-[#A00D24] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Full Archive</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Carousel Prev/Next Overlay Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 z-30"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 z-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Footer Navigation Bar: Progress, Dots, Play/Pause, and Thumbnails */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Play/Pause & Slide Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
            title={isPlaying ? 'Pause Auto-rotation' : 'Resume Auto-rotation'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <span className="text-xs text-slate-500 font-medium">
            <strong className="text-slate-900">{currentIndex + 1}</strong> of{' '}
            {filteredPhotos.length} Highlights
          </span>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full sm:max-w-md py-1">
          {filteredPhotos.slice(0, 7).map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-12 h-8 rounded shrink-0 overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-[#C8102E] ring-2 ring-red-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
            </button>
          ))}
          {filteredPhotos.length > 7 && (
            <span className="text-[11px] text-slate-500 px-1 font-semibold">
              +{filteredPhotos.length - 7}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
