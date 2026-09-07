import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  Clock,
  MapPin,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { EventItem } from '../../types';

export const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<EventItem>>({
    title: '',
    category: 'Health & Wellbeing',
    date: '2026-09-25',
    time: '9:00 AM – 3:00 PM',
    location: 'College Campus & Medical Centre',
    status: 'upcoming',
    heroImage: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    shortDescription: '',
    fullDescription: '',
    objectives: ['Promote youth participation in nation-building.'],
    registrationOpen: true,
    reportAvailable: false,
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.events.list();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (e) {
      console.error('Failed to load events:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      category: 'Health & Wellbeing',
      date: new Date().toISOString().split('T')[0],
      time: '9:00 AM – 2:00 PM',
      location: 'College Main Campus',
      status: 'upcoming',
      heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      shortDescription: '',
      fullDescription: '',
      objectives: ['Raise community awareness on critical health and civic priorities.'],
      registrationOpen: true,
      reportAvailable: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setFormData(event);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploads.uploadImage(file, 'images');
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, heroImage: res.data!.url }));
      }
    } catch (err) {
      console.error('Drive image upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingEvent) {
        const res = await api.events.update(editingEvent.id, formData);
        if (res.success && res.data) {
          setEvents((prev) => prev.map((item) => (item.id === editingEvent.id ? res.data! : item)));
          setIsModalOpen(false);
        }
      } else {
        const res = await api.events.create(formData);
        if (res.success && res.data) {
          setEvents((prev) => [res.data!, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Failed to save event:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event record?')) return;
    try {
      await api.events.delete(id);
      setEvents((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Delete event failed:', err);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Calendar size={14} />
            <span>Campus Drives & Events Management</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            Events & Special Drives
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Publish, schedule, and archive NSS community outreach drives, blood camps, and national day observances.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A8A] transition-colors self-start md:self-auto"
        >
          <Plus size={14} />
          <span>Publish New Event</span>
        </button>
      </div>

      {/* Search and Table */}
      <div className="bg-white border border-[#E5E7EB] shadow-xs p-4 space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search events by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 focus:outline-none focus:border-[#0B1528]"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#0B1528]" size={18} />
            <span>Loading events from Google Sheets...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No events found. Click "Publish New Event" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#0B1528]">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.heroImage}
                          alt={item.title}
                          className="w-10 h-10 object-cover border border-gray-200"
                        />
                        <div>
                          <div>{item.title}</div>
                          <div className="text-[11px] text-gray-400 font-mono font-normal">/{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{item.date}</div>
                      <div className="text-[11px] text-gray-500">{item.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{item.location}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          item.status === 'upcoming'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-gray-600 hover:text-[#0B1528]"
                        title="Edit event"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete event"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-[#0B1528] text-white p-4 border-b-2 border-[#C8102E] flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white">
                {editingEvent ? 'Edit Event Record' : 'Publish New NSS Event Drive'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Mega Voluntary Blood Donation Drive 2026"
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  >
                    <option value="Health & Wellbeing">Health & Wellbeing</option>
                    <option value="Environment">Environment</option>
                    <option value="Education">Education</option>
                    <option value="Community Development">Community Development</option>
                    <option value="Social Awareness">Social Awareness</option>
                    <option value="National Integration">National Integration</option>
                    <option value="Special Camp">Special Camp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past / Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="9:00 AM – 3:00 PM"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="College Medical Wing"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              {/* Hero Image with Google Drive upload */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Hero Image (Google Drive Asset Storage)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                  <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 cursor-pointer font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                    {uploadingImage ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Upload size={14} />
                    )}
                    <span>Upload to Drive</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Summary of the drive for listings and cards..."
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Comprehensive drive details, institutional partners, target units..."
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.registrationOpen}
                    onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.checked })}
                  />
                  <span className="font-semibold text-gray-700">Open for Volunteer Registration</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.reportAvailable}
                    onChange={(e) => setFormData({ ...formData, reportAvailable: e.target.checked })}
                  />
                  <span className="font-semibold text-gray-700">Official Monograph Report Available</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#0B1528] text-white font-bold uppercase tracking-wider hover:bg-[#1E3A8A] disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="animate-spin" size={14} />}
                  <span>{editingEvent ? 'Save Changes' : 'Publish to Sheets & Drive'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
