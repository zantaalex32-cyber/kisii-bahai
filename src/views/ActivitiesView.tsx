import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, MapPin, Tag, X } from 'lucide-react';
import { Activity, UserProfile, Locality } from '../types';
import { ActivityCard } from '../components/ActivityCard';
import { canViewActivity, hasPermission } from '../lib/permissions';
import { StorageDB } from '../lib/storage';

interface ActivitiesViewProps {
  user: UserProfile;
  activities: Activity[];
  localities: Locality[];
  onNavigate: (path: string) => void;
  onRefresh: () => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  user,
  activities,
  localities,
  onNavigate,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localityFilter, setLocalityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New activity form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState('Study Circle');
  const [localityId, setLocalityId] = useState(localities[0]?.id || 'loc-01');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('2026-10-15T14:00');
  const [endTime, setEndTime] = useState('2026-10-15T16:00');
  const [visibility, setVisibility] = useState<'public' | 'members' | 'coordinators'>('members');

  const canCreate = hasPermission(user.role, 'activities.create');
  const canApprove = hasPermission(user.role, 'activities.approve');

  // Filter activities strictly by permission first
  const authorizedActivities = activities.filter((act) => canViewActivity(user.role, act, user.id));

  // Then apply user UI filters
  const filtered = authorizedActivities.filter((act) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (localityFilter !== 'all' && (act.locality_name || 'Kisii Central') !== localityFilter) return false;
    if (typeFilter !== 'all' && act.activity_type !== typeFilter) return false;
    if (statusFilter !== 'all' && act.status !== statusFilter) return false;
    return true;
  });

  const uniqueLocalities = Array.from(new Set(authorizedActivities.map((a) => a.locality_name || 'Kisii Central')));
  const uniqueTypes = Array.from(new Set(authorizedActivities.map((a) => a.activity_type)));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const loc = localities.find((l) => l.id === localityId);
    const cluster = StorageDB.getCluster();

    const initialStatus = canApprove ? 'published' : 'pending_review';

    StorageDB.addActivity({
      cluster_id: cluster.id,
      locality_id: localityId,
      locality_name: loc?.name || 'Kisii Central',
      title,
      description,
      activity_type: activityType,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      location,
      visibility,
      status: initialStatus,
      created_by: user.id,
      creator_name: user.full_name,
      approved_by: canApprove ? user.id : undefined,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
    setLocation('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cluster Activities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse and coordinate approved educational, devotional, and youth activities in Kisii Cluster.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by title, keyword, or venue..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-teal-500 focus:bg-white transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Locality */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={localityFilter}
              onChange={(e) => setLocalityFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden text-slate-800"
            >
              <option value="all">All Localities</option>
              {uniqueLocalities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Activity Type */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Tag className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden text-slate-800"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status (Visible to coordinators/admins) */}
          {hasPermission(user.role, 'activities.view') && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium focus:outline-hidden text-slate-800"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="pending_review">Pending Review</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          )}

          {(searchQuery || localityFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setLocalityFilter('all');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Activities Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
          <p className="text-sm font-semibold text-slate-700">No authorized activities found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onViewDetails={(id) => onNavigate(`/activities/${id}`)}
            />
          ))}
        </div>
      )}

      {/* Add Activity Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {canApprove ? 'Create & Publish Activity' : 'Draft Activity for Review'}
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
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Children's Festival & Moral Showcase"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Activity Type
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500 bg-white"
                >
                  <option value="Study Circle">Study Circle</option>
                  <option value="Devotional Meeting">Devotional Meeting</option>
                  <option value="Children's Class">Children's Class</option>
                  <option value="Junior Youth Group">Junior Youth Group</option>
                  <option value="Cluster Gathering">Cluster Gathering</option>
                  <option value="Reflection Meeting">Reflection Meeting</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Locality
                  </label>
                  <select
                    value={localityId}
                    onChange={(e) => setLocalityId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    {localities.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    <option value="members">Members Only</option>
                    <option value="public">Public</option>
                    <option value="coordinators">Coordinators Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location / Venue *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Milimani Community Center, Kisii"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description & Agenda
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly state the purpose, study unit, or program details..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
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
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition shadow-xs"
                >
                  {canApprove ? 'Publish Immediately' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
