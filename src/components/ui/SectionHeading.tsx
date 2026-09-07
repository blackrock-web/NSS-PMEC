import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
  action?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  centered = false,
  dark = false,
  action
}) => {
  return (
    <div
      className={`mb-10 sm:mb-14 flex flex-col ${
        centered ? 'items-center text-center' : 'items-start text-left'
      } ${action ? 'md:flex-row md:items-end md:justify-between gap-6' : ''}`}
    >
      <div className={`${centered ? 'max-w-3xl mx-auto' : 'max-w-3xl border-l-4 border-[#E63946] pl-5 sm:pl-6'}`}>
        {badge && (
          <div className="mb-2">
            <span
              className={`text-xs font-black uppercase tracking-[0.3em] inline-block ${
                dark ? 'text-[#FCA5A5]' : 'text-[#E63946]'
              }`}
            >
              {badge}
            </span>
          </div>
        )}
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight ${
            dark ? 'text-white' : 'text-[#0B1F3A]'
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-3 text-sm sm:text-base leading-relaxed ${
              dark ? 'text-slate-300' : 'text-[#6B7280]'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="mt-4 md:mt-0 shrink-0">{action}</div>}
    </div>
  );
};
