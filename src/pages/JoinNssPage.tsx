import React, { useState } from 'react';
import { 
  HeartHandshake, CheckCircle2, ShieldAlert, Award, 
  FileText, Clock, Users, ArrowRight, Sparkles, Send, RefreshCw, AlertCircle 
} from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SITE_CONFIG } from '../data/config';
import { api } from '../lib/api';
import { useTenant } from '../context/TenantContext';

export const JoinNssPage: React.FC = () => {
  const { config } = useTenant();
  const activeConfig = config || SITE_CONFIG;

  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    yearOfStudy: '1st Year (Semester I / II)',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    areasOfInterest: [] as string[],
    motivation: '',
    pastExperience: '',
    undertaking: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const interestOptions = [
    'Tree Plantation & Environmental Care',
    'Blood Donation Drives & Healthcare Camps',
    'Remedial Teaching & Child Literacy',
    'Social Awareness & Street Theater (Nukkad Natak)',
    'Event Logistics & Field Operations',
    'Photography, Media & Digital Documentation'
  ];

  const handleInterestToggle = (option: string) => {
    setFormData((prev) => {
      const exists = prev.areasOfInterest.includes(option);
      return {
        ...prev,
        areasOfInterest: exists
          ? prev.areasOfInterest.filter((item) => item !== option)
          : [...prev.areasOfInterest, option]
      };
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.rollNumber.trim()) errs.rollNumber = 'College roll / registration number is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid institutional or personal email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid 10-digit mobile number is required';
    if (!formData.motivation.trim() || formData.motivation.length < 20) {
      errs.motivation = 'Please share at least a sentence explaining your motivation (min 20 characters)';
    }
    if (!formData.undertaking) {
      errs.undertaking = 'You must accept the NSS service undertaking and attendance commitment';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await api.volunteers.apply({
        fullName: formData.fullName,
        rollNumber: formData.rollNumber,
        department: formData.department,
        academicYear: formData.yearOfStudy,
        email: formData.email,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        skills: formData.areasOfInterest,
        motivation: formData.motivation,
        previousExperience: formData.pastExperience,
        pledgeAccepted: true,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrors({ form: res.error || 'Submission failed. Please verify your details.' });
      }
    } catch (err: any) {
      setErrors({ form: err.message || 'An unexpected error occurred while saving application.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      rollNumber: '',
      department: 'Computer Science & Engineering',
      yearOfStudy: '1st Year (Semester I / II)',
      email: '',
      phone: '',
      bloodGroup: 'O+',
      areasOfInterest: [],
      motivation: '',
      pastExperience: '',
      undertaking: false
    });
  };

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-[#0B1F3A] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FCA5A5] mb-4">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>ANNUAL RECRUITMENT 2026–27</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Join the NSS Volunteer Cadre
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Step beyond academic lecture halls into meaningful community service. Build leadership, earn university service credentials, and touch lives directly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Benefits & Application Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Why Join & Eligibility (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Why Join NSS Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-xl font-bold text-[#0B1F3A] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E63946]" />
                Why Join NSS?
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-red-50 text-[#E63946] shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      Government Certificate of Merit
                    </strong>
                    Issued by the Ministry of Youth Affairs upon completion of 240 hours of regular service and one 7-day Special Camp.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-blue-50 text-[#0B1F3A] shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      Leadership & Field Exposure
                    </strong>
                    Experience crisis management, crowd logistics, public speaking, and team leadership across diverse village communities.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      Academic & Placement Weightage
                    </strong>
                    Recognized with extra-curricular credit points in university marksheets and highly valued during higher education admissions.
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility & Commitment */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h3 className="text-lg font-bold text-[#0B1F3A] mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E63946]" />
                Eligibility & Service Commitment
              </h3>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] shrink-0 mt-1.5" />
                  <span>Enrolled full-time undergraduate student (1st or 2nd year preferred).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] shrink-0 mt-1.5" />
                  <span>Minimum commitment of <strong>120 service hours per academic year</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] shrink-0 mt-1.5" />
                  <span>Willingness to participate in the mandatory residential <strong>7-Day Special Camp</strong> in adopted rural village.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] shrink-0 mt-1.5" />
                  <span>High personal integrity, non-discriminatory attitude, and dedication to Gandhian ideals.</span>
                </li>
              </ul>
            </div>

            {/* Helpline Box */}
            <div className="p-5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
              <div className="font-bold text-[#0B1F3A] mb-1">
                Have queries before enrolling?
              </div>
              <div>
                Visit the NSS Unit Office (Ground Floor, Student Activities Wing) or contact Programme Officer at{' '}
                <strong className="text-slate-800">{SITE_CONFIG.phone}</strong>.
              </div>
            </div>
          </div>

          {/* Right Column: Enrollment Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-md">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#0B1F3A] mb-2">
                    Application Successfully Registered!
                  </h3>
                  <div className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold mb-4">
                    Reference ID: NSS-2026-APP-{Math.floor(1000 + Math.random() * 9000)}
                  </div>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                    Thank you, <strong>{formData.fullName}</strong>. Your volunteer application has been recorded in the college NSS cell database. The Programme Officer and Student Executive Council will notify you via email (<strong>{formData.email}</strong>) regarding the volunteer orientation and badge distribution schedule.
                  </p>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-left max-w-md mx-auto mb-8 space-y-1">
                    <div><strong>Department:</strong> {formData.department} ({formData.yearOfStudy})</div>
                    <div><strong>Emergency Blood Group:</strong> {formData.bloodGroup}</div>
                    <div><strong>Selected Interests:</strong> {formData.areasOfInterest.length > 0 ? formData.areasOfInterest.join(', ') : 'General Volunteer Duty'}</div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#071526] transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Submit Another Application</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1F3A]">
                      NSS Volunteer Enrolment Form
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Academic Year 2026–27 • All fields marked with an asterisk (*) are mandatory.
                    </p>
                  </div>

                  {errors.form && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.form}</span>
                    </div>
                  )}

                  {/* Name & Roll Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-[#E63946] mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Roll / Reg Number *
                      </label>
                      <input
                        type="text"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        placeholder="e.g. 2026-CSE-042"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      />
                      {errors.rollNumber && (
                        <p className="text-[11px] text-[#E63946] mt-1">{errors.rollNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Department & Year of Study */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Department / Branch *
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      >
                        <option>Computer Science & Engineering</option>
                        <option>Mechanical Engineering</option>
                        <option>Electrical & Electronics Engineering</option>
                        <option>Civil Engineering</option>
                        <option>Arts & Humanities</option>
                        <option>Commerce & Management</option>
                        <option>Physical & Biological Sciences</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Year of Study *
                      </label>
                      <select
                        value={formData.yearOfStudy}
                        onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      >
                        <option>1st Year (Semester I / II)</option>
                        <option>2nd Year (Semester III / IV)</option>
                        <option>3rd Year (Semester V / VI)</option>
                      </select>
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@college.edu"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      />
                      {errors.email && (
                        <p className="text-[11px] text-[#E63946] mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Mobile Number (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-[#E63946] mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Blood Group (For Emergency Donor Registry) *
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                            formData.bloodGroup === bg
                              ? 'bg-[#E63946] text-white border-[#E63946]'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Areas of Interest */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Areas of Interest & Specialization
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {interestOptions.map((opt) => {
                        const checked = formData.areasOfInterest.includes(opt);
                        return (
                          <label
                            key={opt}
                            className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                              checked
                                ? 'bg-red-50/50 border-[#E63946] text-[#0B1F3A] font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleInterestToggle(opt)}
                              className="mt-0.5 rounded text-[#E63946] focus:ring-0"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Motivation Statement */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Why do you wish to serve in NSS? *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      placeholder="Briefly describe what community service means to you and how you wish to contribute..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                    />
                    {errors.motivation && (
                      <p className="text-[11px] text-[#E63946] mt-1">{errors.motivation}</p>
                    )}
                  </div>

                  {/* Previous Experience */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Previous Volunteering or Social Work Experience (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.pastExperience}
                      onChange={(e) => setFormData({ ...formData, pastExperience: e.target.value })}
                      placeholder="e.g. School scout/guide, Red Cross youth volunteer, tree plantation volunteer"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>

                  {/* Undertaking Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.undertaking}
                        onChange={(e) => setFormData({ ...formData, undertaking: e.target.checked })}
                        className="mt-0.5 rounded text-[#E63946] focus:ring-0"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I pledge to uphold the motto <strong>&quot;NOT ME BUT YOU&quot;</strong>, abide by the disciplinary guidelines of the college NSS unit, and commit to the minimum 120 annual service hours and residential camp attendance.
                      </span>
                    </label>
                    {errors.undertaking && (
                      <p className="text-[11px] text-[#E63946] mt-1">{errors.undertaking}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#071526] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-[#E63946]" />
                      <span>{submitting ? 'Submitting Application...' : 'Submit Volunteer Application'}</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2.5">
                      Your details are securely stored for unit administration and state university compliance only.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
