import React, { useState } from 'react';
import {
  Calendar,
  Users,
  FileText,
  Bell,
  Check,
  X,
  Archive,
  Eye,
  Filter,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Activity, Group, DocumentItem, Announcement, UserProfile, ContentStatus } from '../../types';
import { StorageDB } from '../../lib/storage';
import { StatusBadge, VisibilityBadge } from '../../components/StatusBadge';

interface AdminContentCMSViewProps {
  user: UserProfile;
  initialTab?: 'activities' | 'groups' | 'documents' | 'announcements';
  activities: Activity[];
  groups: Group[];
  documents: DocumentItem[];
  announcements: Announcement[];
  onRefresh: () => void;
}

export const AdminContentCMSView: React.FC<AdminContentCMSViewProps> = ({
  user,
  initialTab = 'activities',
  activities,
  groups,
  documents,
  announcements,
  onRefresh,
}) => {
  const [tab, setTab] = useState<'activities' | 'groups' | 'documents' | 'announcements'>(initialTab);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleUpdateActivityStatus = (id: string, newStatus: ContentStatus) => {
    StorageDB.updateActivity(id, {
      status: newStatus,
      approved_by: ['approved', 'published'].includes(newStatus) ? user.id : undefined,
    });
    onRefresh();
  };

  const handleUpdateDocStatus = (id: string, newStatus: ContentStatus) => {
    StorageDB.updateDocument(id, {
      status: newStatus,
      approved_by: ['approved', 'published'].includes(newStatus) ? user.id : undefined,
    });
    onRefresh();
  };

  const handleUpdateAnnStatus = (id: string, newStatus: ContentStatus) => {
    StorageDB.updateAnnouncement(id, {
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : undefined,
      approved_by: ['approved', 'published'].includes(newStatus) ? user.id : undefined,
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Content Approval & Publishing Workflow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enforces the verified pipeline: Draft &rarr; Pending Review &rarr; Approved &rarr; Published.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 text-xs font-semibold self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setTab('activities')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'activities' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Activities ({activities.length})
          </button>
          <button
            onClick={() => setTab('groups')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'groups' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Groups ({groups.length})
          </button>
          <button
            onClick={() => setTab('documents')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'documents' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Documents ({documents.length})
          </button>
          <button
            onClick={() => setTab('announcements')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'announcements' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Announcements ({announcements.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        {/* ACTIVITIES CMS */}
        {tab === 'activities' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3">Title & Type</th>
                  <th className="py-3 px-3">Locality</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Visibility</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {activities.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{a.title}</div>
                      <div className="text-[10px] text-slate-400">{a.activity_type}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{a.locality_name || 'Kisii Central'}</td>
                    <td className="py-3 px-3 text-slate-500 text-xs">
                      {new Date(a.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-3">
                      <VisibilityBadge visibility={a.visibility} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {a.status !== 'published' && (
                          <button
                            onClick={() => handleUpdateActivityStatus(a.id, 'published')}
                            className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold transition"
                          >
                            Publish
                          </button>
                        )}
                        {a.status === 'pending_review' && (
                          <button
                            onClick={() => handleUpdateActivityStatus(a.id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition"
                          >
                            Approve
                          </button>
                        )}
                        {a.status !== 'archived' && (
                          <button
                            onClick={() => handleUpdateActivityStatus(a.id, 'archived')}
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] transition"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* DOCUMENTS CMS */}
        {tab === 'documents' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3">Document Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Uploaded By</th>
                  <th className="py-3 px-3">Visibility</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">{d.title}</td>
                    <td className="py-3 px-3 text-slate-600">{d.category}</td>
                    <td className="py-3 px-3 text-slate-500">{d.uploader_name || 'Coordinator'}</td>
                    <td className="py-3 px-3">
                      <VisibilityBadge visibility={d.visibility} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {d.status !== 'published' && (
                          <button
                            onClick={() => handleUpdateDocStatus(d.id, 'published')}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition"
                          >
                            Publish
                          </button>
                        )}
                        {d.status !== 'archived' && (
                          <button
                            onClick={() => handleUpdateDocStatus(d.id, 'archived')}
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] transition"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANNOUNCEMENTS CMS */}
        {tab === 'announcements' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3">Announcement Title</th>
                  <th className="py-3 px-3">Author</th>
                  <th className="py-3 px-3">Visibility</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {announcements.map((an) => (
                  <tr key={an.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">{an.title}</td>
                    <td className="py-3 px-3 text-slate-500">{an.author_name || 'Admin'}</td>
                    <td className="py-3 px-3">
                      <VisibilityBadge visibility={an.visibility} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={an.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {an.status !== 'published' && (
                          <button
                            onClick={() => handleUpdateAnnStatus(an.id, 'published')}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition"
                          >
                            Publish
                          </button>
                        )}
                        {an.status !== 'archived' && (
                          <button
                            onClick={() => handleUpdateAnnStatus(an.id, 'archived')}
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] transition"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GROUPS CMS */}
        {tab === 'groups' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3">Group Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Locality</th>
                  <th className="py-3 px-3">Schedule</th>
                  <th className="py-3 px-3">Visibility</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {groups.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">{g.name}</td>
                    <td className="py-3 px-3 text-slate-600">{g.group_type}</td>
                    <td className="py-3 px-3">{g.locality_name || 'Kisii Central'}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {g.meeting_day} {g.meeting_time}
                    </td>
                    <td className="py-3 px-3">
                      <VisibilityBadge visibility={g.visibility} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          const nextStatus = g.status === 'active' ? 'inactive' : 'active';
                          StorageDB.updateGroup(g.id, { status: nextStatus });
                          onRefresh();
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition"
                      >
                        Toggle Status
                      </button>
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
