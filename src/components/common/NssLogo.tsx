import React from 'react';

interface NssLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const NssLogo: React.FC<NssLogoProps> = ({
  className = '',
  size = 48,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Authentic NSS Konark Sun Wheel Badge SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:rotate-12"
        aria-label="National Service Scheme Emblem"
      >
        {/* Outer Navy Ring */}
        <circle cx="50" cy="50" r="48" fill="#0B1F3A" stroke="#FFFFFF" strokeWidth="1.5" />
        
        {/* Outer Gold/White Accent Ring */}
        <circle cx="50" cy="50" r="43" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Red Field representing youthful vigor and sacrifice */}
        <circle cx="50" cy="50" r="39" fill="#E63946" stroke="#FFFFFF" strokeWidth="1.5" />
        
        {/* Inner Navy Ring representing the cosmos */}
        <circle cx="50" cy="50" r="28" fill="#0B1F3A" stroke="#FFFFFF" strokeWidth="1" />
        
        {/* Konark Chariot Wheel Spokes (8 major spokes representing 24 hours of continuous service) */}
        <g stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round">
          {/* 8 Main Spokes */}
          <line x1="50" y1="22" x2="50" y2="78" />
          <line x1="22" y1="50" x2="78" y2="50" />
          <line x1="30.2" y1="30.2" x2="69.8" y2="69.8" />
          <line x1="69.8" y1="30.2" x2="30.2" y2="69.8" />
        </g>
        
        {/* Hub detail beads */}
        <circle cx="50" cy="50" r="10" fill="#E63946" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
        
        {/* 8 Outer rim spoke nodes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 33.5 * Math.cos(rad);
          const y = 50 + 33.5 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="2" fill="#FFFFFF" />;
        })}
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-wider text-[#0B1F3A] text-lg leading-tight">NSS</span>
            <span className="text-[#E63946] font-bold text-base leading-tight">|</span>
            <span className="font-semibold text-slate-800 text-sm tracking-tight leading-tight">[COLLEGE NAME]</span>
          </div>
          <span className="text-[10px] tracking-widest text-[#E63946] font-bold uppercase">
            NOT ME BUT YOU
          </span>
        </div>
      )}
    </div>
  );
};
