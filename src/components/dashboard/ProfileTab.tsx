import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  ShieldCheck,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

export const ProfileTab: React.FC = () => {
  const { user, role } = useAuth();
  const { config } = useTenant();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('+91 94221 55678');
  const [department, setDepartment] = useState('Civil Engineering');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Status
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      setProfileSuccess('Profile information updated successfully.');
      setTimeout(() => setProfileSuccess(null), 3000);
    }, 600);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordSuccess('Account security credentials updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 3000);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white p-6 border border-slate-200 shadow-xs rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0B1528] text-white font-bold text-xl flex items-center justify-center border-2 border-[#C8102E] shadow-sm">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{user?.name || 'Administrator'}</h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#C8102E] text-white rounded-xs font-bold">
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {config.collegeName} • {config.unitNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="font-semibold">2FA & RBAC Enforced</span>
          </div>
        </div>
      </div>

      {/* Grid: Profile Details & Password Change */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <UserIcon size={16} className="text-slate-600" />
            <h3 className="font-bold text-slate-900 text-sm">Official Officer Profile</h3>
          </div>

          {profileSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email (Fixed)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-md cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Contact Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Faculty / Department
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              {savingProfile ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* Account Security & Password */}
        <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-[#C8102E]" />
              <h3 className="font-bold text-slate-900 text-sm">Security & Passcode</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              {showPasswords ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{showPasswords ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>

          {passwordSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={14} className="text-red-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleSavePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                New Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword || !newPassword}
              className="w-full py-2 bg-[#C8102E] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#9B0D22] transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-60"
            >
              {savingPassword ? <Loader2 className="animate-spin" size={14} /> : <KeyRound size={14} />}
              <span>Update Password Credentials</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
