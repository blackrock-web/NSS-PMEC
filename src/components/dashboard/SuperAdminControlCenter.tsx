import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Settings,
  Globe,
  Database,
  History,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertCircle,
  FolderSync,
  Edit3,
  Sliders,
  FileCheck,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import type { SiteCmsContent, ExternalDataSource, AuditTrailDiff } from '../../types';

interface SuperAdminControlCenterProps {
  onBackToPortal?: () => void;
}

export const SuperAdminControlCenter: React.FC<SuperAdminControlCenterProps> = ({ onBackToPortal }) => {
  const { user, isSuperAdmin2, logout } = useAuth();

  const [activeSection, setActiveSection] = useState<'cms' | 'datasources' | 'audit' | 'security'>('cms');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // CMS State
  const [cmsContent, setCmsContent] = useState<SiteCmsContent | null>(null);

  // Data Sources State
  const [dataSources, setDataSources] = useState<ExternalDataSource[]>([]);
  const [newSourceModal, setNewSourceModal] = useState<boolean>(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState<'google_drive' | 'google_sheet' | 'external_api'>('google_drive');
  const [newSourceDesc, setNewSourceDesc] = useState('');

  // Audit Trail Diffs State
  const [auditDiffs, setAuditDiffs] = useState<AuditTrailDiff[]>([]);

  // Load all Level 2 data
  const loadData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [cmsRes, sourcesRes, diffsRes] = await Promise.all([
        api.tenant.getCms(),
        api.tenant.getDataSources(),
        api.tenant.getAuditDiffs(),
      ]);

      if (cmsRes.success && cmsRes.data) {
        setCmsContent(cmsRes.data);
      }
      if (sourcesRes.success && sourcesRes.data) {
        setDataSources(sourcesRes.data);
      }
      if (diffsRes.success && diffsRes.data) {
        setAuditDiffs(diffsRes.data);
      }
    } catch (err: unknown) {
      setErrorMessage('Failed to load Level 2 Control Center data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle CMS Field Update
  const handleCmsFieldChange = (key: keyof SiteCmsContent, value: any) => {
    if (!cmsContent) return;
    setCmsContent({
      ...cmsContent,
      [key]: value,
    });
  };

  // Save CMS Content to Server
  const handleSaveCms = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cmsContent) return;

    setSaving(true);
    setSaveSuccess(null);
    setErrorMessage(null);

    try {
      const res = await api.tenant.updateCms(cmsContent);
      if (res.success && res.data) {
        setCmsContent(res.data);
        setSaveSuccess('Website configuration updated dynamically! Changes are live across all public portals.');
        // Refresh audit diffs
        api.tenant.getAuditDiffs().then((d) => d.success && d.data && setAuditDiffs(d.data));
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setErrorMessage(res.error || 'Failed to save configuration.');
      }
    } catch (err: unknown) {
      setErrorMessage('Server error updating CMS.');
    } finally {
      setSaving(false);
    }
  };

  // Add External Data Source
  const handleAddDataSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;

    setSaving(true);
    try {
      const res = await api.tenant.createDataSource({
        name: newSourceName.trim(),
        url: newSourceUrl.trim(),
        type: newSourceType,
        description: newSourceDesc.trim(),
        isActive: true,
        priority: dataSources.length + 1,
      });

      if (res.success && res.data) {
        setDataSources([...dataSources, res.data]);
        setNewSourceModal(false);
        setNewSourceName('');
        setNewSourceUrl('');
        setNewSourceDesc('');
        setSaveSuccess('Data source connected and verified.');
        setTimeout(() => setSaveSuccess(null), 3000);
      }
    } catch (err) {
      setErrorMessage('Failed to create data source.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Data Source
  const handleDeleteSource = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this external data source?')) return;
    try {
      const res = await api.tenant.deleteDataSource(id);
      if (res.success) {
        setDataSources(dataSources.filter((s) => s.id !== id));
      }
    } catch (err) {
      setErrorMessage('Failed to delete data source.');
    }
  };

  // Strict Server & Role Verification Check
  if (!isSuperAdmin2) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-rose-900/60 p-8 rounded-2xl shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-rose-950/80 border border-rose-600/40 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="inline-block px-2.5 py-0.5 bg-rose-950/60 border border-rose-700/50 text-[10px] font-mono uppercase tracking-widest text-rose-400 rounded">
            Level 2 Air-Gapped Authority
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Unauthorized Control Center Access
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Super Admin Level 2 Control Center requires verified two-factor TOTP authorization and a valid Master Authorization Key.
          </p>
          <div className="pt-2">
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Standard Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Black Executive Bar */}
      <header className="bg-slate-900/90 border-b border-rose-900/40 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-600 to-indigo-800 rounded-xl flex items-center justify-center text-white shadow-md shadow-rose-900/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white tracking-tight text-sm">
                  Super Admin Level 2 Control Center
                </span>
                <span className="px-2 py-0.5 bg-rose-950/80 border border-rose-600 text-[10px] font-mono text-rose-300 font-bold rounded uppercase">
                  Apex Master
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Institutional Dynamic CMS • Remote Data Stores • Immutable Audit Trail
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium rounded-lg text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit to Portal</span>
              </button>
            )}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 font-mono text-[11px]">{user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Save Success Banner */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl flex items-center space-x-3 text-emerald-200 text-xs shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{saveSuccess}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-950/40 border border-rose-800 rounded-xl flex items-center space-x-3 text-rose-200 text-xs shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveSection('cms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSection === 'cms'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Dynamic Website CMS</span>
          </button>

          <button
            onClick={() => setActiveSection('datasources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSection === 'datasources'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>External Data Sources & Drive</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-[10px] rounded text-slate-300">
              {dataSources.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSection === 'audit'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Granular Audit Trail Diffs</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-[10px] rounded text-slate-300">
              {auditDiffs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSection === 'security'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>TOTP & Security Policies</span>
          </button>
        </div>

        {/* SECTION 1: DYNAMIC WEBSITE CMS */}
        {activeSection === 'cms' && cmsContent && (
          <form onSubmit={handleSaveCms} className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900/80 p-4 border border-slate-800 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-rose-500" />
                  <span>Dynamic Site Content & Copy Management</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Edits made here update the public home page, header alerts, mottos, and footer in real-time.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-900/30 flex items-center space-x-2 disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Publishing Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Publish to Live Website</span>
                  </>
                )}
              </button>
            </div>

            {/* 1. Institutional Identity & Mottos */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>1. Institutional Identity & Mottos</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Institution / College Name
                  </label>
                  <input
                    type="text"
                    value={cmsContent.collegeName}
                    onChange={(e) => handleCmsFieldChange('collegeName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Unit Designation
                  </label>
                  <input
                    type="text"
                    value={cmsContent.unitDesignation}
                    onChange={(e) => handleCmsFieldChange('unitDesignation', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    English Motto
                  </label>
                  <input
                    type="text"
                    value={cmsContent.mottoEnglish}
                    onChange={(e) => handleCmsFieldChange('mottoEnglish', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hindi Sanskrit Motto
                  </label>
                  <input
                    type="text"
                    value={cmsContent.mottoHindi}
                    onChange={(e) => handleCmsFieldChange('mottoHindi', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none font-serif"
                  />
                </div>
              </div>
            </div>

            {/* 2. Hero Section Content */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>2. Homepage Hero Showcase</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Badge Label
                  </label>
                  <input
                    type="text"
                    value={cmsContent.heroBadge}
                    onChange={(e) => handleCmsFieldChange('heroBadge', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={cmsContent.heroHeadline}
                    onChange={(e) => handleCmsFieldChange('heroHeadline', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hero Subtitle & Overview Description
                  </label>
                  <textarea
                    rows={3}
                    value={cmsContent.heroSubtitle}
                    onChange={(e) => handleCmsFieldChange('heroSubtitle', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={cmsContent.heroCtaText}
                    onChange={(e) => handleCmsFieldChange('heroCtaText', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary CTA Route / Link
                  </label>
                  <input
                    type="text"
                    value={cmsContent.heroCtaLink}
                    onChange={(e) => handleCmsFieldChange('heroCtaLink', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Top Announcement Banner */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-indigo-400" />
                  <span>3. High-Priority Header Announcement</span>
                </h4>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cmsContent.announcementBannerActive}
                    onChange={(e) => handleCmsFieldChange('announcementBannerActive', e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Show Announcement Banner</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Announcement Title & Text
                </label>
                <input
                  type="text"
                  value={cmsContent.announcementText}
                  onChange={(e) => handleCmsFieldChange('announcementText', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Banner Target Link / Route
                  </label>
                  <input
                    type="text"
                    value={cmsContent.announcementLink}
                    onChange={(e) => handleCmsFieldChange('announcementLink', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Urgent / Highlight Badge Text
                  </label>
                  <input
                    type="text"
                    value={cmsContent.announcementBadge}
                    onChange={(e) => handleCmsFieldChange('announcementBadge', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Emergency Helplines & Contact */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>4. Helplines, Address & Footer Info</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-rose-400 mb-1">
                    Emergency Blood Helpline
                  </label>
                  <input
                    type="text"
                    value={cmsContent.emergencyBloodHelpline}
                    onChange={(e) => handleCmsFieldChange('emergencyBloodHelpline', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-rose-900/50 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Phone
                  </label>
                  <input
                    type="text"
                    value={cmsContent.officialPhone}
                    onChange={(e) => handleCmsFieldChange('officialPhone', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={cmsContent.officialEmail}
                    onChange={(e) => handleCmsFieldChange('officialEmail', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Office Location & Campus Address
                  </label>
                  <input
                    type="text"
                    value={cmsContent.address}
                    onChange={(e) => handleCmsFieldChange('address', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={cmsContent.officeHours}
                    onChange={(e) => handleCmsFieldChange('officeHours', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Footer Legal & Accreditation Text
                </label>
                <input
                  type="text"
                  value={cmsContent.footerText}
                  onChange={(e) => handleCmsFieldChange('footerText', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          </form>
        )}

        {/* SECTION 2: EXTERNAL DATA SOURCES */}
        {activeSection === 'datasources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900/80 p-4 border border-slate-800 rounded-xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Database className="w-4 h-4 text-rose-500" />
                  <span>External Cloud Repositories & Data Integrations</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage remote Google Drive folders, Google Sheets endpoints, and external synchronization links.
                </p>
              </div>

              <button
                onClick={() => setNewSourceModal(true)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center space-x-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Connect Remote Source</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataSources.map((source) => (
                <div
                  key={source.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FolderSync className="w-4 h-4 text-blue-400" />
                        <h4 className="text-sm font-bold text-white">{source.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-800 text-[10px] font-mono font-bold text-slate-300 rounded uppercase">
                        {source.type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{source.description}</p>
                    <div className="text-[11px] font-mono text-slate-500 truncate bg-slate-950 p-2 rounded-lg border border-slate-800">
                      {source.url}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Priority {source.priority}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                        title="Test Source URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteSource(source.id)}
                        className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 rounded text-rose-300 hover:text-white"
                        title="Disconnect"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: New Source */}
            {newSourceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <form
                  onSubmit={handleAddDataSource}
                  className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <FolderSync className="w-4 h-4 text-rose-500" />
                      <span>Connect External Data Source</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setNewSourceModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Source Name</label>
                    <input
                      type="text"
                      required
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                      placeholder="e.g. State Directorate Central Drive"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Source Type</label>
                    <select
                      value={newSourceType}
                      onChange={(e: any) => setNewSourceType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="google_drive">Google Drive Folder Repository</option>
                      <option value="google_sheet">Google Sheets Central Register</option>
                      <option value="external_api">Rest API / Webhook</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">URL / Resource Link</label>
                    <input
                      type="url"
                      required
                      value={newSourceUrl}
                      onChange={(e) => setNewSourceUrl(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Purpose</label>
                    <textarea
                      rows={2}
                      value={newSourceDesc}
                      onChange={(e) => setNewSourceDesc(e.target.value)}
                      placeholder="Brief note on what data this source provides"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setNewSourceModal(false)}
                      className="w-1/3 py-2 bg-slate-800 text-xs font-semibold rounded-xl text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-2/3 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-bold rounded-xl text-white shadow-lg"
                    >
                      Save & Verify Connection
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: GRANULAR AUDIT TRAIL DIFFS */}
        {activeSection === 'audit' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-4 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <History className="w-4 h-4 text-rose-500" />
                  <span>Immutable Level 2 Configuration Audit Trail</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed, chronological diff records tracking all administrative mutations across CMS and system flags.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {auditDiffs.length} Recorded Diffs
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                    <tr>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Actor & Role</th>
                      <th className="p-3.5">Section</th>
                      <th className="p-3.5">Field Changed</th>
                      <th className="p-3.5">Previous Value</th>
                      <th className="p-3.5">New Value</th>
                      <th className="p-3.5">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {auditDiffs.map((diff) => (
                      <tr key={diff.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                          {new Date(diff.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-semibold text-white">{diff.actorEmail}</span>
                          <span className="block text-[10px] text-rose-400 font-mono uppercase">
                            {diff.actorRole}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-300 font-medium whitespace-nowrap">
                          {diff.section}
                        </td>
                        <td className="p-3.5 font-mono text-amber-400 font-bold whitespace-nowrap">
                          {diff.fieldChanged}
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono max-w-xs truncate" title={diff.previousValue}>
                          <span className="line-through decoration-rose-500/60 text-slate-500">
                            {diff.previousValue || '(empty)'}
                          </span>
                        </td>
                        <td className="p-3.5 text-emerald-400 font-mono max-w-xs truncate" title={diff.newValue}>
                          {diff.newValue}
                        </td>
                        <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">
                          {diff.ipAddress || '127.0.0.1'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: SECURITY & TOTP POLICIES */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Super Admin Level 2 Security Architecture</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-200">Enforced Two-Factor Authentication</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Level 2 administrative accounts are cryptographically locked behind standard RFC 6238 Time-based One-Time Passwords (TOTP). Temporary JWT tokens expire within 10 minutes.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-slate-400">
                    Secret: <span className="text-rose-400">JBSWY3DPEHPK3PXP</span> (Base32)
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-200">Dual-Key Master Verification</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mutations to core system parameters require both server-side token validation and the institutional Master Authorization Key.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-slate-400">
                    Master Key: <span className="text-amber-400">MASTER-LEVEL2-KEY-9942</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
