import React from 'react';
import { UnifiedAuthModal } from '../components/auth/UnifiedAuthModal';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, HeartPulse, Award, Users, CheckCircle2 } from 'lucide-react';
import { NssLogo } from '../components/common/NssLogo';
import { useTenant } from '../context/TenantContext';

interface AuthPageProps {
  onNavigate: (path: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { config } = useTenant();

  // If already authenticated, redirect to admin or home
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        onNavigate('/admin');
      } else {
        onNavigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, onNavigate]);

  return (
    <div className="min-h-[85vh] bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Institutional Trust & Mission */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <NssLogo size={48} showText={false} />
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#C8102E]">
                Government of India • Ministry of Youth Affairs
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1528] tracking-tight">
                National Service Scheme
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {config.collegeFullName || 'Unit 04 & 05 Institutional Portal'}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Single Unified Portal for Students, Volunteers & Officers
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access official service hour verifications, blood donation drives, national camp enrollment, and institutional reports under one unified identity.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-md shadow-2xs">
                <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Student & Volunteer Access</div>
                  <p className="text-[11px] text-slate-500">Track 240+ mandatory service hours, shramdaan participation, and download certificates.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-md shadow-2xs">
                <HeartPulse className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">24/7 Emergency Blood Donor Registry</div>
                  <p className="text-[11px] text-slate-500">Real-time emergency blood requests and voluntary donor notifications.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-md shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Administrative Governance</div>
                  <p className="text-[11px] text-slate-500">Strict server-enforced RBAC and 2FA passcode authentication for Programme Officers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Embedded Unified Auth Box */}
        <div className="lg:col-span-6">
          <UnifiedAuthModal
            isOpen={true}
            initialMode="login"
            onSuccess={() => onNavigate('/')}
            onNavigateToAdmin={() => onNavigate('/admin')}
          />
        </div>
      </div>
    </div>
  );
};
