import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { ReportItem } from '../../types';
import { SITE_CONFIG } from '../../data/config';
import { NssLogo } from '../common/NssLogo';

interface ReportDownloadModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export const ReportDownloadModal: React.FC<ReportDownloadModalProps> = ({
  report,
  onClose
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!report) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      // Simulate creating and downloading a real text document file
      const dummyContent = `=====================================================
NATIONAL SERVICE SCHEME (NSS) - OFFICIAL REPORT
${SITE_CONFIG.collegeFullName}
Affiliation: ${SITE_CONFIG.universityAffiliation}
Motto: NOT ME BUT YOU
=====================================================

TITLE: ${report.title}
ACADEMIC YEAR: ${report.academicYear}
CATEGORY: ${report.category}
PUBLICATION DATE: ${report.datePublished}
PREPARED BY: ${report.preparedBy}
VERIFIED BY: ${SITE_CONFIG.programmeOfficerName} (Programme Officer)

SUMMARY:
${report.description}

STATUS: Institutional Record (Phase 1 Official Archive)
Generated on: ${new Date().toLocaleDateString('en-GB')}
=====================================================`;

      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B1F3A] text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <NssLogo size={40} />
            <div>
              <div className="text-xs uppercase tracking-widest text-[#E63946] font-bold">
                Official Institutional Dossier
              </div>
              <h3 className="font-bold text-base text-white leading-snug">
                {report.academicYear} Document Archive
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <FileText className="w-8 h-8 text-[#0B1F3A] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{report.title}</h4>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                <span>Category: <strong className="text-slate-700">{report.category}</strong></span>
                <span>•</span>
                <span>Pages: <strong className="text-slate-700">{report.pages}</strong></span>
                <span>•</span>
                <span>Size: <strong className="text-slate-700">{report.fileSize}</strong></span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {report.description}
          </p>

          <div className="border-t border-slate-100 pt-3 text-xs text-slate-500 space-y-1.5">
            <div className="flex justify-between">
              <span>Compilation Committee:</span>
              <span className="font-medium text-slate-700">{report.preparedBy}</span>
            </div>
            <div className="flex justify-between">
              <span>Supervising Officer:</span>
              <span className="font-medium text-slate-700">{SITE_CONFIG.programmeOfficerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Archival Verification:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Unit Document
              </span>
            </div>
          </div>

          {downloaded && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dossier downloaded successfully to your local machine.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded hover:bg-white flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Summary</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0B1F3A] hover:bg-[#071526] rounded shadow flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Preparing File...' : 'Download Dossier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
