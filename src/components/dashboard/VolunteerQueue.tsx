import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  FileSpreadsheet,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { VolunteerApplication, ApplicationStatus } from '../../types';

export const VolunteerQueue: React.FC = () => {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<VolunteerApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.volunteers.listAdmin({
        status: statusFilter,
        department: departmentFilter,
        search: searchQuery,
      });
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (e) {
      console.error('Error fetching applications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, departmentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleUpdateStatus = async (status: ApplicationStatus) => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const res = await api.volunteers.updateStatus(selectedApp.id, status, reviewNotes);
      if (res.success && res.data) {
        // Update local list
        setApplications((prev) => prev.map((a) => (a.id === selectedApp.id ? res.data! : a)));
        setSelectedApp(res.data);
        setReviewNotes('');
      }
    } catch (e) {
      console.error('Failed to update volunteer status:', e);
    } finally {
      setActionLoading(false);
    }
  };

  const departments = Array.from(new Set(applications.map((a) => a.department).filter(Boolean)));

  const exportCSV = () => {
    const headers = ['Full Name', 'Roll Number', 'Department', 'Year', 'Blood Group', 'Phone', 'Email', 'Status', 'Submitted At'];
    const rows = applications.map((a) => [
      `"${a.fullName}"`,
      `"${a.rollNumber}"`,
      `"${a.department}"`,
      `"${a.academicYear}"`,
      `"${a.bloodGroup}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.status}"`,
      `"${a.submittedAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nss_volunteers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Users size={14} />
            <span>Volunteer Intake & Enrolment Management</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            Volunteer Verification Queue
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Process student enrollment applications for the 240-hour national community service programme.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={applications.length === 0}
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors self-start md:self-auto disabled:opacity-50"
        >
          <FileSpreadsheet size={14} />
          <span>Export Roster (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E7EB] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  statusFilter === s
                    ? 'bg-[#0B1528] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search name, roll no, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 focus:outline-none focus:border-[#0B1528]"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#0B1528] text-white text-xs font-bold hover:bg-[#1E3A8A]"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-[#E5E7EB] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#0B1528]" size={18} />
            <span>Loading volunteer records from Google Sheets database...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No volunteer applications found matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Department & Year</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#0B1528]">
                      <div>{app.fullName}</div>
                      <div className="text-[11px] text-gray-500 font-normal">{app.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-600">
                      {app.rollNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div>{app.department}</div>
                      <div className="text-[10px] text-gray-500">{app.academicYear}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 text-[10px]">
                        {app.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {app.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          <CheckCircle2 size={10} />
                          Approved
                        </span>
                      )}
                      {app.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                          <Clock size={10} />
                          Pending Review
                        </span>
                      )}
                      {app.status === 'action_required' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-200">
                          <AlertCircle size={10} />
                          Action Required
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-red-700 bg-red-50 px-2 py-0.5 border border-red-200">
                          <XCircle size={10} />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-gray-500">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewNotes(app.reviewNotes || '');
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-[#0B1528] border border-gray-300 hover:bg-[#0B1528] hover:text-white transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-[#0B1528] text-white p-4 border-b-2 border-[#C8102E] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white leading-tight">
                  Volunteer Application Review
                </h3>
                <p className="text-xs text-white/70">
                  {selectedApp.fullName} • Roll: {selectedApp.rollNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Department</span>
                  <span className="font-semibold text-gray-800">{selectedApp.department}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Academic Year</span>
                  <span className="font-semibold text-gray-800">{selectedApp.academicYear} ({selectedApp.semester})</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Blood Group</span>
                  <span className="font-bold text-red-600">{selectedApp.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Phone</span>
                  <span className="font-semibold text-gray-800">{selectedApp.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Institutional Email</span>
                  <span className="font-semibold text-gray-800">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Gender / DOB</span>
                  <span className="font-semibold text-gray-800">{selectedApp.gender} • {selectedApp.dob}</span>
                </div>
              </div>

              {/* Skills */}
              {selectedApp.skills && selectedApp.skills.length > 0 && (
                <div>
                  <h4 className="text-[11px] uppercase font-bold text-gray-700 mb-1">Declared Competencies & Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedApp.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivation */}
              <div>
                <h4 className="text-[11px] uppercase font-bold text-gray-700 mb-1">Statement of Motivation</h4>
                <div className="p-3 bg-white border border-gray-200 text-gray-700 leading-relaxed italic">
                  "{selectedApp.motivation}"
                </div>
              </div>

              {/* Previous Experience */}
              {selectedApp.previousExperience && (
                <div>
                  <h4 className="text-[11px] uppercase font-bold text-gray-700 mb-1">Prior Social & Scout Experience</h4>
                  <p className="text-gray-600">{selectedApp.previousExperience}</p>
                </div>
              )}

              {/* Pledge Acceptance */}
              <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Check size={14} className="text-emerald-700" />
                <span className="text-[11px] font-semibold">
                  Signed & affirmed the Official National Service Scheme Volunteer Pledge (240 Hours)
                </span>
              </div>

              {/* Review Officer Notes */}
              <div className="pt-2">
                <label className="block text-[11px] uppercase font-bold text-gray-700 mb-1">
                  Programme Officer Decision Notes
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Approved for Health & Blood Donation wing; induction on Sept 15."
                  className="w-full p-2 border border-gray-300 text-xs focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              {selectedApp.reviewedBy && (
                <div className="text-[10px] text-gray-500">
                  Last reviewed by <strong>{selectedApp.reviewedBy}</strong> on{' '}
                  {selectedApp.reviewedAt ? new Date(selectedApp.reviewedAt).toLocaleString() : 'N/A'}
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-3 py-1.5 border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('rejected')}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('action_required')}
                  className="px-3 py-1.5 bg-blue-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-800 disabled:opacity-50"
                >
                  Request Info
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('approved')}
                  className="px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                  <span>Approve Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
