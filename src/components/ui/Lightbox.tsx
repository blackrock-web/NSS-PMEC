import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Tag } from 'lucide-react';
import { GalleryPhoto } from '../../types';

interface LightboxProps {
  photo: GalleryPhoto | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
    };

    if (photo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photo, onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {hasPrev && onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Modal Container */}
      <div
        className="max-w-5xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="md:w-2/3 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="max-h-[75vh] w-full object-contain"
          />
        </div>

        {/* Metadata Section */}
        <div className="md:w-1/3 p-6 sm:p-8 flex flex-col justify-between text-slate-200 bg-slate-900 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-[#E63946] text-white">
                {photo.category}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 leading-snug">
              {photo.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {photo.caption}
            </p>

            <div className="space-y-3 text-xs text-slate-400 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#E63946]" />
                <span>{photo.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E63946]" />
                <span>{photo.location}</span>
              </div>
              {photo.eventAssociated && (
                <div className="flex items-start gap-2 pt-1">
                  <Tag className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
                  <span className="text-slate-300 font-medium">
                    {photo.eventAssociated}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            NSS Unit Photographic Archive • Verified Community Documentation
          </div>
        </div>
      </div>
    </div>
  );
};
