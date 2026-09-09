import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Shield,
  Award,
  FileCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Send,
  Download,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Bell,
  Sparkles,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { api } from '../lib/api';
import type { TenantCollegeConfig } from '../types';

interface DirectoratePortalProps {
  onNavigate?: (path: string) => void;
}

interface DirectorateNotice {
  id: string;
  title: string;
  category: 'circular' | 'compliance' | 'quota' | 'urgent';
  date: string;
  targetColleges: string;
  content: string;
}

export const DirectoratePortal: React.FC<DirectoratePortalProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, role, openLogin } = useAuth();
  const { config } = useTenant();

  const isDirectorateAuthorized =
    isAuthenticated && (role === 'super_admin_1' || role === 'superadmin' || role === 'super_admin_2');

  const [activeTab, setActiveTab] = useState<'colleges' | 'quotas' | 'audits' | 'circulars'>('colleges');
  const [tenants, setTenants] = useState<TenantCollegeConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Circulars state
  const [notices, setNotices] = useState<DirectorateNotice[]>([
    {
      id: 'circ-01',
      title: 'Annual Shramdaan & Blood Drive Minimum Benchmark Mandate FY 2025–26',
      category: 'circular',
      date: '2025-02-15',
      targetColleges: 'All Affiliated Units (Units 01 to 12)',
      content: 'Every recognized unit must complete a minimum of 120 certified volunteer service hours and organize at least two campus blood donation camps.',
    },
    {
      id: 'circ-02',
      title: 'State Directorate Special 7-Day Residential Village Camp Guidelines',
      category: 'compliance',
      date: '2025-01-20',
      targetColleges: 'All Units',
      content: 'Submission of adopted village survey baseline report is mandatory prior to camp sanction disbursement.',
    },
    {
      id: 'circ-03',
      title: 'Notification on Enhanced Sanctioned Unit Quota for Technical Campuses',
      category: 'quota',
      date: '2025-01-05',
      targetColleges: 'Autonomous & Engineering Colleges',
      content: 'Volunteer strength caps revised upward by 25% to accommodate youth participation in disaster management training.',
    },
  ]);

  const [newNoticeModal, setNewNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'circular' as 'circular' | 'compliance' | 'quota' | 'urgent',
    targetColleges: 'All Affiliated Units',
    content: '',
  });

  const loadTenants = async () => {
    setLoading(true);
    try {
      const res = await api.tenant.list();
      if (res.success && res.data) {
        setTenants(res.data);
      }
    } catch (e) {
      console.error('Failed to load tenants list', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDirectorateAuthorized) {
      loadTenants();
    } else {
      setLoading(false);
    }
  }, [isDirectorateAuthorized]);

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    const created: DirectorateNotice = {
      id: `circ-${Date.now()}`,
      title: newNotice.title,
      category: newNotice.category,
      date: new Date().toISOString().split('T')[0],
      targetColleges: newNotice.targetColleges,
      content: newNotice.content,
    };
    setNotices([created, ...notices]);
    setNewNoticeModal(false);
    setNewNotice({
      title: '',
      category: 'circular',
      targetColleges: 'All Affiliated Units',
      content: '',
    });
  };

  // Case 1: Unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-md w-full bg-white border border-slate-200 shadow-xl p-8 text-center rounded-2xl">
          <div className="w-16 h-16 bg-[#0B1F3A] text-white flex items-center justify-center mx-auto mb-5 rounded-2xl border-2 border-[#C8102E] shadow-md">
            <Building2 size={28} />
          </div>

          <div className="text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            Regional Governance
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0B1F3A] tracking-tight mb-2">
            NSS State Directorate
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Institutional oversight, state-level quotas, and multi-tenant compliance audits require authenticated Superadmin Level 1 (Regional Directorate) credentials.
          </p>

          <button
            onClick={openLogin}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0B1F3A] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#1E3A8A] transition-colors rounded-xl shadow-md"
          >
            <span>Directorate Authentication</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Authenticated but not authorized for Superadmin 1
  if (!isDirectorateAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-md w-full bg-white border border-amber-200 shadow-xl p-8 text-center rounded-2xl space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 flex items-center justify-center mx-auto rounded-2xl border border-amber-200 shadow-sm">
            <ShieldAlert size={28} />
          </div>

          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              State Governance Clearance Required
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Directorate Access Restricted
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your account <strong>{user?.email}</strong> is assigned the role <span className="font-mono font-bold text-blue-600 uppercase">{user?.role}</span>. Regional Directorate oversight functions require Superadmin Level 1 clearance.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {(user?.role === 'user' || user?.role === 'member') ? (
              <button
                onClick={() => (onNavigate ? onNavigate('/volunteer') : (window.location.href = '#/volunteer'))}
                className="w-full py-2.5 px-4 bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-2"
              >
                <span>Go to Volunteer Cadre Portal</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => (onNavigate ? onNavigate('/admin') : (window.location.href = '#/admin'))}
                className="w-full py-2.5 px-4 bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-2"
              >
                <span>Go to College Admin Dashboard</span>
                <ArrowRight size={14} />
              </button>
            )}
            <button
              onClick={() => (onNavigate ? onNavigate('/') : (window.location.href = '#/'))}
              className="w-full py-2 px-4 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Return to Public Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredTenants = tenants.filter(
    (t) =>
      t.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Top Directorate Banner */}
      <div className="bg-[#0B1F3A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm text-[#E63946]">
                <Building2 size={28} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#E63946] text-white">
                    State Directorate
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Tier 1 Governance Active
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  Regional Directorate Portal
                </h1>
                <p className="text-xs text-slate-300">
                  Officer in Charge: {user?.name} ({user?.email}) • State University Central Oversight
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setNewNoticeModal(true)}
                className="px-4 py-2 bg-[#E63946] hover:bg-[#C8102E] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
              >
                <Send size={14} />
                <span>Issue Directorate Circular</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mt-8 border-b border-slate-700/60 overflow-x-auto pb-0.5">
            {[
              { id: 'colleges', label: 'Institutional Units (Multi-Tenant)', icon: Building2 },
              { id: 'quotas', label: 'Volunteer Quota Allocations', icon: Users },
              { id: 'audits', label: 'Compliance & University Audits', icon: FileCheck },
              { id: 'circulars', label: 'State Policy Circulars', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-[#E63946] text-white bg-white/5'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Regional Benchmark Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 size={22} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Affiliated Units</div>
              <div className="text-2xl font-bold text-slate-900">{tenants.length || 6} Colleges</div>
              <div className="text-[11px] text-emerald-600 font-medium">100% Active in DB</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Volunteers</div>
              <div className="text-2xl font-bold text-slate-900">1,250 Cadets</div>
              <div className="text-[11px] text-slate-500">Sanctioned quota: 1,500</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award size={22} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Service Delivered</div>
              <div className="text-2xl font-bold text-slate-900">48,200 Hrs</div>
              <div className="text-[11px] text-emerald-600 font-medium">+14% vs FY 2024</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileCheck size={22} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Compliance Health</div>
              <div className="text-2xl font-bold text-emerald-700">96.4%</div>
              <div className="text-[11px] text-slate-500">Audit Grade: Exemplary A+</div>
            </div>
          </div>
        </div>

        {/* TAB 1: INSTITUTIONAL UNITS OVERVIEW */}
        {activeTab === 'colleges' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Affiliated College Units & Officers</h3>
                <p className="text-xs text-slate-500">Live multi-tenant colleges reporting to Directorate</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter colleges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#0B1F3A]" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                      <th className="py-3 px-4">College & Campus</th>
                      <th className="py-3 px-4">Unit Designation</th>
                      <th className="py-3 px-4">Programme Officer</th>
                      <th className="py-3 px-4">Sanctioned Quota</th>
                      <th className="py-3 px-4">Enrolled Cadets</th>
                      <th className="py-3 px-4">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTenants.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{t.collegeName}</div>
                          <div className="text-[11px] text-slate-400">{t.location || 'Odisha, India'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-bold rounded-full font-mono text-[10px]">
                            {t.unitNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{t.programmeOfficerName}</div>
                          <div className="text-[10px] text-slate-400">{t.contactEmail}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                          100 Volunteers
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-emerald-700">92 / 100</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-[10px] border border-emerald-200">
                            Compliant
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: QUOTA ALLOCATIONS */}
        {activeTab === 'quotas' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Volunteer Strength Quota Management</h3>
              <p className="text-xs text-slate-500">
                Authorized government strength allocation for FY 2025–2026 under National Service Scheme
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Sanctioned Quota</span>
                <div className="text-2xl font-bold text-slate-900">1,500 Seats</div>
                <p className="text-[11px] text-slate-500">Across 12 Regional Units</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Utilized Enrolment</span>
                <div className="text-2xl font-bold text-blue-700">1,250 Cadets</div>
                <p className="text-[11px] text-emerald-600 font-medium">83.3% Utilization Rate</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Remaining Buffer</span>
                <div className="text-2xl font-bold text-amber-700">250 Vacancies</div>
                <p className="text-[11px] text-slate-500">Available for Spot Allocation</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <strong>Directorate Policy Note:</strong> Quota adjustments require submission of student intake records and endorsement by the College Principal. Units maintaining &gt;95% shramdaan participation become eligible for additional unit branches.
            </div>
          </div>
        )}

        {/* TAB 3: REGIONAL AUDITS */}
        {activeTab === 'audits' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">University Compliance Inspection Logs</h3>
                <p className="text-xs text-slate-500">Quarterly unit audit records and special camp compliance</p>
              </div>
              <button
                onClick={() => alert('Exporting Directorate Consolidated Compliance Report...')}
                className="px-3 py-1.5 bg-[#0B1F3A] hover:bg-[#E63946] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download size={13} />
                <span>Export Audit PDF</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      PASSED A+
                    </span>
                    <h4 className="font-bold text-slate-900">NSS PMEC Unit 01 (Berhampur)</h4>
                  </div>
                  <p className="text-slate-500 mt-1">Special 7-Day Winter Camp in Sitalapalli adopted village. 100% audit compliance.</p>
                </div>
                <span className="text-slate-400 text-[11px]">Audit Date: 12 Jan 2025</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      PASSED A
                    </span>
                    <h4 className="font-bold text-slate-900">NSS GEC Unit 02 (Bhubaneswar)</h4>
                  </div>
                  <p className="text-slate-500 mt-1">Mega Blood Donation Drive. 250 units collected. Audited by State Blood Transfusion Council.</p>
                </div>
                <span className="text-slate-400 text-[11px]">Audit Date: 05 Jan 2025</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                      RETURN PENDING
                    </span>
                    <h4 className="font-bold text-slate-900">NSS VSSUT Unit 03 (Burla)</h4>
                  </div>
                  <p className="text-slate-500 mt-1">Quarterly expenditure utilization certificate awaited from finance committee.</p>
                </div>
                <span className="text-slate-400 text-[11px]">Due: 28 Feb 2025</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CIRCULARS */}
        {activeTab === 'circulars' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">State Directorate Circulars & Directives</h3>
                <p className="text-xs text-slate-500">Official broadcasts published to all affiliated college units</p>
              </div>
              <button
                onClick={() => setNewNoticeModal(true)}
                className="px-3 py-1.5 bg-[#E63946] hover:bg-[#C8102E] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus size={13} />
                <span>New Circular</span>
              </button>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded uppercase text-[10px]">
                      {n.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{n.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Target: {n.targetColleges}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Notice Modal */}
      {newNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Issue Directorate Circular</h3>
            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Tree Plantation Drive Target Allocation"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="circular">General Circular</option>
                    <option value="compliance">Compliance Mandate</option>
                    <option value="quota">Quota Revision</option>
                    <option value="urgent">Urgent Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Units</label>
                  <input
                    type="text"
                    value={newNotice.targetColleges}
                    onChange={(e) => setNewNotice({ ...newNotice, targetColleges: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Directive Details</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Official instructions and compliance timeline..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewNoticeModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E63946] hover:bg-[#C8102E] text-white font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Publish Statewide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
