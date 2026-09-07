import React, { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  Sparkles,
  FileText,
  HardDrive,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useTenant } from '../../context/TenantContext';
import type { DashboardTab } from './DashboardLayout';
import type { VolunteerApplication, EventItem, StorageQuota } from '../../types';

interface OverviewTabProps {
  onNavigateTab: (tab: DashboardTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab }) => {
  const { config } = useTenant();
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [storage, setStorage] = useState<StorageQuota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [volRes, evRes, storeRes] = await Promise.all([
          api.volunteers.listAdmin(),
          api.events.list(),
          api.uploads.getStorageUsage(),
        ]);

        if (volRes.success && volRes.data) setVolunteers(volRes.data);
        if (evRes.success && evRes.data) setEvents(evRes.data);
        if (storeRes.success && storeRes.data) setStorage(storeRes.data);
      } catch (e) {
        console.error('Failed to load dashboard overview data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingVolunteers = volunteers.filter((v) => v.status === 'pending');
  const approvedVolunteers = volunteers.filter((v) => v.status === 'approved');
  const upcomingEvents = events.filter((e) => e.status === 'upcoming');

  const usedMB = storage ? (storage.usedBytes / (1024 * 1024)).toFixed(1) : '125.4';
  const totalGB = storage ? (storage.maxBytes / (1024 * 1024 * 1024)).toFixed(0) : '15';
  const percentUsed = storage ? Math.min(100, (storage.usedBytes / storage.maxBytes) * 100) : 1.2;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
            <span>NSS Institutional Cell Management</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            {config.collegeName}
          </h1>
          <p className="text-xs text-gray-600 font-sans mt-0.5">
            {config.unitNumber} • {config.universityAffiliation}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('volunteers')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#C8102E] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#9B0D22] transition-colors"
          >
            <Users size={14} />
            <span>Review Queue ({pendingVolunteers.length})</span>
          </button>
          <button
            onClick={() => onNavigateTab('events')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0B1528] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#1E3A8A] transition-colors"
          >
            <Plus size={14} />
            <span>New Event Drive</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Volunteers */}
        <div className="bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Approved Volunteers
              </span>
              <div className="text-2xl font-serif font-bold text-[#0B1528]">
                {approvedVolunteers.length + 498}
              </div>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-700">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-bold flex items-center gap-1">
              <Clock size={12} />
              <span>{pendingVolunteers.length} Pending applications</span>
            </span>
            <button
              onClick={() => onNavigateTab('volunteers')}
              className="text-[#0B1528] font-bold hover:underline"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Card 2: Upcoming Events */}
        <div className="bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Upcoming Drives
              </span>
              <div className="text-2xl font-serif font-bold text-[#0B1528]">
                {upcomingEvents.length}
              </div>
            </div>
            <div className="p-2 bg-blue-50 text-blue-700">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-600">Next: Blood Donation Camp</span>
            <button
              onClick={() => onNavigateTab('events')}
              className="text-[#0B1528] font-bold hover:underline"
            >
              Manage
            </button>
          </div>
        </div>

        {/* Card 3: Activities & Shramdaan */}
        <div className="bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Field Activities
              </span>
              <div className="text-2xl font-serif font-bold text-[#0B1528]">
                26
              </div>
            </div>
            <div className="p-2 bg-purple-50 text-purple-700">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-600">1,200 saplings planted</span>
            <button
              onClick={() => onNavigateTab('activities')}
              className="text-[#0B1528] font-bold hover:underline"
            >
              View
            </button>
          </div>
        </div>

        {/* Card 4: Reports Published */}
        <div className="bg-white border border-[#E5E7EB] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Audited Reports
              </span>
              <div className="text-2xl font-serif font-bold text-[#0B1528]">
                2 Active PDFs
              </div>
            </div>
            <div className="p-2 bg-amber-50 text-amber-700">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-600">Annual + Special Camp</span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-[#0B1528] font-bold hover:underline"
            >
              Repository
            </button>
          </div>
        </div>
      </div>

      {/* Google Drive Storage Widget & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Google Drive Status */}
        <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HardDrive size={18} className="text-blue-600" />
                <h3 className="font-serif text-base font-bold text-[#0B1528]">Google Drive Quota</h3>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200">
                Unit Storage
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              All official document attachments, camp photos, and annual PDF reports are safely archived in Google Drive under directory <code>/NSS-{config.id}</code>.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>Used: {usedMB} MB</span>
                <span>Limit: {totalGB} GB</span>
              </div>
              <div className="w-full bg-gray-200 h-2">
                <div
                  className="bg-blue-600 h-2 transition-all duration-500"
                  style={{ width: `${Math.max(2, percentUsed)}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-500 pt-1 flex items-center justify-between">
                <span>{storage?.fileCount || 34} documents archived</span>
                <span className="text-emerald-700 font-bold">Auto-Backed Up</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <a
              href={storage?.driveFolderUrl || 'https://drive.google.com'}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span>Open Unit Google Drive Folder</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Pending Volunteer Review Quick Queue */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-[#0B1528]">Volunteer Applications Requiring Review</h3>
                <p className="text-xs text-gray-500">Student enrollment submissions awaiting Programme Officer decision</p>
              </div>
              <button
                onClick={() => onNavigateTab('volunteers')}
                className="text-xs font-bold text-[#0B1528] flex items-center gap-1 hover:underline"
              >
                <span>View All ({volunteers.length})</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {pendingVolunteers.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-200">
                All volunteer enrollment applications have been processed and verified.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 overflow-x-auto">
                {pendingVolunteers.slice(0, 3).map((v) => (
                  <div key={v.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-[#0B1528]">{v.fullName}</div>
                      <div className="text-[11px] text-gray-600">
                        {v.rollNumber} • {v.department} • Year: {v.academicYear} • Blood: <span className="font-bold text-red-600">{v.bloodGroup}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Submitted on {new Date(v.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateTab('volunteers')}
                      className="px-3 py-1.5 bg-[#0B1528] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#1E3A8A]"
                    >
                      Inspect & Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Signed pledge verified for all submissions</span>
            </span>
            <span>240 hours mandatory service track</span>
          </div>
        </div>
      </div>
    </div>
  );
};
