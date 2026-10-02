// Kisii Cluster Portal Types

export type RoleName = 'public' | 'member' | 'coordinator' | 'cluster_admin' | 'super_admin';

export type PermissionName =
  | 'users.view'
  | 'users.approve'
  | 'users.edit'
  | 'users.suspend'
  | 'activities.view'
  | 'activities.create'
  | 'activities.edit'
  | 'activities.delete'
  | 'activities.approve'
  | 'groups.view'
  | 'groups.create'
  | 'groups.edit'
  | 'groups.delete'
  | 'documents.view'
  | 'documents.upload'
  | 'documents.edit'
  | 'documents.delete'
  | 'documents.approve'
  | 'announcements.view'
  | 'announcements.create'
  | 'announcements.edit'
  | 'announcements.publish'
  | 'announcements.delete'
  | 'reports.view'
  | 'ai.use'
  | 'ai.manage_knowledge'
  | 'audit.view'
  | 'settings.manage';

export type Visibility = 'public' | 'members' | 'coordinators' | 'admins';

export type ContentStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'published'
  | 'cancelled'
  | 'archived';

export type GroupType =
  | 'Study Circle'
  | 'Devotional Meeting'
  | "Children's Class"
  | 'Junior Youth Group'
  | 'Cluster Gathering'
  | 'Other';

export type DocumentCategory =
  | 'Cluster Resources'
  | 'Activity Resources'
  | 'Training Materials'
  | 'Guidelines'
  | 'Forms'
  | 'Reports'
  | 'Other';

export interface Cluster {
  id: string;
  name: string;
  description: string;
  region: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Locality {
  id: string;
  cluster_id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  cluster_id: string;
  locality_id?: string;
  phone_visibility: Visibility;
  status: 'pending' | 'active' | 'suspended';
  role: RoleName;
  permissions: PermissionName[];
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  cluster_id: string;
  locality_id?: string;
  locality_name?: string;
  title: string;
  description: string;
  activity_type: string;
  start_time: string;
  end_time: string;
  location: string;
  visibility: Visibility;
  status: ContentStatus;
  created_by: string;
  creator_name?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  cluster_id: string;
  locality_id?: string;
  locality_name?: string;
  name: string;
  group_type: GroupType;
  description: string;
  meeting_day: string;
  meeting_time: string;
  location: string;
  visibility: Visibility;
  status: 'active' | 'inactive' | 'archived';
  created_by: string;
  facilitator_name?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentItem {
  id: string;
  cluster_id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  file_path: string;
  file_size?: string;
  file_type?: string;
  visibility: Visibility;
  status: ContentStatus;
  uploaded_by: string;
  uploader_name?: string;
  approved_by?: string;
  download_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  cluster_id: string;
  title: string;
  content: string;
  visibility: Visibility;
  status: ContentStatus;
  published_at?: string;
  created_by: string;
  author_name?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'action_required';
  read: boolean;
  link_url?: string;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AccessRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  locality_id?: string;
  locality_name?: string;
  cluster_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  assigned_role?: RoleName;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface KnowledgeDocument {
  id: string;
  cluster_id: string;
  title: string;
  source_type: 'document' | 'activity_archive' | 'guideline';
  visibility: Visibility;
  chunks_count: number;
  status: 'indexed' | 'indexing' | 'failed';
  last_indexed_at: string;
  content_preview: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  document_title: string;
  cluster_id: string;
  chunk_index: number;
  content: string;
  visibility: Visibility;
}

export interface SearchResult {
  id: string;
  type: 'activity' | 'group' | 'document' | 'announcement' | 'locality';
  title: string;
  description: string;
  subtitle?: string;
  badge?: string;
  url: string;
  visibility: Visibility;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: Array<{
    type: string;
    id: string;
    title: string;
  }>;
  modelUsed?: string;
}
