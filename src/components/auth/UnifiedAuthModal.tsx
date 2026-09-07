import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  Phone,
  Hash,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NssLogo } from '../common/NssLogo';
import { api } from '../../lib/api';

export type AuthViewMode = 'login' | 'register' | 'forgot-password' | 'admin-2fa';

interface UnifiedAuthModalProps {
  isOpen?: boolean;
  initialMode?: AuthViewMode;
  onClose?: () => void;
  onSuccess?: () => void;
  onNavigateToAdmin?: () => void;
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({
  isOpen: propsIsOpen,
  initialMode = 'login',
  onClose: propsOnClose,
  onSuccess,
  onNavigateToAdmin,
}) => {
  const { login, register, quickDemoLogin, isLoginOpen, closeLogin } = useAuth();
  const [mode, setMode] = useState<AuthViewMode>(initialMode);

  // Form Fields - Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [requestAdminAccess, setRequestAdminAccess] = useState(false);

  // Form Fields - Admin 2FA Verification
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);

  // Form Fields - Registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regAcademicYear, setRegAcademicYear] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRollNumber, setRegRollNumber] = useState('');

  // Form Fields - Password Reset
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const isOpen = propsIsOpen !== undefined ? propsIsOpen : isLoginOpen;

  const handleClose = () => {
    setError(null);
    setInfoMessage(null);
    if (propsOnClose) {
      propsOnClose();
    } else {
      closeLogin();
    }
  };

  const handleAuthComplete = (wasAdminFlow = false) => {
    handleClose();
    if (onSuccess) onSuccess();
    if (wasAdminFlow && onNavigateToAdmin) {
      onNavigateToAdmin();
    }
  };

  if (!isOpen) return null;

