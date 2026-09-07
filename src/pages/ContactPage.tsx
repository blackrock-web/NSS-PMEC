import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, HeartPulse, Send, 
  CheckCircle2, ShieldCheck, HelpCircle, Building2 
} from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SITE_CONFIG } from '../data/config';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Enquiry',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.length < 15) {
      errs.message = 'Please provide a message with at least 15 characters';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-[#0B1F3A] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FCA5A5] mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>OFFICIAL INSTITUTIONAL DESK</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Contact NSS Cell
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Have a query regarding volunteer recruitment, community collaboration, or urgent blood donation requirements? Get in touch with our cell.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Office info & Emergency Blood Helpline (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Emergency Blood Helpline Box */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#E63946] mb-2">
                <HeartPulse className="w-4 h-4 animate-pulse" />
                <span>24/7 Emergency Blood Helpline</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Urgent Blood Donor Registry
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Our NSS unit maintains a verified student volunteer blood donor registry for government and district hospital emergencies across all major blood groups.
              </p>
              <div className="p-3 bg-white rounded-lg border border-red-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Donor Coordinator Hotline</div>
                  <div className="text-base font-extrabold text-[#E63946]">{SITE_CONFIG.bloodHelpline}</div>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E63946] text-white">
                  Available
                </span>
              </div>
            </div>

            {/* Institutional Office Location */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#0B1F3A] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E63946]" />
                <span>Campus Location & Postal Address</span>
              </h3>

              <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                <div>
                  <strong className="text-slate-800 block">NSS Administrative Office:</strong>
                  <span>{SITE_CONFIG.officeLocation}</span>
                </div>
                <div>
                  <strong className="text-slate-800 block">Postal Address:</strong>
                  <span>{SITE_CONFIG.collegeFullName}, {SITE_CONFIG.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                  <span>Office: <strong>{SITE_CONFIG.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                  <span>Email: <strong>{SITE_CONFIG.email}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                  <span>Working Hours: <strong>{SITE_CONFIG.workingHours}</strong></span>
                </div>
              </div>
            </div>

            {/* Programme Officer Desk */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs">
              <h3 className="font-bold text-sm text-[#0B1F3A] mb-3">
                Programme Officer Desk
              </h3>
              <div className="text-xs text-slate-600 space-y-1.5">
                <div>
                  Name: <strong className="text-slate-800">{SITE_CONFIG.programmeOfficerName}</strong>
                </div>
                <div>Designation: Assistant Professor & NSS Programme Officer (Unit I)</div>
                <div>Office Chamber: Room 104, Department Block</div>
                <div>Student Consultation: Mon & Thu (3:30 PM – 5:00 PM)</div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Collaboration Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-md">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B1F3A] mb-2">
                    Message Dispatched Successfully
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                    Thank you, <strong>{formData.name}</strong>. Your communication regarding &quot;{formData.subject}&quot; has been forwarded to the NSS Programme Officer and Student Secretarial Team. We usually respond within 24 to 48 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        category: 'General Enquiry',
                        subject: '',
                        message: ''
                      });
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#0B1F3A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#071526]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1F3A]">
                      Send an Official Communication
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      For community collaborations, student queries, or village outreach suggestions.
                    </p>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Ramesh Patel"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      />
                      {errors.name && (
                        <p className="text-[11px] text-[#E63946] mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ramesh@organization.org"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      />
                      {errors.email && (
                        <p className="text-[11px] text-[#E63946] mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Contact Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Inquiry Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                      >
                        <option>General Enquiry</option>
                        <option>Student Volunteer Enrolment</option>
                        <option>Emergency Blood Requirement</option>
                        <option>Village Community Collaboration / NGO</option>
                        <option>Activity Documentation & Certificate</option>
                        <option>Media & Press Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Subject Line *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Invitation for Joint Village Cleanliness Drive"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-[#E63946] mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Detailed Message *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please articulate your message or proposed initiative in detail..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B1F3A]"
                    />
                    {errors.message && (
                      <p className="text-[11px] text-[#E63946] mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#071526] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-[#E63946]" />
                      <span>{submitting ? 'Transmitting Message...' : 'Send Message to NSS Cell'}</span>
                    </button>
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
