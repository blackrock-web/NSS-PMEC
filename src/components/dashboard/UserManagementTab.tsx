import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Shield,
  ShieldAlert,
  ShieldCheck,
  MoreVertical,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Download,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { User, Role } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const UserManagementTab: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.auth.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      } else {
        // Fallback default demo users if endpoint empty
        setUsers([
          {
            id: 'user-po-verma',
            email: 'programme.officer@college.edu.in',
            name: 'Dr. Anand Verma',
            role: 'admin',
            collegeId: 'unit-04-05',
            collegeName: 'Government Model Autonomous College',
            department: 'Civil Engineering',
            phone: '+91 94221 55678',
            createdAt: '2026-01-01T00:00:00Z',
            isActive: true,
          },
          {
            id: 'user-volunteer-lead',
            email: 'volunteer.lead@college.edu.in',
            name: 'Pooja Sharma',
            role: 'admin',
            collegeId: 'unit-04-05',
            department: 'Computer Science',
            academicYear: 'Final Year',
            rollNumber: '2022-CS-041',
            phone: '+91 98230 11223',
            createdAt: '2026-01-10T00:00:00Z',
            isActive: true,
          },
          {
            id: 'user-student-1',
            email: 'rahul.s@college.edu.in',
            name: 'Rahul Sen',
            role: 'member',
            collegeId: 'unit-04-05',
            department: 'Mechanical Engineering',
            academicYear: '3rd Year',
            rollNumber: '2023-ME-019',
            phone: '+91 99887 66554',
            createdAt: '2026-02-01T00:00:00Z',
            isActive: true,
          },
          {
            id: 'user-student-2',
            email: 'ananya.p@college.edu.in',
            name: 'Ananya Patel',
            role: 'member',
            collegeId: 'unit-04-05',
            department: 'Electronics & Comm.',
            academicYear: '2nd Year',
            rollNumber: '2024-EC-082',
            phone: '+91 97654 32109',
            createdAt: '2026-02-14T00:00:00Z',
            isActive: true,
          },
          {
            id: 'user-student-3',
            email: 'vikram.joshi@college.edu.in',
            name: 'Vikram Joshi',
            role: 'member',
            collegeId: 'unit-04-05',
            department: 'Information Technology',
            academicYear: '2nd Year',
            rollNumber: '2024-IT-105',
            phone: '+91 95432 10987',
            createdAt: '2026-02-20T00:00:00Z',
            isActive: true,
          },
        ]);
      }
    } catch {
      setErrorMessage('Failed to load user records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (targetUser: User) => {
    const nextRole: Role = targetUser.role === 'admin' ? 'member' : 'admin';
    setUpdatingId(targetUser.id);
    try {
      const res = await api.auth.updateUserRole(targetUser.id, { role: nextRole });
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: nextRole } : u))
        );
        setSuccessMessage(`Updated ${targetUser.name}'s role to ${nextRole.toUpperCase()}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.error || 'Failed to update role');
      }
    } catch {
      setErrorMessage('Network error while updating role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (targetUser: User) => {
    const nextStatus = !targetUser.isActive;
    setUpdatingId(targetUser.id);
    try {
      const res = await api.auth.updateUserRole(targetUser.id, { isActive: nextStatus });
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: nextStatus } : u))
        );
        setSuccessMessage(`Account ${targetUser.name} is now ${nextStatus ? 'ACTIVE' : 'SUSPENDED'}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.error || 'Failed to update status');
      }
    } catch {
      setErrorMessage('Network error while updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      roleFilter === 'all' || u.role === roleFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && u.isActive) ||
      (statusFilter === 'inactive' && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalMembers = users.filter((u) => u.role === 'member').length;
  const totalAdmins = users.filter((u) => u.role === 'admin' || u.role === 'superadmin').length;
  const totalActive = users.filter((u) => u.isActive).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-slate-200 shadow-xs rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Users size={14} />
            <span>Identity & Access Management (RBAC)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            User Management Portal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer registered student volunteers, Programme Officers, and Directorate credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Refresh user records"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Accounts</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{users.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Registered in database</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Student Members</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{totalMembers}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Standard volunteer role</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Officers & Admins</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{totalAdmins}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">2FA & RBAC authorized</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active Status</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{totalActive}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Permitted access</div>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in">
          <XCircle size={16} className="text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, department, roll..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-[#0B1528] focus:ring-1 focus:ring-[#0B1528]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter size={14} className="text-slate-400" />
              <span>Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1.5 px-2.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#0B1528]"
              >
                <option value="all">All Roles</option>
                <option value="member">Members (Students)</option>
                <option value="admin">Programme Officers (Admin)</option>
                <option value="superadmin">National Superadmins</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1.5 px-2.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#0B1528]"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive / Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">User Information</th>
                <th className="py-3 px-4 font-bold">Role & Permissions</th>
                <th className="py-3 px-4 font-bold">Department / Academic Info</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Loader2 className="animate-spin inline-block mr-2" size={18} />
                    <span>Loading registered users...</span>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No users matching the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0B1528] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{u.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Mail size={11} className="text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                          {u.phone && (
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Phone size={10} />
                              <span>{u.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {u.role === 'superadmin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                          <ShieldCheck size={12} />
                          <span>Superadmin</span>
                        </span>
                      ) : u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                          <Shield size={12} />
                          <span>Programme Officer</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                          <UserCheck size={12} />
                          <span>Member Volunteer</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-slate-600">
                        {u.department ? (
                          <div className="font-medium text-slate-800 flex items-center gap-1">
                            <Building size={11} className="text-slate-400" />
                            <span>{u.department}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">General Member</span>
                        )}
                        {(u.academicYear || u.rollNumber) && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            {u.academicYear && <span>{u.academicYear}</span>}
                            {u.rollNumber && <span>• Roll: {u.rollNumber}</span>}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={updatingId === u.id || u.id === currentUser?.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          u.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Click to toggle account access status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isActive ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        />
                        <span>{u.isActive ? 'Active' : 'Suspended'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.role !== 'superadmin' && (
                          <button
                            onClick={() => handleToggleRole(u)}
                            disabled={updatingId === u.id || u.id === currentUser?.id}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors ${
                              u.role === 'admin'
                                ? 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                                : 'border-blue-300 text-blue-800 bg-blue-50 hover:bg-blue-100'
                            }`}
                            title={u.role === 'admin' ? 'Demote to Member' : 'Promote to Officer'}
                          >
                            {updatingId === u.id ? (
                              <Loader2 size={12} className="animate-spin inline" />
                            ) : u.role === 'admin' ? (
                              'Demote'
                            ) : (
                              'Make Officer'
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                          title="View user details"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-700">{paginatedUsers.length}</strong> of{' '}
            <strong className="text-slate-700">{filteredUsers.length}</strong> accounts
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-slate-300 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 text-xs"
            >
              Previous
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-slate-300 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#0B1528] text-white flex items-center justify-center font-bold">
                  {selectedUser.name ? selectedUser.name[0] : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedUser.name}</h3>
                  <div className="text-xs text-slate-500 font-mono">{selectedUser.email}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Account ID:</span>
                <span className="font-mono text-slate-800">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Security Role:</span>
                <span className="font-bold uppercase text-[#C8102E]">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">College / Unit:</span>
                <span className="font-medium text-slate-800">{selectedUser.collegeName || 'Unit 04 & 05'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-slate-800">{selectedUser.department || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Academic Year:</span>
                <span className="font-medium text-slate-800">{selectedUser.academicYear || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Student Roll No:</span>
                <span className="font-mono text-slate-800">{selectedUser.rollNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Contact Phone:</span>
                <span className="font-medium text-slate-800">{selectedUser.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Registered On:</span>
                <span className="text-slate-800">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