  // ----------------------------------------------------
  // Handler: Login (Step 1 or Unified)
  // ----------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    const res = await login({
      email: email.trim(),
      password,
      requestAdminAccess,
    });

    setLoading(false);

    if (res.requiresAdmin2FA) {
      // Backend verified credentials and confirmed user has admin role; transition to 2FA verification step
      setMode('admin-2fa');
      setInfoMessage(res.message || 'Administrator authorization required. Please verify with your official admin passcode.');
      return;
    }

    if (res.success) {
      handleAuthComplete(requestAdminAccess);
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  // ----------------------------------------------------
  // Handler: Admin 2FA / Passcode (Step 2)
  // ----------------------------------------------------
  const handleAdmin2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login({
      email: email.trim(),
      password,
      requestAdminAccess: true,
      adminPasscode: adminPasscode.trim(),
    });

    setLoading(false);

    if (res.success) {
      handleAuthComplete(true);
    } else {
      setError(res.error || 'Invalid administrator verification code. Access was denied.');
    }
  };

  // ----------------------------------------------------
  // Handler: Register (Normal User by default)
  // ----------------------------------------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    const res = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      confirmPassword: regConfirmPassword,
      department: regDepartment.trim() || undefined,
      academicYear: regAcademicYear || undefined,
      phone: regPhone.trim() || undefined,
      rollNumber: regRollNumber.trim() || undefined,
    });

    setLoading(false);

    if (res.success) {
      handleAuthComplete(false);
    } else {
      setError(res.error || 'Registration failed. Please check your information.');
    }
  };

  // ----------------------------------------------------
  // Handler: Forgot Password - Request Code
  // ----------------------------------------------------
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await api.auth.forgotPassword(resetEmail.trim());
    setLoading(false);

    if (res.success) {
      setResetStep(2);
      if (res.data?.demoCode) {
        setInfoMessage(`Verification code dispatched. (Preview code: ${res.data.demoCode})`);
      } else {
        setInfoMessage('If an account exists for this email, a verification code has been dispatched.');
      }
    } else {
      setError(res.error || 'Unable to request password reset code.');
    }
  };

  // ----------------------------------------------------
  // Handler: Forgot Password - Reset Password
  // ----------------------------------------------------
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNewPassword !== resetConfirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await api.auth.resetPassword({
      email: resetEmail.trim(),
      code: resetCode.trim(),
      newPassword: resetNewPassword,
      confirmPassword: resetConfirmPassword,
    });

    setLoading(false);

    if (res.success) {
      setResetSuccessMessage('Your password has been successfully reset! You may now sign in.');
      setTimeout(() => {
        setMode('login');
        setEmail(resetEmail);
        setResetStep(1);
        setResetSuccessMessage(null);
      }, 2000);
    } else {
      setError(res.error || 'Failed to reset password. Please check your verification code.');
    }
  };

  // ----------------------------------------------------
  // Fast Evaluation Demo Sign In
  // ----------------------------------------------------
  const handleFastDemoSignIn = async (role: 'member' | 'admin' | 'superadmin') => {
    setLoading(true);
    setError(null);
    try {
      await quickDemoLogin(role);
      handleAuthComplete(role === 'admin' || role === 'superadmin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="unified-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-[#0B1528] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#C8102E]">
          <div className="flex items-center gap-3">
            <NssLogo size={36} showText={false} />
            <div>
              <div className="font-serif text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>NSS Institutional Portal</span>
                {mode === 'admin-2fa' && (
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-[#C8102E] text-white rounded-xs">
                    Admin 2FA
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">
                {mode === 'login' && 'Unified Access for Volunteers & Administrators'}
                {mode === 'register' && 'Student & Volunteer Account Registration'}
                {mode === 'forgot-password' && 'Self-Service Password Recovery'}
                {mode === 'admin-2fa' && 'Administrative Security Verification'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Navigation Tabs */}
        {mode !== 'admin-2fa' && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setInfoMessage(null);
              }}
              className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                mode === 'login'
                  ? 'border-[#0B1528] text-[#0B1528] bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
                setInfoMessage(null);
              }}
              className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                mode === 'register'
                  ? 'border-[#0B1528] text-[#0B1528] bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              New Registration
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot-password');
                setError(null);
                setInfoMessage(null);
              }}
              className={`py-3 px-4 text-center transition-colors border-b-2 ${
                mode === 'forgot-password'
                  ? 'border-[#0B1528] text-[#0B1528] bg-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Recovery
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Alerts */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-start gap-2 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <div>
                <span className="font-semibold">Authentication Error: </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-md flex items-start gap-2 animate-in fade-in">
              <ShieldCheck size={16} className="shrink-0 mt-0.5 text-blue-600" />
              <span>{infoMessage}</span>
            </div>
          )}

          {resetSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
              <span>{resetSuccessMessage}</span>
            </div>
          )}

          {/* MODE 1: UNIFIED LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email / Institutional ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu.in or officer@college.edu.in"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot-password')}
                    className="text-xs text-blue-700 hover:text-blue-900 font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Administrator Access Checkbox (Server-side RBAC enforced) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requestAdminAccess}
                    onChange={(e) => setRequestAdminAccess(e.target.checked)}
                    className="mt-0.5 rounded-sm border-slate-300 text-[#0B1528] focus:ring-[#0B1528]"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Shield size={13} className="text-[#C8102E]" />
                      <span>Request Administrator Access</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      For authorized Programme Officers and Directorate personnel. Requires backend privilege verification & 2FA passcode.
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span>{requestAdminAccess ? 'Verify & Continue as Administrator' : 'Sign In to Portal'}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-600">
                <span>New volunteer or student? </span>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#C8102E] hover:underline"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: ADMIN 2FA VERIFICATION (Step 2) */}
          {mode === 'admin-2fa' && (
            <form onSubmit={handleAdmin2FASubmit} className="space-y-4">
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-md text-xs text-amber-900 flex items-start gap-2.5">
                <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-950">Administrative Verification Required</div>
                  <p className="text-[11px] text-amber-800/90 mt-0.5">
                    Account <strong className="font-semibold text-amber-950">{email}</strong> has verified administrative privileges. Enter your institutional security passcode or 2FA token to unlock admin management.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Administrator Passcode / Verification Token
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    required
                    autoFocus
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    placeholder="Enter official admin verification code"
                    className="w-full pl-9 pr-10 py-2.5 text-sm font-mono tracking-widest border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Validated securely on the backend. Never hardcoded on client devices.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setAdminPasscode('');
                    setError(null);
                  }}
                  className="w-1/3 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading || !adminPasscode}
                  className="w-2/3 py-2.5 bg-[#C8102E] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#9B0D22] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Authenticate & Enter Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: UNIFIED REGISTRATION */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800">Registration Notice: </span>
                All student registrations create a Member account with access to volunteer applications and certificates. Administrative privileges are provisioned server-side by institutional officers.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Priya Deshmukh"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="student@college.edu.in"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Profile Information */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Academic Information (Optional)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Department / Branch
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2 text-slate-400" size={14} />
                      <input
                        type="text"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Academic Year
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-2 text-slate-400" size={14} />
                      <select
                        value={regAcademicYear}
                        onChange={(e) => setRegAcademicYear(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#0B1528]"
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="Final Year">Final Year</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Roll / Student ID
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2 text-slate-400" size={14} />
                      <input
                        type="text"
                        value={regRollNumber}
                        onChange={(e) => setRegRollNumber(e.target.value)}
                        placeholder="e.g. 2024-CS-084"
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2 text-slate-400" size={14} />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Complete Registration</span>}
              </button>

              <div className="text-center pt-2 text-xs text-slate-600">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#0B1528] hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: FORGOT PASSWORD */}
          {mode === 'forgot-password' && (
            <div className="space-y-4">
              {resetStep === 1 ? (
                <form onSubmit={handleRequestResetCode} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter the email address associated with your NSS portal account. We will dispatch a 6-digit verification code to reset your password.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Registered Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="your.email@college.edu.in"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="w-1/3 py-2 border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !resetEmail}
                      className="w-2/3 py-2 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Send Reset Code</span>}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                  <p className="text-xs text-slate-600">
                    Verification code dispatched to <strong>{resetEmail}</strong>. Enter the code and your new password.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      6-Digit Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        placeholder="123456"
                        className="w-full pl-9 pr-3 py-2 text-sm font-mono tracking-widest border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <input
                        type="password"
                        required
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <input
                        type="password"
                        required
                        value={resetConfirmPassword}
                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setResetStep(1)}
                      className="w-1/3 py-2 border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !resetCode || !resetNewPassword}
                      className="w-2/3 py-2 bg-[#C8102E] text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-[#9B0D22] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Update Password</span>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Quick Evaluation / Role Simulator */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Evaluation Access (1-Click Switch):
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Backend RBAC</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFastDemoSignIn('member')}
                disabled={loading}
                className="p-2 text-left border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors rounded-md text-[11px] group"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <UserIcon size={12} className="text-slate-600" />
                  <span>Student</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">Member Role</div>
              </button>

              <button
                type="button"
                onClick={() => handleFastDemoSignIn('admin')}
                disabled={loading}
                className="p-2 text-left border border-blue-200 bg-blue-50/70 hover:bg-blue-100 transition-colors rounded-md text-[11px] group"
              >
                <div className="font-bold text-blue-900 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-blue-600" />
                  <span>College PO</span>
                </div>
                <div className="text-[10px] text-blue-700/80 truncate">Unit 04 & 05</div>
              </button>

              <button
                type="button"
                onClick={() => handleFastDemoSignIn('superadmin')}
                disabled={loading}
                className="p-2 text-left border border-purple-200 bg-purple-50/70 hover:bg-purple-100 transition-colors rounded-md text-[11px] group"
              >
                <div className="font-bold text-purple-900 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-purple-600" />
                  <span>Directorate</span>
                </div>
                <div className="text-[10px] text-purple-700/80 truncate">Superadmin</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
