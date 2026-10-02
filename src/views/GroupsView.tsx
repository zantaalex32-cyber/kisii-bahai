import React, { useState } from 'react';
import { Users, Search, Plus, Filter, MapPin, Tag, X } from 'lucide-react';
import { Group, UserProfile, Locality, GroupType } from '../types';
import { GroupCard } from '../components/GroupCard';
import { canViewByVisibility, hasPermission } from '../lib/permissions';
import { StorageDB } from '../lib/storage';

interface GroupsViewProps {
  user: UserProfile;
  groups: Group[];
  localities: Locality[];
  onNavigate: (path: string) => void;
  onRefresh: () => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  user,
  groups,
  localities,
  onNavigate,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [localityFilter, setLocalityFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [groupType, setGroupType] = useState<GroupType>('Study Circle');
  const [localityId, setLocalityId] = useState(localities[0]?.id || 'loc-01');
  const [meetingDay, setMeetingDay] = useState('Sunday');
  const [meetingTime, setMeetingTime] = useState('14:00 - 16:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'members' | 'coordinators'>('members');

  const canCreate = hasPermission(user.role, 'groups.create');

  // Filter groups strictly by user visibility authorization first
  const authorizedGroups = groups.filter((g) => canViewByVisibility(user.role, g.visibility));

  const filtered = authorizedGroups.filter((g) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (typeFilter !== 'all' && g.group_type !== typeFilter) return false;
    if (localityFilter !== 'all' && (g.locality_name || 'Kisii Central') !== localityFilter) return false;
    return true;
  });

  const uniqueLocalities = Array.from(new Set(authorizedGroups.map((g) => g.locality_name || 'Kisii Central')));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    const loc = localities.find((l) => l.id === localityId);
    const cluster = StorageDB.getCluster();

    StorageDB.addGroup({
      cluster_id: cluster.id,
      locality_id: localityId,
      locality_name: loc?.name || 'Kisii Central',
      name,
      group_type: groupType,
      description,
      meeting_day: meetingDay,
      meeting_time: meetingTime,
      location,
      visibility,
      status: 'active',
      created_by: user.id,
      facilitator_name: user.full_name,
    });

    setIsCreateModalOpen(false);
    setName('');
    setDescription('');
    setLocation('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cluster Groups
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Study circles, devotional meetings, children classes, and junior youth groups across Kisii.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Register Group</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups by name, book title, or location..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-teal-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Group Type */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Tag className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden text-slate-800"
            >
              <option value="all">All Group Types</option>
              <option value="Study Circle">Study Circle</option>
              <option value="Devotional Meeting">Devotional Meeting</option>
              <option value="Children's Class">Children's Class</option>
              <option value="Junior Youth Group">Junior Youth Group</option>
              <option value="Cluster Gathering">Cluster Gathering</option>
              <option value="Other">Other</option>
            </select>
          </div>

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

          {(searchQuery || typeFilter !== 'all' || localityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setLocalityFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Groups Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
          <p className="text-sm font-semibold text-slate-700">No authorized groups found</p>
          <p className="text-xs text-slate-400 mt-1">
            Check your search parameters or select a different locality.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onViewDetails={(id) => onNavigate(`/groups/${id}`)}
            />
          ))}
        </div>
      )}

      {/* Add Group Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Register New Cluster Group</h3>
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
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nyaribari Chache Junior Youth Group"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Group Type
                  </label>
                  <select
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value as GroupType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    <option value="Study Circle">Study Circle</option>
                    <option value="Devotional Meeting">Devotional Meeting</option>
                    <option value="Children's Class">Children's Class</option>
                    <option value="Junior Youth Group">Junior Youth Group</option>
                    <option value="Cluster Gathering">Cluster Gathering</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Meeting Day
                  </label>
                  <select
                    value={meetingDay}
                    onChange={(e) => setMeetingDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500 bg-white"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Meeting Time
                  </label>
                  <input
                    type="text"
                    required
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    placeholder="e.g. 10:00 - 12:00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location / Meeting Place *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Keumbu School Veranda"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description & Course Material
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Studying Book 1: Reflections on the Life of the Spirit with youth..."
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
                  Register Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
