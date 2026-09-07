import React, { useEffect, useState } from 'react';
import { History, Shield, RefreshCw, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { AuditLogEntry } from '../../types';

export const AuditLogTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.audit.list();
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Shield size={14} />
            <span>Immutable Security & System Audit Trail</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            Activity & Mutation Logs
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Real-time audit log of all administrative actions, volunteer approvals, and cloud changes recorded in Google Sheets.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors self-start md:self-auto disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-[#E5E7EB] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#0B1528]" size={18} />
            <span>Retrieving audit stream from Google Sheets...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No audit records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-[#0B1528] font-sans">
                      {log.actorEmail}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-gray-100 border border-gray-200 font-sans text-gray-700">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#C8102E]">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 uppercase text-gray-500 font-sans text-[10px]">
                      {log.domain}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-gray-800 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-2.5 px-4 text-right text-gray-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
