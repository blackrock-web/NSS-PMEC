import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Search,
  Plus,
  X,
  Loader2,
  HardDrive,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { GalleryPhoto } from '../../types';

export const GalleryManager: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Events' as const,
    location: 'College Campus',
    date: '2026',
    caption: '',
    imageUrl: '',
    aspectRatio: 'landscape' as const,
  });

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await api.gallery.list();
      if (res.success && res.data) {
        setPhotos(res.data);
      }
    } catch (e) {
      console.error('Error fetching gallery:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploads.uploadImage(file, 'gallery');
      if (res.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: res.data!.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Please upload an image or provide a valid URL');
      return;
    }

    try {
      const res = await api.gallery.create(formData);
      if (res.success && res.data) {
        setPhotos((prev) => [res.data!, ...prev]);
        setIsUploadModalOpen(false);
        setFormData({
          title: '',
          category: 'Events',
          location: 'College Campus',
          date: '2026',
          caption: '',
          imageUrl: '',
          aspectRatio: 'landscape',
        });
      }
    } catch (err) {
      console.error('Failed to add photo:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this photo from the media archive?')) return;
    try {
      await api.gallery.delete(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete photo failed:', err);
    }
  };

  const categories = ['All', 'Events', 'Special Camp', 'Community', 'Environment', 'Volunteers', 'Celebrations'];
  const filtered = categoryFilter === 'All' ? photos : photos.filter((p) => p.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <ImageIcon size={14} />
            <span>Google Drive Media Asset Management</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            Institutional Photo Archive
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Photographic documentation archived directly to unit Google Drive folder <code>/gallery</code>.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A8A] transition-colors self-start md:self-auto"
        >
          <Plus size={14} />
          <span>Upload New Photos</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-[#E5E7EB] p-4 shadow-xs flex items-center gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-[#0B1528] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="bg-white border border-[#E5E7EB] shadow-xs p-6">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#0B1528]" size={18} />
            <span>Fetching media records from Google Sheets & Drive...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No photos found in this category. Click "Upload New Photos" to add some.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                className="group relative border border-gray-200 bg-gray-50 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-gray-200">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-[#0B1528]/90 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                    {photo.category}
                  </div>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Delete photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-bold text-[#0B1528] line-clamp-1">{photo.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    {photo.location} • {photo.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div className="bg-[#0B1528] text-white p-4 border-b-2 border-[#C8102E] flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white">Upload to Google Drive Media Archive</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {/* Drag-and-drop / File upload container */}
              <div className="border-2 border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:bg-gray-100/60 transition-colors">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    <span className="font-semibold text-gray-700">Streaming image directly to Google Drive...</span>
                  </div>
                ) : formData.imageUrl ? (
                  <div className="space-y-2">
                    <img
                      src={formData.imageUrl}
                      alt="Uploaded preview"
                      className="max-h-36 mx-auto border border-gray-300 object-cover"
                    />
                    <span className="text-[11px] text-emerald-700 font-bold block">
                      Uploaded to Google Drive successfully
                    </span>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto text-gray-400 mb-2" size={28} />
                    <p className="text-xs font-semibold text-gray-700">
                      Select photo to upload to Google Drive
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WEBP up to 15 MB</p>
                    <label className="inline-block mt-3 px-4 py-1.5 bg-[#0B1528] text-white font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-[#1E3A8A]">
                      <span>Browse Files</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Photo Title / Headline
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Village Bund Construction Work"
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Category Tag
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  >
                    <option value="Events">Events</option>
                    <option value="Special Camp">Special Camp</option>
                    <option value="Community">Community</option>
                    <option value="Environment">Environment</option>
                    <option value="Volunteers">Volunteers</option>
                    <option value="Celebrations">Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Caption / Archival Note
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Volunteers conducting soil percolation tests with local panchayat..."
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.imageUrl || uploading}
                  className="px-5 py-2 bg-[#0B1528] text-white font-bold uppercase tracking-wider hover:bg-[#1E3A8A] disabled:opacity-50"
                >
                  Archive to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
