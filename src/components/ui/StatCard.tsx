import React, { useEffect, useState, useRef } from 'react';

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  note?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  suffix = '+',
  label,
  note,
  icon
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.25 }
    );

    const currentElem = elementRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let start = 0;
    const duration = 1600; // ms
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasAnimated, value]);

  return (
    <div
      ref={elementRef}
      className="bg-white border border-[#E5E7EB] rounded-sm p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 relative group overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1F3A] tracking-tight tabular-nums flex items-baseline">
          <span>{count.toLocaleString()}</span>
          <span className="text-[#E63946] ml-0.5">{suffix}</span>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-sm bg-[#0B1F3A] text-white flex items-center justify-center group-hover:bg-[#E63946] transition-colors duration-200">
            {icon}
          </div>
        )}
      </div>

      <div className="text-[11px] font-black text-[#6B7280] uppercase tracking-[0.2em]">
        {label}
      </div>

      {note && (
        <div className="text-xs text-slate-500 mt-1.5 leading-normal">
          {note}
        </div>
      )}

      {/* Decorative geometric accent line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#E63946] group-hover:w-full transition-all duration-300" />
    </div>
  );
};
