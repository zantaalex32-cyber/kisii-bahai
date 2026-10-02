import React, { useState } from 'react';
import { Bell, Plus, Search, Filter, X, Send } from 'lucide-react';
import { Announcement, UserProfile } from '../types';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { canViewAnnouncement, hasPermission } from '../lib/permissions';
import { StorageDB } from '../lib/storage';

interface AnnouncementsViewProps {
  user: UserProfile;
  announcements: Announcement[];
  onRefresh: () => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  user,
  announcements,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'members' | 'coordinators'>('members');

  const canCreate = hasPermission(user.role, 'announcements.create');
  const canPublish = hasPermission(user.role, 'announcements.publish');

  // Filter announcements strictly by user permission
  const authorizedAnnouncements = announcements.filter((a) => canViewAnnouncement(user.role, a));

  const filtered = authorizedAnnouncements.filter((a) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const cluster = StorageDB.getCluster();
    const initialStatus = canPublish ? 'published' : 'pending_review';

    StorageDB.addAnnouncement({
      cluster_id: cluster.id,
      title,
      content,
      visibility,
      status: initialStatus,
      published_at: canPublish ? new Date().toISOString() : undefined,
      created_by: user.id,
      author_name: user.full_name,
      approved_by: canPublish ? user.id : undefined,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setContent('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cluster Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verified official communications, retreat alerts, and administrative updates for Kisii Cluster.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements by keyword..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
          <p className="text-sm font-semibold text-slate-700">No authorized announcements found</p>
          <p className="text-xs text-slate-400 mt-1">
            Check back later for new notices from the cluster administration.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((ann) => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      )}

      {/* Create Announcement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {canPublish ? 'Draft & Publish Announcement' : 'Submit Announcement for Review'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Venue Change for Monthly Reflection Meeting"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Audience Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-amber-500 bg-white"
                >
                  <option value="members">Cluster Members</option>
                  <option value="public">General Public</option>
                  <option value="coordinators">Coordinators Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Announcement Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write clear, factual information about timings, logistics, or deadlines..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{canPublish ? 'Publish Announcement' : 'Submit for Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
