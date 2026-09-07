import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Building,
  Phone,
  Mail,
  Share2,
  BarChart3,
  Bell,
  Loader2,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import type { TenantConfig, ImpactStat, Announcement } from '../../types';

export const SettingsTab: React.FC = () => {
  const { config, updateConfig } = useTenant();
  const [formData, setFormData] = useState<TenantConfig>(config);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const res = await updateConfig(formData);
    setSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      setSaveError(res.error || 'Failed to save configuration');
    }
  };

  const handleImpactStatChange = (index: number, field: keyof ImpactStat, val: any) => {
    const next = [...formData.impactStats];
    next[index] = { ...next[index], [field]: val };
    setFormData({ ...formData, impactStats: next });
  };

  const handleAddAnnouncement = () => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: 'New Important Notice for Volunteers',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      isNew: true,
      link: '/events',
    };
    setFormData({
      ...formData,
      announcements: [newAnn, ...formData.announcements],
    });
  };

  const handleRemoveAnnouncement = (id: string) => {
    setFormData({
      ...formData,
      announcements: formData.announcements.filter((a) => a.id !== id),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Settings size={14} />
            <span>Institutional Multi-Tenant Configuration</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            Unit Details & Live Portal Settings
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Synchronizes institutional metadata, officer contacts, impact numbers, and announcements to Google Sheets.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A8A] transition-colors disabled:opacity-50 self-start md:self-auto"
        >
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
          <span>Save Changes to Cloud</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Institutional portal settings updated and synced to Google Sheets successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{saveError}</span>
        </div>
      )}

      {/* Section 1: College Identity */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <Building size={16} className="text-[#C8102E]" />
          <h3 className="font-serif text-base font-bold text-[#0B1528]">Institutional Identity & Unit Numbers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">College Short Name</label>
            <input
              type="text"
              value={formData.collegeName}
              onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Unit Designation</label>
            <input
              type="text"
              value={formData.unitNumber}
              onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Full Institutional Name</label>
            <input
              type="text"
              value={formData.collegeFullName}
              onChange={(e) => setFormData({ ...formData, collegeFullName: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">University Affiliation & Accreditation</label>
            <input
              type="text"
              value={formData.universityAffiliation}
              onChange={(e) => setFormData({ ...formData, universityAffiliation: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Programme Officer & Helplines */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <Phone size={16} className="text-[#C8102E]" />
          <h3 className="font-serif text-base font-bold text-[#0B1528]">Programme Officer & Helpline Contacts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Programme Officer Name</label>
            <input
              type="text"
              value={formData.programmeOfficerName}
              onChange={(e) => setFormData({ ...formData, programmeOfficerName: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Programme Officer Official Title</label>
            <input
              type="text"
              value={formData.programmeOfficerTitle}
              onChange={(e) => setFormData({ ...formData, programmeOfficerTitle: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">NSS Institutional Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Official Office Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value, officialPhone: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">24/7 Voluntary Blood Helpline</label>
            <input
              type="text"
              value={formData.bloodHelpline}
              onChange={(e) => setFormData({ ...formData, bloodHelpline: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Office Location & Hours</label>
            <input
              type="text"
              value={formData.officeLocation}
              onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Impact Metrics */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <BarChart3 size={16} className="text-[#C8102E]" />
          <h3 className="font-serif text-base font-bold text-[#0B1528]">Hero Impact Statistics</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {formData.impactStats.map((stat, i) => (
            <div key={i} className="p-3 bg-gray-50 border border-gray-200 space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase">{stat.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => handleImpactStatChange(i, 'value', parseInt(e.target.value, 10) || 0)}
                  className="w-full p-1.5 border border-gray-300 font-bold text-sm bg-white"
                />
                <span className="font-bold text-gray-600">{stat.suffix}</span>
              </div>
              <input
                type="text"
                value={stat.note}
                onChange={(e) => handleImpactStatChange(i, 'note', e.target.value)}
                placeholder="Note caption"
                className="w-full p-1 border border-gray-200 text-[10px] bg-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Live Announcements */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-[#C8102E]" />
            <h3 className="font-serif text-base font-bold text-[#0B1528]">Notice Board & Ticker Announcements</h3>
          </div>
          <button
            type="button"
            onClick={handleAddAnnouncement}
            className="px-2.5 py-1 text-xs font-bold text-[#0B1528] border border-gray-300 hover:bg-gray-100 flex items-center gap-1"
          >
            <Plus size={12} />
            <span>Add Announcement</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {formData.announcements.map((ann) => (
            <div key={ann.id} className="p-3 border border-gray-200 bg-[#F8FAFC] flex items-center justify-between gap-3">
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={ann.title}
                  onChange={(e) => {
                    const next = formData.announcements.map((a) =>
                      a.id === ann.id ? { ...a, title: e.target.value } : a
                    );
                    setFormData({ ...formData, announcements: next });
                  }}
                  className="w-full p-1.5 border border-gray-300 font-medium bg-white text-xs"
                />
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-500">{ann.date}</span>
                  <label className="flex items-center gap-1 text-[10px] font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      checked={ann.isNew}
                      onChange={(e) => {
                        const next = formData.announcements.map((a) =>
                          a.id === ann.id ? { ...a, isNew: e.target.checked } : a
                        );
                        setFormData({ ...formData, announcements: next });
                      }}
                    />
                    <span>Highlight with "NEW" Badge</span>
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAnnouncement(ann.id)}
                className="p-1.5 text-red-600 hover:text-red-800"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
