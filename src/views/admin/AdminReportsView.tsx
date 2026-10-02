import React from 'react';
import { BarChart3, Calendar, Users, Layers, FileText, Bell, CheckCircle2, Shield } from 'lucide-react';
import { StorageDB } from '../../lib/storage';

export const AdminReportsView: React.FC = () => {
  const activities = StorageDB.getActivities();
  const groups = StorageDB.getGroups();
  const users = StorageDB.getUsers();
  const accessRequests = StorageDB.getAccessRequests();
  const documents = StorageDB.getDocuments();
  const announcements = StorageDB.getAnnouncements();
  const localities = StorageDB.getLocalities();

  const publishedActivities = activities.filter((a) => a.status === 'published');
  const activeGroups = groups.filter((g) => g.status === 'active');
  const activeUsers = users.filter((u) => u.status === 'active');
  const pendingRequests = accessRequests.filter((r) => r.status === 'pending');
  const publishedDocs = documents.filter((d) => d.status === 'published');

  // Breakdown by activity type
  const activityTypeCounts: Record<string, number> = {};
  activities.forEach((a) => {
    activityTypeCounts[a.activity_type] = (activityTypeCounts[a.activity_type] || 0) + 1;
  });

  // Breakdown by group type
  const groupTypeCounts: Record<string, number> = {};
  groups.forEach((g) => {
    groupTypeCounts[g.group_type] = (groupTypeCounts[g.group_type] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Cluster Statistical Reports & Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Factual summary of active educational initiatives and community resources across Kisii Cluster.
        </p>
      </div>

      {/* Policy Banner: Non-competitive Factual Reporting */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <span>
          <strong>Ethical Reporting Standard:</strong> This portal displays factual, constructive statistical aggregates. It strictly avoids individual or locality comparative rankings.
        </span>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Total Activities</span>
          <div className="text-2xl font-extrabold text-teal-700">{activities.length}</div>
          <span className="text-[10px] text-teal-600 font-medium">{publishedActivities.length} published</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Active Groups</span>
          <div className="text-2xl font-extrabold text-blue-700">{activeGroups.length}</div>
          <span className="text-[10px] text-blue-600 font-medium">Study & Youth</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Active Users</span>
          <div className="text-2xl font-extrabold text-indigo-700">{activeUsers.length}</div>
          <span className="text-[10px] text-indigo-600 font-medium">Verified members</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Pending Requests</span>
          <div className="text-2xl font-extrabold text-amber-700">{pendingRequests.length}</div>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting review</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Published Docs</span>
          <div className="text-2xl font-extrabold text-emerald-700">{publishedDocs.length}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Approved resources</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Announcements</span>
          <div className="text-2xl font-extrabold text-purple-700">{announcements.length}</div>
          <span className="text-[10px] text-purple-600 font-medium">Cluster notices</span>
        </div>
      </div>

      {/* Aggregate Categorical Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Activities by Category</span>
          </h3>
          <div className="space-y-2.5">
            {Object.entries(activityTypeCounts).map(([type, count]) => {
              const pct = Math.round((count / activities.length) * 100) || 0;
              return (
                <div key={type} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{type}</span>
                    <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Group Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Groups by Educational Endeavour</span>
          </h3>
          <div className="space-y-2.5">
            {Object.entries(groupTypeCounts).map(([type, count]) => {
              const pct = Math.round((count / groups.length) * 100) || 0;
              return (
                <div key={type} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{type}</span>
                    <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
