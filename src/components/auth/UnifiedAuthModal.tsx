import React, { useState, useEffect } from 'react';
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
  QrCode,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAuth, Pending2FAState } from '../../context/AuthContext';
import { NssLogo } from '../common/NssLogo';
import { api } from '../../lib/api';
import type { Role } from '../../types';

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
  const { login, verify2FA, register, demoSwitch, isLoginOpen, closeLogin } = useAuth();
  const [mode, setMode] = useState<AuthViewMode>(initialMode);

  // Form Fields - Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields - 2FA Verification
  const [pending2FA, setPending2FA] = useState<Pending2FAState | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [masterAuthKey, setMasterAuthKey] = useState('');
  const [showMasterKey, setShowMasterKey] = useState(false);
  const [totpSetupInfo, setTotpSetupInfo] = useState<{
    secret: string;
    otpauthUrl: string;
    demoBypassCodes: string[];
    masterKeyHint: string;
  } | null>(null);

  // Form Fields - Registration (Normal Volunteer Cadet)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regAcademicYear, setRegAcademicYear] = useState('2025–26');
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

  useEffect(() => {
    if (mode === 'admin-2fa') {
      api.auth.getTotpSetup(pending2FA?.email).then((res) => {
        if (res.success && res.data) {
          setTotpSetupInfo(res.data);
        }
      });
    }
  }, [mode, pending2FA?.email]);

  const handleClose = () => {
    setError(null);
    setInfoMessage(null);
    setPending2FA(null);
    setTotpCode('');
    setMasterAuthKey('');
    if (propsOnClose) {
      propsOnClose();
    } else {
      closeLogin();
    }
  };

  const handleAuthComplete = (role?: Role) => {
    handleClose();
    if (onSuccess) onSuccess();
    const isAdminRole = role && role !== 'user' && role !== 'member' && role !== 'public';
    if (isAdminRole && onNavigateToAdmin) {
      onNavigateToAdmin();
    }
  };

  if (!isOpen) return null;

  // ----------------------------------------------------
  // Handler: Unified Login
  // ----------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    const res = await login({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (res.requiresAdmin2FA && res.pending2FA) {
      setPending2FA(res.pending2FA);
      setMode('admin-2fa');
      setInfoMessage(res.message || 'Administrative credentials recognized. Please enter your 6-digit TOTP code.');
      return;
    }

    if (res.success) {
      handleAuthComplete();
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  // ----------------------------------------------------
  // Handler: 2FA Verification
  // ----------------------------------------------------
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending2FA) return;

    setLoading(true);
    setError(null);

    const res = await verify2FA({
      email: pending2FA.email,
      tempToken: pending2FA.tempToken,
      totpCode: totpCode.trim(),
      masterAuthKey: masterAuthKey.trim() || undefined,
    });

    setLoading(false);

    if (res.success) {
      handleAuthComplete(pending2FA.role);
    } else {
      setError(res.error || 'Invalid verification credentials. Access denied.');
    }
  };

  // ----------------------------------------------------
  // Handler: User Registration
  // ----------------------------------------------------
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify and re-type.');
      return;
    }

    setLoading(true);
    const res = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      confirmPassword: regConfirmPassword,
      department: regDepartment.trim(),
      academicYear: regAcademicYear,
      phone: regPhone.trim(),
      rollNumber: regRollNumber.trim(),
    });
    setLoading(false);

    if (res.success) {
      handleAuthComplete('user');
    } else {
      setError(res.error || 'Registration failed. Please check the entered information.');
    }
  };

  // ----------------------------------------------------
  // Handler: Password Reset Request
  // ----------------------------------------------------
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await api.auth.forgotPassword(resetEmail.trim());
    setLoading(false);

    if (res.success) {
      setResetStep(2);
      if (res.data?.demoCode) {
        setResetCode(res.data.demoCode);
      }
      setInfoMessage(res.message || 'Verification code sent to your registered email.');
    } else {
      setError(res.error || 'Failed to request password reset.');
    }
  };

  // ----------------------------------------------------
  // Handler: Password Reset Complete
  // ----------------------------------------------------
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNewPassword !== resetConfirmPassword) {
      setError('Passwords do not match.');
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
      setResetSuccessMessage(res.message || 'Password reset successful!');
      setTimeout(() => {
        setMode('login');
        setEmail(resetEmail);
        setResetStep(1);
        setResetSuccessMessage(null);
      }, 2000);
    } else {
      setError(res.error || 'Password reset failed.');
    }
  };

  // ----------------------------------------------------
  // Handler: Instant Demo Switch
  // ----------------------------------------------------
  const handleDemoSwitch = async (targetRole: Role) => {
    setLoading(true);
    setError(null);
    const ok = await demoSwitch(targetRole);
    setLoading(false);
    if (ok) {
      handleAuthComplete(targetRole);
    } else {
      setError(`Failed to switch to role: ${targetRole}`);
    }
  };

  return (
    <div
      id="unified-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Band */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <NssLogo size="md" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {mode === 'login' && 'NSS Unified Portal Sign In'}
                {mode === 'register' && 'New Volunteer Cadet Registration'}
                {mode === 'forgot-password' && 'Reset Account Password'}
                {mode === 'admin-2fa' && 'Administrative 2FA Verification'}
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {mode === 'login' && 'Single login gateway for students, coordinators & leadership'}
                {mode === 'register' && 'Standard volunteer enrollment (strictly verified)'}
                {mode === 'forgot-password' && 'Enter your institutional email to recover access'}
                {mode === 'admin-2fa' && 'Time-based One-Time Password (TOTP) verification'}
              </p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert / Notification banners */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start space-x-3 text-rose-800 dark:text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {infoMessage && (
          <div className="mx-6 mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl flex items-start space-x-3 text-blue-850 dark:text-blue-200 text-xs">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
            <div>
              <p className="font-semibold">Notice</p>
              <p className="mt-0.5">{infoMessage}</p>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* ==================================================== */}
          {/* VIEW: LOGIN */}
          {/* ==================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    id="auth-forgot-pw-link"
                    type="button"
                    onClick={() => {
                      setMode('forgot-password');
                      setError(null);
                      setInfoMessage(null);
                    }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="auth-submit-login-btn"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  New student volunteer?{' '}
                  <button
                    id="auth-switch-to-register-btn"
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError(null);
                      setInfoMessage(null);
                    }}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Create a Volunteer Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* VIEW: ADMIN 2FA VERIFICATION */}
          {/* ==================================================== */}
          {mode === 'admin-2fa' && pending2FA && (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold">
                    Elevated Role Detected: {pending2FA.role.toUpperCase().replace(/_/g, ' ')}
                  </p>
                  <p className="mt-0.5">
                    Account: <span className="font-mono">{pending2FA.email}</span>. Please enter the 6-digit TOTP code generated by your Authenticator app.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  6-Digit Authenticator Code (TOTP)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-totp-input"
                    type="text"
                    required
                    maxLength={8}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\s+/g, ''))}
                    placeholder="e.g. 894216"
                    className="w-full pl-10 pr-4 py-2.5 font-mono text-center tracking-widest text-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Demo Evaluation Codes */}
              {totpSetupInfo && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-500 font-medium">Evaluation Demo TOTP Codes:</span>
                    <span className="text-[10px] font-mono text-slate-400">Secret: {totpSetupInfo.secret}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {totpSetupInfo.demoBypassCodes.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setTotpCode(code)}
                        className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono font-bold text-blue-700 dark:text-blue-300 transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Super Admin Level 2 Master Key Input */}
              {pending2FA.isSuperAdmin2 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                      Master Authorization Key (Level 2 Required)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowMasterKey(!showMasterKey)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      {showMasterKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                    <input
                      id="auth-master-key-input"
                      type={showMasterKey ? 'text' : 'password'}
                      required
                      value={masterAuthKey}
                      onChange={(e) => setMasterAuthKey(e.target.value)}
                      placeholder="Enter Master Level 2 Auth Key"
                      className="w-full pl-10 pr-4 py-2 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Evaluation Key:{' '}
                    <button
                      type="button"
                      onClick={() => setMasterAuthKey('MASTER-LEVEL2-KEY-9942')}
                      className="text-rose-600 dark:text-rose-400 font-mono underline hover:no-underline"
                    >
                      MASTER-LEVEL2-KEY-9942
                    </button>
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setPending2FA(null);
                    setError(null);
                  }}
                  className="w-1/3 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  id="auth-verify-2fa-btn"
                  type="submit"
                  disabled={loading || !totpCode}
                  className="w-2/3 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-indigo-700 hover:from-amber-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-md text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Enter Portal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* VIEW: REGISTER (NORMAL USER ONLY - NO ROLE SELECTION) */}
          {/* ==================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-center space-x-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>All registrations default strictly to Student Volunteer Cadet.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Institutional Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="student@college.edu.in"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={regRollNumber}
                    onChange={(e) => setRegRollNumber(e.target.value)}
                    placeholder="e.g. CS-2024-042"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Academic Year
                  </label>
                  <select
                    value={regAcademicYear}
                    onChange={(e) => setRegAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="2025–26">2025–26</option>
                    <option value="2024–25">2024–25</option>
                    <option value="2023–24">2023–24</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold rounded-xl text-sm shadow flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Cadet Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as Volunteer Cadet</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Already registered? <span className="font-semibold text-blue-600">Sign in here</span>
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* VIEW: FORGOT / RESET PASSWORD */}
          {/* ==================================================== */}
          {mode === 'forgot-password' && (
            <div className="space-y-4">
              {resetSuccessMessage ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    {resetSuccessMessage}
                  </p>
                  <p className="text-xs text-slate-500">Redirecting to sign in...</p>
                </div>
              ) : resetStep === 1 ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Enter Registered Institutional Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="your.email@college.edu.in"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="w-1/3 py-2.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Code</span>}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-center text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Set New Password'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Evaluation Quick Demo Role Switcher Strip */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Evaluation Tiers (5 Roles)</span>
            </span>
            <span className="text-[10px] text-slate-400">Click to preview portal</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 text-center">
            <button
              id="demo-switch-user"
              type="button"
              onClick={() => handleDemoSwitch('user')}
              className="px-1.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-200 truncate"
              title="Student Volunteer"
            >
              User
            </button>
            <button
              id="demo-switch-coordinator"
              type="button"
              onClick={() => handleDemoSwitch('coordinator')}
              className="px-1.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-purple-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] font-semibold text-purple-700 dark:text-purple-300 truncate"
              title="Cadre Coordinator"
            >
              Coordinator
            </button>
            <button
              id="demo-switch-admin"
              type="button"
              onClick={() => handleDemoSwitch('admin')}
              className="px-1.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] font-semibold text-blue-700 dark:text-blue-300 truncate"
              title="Programme Officer Admin"
            >
              Admin
            </button>
            <button
              id="demo-switch-super1"
              type="button"
              onClick={() => handleDemoSwitch('super_admin_1')}
              className="px-1.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 truncate"
              title="Regional Directorate"
            >
              Super 1
            </button>
            <button
              id="demo-switch-super2"
              type="button"
              onClick={() => handleDemoSwitch('super_admin_2')}
              className="px-1.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-lg text-[10px] font-semibold text-rose-700 dark:text-rose-300 truncate"
              title="Web Master Control Center"
            >
              Super 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
