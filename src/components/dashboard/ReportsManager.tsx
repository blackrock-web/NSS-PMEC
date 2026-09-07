import React, { useEffect, useState } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Plus,
  X,
  Loader2,
  FileCheck,
  HardDrive,
  Calendar,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { ReportItem } from '../../types';

export const ReportsManager: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<ReportItem>>({
    title: '',
    academicYear: '2025–26',
    category: 'Annual',
    datePublished: 'May 10, 2026',
    fileSize: '3.4 MB',
    pages: 28,
    preparedBy: 'Dr. Anand Verma, Programme Officer',
    description: '',
    downloadUrl: '',
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.reports.list();
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch (e) {
      console.error('Error fetching reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploads.uploadPdf(file);
      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          downloadUrl: res.data!.url,
          fileSize: res.data!.fileSize,
          pages: res.data!.pages,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        }));
      }
    } catch (err) {
      console.error('PDF upload to Drive failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.downloadUrl) {
      alert('Please upload a PDF document before saving.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.reports.create(formData);
      if (res.success && res.data) {
        setReports((prev) => [res.data!, ...prev]);
        setIsModalOpen(false);
        setFormData({
          title: '',
          academicYear: '2025–26',
          category: 'Annual',
          datePublished: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          fileSize: '3.0 MB',
          pages: 20,
          preparedBy: 'Programme Officer',
          description: '',
          downloadUrl: '',
        });
      }
    } catch (err) {
      console.error('Failed to create report:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this published report?')) return;
    try {
      await api.reports.delete(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Delete report failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <FileText size={14} />
            <span>Audited Documentation & Reports Repository</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            Official Reports Management
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Store, catalog, and publish official annual reports, special camp monographs, and audit statements on Google Drive.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A8A] transition-colors self-start md:self-auto"
        >
          <Plus size={14} />
          <span>Upload PDF Report</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-[#E5E7EB] shadow-xs p-6">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#0B1528]" size={18} />
            <span>Loading reports archive...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No official reports uploaded yet. Click "Upload PDF Report" to publish one.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-red-50 text-[#C8102E] border border-red-200 mt-1">
                    <FileText size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif text-sm font-bold text-[#0B1528]">{report.title}</h4>
                      <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-600 uppercase border border-gray-200">
                        {report.category}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-bold text-blue-800 border border-blue-200">
                        AY {report.academicYear}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 max-w-2xl">{report.description}</p>
                    <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-4">
                      <span>Pages: <strong>{report.pages}</strong></span>
                      <span>Size: <strong>{report.fileSize}</strong></span>
                      <span>By: {report.preparedBy}</span>
                      <span>Published: {report.datePublished}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <a
                    href={report.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50"
                    title="Delete report"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div className="bg-[#0B1528] text-white p-4 border-b-2 border-[#C8102E] flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white">Upload Audited NSS Report (PDF)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {/* PDF Drag-and-drop container */}
              <div className="border-2 border-dashed border-gray-300 p-6 text-center bg-gray-50 hover:bg-gray-100/60 transition-colors">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="animate-spin text-red-600" size={24} />
                    <span className="font-semibold text-gray-700">Streaming PDF to Google Drive `/reports`...</span>
                  </div>
                ) : formData.downloadUrl ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold py-2">
                    <FileCheck size={20} />
                    <span>PDF uploaded successfully ({formData.fileSize}, ~{formData.pages} pages)</span>
                  </div>
                ) : (
                  <div>
                    <FileText className="mx-auto text-gray-400 mb-2" size={28} />
                    <p className="text-xs font-semibold text-gray-700">Select official report PDF</p>
                    <p className="text-[10px] text-gray-400 mt-1">PDF up to 15 MB</p>
                    <label className="inline-block mt-3 px-4 py-1.5 bg-[#0B1528] text-white font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-[#1E3A8A]">
                      <span>Browse PDF</span>
                      <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Activity Report 2025–26 (Complete Audit)"
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Academic Year
                  </label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  >
                    <option value="2025–26">2025–26</option>
                    <option value="2024–25">2024–25</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  >
                    <option value="Annual">Annual Activity Report</option>
                    <option value="Special Camp">Special Camp Monograph</option>
                    <option value="Blood Donation">Blood Donation Audit</option>
                    <option value="Environment">Environmental Shramdaan</option>
                    <option value="Social Drive">Social Awareness Drive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Prepared By
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.preparedBy}
                    onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.datePublished}
                    onChange={(e) => setFormData({ ...formData, datePublished: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Executive Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of institutional outreach, total volunteer service hours, outcomes..."
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
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
                  disabled={!formData.downloadUrl || saving || uploading}
                  className="px-5 py-2 bg-[#0B1528] text-white font-bold uppercase tracking-wider hover:bg-[#1E3A8A] disabled:opacity-50"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
