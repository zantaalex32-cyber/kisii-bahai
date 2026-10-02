import React, { useState } from 'react';
import { UserCheck, Check, X, Shield, Calendar, MapPin, Mail, Phone, FileText } from 'lucide-react';
import { AccessRequest, RoleName, UserProfile } from '../../types';
import { StorageDB } from '../../lib/storage';
import { StatusBadge } from '../../components/StatusBadge';
import { ROLE_LABELS } from '../../lib/permissions';

interface AdminAccessRequestsViewProps {
  user: UserProfile;
  accessRequests: AccessRequest[];
  onRefresh: () => void;
}

export const AdminAccessRequestsView: React.FC<AdminAccessRequestsViewProps> = ({
  user,
  accessRequests,
  onRefresh,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [assignedRole, setAssignedRole] = useState<RoleName>('member');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const pendingRequests = accessRequests.filter((r) => r.status === 'pending');
  const pastRequests = accessRequests.filter((r) => r.status !== 'pending');

  const handleConfirmAction = () => {
    if (!selectedRequest || !actionType) return;

    if (actionType === 'approve') {
      StorageDB.updateAccessRequest(selectedRequest.id, {
        status: 'approved',
        assigned_role: assignedRole,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      });

      // Create profile for approved user if needed
      StorageDB.updateUser(`usr-${Date.now()}`, {
        id: `usr-${Date.now()}`,
        full_name: selectedRequest.full_name,
        email: selectedRequest.email,
        phone: selectedRequest.phone,
        locality_id: selectedRequest.locality_id,
        cluster_id: selectedRequest.cluster_id,
        role: assignedRole,
        status: 'active',
        phone_visibility: 'members',
      });
    } else {
      StorageDB.updateAccessRequest(selectedRequest.id, {
        status: 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      });
    }

    setSelectedRequest(null);
    setActionType(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Access Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review community membership applications, verify locality, and assign appropriate permissions.
        </p>
      </div>

      {/* Pending Requests Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Pending Applications ({pendingRequests.length})
            </h2>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No pending access requests at this time.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{req.full_name}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                      Pending Approval
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {req.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {req.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {req.locality_name || 'Kisii Central'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    “{req.reason}”
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setActionType('reject');
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setActionType('approve');
                      setAssignedRole('member');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shadow-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Assign Role</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Reviewed Requests */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Reviewed Applications History ({pastRequests.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Applicant</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Locality</th>
                <th className="py-2.5 px-3">Assigned Role</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Decision Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pastRequests.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 px-3 font-semibold text-slate-900">{r.full_name}</td>
                  <td className="py-3 px-3 text-slate-500">{r.email}</td>
                  <td className="py-3 px-3">{r.locality_name || 'Kisii Central'}</td>
                  <td className="py-3 px-3 font-medium capitalize">{r.assigned_role || '—'}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-xs">
                    {r.reviewed_at ? new Date(r.reviewed_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval / Rejection Modal */}
      {selectedRequest && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {actionType === 'approve'
                ? `Approve Access for ${selectedRequest.full_name}`
                : `Reject Access Request for ${selectedRequest.full_name}`}
            </h3>

            {actionType === 'approve' ? (
              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  Assign the appropriate cluster permission role for{' '}
                  <strong>{selectedRequest.full_name}</strong> ({selectedRequest.email}):
                </p>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Select Assigned Role:
                  </label>
                  <select
                    value={assignedRole}
                    onChange={(e) => setAssignedRole(e.target.value as RoleName)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="member">Member — Standard community access</option>
                    <option value="coordinator">Coordinator — Activity & group planning</option>
                    <option value="cluster_admin">Cluster Admin — Content approval & users</option>
                  </select>
                </div>

                <div className="p-3 bg-teal-50 rounded-xl text-teal-800 border border-teal-200 text-[11px] leading-relaxed">
                  <strong>Role details:</strong> {ROLE_LABELS[assignedRole].description}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to decline this access request? The decision will be recorded in the audit trail.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedRequest(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2 rounded-xl text-white font-semibold text-xs transition shadow-xs ${
                  actionType === 'approve'
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
