import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  FileCheck,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  GraduationCap,
  Heart,
  Droplet,
  BookOpen,
  Sparkles,
  Shield,
  ArrowRight,
  Loader2,
  Bell,
  Check,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { api } from '../lib/api';
import type { VolunteerApplication, EventItem, Activity } from '../types';

interface VolunteerPortalProps {
  onNavigate?: (path: string) => void;
}

export const VolunteerPortal: React.FC<VolunteerPortalProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, openLogin } = useAuth();
  const { config } = useTenant();

  const [activeTab, setActiveTab] = useState<'overview' | 'drives' | 'hours' | 'profile'>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [appStatus, setAppStatus] = useState<VolunteerApplication | null>(null);
  const [activitiesData, setActivitiesData] = useState<{
    enrolledEvents: EventItem[];
    upcomingOpportunities: EventItem[];
    recentActivities: Activity[];
    totalCompletedEvents: number;
    estimatedServiceHours: number;
  }>({
    enrolledEvents: [],
    upcomingOpportunities: [],
    recentActivities: [],
    totalCompletedEvents: 0,
    estimatedServiceHours: 0,
  });

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    phone: '',
    department: '',
    academicYear: '2025–26',
    semester: 'Semester 4',
    bloodGroup: 'O+',
    skills: '',
    motivation: '',
    previousExperience: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Enroll in Event State
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrollFeedback, setEnrollFeedback] = useState<{ [id: string]: string }>({});

  const loadVolunteerData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [statusRes, actRes] = await Promise.all([
        api.volunteers.getMyStatus(),
        api.volunteers.getMyActivities(),
      ]);

      if (statusRes.success && statusRes.data) {
        setAppStatus(statusRes.data);
        setEditFormData({
          phone: statusRes.data.phone || '',
          department: statusRes.data.department || user?.department || '',
          academicYear: statusRes.data.academicYear || user?.academicYear || '2025–26',
          semester: statusRes.data.semester || 'Semester 4',
          bloodGroup: statusRes.data.bloodGroup || 'O+',
          skills: statusRes.data.skills || '',
          motivation: statusRes.data.motivation || '',
          previousExperience: statusRes.data.previousExperience || '',
        });
      } else {
        // Preset with user info
        setEditFormData({
          phone: user?.phone || '',
          department: user?.department || 'Computer Science & Engineering',
          academicYear: user?.academicYear || '2025–26',
          semester: 'Semester 4',
          bloodGroup: 'B+',
          skills: 'First Aid, Disaster Response, Digital Media',
          motivation: 'Passionate about nation building through NSS youth mobilization.',
          previousExperience: 'Organized school level blood donation drive and health camp.',
        });
      }

      if (actRes.success && actRes.data) {
        setActivitiesData(actRes.data);
      }
    } catch (e) {
      console.error('Failed to load volunteer records', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteerData();
  }, [isAuthenticated]);

  const handleEnrollEvent = async (event: EventItem) => {
    setEnrollingId(event.id);
    try {
      const res = await api.volunteers.registerForEvent(event.id);
      if (res.success) {
        setEnrollFeedback((prev) => ({
          ...prev,
          [event.id]: 'Enrolled successfully! Report at registration desk.',
        }));
        // Refresh activity list
        const actRes = await api.volunteers.getMyActivities();
        if (actRes.success && actRes.data) {
          setActivitiesData(actRes.data);
        }
      } else {
        setEnrollFeedback((prev) => ({
          ...prev,
          [event.id]: res.error || 'Enrollment failed. Contact coordinator.',
        }));
      }
    } catch (e) {
      setEnrollFeedback((prev) => ({
        ...prev,
        [event.id]: 'Network error while enrolling.',
      }));
    } finally {
      setEnrollingId(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg(null);
    try {
      const res = await api.volunteers.updateMyProfile(editFormData);
      if (res.success) {
        setProfileSuccessMsg('Volunteer profile updated successfully!');
        if (res.data) {
          setAppStatus(res.data);
        }
        setTimeout(() => {
          setIsEditModalOpen(false);
          setProfileSuccessMsg(null);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-md w-full bg-white border border-slate-200 shadow-xl p-8 text-center rounded-2xl">
          <div className="w-16 h-16 bg-[#0B1F3A] text-white flex items-center justify-center mx-auto mb-5 rounded-2xl border-2 border-[#C8102E] shadow-md">
            <UserCheck size={28} />
          </div>

          <div className="text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            Student Cadet Gateway
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0B1F3A] tracking-tight mb-2">
            NSS Volunteer Portal
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Track your enrolment status, sign up for weekend community drives, log service hours, and view your verified NSS service certificate.
          </p>

          <button
            onClick={openLogin}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0B1F3A] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#1E3A8A] transition-colors rounded-xl shadow-md"
          >
            <span>Sign In with Student ID</span>
            <ArrowRight size={14} />
          </button>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            {config.collegeName} • {config.unitNumber}
          </div>
        </div>
      </div>
    );
  }

  const statusColorMap: { [key: string]: string } = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    action_required: 'bg-blue-50 text-blue-700 border-blue-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const currentStatus = appStatus?.status || (user?.role === 'member' ? 'approved' : 'pending');

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Top Banner Header */}
      <div className="bg-[#0B1F3A] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm text-[#E63946]">
                <UserCheck size={28} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#E63946] text-white">
                    Volunteer Cadet
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                      statusColorMap[currentStatus as keyof typeof statusColorMap] || statusColorMap.pending
                    }`}
                  >
                    Status: {currentStatus.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  Welcome, {user?.name}
                </h1>
                <p className="text-xs text-slate-300">
                  Roll: {user?.rollNumber || appStatus?.rollNumber || 'Cadet-2025'} • {user?.department || appStatus?.department || config.collegeName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Edit size={14} />
                <span>Update Profile</span>
              </button>
              <button
                onClick={handlePrintCertificate}
                className="px-4 py-2 bg-[#E63946] hover:bg-[#C8102E] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
              >
                <Printer size={14} />
                <span>Service Certificate</span>
              </button>
            </div>
          </div>

          {/* Quick Tab Selector */}
          <div className="flex space-x-2 mt-8 border-b border-slate-700/60 overflow-x-auto pb-0.5">
            {[
              { id: 'overview', label: 'Cadet Overview', icon: Sparkles },
              { id: 'drives', label: 'Community Drives & Signups', icon: Calendar },
              { id: 'hours', label: 'Service Hours & Certificate', icon: Award },
              { id: 'profile', label: 'Enrolment Record', icon: UserCheck },
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

      {/* Main Container Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#0B1F3A] animate-spin mb-3" />
            <p className="text-xs text-slate-500">Loading student volunteer record...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: CADET OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status Callout Card with 3-Stage Lifecycle Pipeline */}
                <div
                  className={`p-6 rounded-2xl border ${
                    currentStatus === 'approved'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : currentStatus === 'action_required'
                      ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                      : currentStatus === 'pending'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-rose-50/70 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-5">
                    {currentStatus === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : currentStatus === 'action_required' ? (
                      <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    ) : currentStatus === 'pending' ? (
                      <Clock3 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm">
                        {currentStatus === 'approved' && 'NSS Enrolment Verified & Approved'}
                        {currentStatus === 'action_required' && 'Action Required: Clarification Requested'}
                        {currentStatus === 'pending' && 'Enrolment Application Under Review'}
                        {currentStatus === 'rejected' && 'Application Not Approved'}
                      </h4>
                      <p className="text-xs mt-1 leading-relaxed opacity-90">
                        {currentStatus === 'approved' &&
                          `Congratulations! Your enrolment for NSS ${config.unitNumber} (${config.collegeName}) is active. You are eligible to participate in state camps, regular activities, and log certified community service hours.`}
                        {currentStatus === 'action_required' &&
                          (appStatus?.reviewNotes || 'The Programme Officer has requested clarification on your academic details or pledge. Click "Update Profile" to resubmit.')}
                        {currentStatus === 'pending' &&
                          'Your application has been received and is in the verification queue. Verification of roll number and department details usually takes 24–48 hours.'}
                        {currentStatus === 'rejected' &&
                          (appStatus?.reviewNotes || 'Please contact your NSS Programme Officer for details regarding enrolment eligibility.')}
                      </p>
                    </div>
                  </div>

                  {/* 3-Stage Visual Pipeline */}
                  <div className="pt-4 border-t border-slate-200/60">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Application Lifecycle Stages
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {/* Stage 1: Submitted */}
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold mb-1">
                          <CheckCircle2 size={13} />
                          <span>Submitted</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">Application Lodged</span>
                      </div>

                      {/* Stage 2: Under PO Review */}
                      <div className={`p-2.5 rounded-xl border shadow-xs ${
                        currentStatus === 'approved' || currentStatus === 'action_required'
                          ? 'bg-white border-slate-200'
                          : 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
                      }`}>
                        <div className="flex items-center justify-center gap-1 font-bold mb-1 text-amber-700">
                          <Clock size={13} />
                          <span>PO Review</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">Officer Verification</span>
                      </div>

                      {/* Stage 3: Approved / Action Required */}
                      <div className={`p-2.5 rounded-xl border shadow-xs ${
                        currentStatus === 'approved'
                          ? 'bg-emerald-100 border-emerald-300 ring-2 ring-emerald-400/20 text-emerald-900 font-bold'
                          : currentStatus === 'action_required'
                          ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-400/20 text-blue-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}>
                        <div className="flex items-center justify-center gap-1 font-bold mb-1">
                          {currentStatus === 'approved' ? (
                            <>
                              <CheckCircle2 size={13} className="text-emerald-700" />
                              <span className="text-emerald-800">Approved</span>
                            </>
                          ) : currentStatus === 'action_required' ? (
                            <>
                              <AlertCircle size={13} className="text-blue-700" />
                              <span className="text-blue-800">Action Required</span>
                            </>
                          ) : (
                            <>
                              <Check size={13} className="text-slate-400" />
                              <span>Decision</span>
                            </>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block">Final Status</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Clock size={22} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase">Service Hours</div>
                      <div className="text-2xl font-bold text-slate-900">
                        {activitiesData.estimatedServiceHours}h / 120h
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium">Annual NSS Requirement</div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Calendar size={22} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase">Drives Attended</div>
                      <div className="text-2xl font-bold text-slate-900">
                        {activitiesData.totalCompletedEvents} Events
                      </div>
                      <div className="text-[11px] text-slate-500">Regular activities</div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Award size={22} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase">Special Camp</div>
                      <div className="text-2xl font-bold text-slate-900">7 Days</div>
                      <div className="text-[11px] text-amber-700 font-medium">Eligible for Selection</div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Droplet size={22} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase">Blood Group</div>
                      <div className="text-2xl font-bold text-slate-900">
                        {appStatus?.bloodGroup || 'O+'}
                      </div>
                      <div className="text-[11px] text-slate-500">Emergency Donor List</div>
                    </div>
                  </div>
                </div>

                {/* Two-Column Detail: Upcoming Signups & Notice Board */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Upcoming Community Drives */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Upcoming Community Opportunities</h3>
                        <p className="text-xs text-slate-500">Directly register to earn verified volunteer credits</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('drives')}
                        className="text-xs text-[#E63946] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>View All ({activitiesData.upcomingOpportunities.length})</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activitiesData.upcomingOpportunities.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                          <div>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase">
                              {event.category || 'Drive'}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900 mt-1">{event.title}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {event.location || 'College Campus'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {enrollFeedback[event.id] ? (
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                {enrollFeedback[event.id]}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleEnrollEvent(event)}
                                disabled={enrollingId === event.id}
                                className="px-3 py-1.5 bg-[#0B1F3A] hover:bg-[#E63946] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                              >
                                {enrollingId === event.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Check size={12} />
                                )}
                                <span>Sign Up</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: NSS Cadet Pledge & PO Notices */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                        <Bell size={16} className="text-[#E63946]" />
                        <span>Unit Announcements</span>
                      </h3>
                      <div className="space-y-3 text-xs text-slate-600">
                        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                          <span className="font-bold text-blue-900 block mb-0.5">Special Camp Briefing</span>
                          Mandatory orientation on Saturday, 10:00 AM at Unit Hall. Attendance is required for all enrolled cadets.
                        </div>
                        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                          <span className="font-bold text-amber-900 block mb-0.5">Blood Donor Registry</span>
                          Please verify your blood group in your enrolment record to support the district emergency hotline.
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1E3A8A] text-white p-6 rounded-2xl shadow-sm">
                      <h4 className="text-xs font-bold tracking-wider uppercase text-[#E63946] mb-1">
                        The NSS Motto
                      </h4>
                      <p className="font-serif text-lg font-bold">"Not Me But You"</p>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        Reflecting the essence of democratic living and upholding the need for selfless service and appreciation of the other person's point of view.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DRIVES & SIGNUPS */}
            {activeTab === 'drives' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-serif">Community Drives & Programs</h2>
                    <p className="text-xs text-slate-500">Sign up to participate in upcoming drives and volunteer missions</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activitiesData.upcomingOpportunities.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E63946]/10 text-[#E63946] uppercase">
                            {event.category || 'Community Service'}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 mb-2">{event.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                          {event.description || 'Community outreach and volunteer contribution program.'}
                        </p>
                        <div className="space-y-1.5 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-slate-400" />
                            <span>{event.location || 'College Campus'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-slate-400" />
                            <span>Expected Service: 4 Hours</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        {enrollFeedback[event.id] ? (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-3 py-1.5 rounded-lg w-full text-center">
                            {enrollFeedback[event.id]}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEnrollEvent(event)}
                            disabled={enrollingId === event.id}
                            className="w-full py-2 px-4 bg-[#0B1F3A] hover:bg-[#E63946] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                          >
                            {enrollingId === event.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                            <span>Enroll for Drive</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SERVICE HOURS & OFFICIAL CERTIFICATE PREVIEW */}
            {activeTab === 'hours' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                    <div>
                      <h2 className="text-xl font-bold font-serif text-slate-900">
                        NSS Volunteer Service Log & Certification
                      </h2>
                      <p className="text-xs text-slate-500">
                        Accredited under the Ministry of Youth Affairs and Sports, Government of India
                      </p>
                    </div>

                    <button
                      onClick={handlePrintCertificate}
                      className="px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#E63946] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Printer size={15} />
                      <span>Print Official Certificate</span>
                    </button>
                  </div>

                  {/* Printable Official Certificate View */}
                  <div className="p-8 border-4 border-double border-[#0B1F3A] rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-white relative shadow-sm my-4">
                    {/* Watermark seal */}
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                      <div className="text-center">
                        <div className="text-xs font-bold tracking-widest text-[#C8102E] uppercase">
                          National Service Scheme
                        </div>
                        <div className="text-xs font-medium text-slate-600">
                          Ministry of Youth Affairs & Sports • Government of India
                        </div>
                        <h3 className="font-serif text-2xl font-extrabold text-[#0B1F3A] mt-2">
                          CERTIFICATE OF SERVICE
                        </h3>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-700 italic">
                        This is to certify that Volunteer Cadet <strong className="text-slate-900 not-italic font-bold underline decoration-slate-400 underline-offset-4">{user?.name}</strong> (Roll No:{' '}
                        <span className="font-mono font-bold not-italic">{user?.rollNumber || appStatus?.rollNumber || 'NSS-CADET-2025'}</span>), student of{' '}
                        <strong className="text-slate-900 not-italic font-bold">{user?.department || appStatus?.department || 'Department of Technology'}</strong>, has actively served with{' '}
                        <strong className="text-slate-900 not-italic font-bold">{config.collegeName}</strong> ({config.unitNumber}).
                      </p>

                      <div className="py-4 my-2 bg-slate-50/70 border border-slate-200 rounded-xl grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Service Hours</div>
                          <div className="text-lg font-bold text-[#0B1F3A]">{activitiesData.estimatedServiceHours} Hours</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Academic Cycle</div>
                          <div className="text-lg font-bold text-[#0B1F3A]">{user?.academicYear || '2025–26'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">Special Camp</div>
                          <div className="text-lg font-bold text-emerald-700">Completed</div>
                        </div>
                      </div>

                      <div className="pt-8 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200">
                        <div className="text-left">
                          <div className="font-bold text-slate-900">{config.programmeOfficerName}</div>
                          <div className="text-[10px] text-slate-500">Programme Officer, {config.unitNumber}</div>
                        </div>

                        <div className="text-center">
                          <div className="w-14 h-14 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-[9px] text-slate-400 font-bold mx-auto">
                            OFFICIAL SEAL
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-slate-900">Principal / Head of Institution</div>
                          <div className="text-[10px] text-slate-500">{config.collegeName}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ENROLMENT RECORD */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Enrolment Application Details</h3>
                    <p className="text-xs text-slate-500">Official student record registered in Google Sheets DB</p>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-3 py-1.5 bg-[#0B1F3A] hover:bg-[#E63946] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit size={13} />
                    <span>Edit Information</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Cadet Full Name</span>
                    <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Institutional Email</span>
                    <p className="font-bold text-slate-900 text-sm">{user?.email}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Roll Number / Reg ID</span>
                    <p className="font-bold text-slate-900 text-sm font-mono">{user?.rollNumber || appStatus?.rollNumber || 'Not specified'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Department</span>
                    <p className="font-bold text-slate-900 text-sm">{appStatus?.department || user?.department || 'Technology'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Contact Phone</span>
                    <p className="font-bold text-slate-900 text-sm">{appStatus?.phone || user?.phone || 'Not provided'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Blood Group</span>
                    <p className="font-bold text-slate-900 text-sm">{appStatus?.bloodGroup || 'O+'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1 md:col-span-2">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Skills & Special Interests</span>
                    <p className="font-medium text-slate-800">{appStatus?.skills || 'First Aid, Event Coordination, Public Speaking'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1 md:col-span-2">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Statement of Motivation</span>
                    <p className="font-medium text-slate-800">{appStatus?.motivation || 'Eager to serve communities and gain social leadership experience through NSS.'}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Volunteer Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Update Volunteer Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {profileSuccessMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
                {profileSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Blood Group</label>
                  <select
                    value={editFormData.bloodGroup}
                    onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={editFormData.skills}
                  onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Motivation / Statement</label>
                <textarea
                  rows={3}
                  value={editFormData.motivation}
                  onChange={(e) => setEditFormData({ ...editFormData, motivation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#E63946] text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  {savingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
