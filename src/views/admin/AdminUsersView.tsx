import React, { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { UserProfile, RoleName, Locality } from '../../types';
import { StorageDB } from '../../lib/storage';
import { ROLE_LABELS } from '../../lib/permissions';
import { StatusBadge } from '../../components/StatusBadge';

interface AdminUsersViewProps {
  currentUser: UserProfile;
  users: UserProfile[];
  localities: Locality[];
  onRefresh: () => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  currentUser,
  users,
  localities,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [localityFilter, setLocalityFilter] = useState('all');

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editRole, setEditRole] = useState<RoleName>('member');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');

  const filteredUsers = users.filter((u) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (localityFilter !== 'all' && u.locality_id !== localityFilter) return false;
    return true;
  });

  const handleSaveUser = () => {
    if (!selectedUser) return;

    // Check escalation protection: Cluster admin cannot promote to super_admin
    if (currentUser.role !== 'super_admin' && editRole === 'super_admin') {
      alert('Security Exception: Only Super Admins can assign the Super Admin role.');
      return;
    }

    StorageDB.updateUser(selectedUser.id, {
      role: editRole,
      status: editStatus,
    });

    setSelectedUser(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          User Directory & Access Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage member accounts, role assignments, and account status across Kisii Cluster.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-teal-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-500">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden text-slate-800"
            >
              <option value="all">All Roles</option>
              <option value="member">Member</option>
              <option value="coordinator">Coordinator</option>
              <option value="cluster_admin">Cluster Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {/* Locality Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-500">Locality:</span>
            <select
              value={localityFilter}
              onChange={(e) => setLocalityFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden text-slate-800"
            >
              <option value="all">All Localities</option>
              {localities.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || roleFilter !== 'all' || localityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setLocalityFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-3">User Profile</th>
                <th className="py-3 px-3">Email & Contact</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Locality</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => {
                const loc = localities.find((l) => l.id === u.locality_id);
                const roleMeta = ROLE_LABELS[u.role];
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        {u.avatar_url ? (
                          <img
                            src={u.avatar_url}
                            alt={u.full_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                            {u.full_name.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-slate-900">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      <div>{u.email}</div>
                      {u.phone && <div className="text-[10px] text-slate-400">{u.phone}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${roleMeta.badgeColor}`}>
                        {roleMeta.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{loc?.name || 'Kisii Central'}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setEditRole(u.role);
                          setEditStatus(u.status === 'suspended' ? 'suspended' : 'active');
                        }}
                        className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Manage User Access</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm">{selectedUser.full_name}</div>
                <div className="text-slate-500">{selectedUser.email}</div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as RoleName)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-teal-500"
                >
                  <option value="member">Member</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="cluster_admin">Cluster Admin</option>
                  {currentUser.role === 'super_admin' && (
                    <option value="super_admin">Super Admin</option>
                  )}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-teal-500"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended (Revoke Access)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
