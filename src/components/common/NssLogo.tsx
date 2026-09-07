import React from 'react';

interface NssLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  collegeName?: string;
}

export const NssLogo: React.FC<NssLogoProps> = ({
  className = '',
  size = 48,
  showText = false,
  collegeName
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Authentic NSS Konark Sun Wheel Emblem */}
      <img
        src="/assets/nss-logo.svg"
        alt="National Service Scheme Official Emblem"
        width={size}
        height={size}
        className="shrink-0 transition-transform duration-300 hover:rotate-6 select-none"
        loading="eager"
      />

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black tracking-wider text-[#0B1F3A] text-lg leading-tight">NSS</span>
            <span className="text-[#E63946] font-bold text-base leading-tight">|</span>
            <span className="font-bold text-slate-800 text-sm tracking-tight leading-tight truncate max-w-[220px]">
              {collegeName || 'College Unit'}
            </span>
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#E63946] font-black uppercase">
            NOT ME BUT YOU
          </span>
        </div>
      )}
    </div>
  );
};

