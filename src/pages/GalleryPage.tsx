import React, { useState, useMemo } from 'react';
import { Image as ImageIcon, Filter, MapPin, Calendar, Tag } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Lightbox } from '../components/ui/Lightbox';
import { GALLERY_DATA } from '../data/gallery';
import { GalleryPhoto } from '../types';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  const categories = [
    'All',
    'Special Camp',
    'Swachhata & Environment',
    'Health & Blood Donation',
    'Awareness Rallies',
    'Education & Literacy',
    'Campus Activities'
  ];

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return GALLERY_DATA;
    return GALLERY_DATA.filter((p) =>
      p.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [selectedCategory]);

  const handleOpenPhoto = (photo: GalleryPhoto) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    setCurrentPhotoIndex(idx !== -1 ? idx : 0);
    setSelectedPhoto(photo);
  };

  const handlePrev = () => {
    const nextIdx = (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setCurrentPhotoIndex(nextIdx);
    setSelectedPhoto(filteredPhotos[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentPhotoIndex + 1) % filteredPhotos.length;
    setCurrentPhotoIndex(nextIdx);
    setSelectedPhoto(filteredPhotos[nextIdx]);
  };

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-[#0B1F3A] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FCA5A5] mb-4">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>PHOTOGRAPHIC ARCHIVE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              NSS Photo Gallery
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Moments of community action, volunteer teamwork, rural engagement, and national service captured in high resolution.
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none text-xs">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0B1F3A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-xs text-slate-500 mb-6 font-medium">
          Showing <strong>{filteredPhotos.length}</strong> photo records
          {selectedCategory !== 'All' && <span> in category &quot;{selectedCategory}&quot;</span>}
        </div>

        {/* Responsive Grid with aspect ratio styles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => handleOpenPhoto(photo)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <div className="relative h-56 bg-slate-200 overflow-hidden shrink-0">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0B1F3A]/90 text-white backdrop-blur-xs">
                    {photo.category}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0B1F3A] group-hover:text-[#E63946] transition-colors leading-snug line-clamp-1 mb-1">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#E63946]" />
                    <span>{photo.date}</span>
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                    <MapPin className="w-3 h-3 text-[#E63946]" />
                    <span className="truncate">{photo.location}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={filteredPhotos.length > 1}
        hasNext={filteredPhotos.length > 1}
      />
    </div>
  );
};
