import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Key, CheckCircle2, Lock } from 'lucide-react';
import { UserProfile, Locality } from '../types';
import { ROLE_LABELS, ROLE_PERMISSIONS } from '../lib/permissions';
import { StorageDB } from '../lib/storage';

interface ProfileViewProps {
  user: UserProfile;
  localities: Locality[];
  onRefresh: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, localities, onRefresh }) => {
  const [phoneVisibility, setPhoneVisibility] = useState(user.phone_visibility || 'coordinators');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const roleMeta = ROLE_LABELS[user.role];
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  const userLocality = localities.find((l) => l.id === user.locality_id);

  const handleSavePrivacy = () => {
    StorageDB.updateUser(user.id, { phone_visibility: phoneVisibility });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-slate-200 shadow-xs"
            />
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {user.full_name.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{user.full_name}</h1>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
                {roleMeta.label}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{userLocality ? userLocality.name : 'Kisii Cluster'}</span>
              <span>• Status: <strong className="text-emerald-700 capitalize">{user.status}</strong></span>
            </div>
          </div>
        </div>

        {/* Contact & Locality Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              Email Address
            </span>
            <div className="text-slate-800 font-medium">{user.email}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              Phone Number
            </span>
            <div className="text-slate-800 font-medium">{user.phone || 'Not specified'}</div>
          </div>
        </div>

        {/* Contact Visibility Privacy Controls */}
        <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-700" />
              <h4 className="text-xs font-bold text-teal-950">Phone Privacy & Visibility</h4>
            </div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-teal-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Updated!
              </span>
            )}
          </div>
          <p className="text-[11px] text-teal-800/80 leading-relaxed">
            The contact directory never exposes your private phone number publicly. You control who can view it:
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={phoneVisibility}
              onChange={(e) => setPhoneVisibility(e.target.value as any)}
              className="text-xs px-3 py-1.5 rounded-xl border border-teal-300 bg-white text-slate-800 font-medium focus:outline-hidden"
            >
              <option value="admins">Admins Only (Maximum Privacy)</option>
              <option value="coordinators">Coordinators & Admins</option>
              <option value="members">All Cluster Members</option>
            </select>
            <button
              onClick={handleSavePrivacy}
              className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition"
            >
              Save Preference
            </button>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Inspector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">
            Granted Granular Permissions ({permissions.length})
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          The Kisii Cluster Portal enforces strict, permission-based Row Level Security (RLS). Below are the active permissions granted to your current role (<strong>{user.role}</strong>):
        </p>

        {permissions.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500">
            No privileged administrative permissions granted. You have standard public visibility.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
            {permissions.map((perm) => (
              <div
                key={perm}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="truncate">{perm}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
