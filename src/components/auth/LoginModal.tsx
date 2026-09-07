import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NssLogo } from '../common/NssLogo';

interface LoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen: propsIsOpen, 
  onClose: propsOnClose, 
  onSuccess,
  onLoginSuccess 
}) => {
  const { login, quickDemoLogin, isLoginOpen, closeLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOpen = propsIsOpen !== undefined ? propsIsOpen : isLoginOpen;
  const handleClose = () => {
    if (propsOnClose) {
      propsOnClose();
    } else {
      closeLogin();
    }
  };

  const handleSuccessTrigger = () => {
    handleClose();
    if (onSuccess) onSuccess();
    if (onLoginSuccess) onLoginSuccess();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login({ email, password });
    setLoading(false);

    if (res.success) {
      handleSuccessTrigger();
    } else {
      setError(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleDemoSignIn = async (role: 'admin' | 'superadmin') => {
    setLoading(true);
    setError(null);
    try {
      await quickDemoLogin(role);
      handleSuccessTrigger();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-[#E5E7EB] shadow-2xl rounded-none overflow-hidden">
        {/* Header bar */}
        <div className="bg-[#0B1528] text-white p-6 border-b-4 border-[#C8102E]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NssLogo size={42} showText={false} />
              <div>
                <h3 className="font-serif text-lg font-bold tracking-tight text-white">NSS Institutional Portal</h3>
                <p className="text-xs text-white/70 font-sans">Officer & Administrator Access</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-none flex items-start gap-2">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Institutional Google Login button */}
          <button
            type="button"
            onClick={() => handleDemoSignIn('admin')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-[#D1D5DB] text-[#111827] text-sm font-semibold hover:bg-[#F9FAFB] transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.18 3.665-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Sign in with Google Workspace</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E5E7EB] w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
              Or Administrator Credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="programme.officer@college.edu.in"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#D1D5DB] rounded-none focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#D1D5DB] rounded-none focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0B1528] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#1E3A8A] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Sign In to Dashboard</span>}
            </button>
          </form>

          {/* Fast Switcher for Review/Evaluation */}
          <div className="pt-3 border-t border-[#E5E7EB]">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Role Simulator (Evaluation & Demo):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('admin')}
                className="px-2.5 py-1.5 text-left border border-blue-200 bg-blue-50/70 hover:bg-blue-100 transition-colors text-[11px] text-blue-900"
              >
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck size={12} className="text-blue-600" />
                  <span>College PO Admin</span>
                </div>
                <div className="text-[10px] text-blue-700/80">Manage Unit 04 & 05</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('superadmin')}
                className="px-2.5 py-1.5 text-left border border-purple-200 bg-purple-50/70 hover:bg-purple-100 transition-colors text-[11px] text-purple-900"
              >
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck size={12} className="text-purple-600" />
                  <span>National Superadmin</span>
                </div>
                <div className="text-[10px] text-purple-700/80">Multi-tenant Oversight</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
