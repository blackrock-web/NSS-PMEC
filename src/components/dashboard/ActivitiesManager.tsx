import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  Loader2,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { Activity } from '../../types';

export const ActivitiesManager: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState<Partial<Activity>>({
    title: '',
    category: 'Environment',
    date: 'July 2026',
    location: 'Adopted Peri-Urban Green Belt',
    shortDescription: '',
    fullDescription: '',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    volunteersInvolved: 50,
    beneficiaries: '300 community members',
    highlights: ['1,000+ direct beneficiaries reached.', 'Executed with zero plastic waste protocol.'],
    featured: true,
  });

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.activities.list();
      if (res.success && res.data) {
        setActivities(res.data);
      }
    } catch (e) {
      console.error('Failed to load activities:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleOpenCreate = () => {
    setEditingActivity(null);
    setFormData({
      title: '',
      category: 'Environment',
      date: 'September 2026',
      location: 'Shivapur Adopted Village',
      shortDescription: '',
      fullDescription: '',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
      volunteersInvolved: 40,
      beneficiaries: '250 rural households',
      highlights: ['Field shramdaan completed in coordinated 4-hour shifts.'],
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (act: Activity) => {
    setEditingActivity(act);
    setFormData(act);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploads.uploadImage(file, 'images');
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, image: res.data!.url }));
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
      if (editingActivity) {
        const res = await api.activities.update(editingActivity.id, formData);
        if (res.success && res.data) {
          setActivities((prev) => prev.map((item) => (item.id === editingActivity.id ? res.data! : item)));
          setIsModalOpen(false);
        }
      } else {
        const res = await api.activities.create(formData);
        if (res.success && res.data) {
          setActivities((prev) => [res.data!, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Failed to save activity:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity record?')) return;
    try {
      await api.activities.delete(id);
      setActivities((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Delete activity failed:', err);
    }
  };

  const filtered = activities.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Field Activities & Shramdaan Archive</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            Activities & Community Service
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Log rural development camps, environmental plantation drives, and health surveys with verified volunteer hours.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A8A] transition-colors self-start md:self-auto"
        >
          <Plus size={14} />
          <span>Record New Activity</span>
        </button>
      </div>

      {/* Search and Table */}
      <div className="bg-white border border-[#E5E7EB] shadow-xs p-4 space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 focus:outline-none focus:border-[#0B1528]"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#0B1528]" size={18} />
            <span>Loading activities from Google Sheets...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No activities recorded. Click "Record New Activity" to publish one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Activity</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Volunteers</th>
                  <th className="py-3 px-4">Beneficiaries</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#0B1528]">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 object-cover border border-gray-200"
                        />
                        <div>
                          <div>{item.title}</div>
                          <div className="text-[11px] text-gray-400 font-mono font-normal">/{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{item.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0B1528]">{item.volunteersInvolved}</td>
                    <td className="py-3 px-4 text-gray-600">{item.beneficiaries}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-gray-600 hover:text-[#0B1528]"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-800"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-[#0B1528] text-white p-4 border-b-2 border-[#C8102E] flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white">
                {editingActivity ? 'Edit Activity Record' : 'Record New NSS Activity'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Van Mahotsav Urban Agroforestry Drive"
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  >
                    <option value="Environment">Environment</option>
                    <option value="Health & Wellbeing">Health & Wellbeing</option>
                    <option value="Education">Education</option>
                    <option value="Community Development">Community Development</option>
                    <option value="Social Awareness">Social Awareness</option>
                    <option value="National Integration">National Integration</option>
                    <option value="Special Camp">Special Camp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Period / Date</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="July 2026"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Volunteers</label>
                  <input
                    type="number"
                    required
                    value={formData.volunteersInvolved}
                    onChange={(e) => setFormData({ ...formData, volunteersInvolved: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Beneficiaries</label>
                  <input
                    type="text"
                    required
                    value={formData.beneficiaries}
                    onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                    placeholder="1,200 villagers"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              {/* Image with Drive Upload */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Activity Photo (Google Drive Asset)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                  <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 cursor-pointer font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                    {uploadingImage ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
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
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Full Narrative Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="actFeatured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <label htmlFor="actFeatured" className="font-semibold text-gray-700 cursor-pointer">
                  Feature on Home Page Carousel
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
                  <span>{editingActivity ? 'Save Changes' : 'Record Activity'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
