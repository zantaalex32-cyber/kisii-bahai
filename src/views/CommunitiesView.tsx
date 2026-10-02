import React, { useState } from 'react';
import { MapPin, Users, Calendar, FileText, Bell, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import { Locality, Activity, Group, DocumentItem, Announcement, UserProfile } from '../types';
import { canViewActivity, canViewByVisibility, canViewDocument, canViewAnnouncement } from '../lib/permissions';
import { ActivityCard } from '../components/ActivityCard';
import { GroupCard } from '../components/GroupCard';
import { DocumentCard } from '../components/DocumentCard';
import { AnnouncementCard } from '../components/AnnouncementCard';

interface CommunitiesViewProps {
  clusterName: string;
  localities: Locality[];
  selectedLocalityId?: string;
  activities: Activity[];
  groups: Group[];
  documents: DocumentItem[];
  announcements: Announcement[];
  user: UserProfile;
  onNavigate: (path: string) => void;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  clusterName,
  localities,
  selectedLocalityId,
  activities,
  groups,
  documents,
  announcements,
  user,
  onNavigate,
  onOpenDocument,
}) => {
  const [activeLocId, setActiveLocId] = useState<string>(
    selectedLocalityId || localities[0]?.id || 'loc-01'
  );
  const [activeTab, setActiveTab] = useState<'activities' | 'groups' | 'resources' | 'announcements'>('activities');

  const currentLocality = localities.find((l) => l.id === activeLocId) || localities[0];

  // Strictly filter by user permissions first!
  const locActivities = activities.filter(
    (a) =>
      (a.locality_id === currentLocality.id || (a.locality_name && a.locality_name === currentLocality.name)) &&
      canViewActivity(user.role, a, user.id)
  );

  const locGroups = groups.filter(
    (g) =>
      (g.locality_id === currentLocality.id || (g.locality_name && g.locality_name === currentLocality.name)) &&
      canViewByVisibility(user.role, g.visibility)
  );

  const locDocuments = documents.filter((d) => canViewDocument(user.role, d));
  const locAnnouncements = announcements.filter((a) => canViewAnnouncement(user.role, a));

  return (
    <div className="space-y-6">
      {/* Cluster Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-teal-600" />
          <span>Multi-Cluster Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {clusterName} Communities & Localities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          The cluster is organized into authorized localities to foster grassroots educational, devotional, and youth activities. Choose a locality below to consult approved gatherings.
        </p>
      </div>

      {/* Locality Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {localities.map((loc) => {
          const isSelected = loc.id === currentLocality.id;
          return (
            <button
              key={loc.id}
              onClick={() => {
                setActiveLocId(loc.id);
                onNavigate(`/communities/${loc.id}`);
              }}
              className={`p-5 rounded-2xl border text-left transition relative cursor-pointer ${
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-md ring-2 ring-teal-500/30'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200/90 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-teal-200' : 'text-teal-600'}`} />
                <h3 className="text-base font-bold truncate">{loc.name}</h3>
              </div>
              <p className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                {loc.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                <span className={isSelected ? 'text-teal-200' : 'text-slate-400'}>
                  Status: {loc.status}
                </span>
                <span className={`inline-flex items-center gap-1 ${isSelected ? 'text-white' : 'text-teal-700'}`}>
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Locality Hub */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-slate-900">{currentLocality.name} Hub</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">{currentLocality.description}</p>
          </div>

          {/* Hub Section Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 text-xs font-semibold self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'activities' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Activities ({locActivities.length})
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'groups' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Groups ({locGroups.length})
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'resources' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resources ({locDocuments.length})
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'announcements' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Notices ({locAnnouncements.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'activities' && (
            locActivities.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No activities authorized or scheduled in {currentLocality.name} at this time.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {locActivities.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onViewDetails={(id) => onNavigate(`/activities/${id}`)}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'groups' && (
            locGroups.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No active groups registered in {currentLocality.name}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {locGroups.map((grp) => (
                  <GroupCard
                    key={grp.id}
                    group={grp}
                    onViewDetails={(id) => onNavigate(`/groups/${id}`)}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {locDocuments.slice(0, 4).map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onOpenOrDownload={onOpenDocument}
                />
              ))}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {locAnnouncements.slice(0, 4).map((ann) => (
                <AnnouncementCard
                  key={ann.id}
                  announcement={ann}
                  onViewDetails={(id) => onNavigate(`/announcements/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
