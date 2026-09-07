import React, { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  HardDrive,
  Table,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useTenant } from '../../context/TenantContext';
import type { TenantConfig } from '../../types';

export const TenantsManager: React.FC = () => {
  const { config, setCollegeId } = useTenant();
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provisioning, setProvisioning] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    collegeName: '',
    collegeFullName: '',
    unitNumber: 'Unit 01',
    universityAffiliation: '',
    programmeOfficerName: '',
    email: '',
    phone: '+91 98765 43210',
  });

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await api.tenant.listAll();
      if (res.success && res.data) {
        setTenants(res.data);
      }
    } catch (e) {
      console.error('Failed to load tenants:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisioning(true);

    try {
      const res = await api.tenant.provision(formData);
      if (res.success && res.data) {
        setTenants((prev) => [...prev, res.data!]);
        setIsModalOpen(false);
        setFormData({
          id: '',
          collegeName: '',
          collegeFullName: '',
          unitNumber: 'Unit 01',
          universityAffiliation: '',
          programmeOfficerName: '',
          email: '',
          phone: '+91 98765 43210',
        });
      }
    } catch (err) {
      console.error('Failed to provision tenant:', err);
    } finally {
      setProvisioning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <ShieldCheck size={14} />
            <span>Superadmin Institutional Multi-Tenant Management</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            College NSS Units & Cloud Tenants
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Provision and manage autonomous NSS college units, with automated Google Drive folder trees and Sheets databases.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A8A] transition-colors self-start md:self-auto"
        >
          <Plus size={14} />
          <span>Provision New College Unit</span>
        </button>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#0B1528]" size={18} />
            <span>Loading registered institutional units...</span>
          </div>
        ) : (
          tenants.map((tenant) => {
            const isCurrent = tenant.id === config.id;
            return (
              <div
                key={tenant.id}
                className={`bg-white border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isCurrent ? 'border-2 border-[#0B1528] ring-2 ring-[#0B1528]/10' : 'border-[#E5E7EB]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-700">
                      ID: {tenant.id}
                    </span>
                    {isCurrent ? (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active In Portal
                      </span>
                    ) : (
                      <button
                        onClick={() => setCollegeId(tenant.id)}
                        className="text-[10px] font-bold uppercase text-blue-700 hover:underline"
                      >
                        Switch To Unit
                      </button>
                    )}
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#0B1528] leading-tight mb-1">
                    {tenant.collegeName}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">{tenant.collegeFullName}</p>
                  <p className="text-[11px] text-[#C8102E] font-semibold">{tenant.unitNumber}</p>
                  <p className="text-[11px] text-gray-500">{tenant.universityAffiliation}</p>

                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs space-y-1.5 text-gray-600">
                    <div>
                      <span className="text-gray-400">Officer:</span>{' '}
                      <strong>{tenant.programmeOfficerName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span> {tenant.email}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 size={12} />
                    <span>Drive & Sheets Active</span>
                  </span>
                  <button
                    onClick={() => {
                      setCollegeId(tenant.id);
                      window.location.reload();
                    }}
                    className="font-bold text-[#0B1528] hover:underline"
                  >
                    View Portal →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Provision Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div className="bg-[#0B1528] text-white p-4 border-b-2 border-[#C8102E] flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white">
                Provision New Autonomous College Unit
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProvision} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 leading-relaxed text-[11px]">
                <strong>Automated Cloud Provisioning:</strong> This will create a separate data partition in Google Sheets and auto-generate the Google Drive folder structure (<code>/images</code>, <code>/reports</code>, <code>/gallery</code>, <code>/documents</code>).
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Tenant College Identifier (Slug / Subdomain)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. stxaviers, loyola, iitb"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full p-2 border border-gray-300 font-mono focus:outline-none focus:border-[#0B1528]"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Lowercase alphanumeric characters only</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    College Short Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="St. Xavier's College"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Unit Designation
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Unit 01 & 02"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Full Institutional Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="St. Xavier's Autonomous College, Mumbai"
                  value={formData.collegeFullName}
                  onChange={(e) => setFormData({ ...formData, collegeFullName: e.target.value })}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  University Affiliation
                </label>
                <input
                  type="text"
                  required
                  placeholder="Affiliated to University of Mumbai, NAAC 'A++'"
                  value={formData.universityAffiliation}
                  onChange={(e) => setFormData({ ...formData, universityAffiliation: e.target.value })}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Programme Officer Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Rajesh Sharma"
                    value={formData.programmeOfficerName}
                    onChange={(e) => setFormData({ ...formData, programmeOfficerName: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Officer Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="po.nss@xaviers.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={provisioning}
                  className="px-5 py-2 bg-[#0B1528] text-white font-bold uppercase tracking-wider hover:bg-[#1E3A8A] disabled:opacity-50 flex items-center gap-1.5"
                >
                  {provisioning && <Loader2 className="animate-spin" size={14} />}
                  <span>Provision Cloud Tenant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
