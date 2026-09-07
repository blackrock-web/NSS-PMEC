import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Loader2,
  Mail,
  Phone,
} from 'lucide-react';
import { api } from '../../lib/api';
import type { TeamMember } from '../../types';

export const TeamManager: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    designation: 'Programme Officer',
    roleType: 'programme_officer',
    department: '',
    bio: '',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: '',
    phone: '',
    badge: 'Programme Officer',
  });

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.team.list();
      if (res.success && res.data) {
        setTeam(res.data);
      }
    } catch (e) {
      console.error('Failed to load team:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      designation: 'Programme Officer',
      roleType: 'programme_officer',
      department: '',
      bio: '',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      email: '',
      phone: '',
      badge: 'Programme Officer',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploads.uploadImage(file, 'images');
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, image: res.data!.url }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMember) {
        const res = await api.team.update(editingMember.id, formData);
        if (res.success && res.data) {
          setTeam((prev) => prev.map((m) => (m.id === editingMember.id ? res.data! : m)));
          setIsModalOpen(false);
        }
      } else {
        const res = await api.team.create(formData);
        if (res.success && res.data) {
          setTeam((prev) => [...prev, res.data!]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Failed to save team member:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this officer/coordinator record?')) return;
    try {
      await api.team.delete(id);
      setTeam((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Delete team member failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C8102E] uppercase tracking-wider mb-1">
            <Users size={14} />
            <span>NSS Leadership & Volunteer Coordinators</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1528] tracking-tight">
            Officers & Student Cadre Roster
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Manage institutional Programme Officers, Faculty Advisors, and Student Volunteer Secretaries.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1528] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A8A] transition-colors self-start md:self-auto"
        >
          <Plus size={14} />
          <span>Add Cadre Member</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="bg-white border border-[#E5E7EB] shadow-xs p-6">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#0B1528]" size={18} />
            <span>Loading team records...</span>
          </div>
        ) : team.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No team members found. Click "Add Cadre Member" to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="border border-gray-200 bg-[#F8FAFC] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-16 h-16 object-cover border border-gray-300 shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#0B1528]">{member.name}</div>
                      <div className="text-[11px] text-[#C8102E] font-semibold">{member.designation}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{member.department}</div>
                      {member.badge && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-blue-50 text-blue-800 border border-blue-200">
                          {member.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{member.bio}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                    {member.email && <Mail size={12} title={member.email} />}
                    {member.phone && <Phone size={12} title={member.phone} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1 text-gray-600 hover:text-[#0B1528]"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div className="bg-[#0B1528] text-white p-4 border-b-2 border-[#C8102E] flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-white">
                {editingMember ? 'Edit Officer / Coordinator Profile' : 'Add New Cadre Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Anand Verma, Ph.D."
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="Programme Officer (Unit 04)"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Role Type</label>
                  <select
                    value={formData.roleType}
                    onChange={(e) => setFormData({ ...formData, roleType: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  >
                    <option value="programme_officer">Programme Officer</option>
                    <option value="leadership">Institutional Leadership / Patron</option>
                    <option value="student_coordinator">Student Volunteer Coordinator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Academic Department</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Department of Sociology & Social Work"
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Photo (Google Drive Asset)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                  <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 cursor-pointer font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                    {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                    <span>Upload to Drive</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="officer@college.edu.in"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Bio / Profile Note</label>
                <textarea
                  rows={3}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Key accomplishments, community work focus, years of NSS advisory..."
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:border-[#0B1528]"
                />
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
                  disabled={saving}
                  className="px-5 py-2 bg-[#0B1528] text-white font-bold uppercase tracking-wider hover:bg-[#1E3A8A] disabled:opacity-50"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
