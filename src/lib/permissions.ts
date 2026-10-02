import { PermissionName, RoleName, Visibility, ContentStatus } from '../types';

export const ROLE_PERMISSIONS: Record<RoleName, PermissionName[]> = {
  public: [],
  member: [
    'ai.use'
  ],
  coordinator: [
    'ai.use',
    'activities.view',
    'activities.create',
    'activities.edit',
    'groups.view',
    'groups.create',
    'groups.edit',
    'documents.view',
    'documents.upload',
    'announcements.view',
    'announcements.create',
    'reports.view',
  ],
  cluster_admin: [
    'ai.use',
    'ai.manage_knowledge',
    'users.view',
    'users.approve',
    'users.edit',
    'users.suspend',
    'activities.view',
    'activities.create',
    'activities.edit',
    'activities.approve',
    'activities.delete',
    'groups.view',
    'groups.create',
    'groups.edit',
    'groups.delete',
    'documents.view',
    'documents.upload',
    'documents.edit',
    'documents.approve',
    'documents.delete',
    'announcements.view',
    'announcements.create',
    'announcements.edit',
    'announcements.publish',
    'announcements.delete',
    'reports.view',
    'audit.view',
  ],
  super_admin: [
    'ai.use',
    'ai.manage_knowledge',
    'users.view',
    'users.approve',
    'users.edit',
    'users.suspend',
    'activities.view',
    'activities.create',
    'activities.edit',
    'activities.approve',
    'activities.delete',
    'groups.view',
    'groups.create',
    'groups.edit',
    'groups.delete',
    'documents.view',
    'documents.upload',
    'documents.edit',
    'documents.approve',
    'documents.delete',
    'announcements.view',
    'announcements.create',
    'announcements.edit',
    'announcements.publish',
    'announcements.delete',
    'reports.view',
    'audit.view',
    'settings.manage',
  ],
};

export const ROLE_LABELS: Record<RoleName, { label: string; badgeColor: string; description: string }> = {
  public: {
    label: 'Public Visitor',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    description: 'Unauthenticated visitor or prospective member with public view access only.',
  },
  member: {
    label: 'Cluster Member',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Verified member of Kisii Cluster with access to internal activities, calendar, groups, documents, and AI.',
  },
  coordinator: {
    label: 'Cluster Coordinator',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Activity and group coordinator who plans events and submits resources for review.',
  },
  cluster_admin: {
    label: 'Cluster Admin',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Administrator for Kisii Cluster with user approval, content publishing, and audit permissions.',
  },
  super_admin: {
    label: 'Super Admin',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'System administrator with multi-cluster configuration and global settings governance.',
  },
};

/**
 * Checks whether a given role has a specific permission.
 */
export function hasPermission(role: RoleName, permission: PermissionName): boolean {
  if (role === 'super_admin') return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Hierarchy checks for visibility.
 */
export function canViewByVisibility(role: RoleName, visibility: Visibility): boolean {
  if (visibility === 'public') return true;
  if (role === 'public') return false;
  if (visibility === 'members') return ['member', 'coordinator', 'cluster_admin', 'super_admin'].includes(role);
  if (visibility === 'coordinators') return ['coordinator', 'cluster_admin', 'super_admin'].includes(role);
  if (visibility === 'admins') return ['cluster_admin', 'super_admin'].includes(role);
  return false;
}

/**
 * Validates whether user can view an activity based on status and visibility.
 */
export function canViewActivity(role: RoleName, activity: { visibility: Visibility; status: ContentStatus; created_by?: string }, userId?: string): boolean {
  // Published items depend on visibility
  if (activity.status === 'published') {
    return canViewByVisibility(role, activity.visibility);
  }

  // Drafts/Pending review: only creator, coordinator, or admins
  if (['cluster_admin', 'super_admin'].includes(role)) return true;
  if (role === 'coordinator' && activity.created_by === userId) return true;
  if (role === 'coordinator' && hasPermission(role, 'activities.view')) return true;

  return false;
}

/**
 * Validates whether user can view a document based on status and visibility.
 */
export function canViewDocument(role: RoleName, doc: { visibility: Visibility; status: ContentStatus }): boolean {
  if (doc.status !== 'published') {
    return ['cluster_admin', 'super_admin', 'coordinator'].includes(role);
  }
  return canViewByVisibility(role, doc.visibility);
}

/**
 * Validates whether user can view an announcement based on status and visibility.
 */
export function canViewAnnouncement(role: RoleName, ann: { visibility: Visibility; status: ContentStatus }): boolean {
  if (ann.status !== 'published') {
    return ['cluster_admin', 'super_admin', 'coordinator'].includes(role);
  }
  return canViewByVisibility(role, ann.visibility);
}

/**
 * Validates whether user can access Admin area.
 */
export function canAccessAdmin(role: RoleName): boolean {
  return ['cluster_admin', 'super_admin'].includes(role);
}
