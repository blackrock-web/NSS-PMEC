import React, { useState, useMemo } from 'react';
import { FileText, Download, Filter, Calendar, FileCheck, ShieldCheck, Eye, Search } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ReportDownloadModal } from '../components/ui/ReportDownloadModal';
import { REPORTS_DATA } from '../data/reports';
import { ReportItem } from '../types';

export const ReportsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeReportForModal, setActiveReportForModal] = useState<ReportItem | null>(null);

  const categories = [
    'All',
    'Annual',
    'Special Camp',
    'Audit & Finance',
    'Blood Donation',
    'Notice'
  ];

  const years = ['All', '2025–26', '2024–25', '2023–24'];

  const filteredReports = useMemo(() => {
    return REPORTS_DATA.filter((rep) => {
      const matchCat =
        selectedCategory === 'All' ||
        rep.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchYear = selectedYear === 'All' || rep.academicYear === selectedYear;
      const matchSearch =
        !searchQuery.trim() ||
        rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.preparedBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchYear && matchSearch;
    });
  }, [selectedCategory, selectedYear, searchQuery]);

  return (
    <div className="w-full bg-[#F7F8FA] min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-[#0B1F3A] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#FCA5A5] mb-4">
              <FileCheck className="w-3.5 h-3.5" />
              <span>OFFICIAL INSTITUTIONAL RECORDS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Reports & Documents
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Official annual dossiers, special camp logs, financial utilization statements, and circulars submitted to university authorities.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0B1F3A] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Academic Year & Search */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Session:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0B1F3A]"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-48 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dossiers..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="text-xs text-slate-500 mb-6 font-medium">
          Showing <strong>{filteredReports.length}</strong> official documents available for institutional reference
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0B1F3A] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0B1F3A] text-white">
                      {rep.category}
                    </span>
                    <span className="text-xs font-semibold text-[#E63946]">
                      {rep.academicYear}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{rep.datePublished}</span>
                  </div>

                  <h3 className="font-bold text-base text-[#0B1F3A] leading-snug">
                    {rep.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {rep.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>
                      Pagination: <strong className="text-slate-700">{rep.pages} pages</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Archive Size: <strong className="text-slate-700">{rep.fileSize}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Prepared by: <strong className="text-slate-700">{rep.preparedBy}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setActiveReportForModal(rep)}
                  className="px-4 py-2 text-xs font-bold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>Preview & Info</span>
                </button>
                <button
                  onClick={() => setActiveReportForModal(rep)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0B1F3A] hover:bg-[#071526] rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-[#E63946]" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal */}
      <ReportDownloadModal
        report={activeReportForModal}
        onClose={() => setActiveReportForModal(null)}
      />
    </div>
  );
};
