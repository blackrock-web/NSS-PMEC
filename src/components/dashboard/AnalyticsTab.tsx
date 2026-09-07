import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Users,
  HeartPulse,
  Award,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  TreePine,
  CheckCircle2,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export const AnalyticsTab: React.FC = () => {
  const { config } = useTenant();
  const [selectedYear, setSelectedYear] = useState('2025-26');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Monthly Service Hours Data
  const monthlyData = [
    { month: 'Jul', hours: 820, volunteers: 110, events: 4 },
    { month: 'Aug', hours: 1450, volunteers: 230, events: 7 },
    { month: 'Sep', hours: 2100, volunteers: 340, events: 9 },
    { month: 'Oct', hours: 1980, volunteers: 310, events: 8 },
    { month: 'Nov', hours: 1750, volunteers: 290, events: 6 },
    { month: 'Dec', hours: 2600, volunteers: 410, events: 11 },
    { month: 'Jan', hours: 2840, volunteers: 430, events: 12 },
    { month: 'Feb', hours: 3150, volunteers: 480, events: 14 },
    { month: 'Mar', hours: 1760, volunteers: 250, events: 5 },
  ];

  const maxHours = Math.max(...monthlyData.map((d) => d.hours));

  // Category Distribution
  const categoryStats = [
    { label: 'Blood Donation Drives', hours: 4820, percentage: 26, color: 'bg-red-500' },
    { label: 'Swachh Bharat & Cleanliness', hours: 4100, percentage: 22, color: 'bg-emerald-500' },
    { label: 'Tree Plantation & Ecology', hours: 3200, percentage: 17, color: 'bg-green-600' },
    { label: 'Special Village Winter Camp', hours: 3850, percentage: 21, color: 'bg-purple-500' },
    { label: 'Social & Health Awareness', hours: 2480, percentage: 14, color: 'bg-blue-500' },
  ];

  // Department Breakdown
  const departmentBreakdown = [
    { name: 'Computer Science & Engineering', volunteers: 142, hours: 5680, pct: 31 },
    { name: 'Mechanical Engineering', volunteers: 88, hours: 3520, pct: 20 },
    { name: 'Information Technology', volunteers: 84, hours: 3360, pct: 19 },
    { name: 'Electronics & Communication', volunteers: 76, hours: 3040, pct: 17 },
    { name: 'Civil Engineering', volunteers: 60, hours: 2850, pct: 13 },
  ];

  const totalHoursDelivered = monthlyData.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-slate-200 shadow-xs rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <TrendingUp size={14} />
            <span>Institutional Impact & Metrics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            NSS Unit Analytics & Statistics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry on mandatory volunteer hours, blood donor drives, and community outreach.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5">
            <Calendar size={13} className="text-slate-500" />
            <span className="font-medium">Session:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="2025-26">2025-26 (Current)</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-[#0B1528] hover:bg-[#1E3A8A] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download size={13} />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Shramdaan Hours
            </span>
            <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              <span>+18.4%</span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            {totalHoursDelivered.toLocaleString()} hrs
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Clock size={12} className="text-slate-400" />
            <span>Target: 24,000 hrs (76% achieved)</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Volunteers
            </span>
            <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              <span>+24.0%</span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-blue-700 mt-2 font-mono">
            450
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Users size={12} className="text-slate-400" />
            <span>Unit 04: 250 • Unit 05: 200</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Blood Units Collected
            </span>
            <span className="flex items-center text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
              <HeartPulse size={12} />
              <span>Critical</span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#C8102E] mt-2 font-mono">
            1,240 <span className="text-sm font-sans font-normal text-slate-500">units</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" />
            <span>3,720 estimated lives saved</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Saplings Planted
            </span>
            <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              <span>+32%</span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2 font-mono">
            2,850
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TreePine size={12} className="text-emerald-600" />
            <span>94% survival rate in adopted village</span>
          </div>
        </div>
      </div>

      {/* Main Visual: Monthly Service Hours Delivered */}
      <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-600" />
              <span>Monthly Service Hours Delivered (Academic Session 2025-26)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Cumulative community volunteer hours submitted by Unit 04 & 05 volunteers.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 bg-[#0B1528] rounded-xs inline-block" />
              <span>Service Hours</span>
            </span>
          </div>
        </div>

        {/* SVG Interactive Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="h-56 flex items-end justify-between gap-3 px-2 border-b border-slate-200">
            {monthlyData.map((d, index) => {
              const heightPct = Math.round((d.hours / maxHours) * 100);
              const isHovered = hoveredBarIndex === index;

              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 z-20 bg-slate-900 text-white text-[10px] rounded-md py-1.5 px-2.5 shadow-lg whitespace-nowrap animate-in fade-in duration-100">
                      <div className="font-bold">{d.month} 2025-26</div>
                      <div>{d.hours} Service Hours</div>
                      <div className="text-slate-300">{d.volunteers} Active Volunteers</div>
                    </div>
                  )}

                  {/* Value on top of bar */}
                  <span
                    className={`text-[10px] font-mono mb-1 transition-opacity ${
                      isHovered ? 'text-slate-900 font-bold opacity-100' : 'text-slate-400 opacity-80'
                    }`}
                  >
                    {d.hours}
                  </span>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[42px] rounded-t-sm transition-all duration-300 ${
                      isHovered
                        ? 'bg-[#C8102E] shadow-sm'
                        : 'bg-[#0B1528] hover:bg-[#1E3A8A]'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Month Labels */}
          <div className="flex justify-between gap-3 px-2 pt-2 text-xs font-semibold text-slate-500">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 text-center">
                {d.month}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column: Category Breakdown + Department Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 border border-slate-200 rounded-lg shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Focus Area Distribution</h3>
            <span className="text-[11px] text-slate-400 font-medium">By Hours</span>
          </div>

          <div className="space-y-3.5">
            {categoryStats.map((cat) => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-600">{cat.hours.toLocaleString()} hrs</span>
                    <span className="font-bold text-slate-900 font-mono">({cat.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 border border-slate-200 rounded-lg shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Departmental Engagement</h3>
            <span className="text-[11px] text-slate-400 font-medium">Cadre Strength</span>
          </div>

          <div className="space-y-3">
            {departmentBreakdown.map((dept) => (
              <div
                key={dept.name}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-md border border-slate-200/80 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{dept.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {dept.volunteers} Active Volunteers • {dept.hours.toLocaleString()} hrs
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {dept.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
