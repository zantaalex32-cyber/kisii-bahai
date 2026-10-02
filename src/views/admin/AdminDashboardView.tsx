import React from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  Layers,
  FileText,
  Bell,
  ScrollText,
  Plus,
  ArrowRight,
  Shield,
  Activity as ActivityIcon,
  CheckCircle2,
} from 'lucide-react';
import { StorageDB } from '../../lib/storage';
import { UserProfile } from '../../types';

interface AdminDashboardViewProps {
  user: UserProfile;
  onNavigate: (path: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ user, onNavigate }) => {
  const users = StorageDB.getUsers();
  const accessRequests = StorageDB.getAccessRequests();
  const pendingRequests = accessRequests.filter((r) => r.status === 'pending');
  const activities = StorageDB.getActivities();
  const groups = StorageDB.getGroups();
  const documents = StorageDB.getDocuments();
  const announcements = StorageDB.getAnnouncements();
  const auditLogs = StorageDB.getAuditLogs();

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, path: '/admin/users', color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Access Requests', value: pendingRequests.length, icon: UserCheck, path: '/admin/access-requests', color: 'text-amber-600 bg-amber-50', alert: pendingRequests.length > 0 },
    { label: 'Upcoming Activities', value: activities.length, icon: Calendar, path: '/admin/activities', color: 'text-teal-600 bg-teal-50' },
    { label: 'Active Groups', value: groups.length, icon: Layers, path: '/admin/groups', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Published Documents', value: documents.length, icon: FileText, path: '/admin/documents', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Announcements', value: announcements.length, icon: Bell, path: '/admin/announcements', color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/10 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Kisii Cluster Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrative Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-xl leading-relaxed">
            Central management console for Kisii Cluster. Review access requests, approve educational content, index knowledge bases, and inspect audit logs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/admin/access-requests')}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shrink-0 self-start sm:self-auto"
        >
          <UserCheck className="w-4 h-4" />
          <span>Review {pendingRequests.length} Pending Requests</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => onNavigate(stat.path)}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition text-left group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {stat.alert && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 group-hover:text-amber-800 transition">
                  {stat.value}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5 line-clamp-1">
                  {stat.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Administrative Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate('/activities')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-300 text-center transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900">Add Activity</span>
          </button>

          <button
            onClick={() => onNavigate('/groups')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-center transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">Add Group</span>
          </button>

          <button
            onClick={() => onNavigate('/documents')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-300 text-center transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-900">Upload Document</span>
          </button>

          <button
            onClick={() => onNavigate('/announcements')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-300 text-center transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900">Announcement</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/users')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-300 text-center transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-purple-900">Manage Users</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/access-requests')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-300 text-center transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-rose-900">Review Requests</span>
          </button>
        </div>
      </div>

      {/* Recent Administrative Actions (Audit Logs) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Recent Administrative Actions (Audit Logs)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/admin/audit')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-slate-900 px-2 py-0.5 rounded bg-slate-100">
                    {log.action}
                  </span>
                  <span className="text-slate-500 font-medium">on {log.entity_type}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  By: <strong className="text-slate-600">{log.user_email || 'System'}</strong>
                  {log.metadata?.title && ` • "${log.metadata.title}"`}
                  {log.metadata?.applicant && ` • "${log.metadata.applicant}"`}
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">
                {new Date(log.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
