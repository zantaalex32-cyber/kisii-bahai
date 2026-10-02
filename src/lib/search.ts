import { SearchResult, UserProfile } from '../types';
import { StorageDB } from './storage';
import { canViewActivity, canViewDocument, canViewAnnouncement, canViewByVisibility } from './permissions';

export function performGlobalSearch(query: string, user: UserProfile): SearchResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  const cluster = StorageDB.getCluster();
  const localities = StorageDB.getLocalities();
  const activities = StorageDB.getActivities();
  const groups = StorageDB.getGroups();
  const documents = StorageDB.getDocuments();
  const announcements = StorageDB.getAnnouncements();

  // Search Localities
  localities.forEach((loc) => {
    if (loc.name.toLowerCase().includes(q) || loc.description.toLowerCase().includes(q)) {
      results.push({
        id: loc.id,
        type: 'locality',
        title: loc.name,
        description: loc.description,
        subtitle: `${cluster.name} • Active Locality`,
        badge: 'Locality',
        url: `/communities/${loc.id}`,
        visibility: 'public',
      });
    }
  });

  // Search Activities (Strict permission check)
  activities.forEach((act) => {
    if (canViewActivity(user.role, act, user.id)) {
      if (
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.location.toLowerCase().includes(q) ||
        act.activity_type.toLowerCase().includes(q)
      ) {
        results.push({
          id: act.id,
          type: 'activity',
          title: act.title,
          description: act.description,
          subtitle: `${act.activity_type} • ${act.location}`,
          badge: act.status !== 'published' ? act.status : act.visibility,
          url: `/activities/${act.id}`,
          visibility: act.visibility,
        });
      }
    }
  });

  // Search Groups (Strict permission check)
  groups.forEach((grp) => {
    if (canViewByVisibility(user.role, grp.visibility)) {
      if (
        grp.name.toLowerCase().includes(q) ||
        grp.description.toLowerCase().includes(q) ||
        grp.group_type.toLowerCase().includes(q) ||
        grp.location.toLowerCase().includes(q)
      ) {
        results.push({
          id: grp.id,
          type: 'group',
          title: grp.name,
          description: grp.description,
          subtitle: `${grp.group_type} • Meets ${grp.meeting_day} ${grp.meeting_time}`,
          badge: grp.visibility,
          url: `/groups/${grp.id}`,
          visibility: grp.visibility,
        });
      }
    }
  });

  // Search Documents (Strict permission check)
  documents.forEach((doc) => {
    if (canViewDocument(user.role, doc)) {
      if (
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: doc.id,
          type: 'document',
          title: doc.title,
          description: doc.description,
          subtitle: `${doc.category} • ${doc.file_type || 'PDF'}`,
          badge: doc.visibility,
          url: `/documents/${doc.id}`,
          visibility: doc.visibility,
        });
      }
    }
  });

  // Search Announcements (Strict permission check)
  announcements.forEach((ann) => {
    if (canViewAnnouncement(user.role, ann)) {
      if (ann.title.toLowerCase().includes(q) || ann.content.toLowerCase().includes(q)) {
        results.push({
          id: ann.id,
          type: 'announcement',
          title: ann.title,
          description: ann.content.slice(0, 140) + '...',
          subtitle: `Announcement • ${new Date(ann.published_at || ann.created_at).toLocaleDateString()}`,
          badge: ann.visibility,
          url: `/announcements/${ann.id}`,
          visibility: ann.visibility,
        });
      }
    }
  });

  return results;
}
