import {
  Cluster,
  Locality,
  UserProfile,
  Activity,
  Group,
  DocumentItem,
  Announcement,
  NotificationItem,
  AuditLogEntry,
  AccessRequest,
  KnowledgeDocument,
  DocumentChunk,
  RoleName,
} from '../types';
import { ROLE_PERMISSIONS } from './permissions';

const STORAGE_KEY_PREFIX = 'kisii_portal_v1_';

export const INITIAL_CLUSTER: Cluster = {
  id: 'cluster-kisii-001',
  name: 'Kisii Cluster',
  description: 'Authorized central administrative and collaborative nexus for Kisii Cluster communities and learning circles.',
  region: 'Nyanza Region, Kenya',
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
};

export const INITIAL_LOCALITIES: Locality[] = [
  {
    id: 'loc-01',
    cluster_id: 'cluster-kisii-001',
    name: 'Kisii Central',
    description: 'Central administrative and fellowship node encompassing Township, Milimani, and Jogoo neighborhoods.',
    status: 'active',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-09-15T00:00:00Z',
  },
  {
    id: 'loc-02',
    cluster_id: 'cluster-kisii-001',
    name: 'Kitutu Chache',
    description: 'Northern sector with an active network of junior youth groups, devotional gatherings, and periodic retreats.',
    status: 'active',
    created_at: '2026-01-12T00:00:00Z',
    updated_at: '2026-09-20T00:00:00Z',
  },
  {
    id: 'loc-03',
    cluster_id: 'cluster-kisii-001',
    name: 'Nyaribari Chache',
    description: 'Eastern sector known for vibrant children classes, neighborhood service projects, and reflection sessions.',
    status: 'active',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-09-22T00:00:00Z',
  },
];

export const DEMO_USERS: Record<RoleName, UserProfile> = {
  public: {
    id: 'user-public',
    full_name: 'Guest Visitor',
    email: 'guest@kisiicluster.org',
    cluster_id: 'cluster-kisii-001',
    phone_visibility: 'admins',
    status: 'active',
    role: 'public',
    permissions: [],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  member: {
    id: 'user-member-01',
    full_name: 'Faith Nyaboke',
    email: 'faith.nyaboke@kisiicluster.org',
    phone: '+254 712 345 678',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-01',
    phone_visibility: 'members',
    status: 'active',
    role: 'member',
    permissions: ROLE_PERMISSIONS.member,
    created_at: '2026-02-10T08:00:00Z',
    updated_at: '2026-08-15T12:00:00Z',
  },
  coordinator: {
    id: 'user-coord-01',
    full_name: 'Caleb Mogaka',
    email: 'caleb.mogaka@kisiicluster.org',
    phone: '+254 722 987 654',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-02',
    phone_visibility: 'coordinators',
    status: 'active',
    role: 'coordinator',
    permissions: ROLE_PERMISSIONS.coordinator,
    created_at: '2026-01-20T09:00:00Z',
    updated_at: '2026-09-01T10:00:00Z',
  },
  cluster_admin: {
    id: 'user-admin-01',
    full_name: 'Damaris Kwamboka',
    email: 'damaris.admin@kisiicluster.org',
    phone: '+254 733 456 789',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-01',
    phone_visibility: 'admins',
    status: 'active',
    role: 'cluster_admin',
    permissions: ROLE_PERMISSIONS.cluster_admin,
    created_at: '2026-01-05T08:00:00Z',
    updated_at: '2026-09-10T14:30:00Z',
  },
  super_admin: {
    id: 'user-super-01',
    full_name: 'Dr. Geoffrey Ondieki',
    email: 'geoffrey.ondieki@kisiicluster.org',
    phone: '+254 701 112 233',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-01',
    phone_visibility: 'admins',
    status: 'active',
    role: 'super_admin',
    permissions: ROLE_PERMISSIONS.super_admin,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-10-01T08:00:00Z',
  },
};

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-01',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-01',
    locality_name: 'Kisii Central',
    title: 'Cluster Reflection & Planning Gathering',
    description: 'Quarterly review of community building educational endeavours, group cycles, and collaborative planning for the upcoming dry season.',
    activity_type: 'Cluster Gathering',
    start_time: '2026-10-10T09:00:00Z',
    end_time: '2026-10-10T13:30:00Z',
    location: 'Kisii Central Community Center, Milimani',
    visibility: 'members',
    status: 'published',
    created_by: 'user-admin-01',
    creator_name: 'Damaris Kwamboka',
    approved_by: 'user-admin-01',
    created_at: '2026-09-25T10:00:00Z',
    updated_at: '2026-09-28T14:00:00Z',
  },
  {
    id: 'act-02',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-02',
    locality_name: 'Kitutu Chache',
    title: 'Youth Community Service & Tree Planting Day',
    description: 'Open youth-led environmental stewardship initiative planting indigenous trees along the river catchment and community dialogue.',
    activity_type: 'Junior Youth Group',
    start_time: '2026-10-17T08:30:00Z',
    end_time: '2026-10-17T12:00:00Z',
    location: 'Marani Primary Grounds, Kitutu Chache',
    visibility: 'public',
    status: 'published',
    created_by: 'user-coord-01',
    creator_name: 'Caleb Mogaka',
    approved_by: 'user-admin-01',
    created_at: '2026-09-20T11:00:00Z',
    updated_at: '2026-09-24T09:00:00Z',
  },
  {
    id: 'act-03',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-01',
    locality_name: 'Kisii Central',
    title: 'Interfaith Devotional and Music Hour',
    description: 'A peaceful gathering for readings, prayers for unity, and upliftment through community choral and instrumental arrangements.',
    activity_type: 'Devotional Meeting',
    start_time: '2026-10-04T15:00:00Z',
    end_time: '2026-10-04T16:30:00Z',
    location: 'Township Multipurpose Hall, Kisii',
    visibility: 'public',
    status: 'published',
    created_by: 'user-member-01',
    creator_name: 'Faith Nyaboke',
    approved_by: 'user-admin-01',
    created_at: '2026-09-28T16:00:00Z',
    updated_at: '2026-09-30T10:00:00Z',
  },
  {
    id: 'act-04',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-03',
    locality_name: 'Nyaribari Chache',
    title: "Children's Moral Education Festival",
    description: "Annual showcase of artistic projects, moral dramas, and memorized quotations by neighborhood children's classes across Nyaribari Chache.",
    activity_type: "Children's Class",
    start_time: '2026-10-24T10:00:00Z',
    end_time: '2026-10-24T14:00:00Z',
    location: 'Keumbu Cultural Center Grounds',
    visibility: 'members',
    status: 'published',
    created_by: 'user-coord-01',
    creator_name: 'Caleb Mogaka',
    approved_by: 'user-admin-01',
    created_at: '2026-09-29T08:00:00Z',
    updated_at: '2026-10-01T11:00:00Z',
  },
  {
    id: 'act-05',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-01',
    locality_name: 'Kisii Central',
    title: 'Cluster Coordinators Strategy & Content Review',
    description: 'Administrative synchronization meeting to evaluate current study circle tutors, upcoming regional conference logistics, and portal access reviews.',
    activity_type: 'Reflection Meeting',
    start_time: '2026-10-08T14:00:00Z',
    end_time: '2026-10-08T16:30:00Z',
    location: 'Kisii Cluster Administration Office',
    visibility: 'coordinators',
    status: 'published',
    created_by: 'user-admin-01',
    creator_name: 'Damaris Kwamboka',
    approved_by: 'user-admin-01',
    created_at: '2026-09-30T09:00:00Z',
    updated_at: '2026-10-01T14:00:00Z',
  },
  {
    id: 'act-06',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-02',
    locality_name: 'Kitutu Chache',
    title: 'New Study Circle Facilitator Workshop (Draft)',
    description: 'Training and capacity development session for prospective study circle tutors covering unit planning and collaborative dialogue.',
    activity_type: 'Study Circle',
    start_time: '2026-11-07T09:00:00Z',
    end_time: '2026-11-07T13:00:00Z',
    location: 'Marani Training Pavilion',
    visibility: 'coordinators',
    status: 'pending_review',
    created_by: 'user-coord-01',
    creator_name: 'Caleb Mogaka',
    created_at: '2026-10-01T15:00:00Z',
    updated_at: '2026-10-01T15:00:00Z',
  },
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'grp-01',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-01',
    locality_name: 'Kisii Central',
    name: 'Milimani Study Circle (Book 1: Reflections on the Life of the Spirit)',
    group_type: 'Study Circle',
    description: 'A study circle examining fundamental spiritual concepts, prayer, and reading the sacred writings with understanding.',
    meeting_day: 'Sunday',
    meeting_time: '14:00 - 16:00',
    location: 'Milimani Community Hall, Room 2',
    visibility: 'members',
    status: 'active',
    created_by: 'user-member-01',
    facilitator_name: 'Faith Nyaboke',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'grp-02',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-02',
    locality_name: 'Kitutu Chache',
    name: 'Marani Junior Youth Group (Glimmer of Hope)',
    group_type: 'Junior Youth Group',
    description: 'Engaging adolescents aged 11–14 in spiritual concepts, scientific inquiry, literacy development, and mutual social action.',
    meeting_day: 'Saturday',
    meeting_time: '10:00 - 12:00',
    location: 'Marani Library Gardens',
    visibility: 'members',
    status: 'active',
    created_by: 'user-coord-01',
    facilitator_name: 'Caleb Mogaka',
    created_at: '2026-02-15T09:00:00Z',
    updated_at: '2026-09-01T14:00:00Z',
  },
  {
    id: 'grp-03',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-01',
    locality_name: 'Kisii Central',
    name: 'Township Friday Devotional Fellowship',
    group_type: 'Devotional Meeting',
    description: 'Weekly neighborhood devotional gathering for spiritual reflection, prayers, and uplifting camaraderie open to the public.',
    meeting_day: 'Friday',
    meeting_time: '17:30 - 18:45',
    location: 'Township Community Room, Ground Floor',
    visibility: 'public',
    status: 'active',
    created_by: 'user-member-01',
    facilitator_name: 'Faith Nyaboke',
    created_at: '2026-01-20T15:00:00Z',
    updated_at: '2026-09-12T16:00:00Z',
  },
  {
    id: 'grp-04',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-03',
    locality_name: 'Nyaribari Chache',
    name: "Keumbu Grade 2 Children's Class",
    group_type: "Children's Class",
    description: 'Weekly educational gathering focusing on virtues like truthfulness, kindness, generosity, and justice through songs and arts.',
    meeting_day: 'Sunday',
    meeting_time: '09:30 - 11:00',
    location: 'Keumbu School Veranda',
    visibility: 'members',
    status: 'active',
    created_by: 'user-coord-01',
    facilitator_name: 'Mary Kemunto',
    created_at: '2026-03-01T08:00:00Z',
    updated_at: '2026-09-15T12:00:00Z',
  },
  {
    id: 'grp-05',
    cluster_id: 'cluster-kisii-001',
    locality_id: 'loc-01',
    locality_name: 'Kisii Central',
    name: 'Nyanza Regional Tutors Reflection Circle',
    group_type: 'Cluster Gathering',
    description: 'Coordinators and senior facilitators circle focused on curriculum mastery, tutor accompaniment, and systematic cluster statistical records.',
    meeting_day: 'Wednesday',
    meeting_time: '16:00 - 17:30',
    location: 'Kisii Cluster Resource Room',
    visibility: 'coordinators',
    status: 'active',
    created_by: 'user-admin-01',
    facilitator_name: 'Damaris Kwamboka',
    created_at: '2026-02-10T11:00:00Z',
    updated_at: '2026-09-20T16:00:00Z',
  },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    cluster_id: 'cluster-kisii-001',
    title: 'Kisii Cluster Institutional Guidelines & Code of Conduct',
    description: 'Approved framework for cluster activities, protective child safeguarding standards, financial accountability, and communication protocol.',
    category: 'Guidelines',
    file_path: '/documents/guidelines/kisii_cluster_guidelines_2026.pdf',
    file_size: '1.4 MB',
    file_type: 'PDF',
    visibility: 'members',
    status: 'published',
    uploaded_by: 'user-admin-01',
    uploader_name: 'Damaris Kwamboka',
    approved_by: 'user-super-01',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 'doc-02',
    cluster_id: 'cluster-kisii-001',
    title: 'Study Circle Facilitator Handbook & Material Guide',
    description: 'Comprehensive tutor handbook providing discussion prompts, pedagogical principles, and session pacing for institute courses.',
    category: 'Training Materials',
    file_path: '/documents/training/facilitator_handbook_v3.pdf',
    file_size: '2.8 MB',
    file_type: 'PDF',
    visibility: 'members',
    status: 'published',
    uploaded_by: 'user-coord-01',
    uploader_name: 'Caleb Mogaka',
    approved_by: 'user-admin-01',
    created_at: '2026-02-05T14:00:00Z',
    updated_at: '2026-08-15T11:00:00Z',
  },
  {
    id: 'doc-03',
    cluster_id: 'cluster-kisii-001',
    title: 'Public Overview: What is the Kisii Cluster Initiative?',
    description: 'A welcoming, informative introduction for newcomers and the general public explaining neighborhood activities, children classes, and community development.',
    category: 'Cluster Resources',
    file_path: '/documents/public/welcome_overview_kisii.pdf',
    file_size: '850 KB',
    file_type: 'PDF',
    visibility: 'public',
    status: 'published',
    uploaded_by: 'user-admin-01',
    uploader_name: 'Damaris Kwamboka',
    approved_by: 'user-admin-01',
    created_at: '2026-01-25T11:00:00Z',
    updated_at: '2026-09-10T09:00:00Z',
  },
  {
    id: 'doc-04',
    cluster_id: 'cluster-kisii-001',
    title: 'Quarterly Statistical Report & Educational Metrics Q3 2026',
    description: 'Factual statistical synthesis of active core activities, participation rates across localities, and training milestones.',
    category: 'Reports',
    file_path: '/documents/reports/q3_2026_statistical_report.pdf',
    file_size: '3.1 MB',
    file_type: 'PDF',
    visibility: 'coordinators',
    status: 'published',
    uploaded_by: 'user-admin-01',
    uploader_name: 'Damaris Kwamboka',
    approved_by: 'user-super-01',
    created_at: '2026-09-30T17:00:00Z',
    updated_at: '2026-10-01T08:00:00Z',
  },
  {
    id: 'doc-05',
    cluster_id: 'cluster-kisii-001',
    title: 'Activity Registration & Attendance Form Template',
    description: 'Standardized printable form for coordinators to track participation and logistical needs at local gatherings.',
    category: 'Forms',
    file_path: '/documents/forms/activity_registration_form.pdf',
    file_size: '340 KB',
    file_type: 'PDF',
    visibility: 'members',
    status: 'published',
    uploaded_by: 'user-coord-01',
    uploader_name: 'Caleb Mogaka',
    approved_by: 'user-admin-01',
    created_at: '2026-03-12T10:00:00Z',
    updated_at: '2026-08-01T15:00:00Z',
  },
  {
    id: 'doc-06',
    cluster_id: 'cluster-kisii-001',
    title: 'Internal Audit & Security Protocols 2026 (Restricted)',
    description: 'Confidential protocol governing cryptographic key management, user verification guidelines, and role review procedures.',
    category: 'Guidelines',
    file_path: '/documents/admin/security_protocol_restricted.pdf',
    file_size: '1.1 MB',
    file_type: 'PDF',
    visibility: 'admins',
    status: 'published',
    uploaded_by: 'user-super-01',
    uploader_name: 'Dr. Geoffrey Ondieki',
    approved_by: 'user-super-01',
    created_at: '2026-01-05T12:00:00Z',
    updated_at: '2026-01-05T12:00:00Z',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    cluster_id: 'cluster-kisii-001',
    title: 'Welcome to the Official Kisii Cluster Portal',
    content: 'We are pleased to introduce the centralized Kisii Cluster Portal. All members, coordinators, and administrators can now access approved schedules, resources, and announcements here without relying on individual contacts.',
    visibility: 'public',
    status: 'published',
    published_at: '2026-10-01T08:00:00Z',
    created_by: 'user-admin-01',
    author_name: 'Damaris Kwamboka',
    approved_by: 'user-admin-01',
    created_at: '2026-09-30T10:00:00Z',
    updated_at: '2026-10-01T08:00:00Z',
  },
  {
    id: 'ann-02',
    cluster_id: 'cluster-kisii-001',
    title: 'Upcoming Cluster Reflection Meeting on October 10',
    content: 'All active facilitators, tutors, and animators are warmly encouraged to review the Q3 educational metrics in the Documents section ahead of our gathering at Milimani on October 10 at 9:00 AM.',
    visibility: 'members',
    status: 'published',
    published_at: '2026-10-01T11:00:00Z',
    created_by: 'user-coord-01',
    author_name: 'Caleb Mogaka',
    approved_by: 'user-admin-01',
    created_at: '2026-10-01T09:30:00Z',
    updated_at: '2026-10-01T11:00:00Z',
  },
  {
    id: 'ann-03',
    cluster_id: 'cluster-kisii-001',
    title: 'New Study Circle Materials Approved for Distribution',
    content: 'The Cluster Resource Committee has approved supplementary reading guides for Book 1 and Book 6. Authorized tutors can download them directly from the Documents library.',
    visibility: 'members',
    status: 'published',
    published_at: '2026-09-28T14:00:00Z',
    created_by: 'user-admin-01',
    author_name: 'Damaris Kwamboka',
    approved_by: 'user-admin-01',
    created_at: '2026-09-28T12:00:00Z',
    updated_at: '2026-09-28T14:00:00Z',
  },
];

export const INITIAL_ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: 'req-01',
    full_name: 'Jared Omwamba',
    email: 'jared.omwamba@gmail.com',
    phone: '+254 721 889 900',
    locality_id: 'loc-01',
    locality_name: 'Kisii Central',
    cluster_id: 'cluster-kisii-001',
    reason: 'Active participant in Township devotional meetings and seeking access to study circle calendar and documents.',
    status: 'pending',
    created_at: '2026-10-01T16:20:00Z',
  },
  {
    id: 'req-02',
    full_name: 'Ruth Kwamboka',
    email: 'ruth.kwamboka@outlook.com',
    phone: '+254 734 556 778',
    locality_id: 'loc-02',
    locality_name: 'Kitutu Chache',
    cluster_id: 'cluster-kisii-001',
    reason: 'Recently relocated to Marani area; want to join children class animator preparation and access training materials.',
    status: 'pending',
    created_at: '2026-10-02T01:15:00Z',
  },
  {
    id: 'req-03',
    full_name: 'Brian Motari',
    email: 'brian.motari@yahoo.com',
    phone: '+254 711 223 344',
    locality_id: 'loc-03',
    locality_name: 'Nyaribari Chache',
    cluster_id: 'cluster-kisii-001',
    reason: 'Youth coordinator in Keumbu area requesting member access.',
    status: 'approved',
    assigned_role: 'member',
    reviewed_by: 'user-admin-01',
    reviewed_at: '2026-09-29T10:00:00Z',
    created_at: '2026-09-28T14:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    user_id: 'user-member-01',
    title: 'Portal Access Approved',
    message: 'Welcome Faith! Your member access request has been approved by the Kisii Cluster administration.',
    type: 'success',
    read: true,
    link_url: '/dashboard',
    created_at: '2026-09-28T10:00:00Z',
  },
  {
    id: 'notif-02',
    user_id: 'user-member-01',
    title: 'Upcoming Reflection Gathering',
    message: 'Cluster Reflection & Planning Gathering will take place on Saturday, October 10 at 9:00 AM.',
    type: 'info',
    read: false,
    link_url: '/activities/act-01',
    created_at: '2026-10-01T08:00:00Z',
  },
  {
    id: 'notif-03',
    user_id: 'user-admin-01',
    title: 'New Access Request Submitted',
    message: 'Jared Omwamba submitted an access request for Kisii Central awaiting your review.',
    type: 'action_required',
    read: false,
    link_url: '/admin/access-requests',
    created_at: '2026-10-01T16:25:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-01',
    user_id: 'user-admin-01',
    user_email: 'damaris.admin@kisiicluster.org',
    action: 'activity.publish',
    entity_type: 'activity',
    entity_id: 'act-01',
    metadata: { title: 'Cluster Reflection & Planning Gathering', visibility: 'members' },
    created_at: '2026-09-28T14:00:00Z',
  },
  {
    id: 'audit-02',
    user_id: 'user-admin-01',
    user_email: 'damaris.admin@kisiicluster.org',
    action: 'access_request.approve',
    entity_type: 'access_request',
    entity_id: 'req-03',
    metadata: { applicant: 'Brian Motari', assigned_role: 'member' },
    created_at: '2026-09-29T10:00:00Z',
  },
  {
    id: 'audit-03',
    user_id: 'user-super-01',
    user_email: 'geoffrey.ondieki@kisiicluster.org',
    action: 'document.approve',
    entity_type: 'document',
    entity_id: 'doc-01',
    metadata: { title: 'Kisii Cluster Institutional Guidelines & Code of Conduct' },
    created_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 'audit-04',
    user_id: 'user-admin-01',
    user_email: 'damaris.admin@kisiicluster.org',
    action: 'announcement.publish',
    entity_type: 'announcement',
    entity_id: 'ann-01',
    metadata: { title: 'Welcome to the Official Kisii Cluster Portal', visibility: 'public' },
    created_at: '2026-10-01T08:00:00Z',
  },
];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'kd-01',
    cluster_id: 'cluster-kisii-001',
    title: 'Kisii Cluster Core Activities & Educational Manual',
    source_type: 'guideline',
    visibility: 'members',
    chunks_count: 8,
    status: 'indexed',
    last_indexed_at: '2026-10-01T09:00:00Z',
    content_preview: 'Systematic explanation of the four core educational endeavours in Kisii Cluster: Study Circles, Devotional Gatherings, Children\'s Classes, and Junior Youth Spiritual Empowerment Groups.',
  },
  {
    id: 'kd-02',
    cluster_id: 'cluster-kisii-001',
    title: 'Localities Boundary & Coordination Framework',
    source_type: 'guideline',
    visibility: 'members',
    chunks_count: 4,
    status: 'indexed',
    last_indexed_at: '2026-10-01T09:15:00Z',
    content_preview: 'Organizational boundaries between Kisii Central, Kitutu Chache, and Nyaribari Chache localities, designating facilitator responsibilities and meeting hubs.',
  },
  {
    id: 'kd-03',
    cluster_id: 'cluster-kisii-001',
    title: 'Cluster Safety, Safeguarding & Administrative Protocols',
    source_type: 'document',
    visibility: 'admins',
    chunks_count: 5,
    status: 'indexed',
    last_indexed_at: '2026-10-01T09:30:00Z',
    content_preview: 'Administrative and legal protocols for background checks, event safety, child protection standards, and institutional audit compliance.',
  },
];

export const INITIAL_KNOWLEDGE_CHUNKS: DocumentChunk[] = [
  {
    id: 'chunk-01',
    document_id: 'kd-01',
    document_title: 'Kisii Cluster Core Activities & Educational Manual',
    cluster_id: 'cluster-kisii-001',
    chunk_index: 0,
    content: 'The Kisii Cluster conducts four primary core activities: Study Circles for youth and adults, Devotional Gatherings fostering collective spiritual atmosphere, Children\'s Classes providing moral education, and Junior Youth Groups empowering adolescents aged 11 to 14.',
    visibility: 'members',
  },
  {
    id: 'chunk-02',
    document_id: 'kd-01',
    document_title: 'Kisii Cluster Core Activities & Educational Manual',
    cluster_id: 'cluster-kisii-001',
    chunk_index: 1,
    content: 'In Kisii Central locality, the primary weekly devotional gathering occurs every Friday at 5:30 PM in the Township Community Room. Study Circle Book 1 meets every Sunday at 2:00 PM at Milimani Community Hall Room 2.',
    visibility: 'members',
  },
  {
    id: 'chunk-03',
    document_id: 'kd-01',
    document_title: 'Kisii Cluster Core Activities & Educational Manual',
    cluster_id: 'cluster-kisii-001',
    chunk_index: 2,
    content: 'In Kitutu Chache locality, junior youth meet every Saturday morning at 10:00 AM at Marani Library Gardens to study moral texts and conduct neighborhood environmental service projects.',
    visibility: 'members',
  },
  {
    id: 'chunk-04',
    document_id: 'kd-02',
    document_title: 'Localities Boundary & Coordination Framework',
    cluster_id: 'cluster-kisii-001',
    chunk_index: 0,
    content: 'Kisii Cluster is divided into three active operational localities: Locality A (Kisii Central), Locality B (Kitutu Chache), and Locality C (Nyaribari Chache). All activities and resources are linked to cluster and locality identifiers.',
    visibility: 'members',
  },
  {
    id: 'chunk-05',
    document_id: 'kd-03',
    document_title: 'Cluster Safety, Safeguarding & Administrative Protocols',
    cluster_id: 'cluster-kisii-001',
    chunk_index: 0,
    content: 'Confidential administrative guidance: All children class facilitators must be verified and approved by the Cluster Child Protection Coordinator before being assigned to classes.',
    visibility: 'admins',
  },
];

// Helper to load or initialize from localStorage
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
}

// Master Storage Database Manager
export const StorageDB = {
  getCluster: (): Cluster => getStored<Cluster>('cluster', INITIAL_CLUSTER),
  updateCluster: (data: Partial<Cluster>): Cluster => {
    const current = StorageDB.getCluster();
    const updated = { ...current, ...data, updated_at: new Date().toISOString() };
    setStored('cluster', updated);
    StorageDB.recordAuditLog('cluster.update', 'cluster', updated.id, data);
    return updated;
  },

  getLocalities: (): Locality[] => getStored<Locality[]>('localities', INITIAL_LOCALITIES),
  addLocality: (data: Omit<Locality, 'id' | 'created_at' | 'updated_at'>): Locality => {
    const list = StorageDB.getLocalities();
    const newLoc: Locality = {
      ...data,
      id: `loc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored('localities', [newLoc, ...list]);
    StorageDB.recordAuditLog('locality.create', 'locality', newLoc.id, { name: newLoc.name });
    return newLoc;
  },

  // Activities
  getActivities: (): Activity[] => getStored<Activity[]>('activities', INITIAL_ACTIVITIES),
  addActivity: (data: Omit<Activity, 'id' | 'created_at' | 'updated_at'>): Activity => {
    const list = StorageDB.getActivities();
    const newAct: Activity = {
      ...data,
      id: `act-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored('activities', [newAct, ...list]);
    StorageDB.recordAuditLog('activity.create', 'activity', newAct.id, { title: newAct.title, status: newAct.status });
    return newAct;
  },
  updateActivity: (id: string, data: Partial<Activity>): Activity => {
    const list = StorageDB.getActivities();
    let updatedItem: Activity | null = null;
    const nextList = list.map((a) => {
      if (a.id === id) {
        updatedItem = { ...a, ...data, updated_at: new Date().toISOString() };
        return updatedItem;
      }
      return a;
    });
    setStored('activities', nextList);
    if (updatedItem) {
      StorageDB.recordAuditLog('activity.update', 'activity', id, data);
    }
    return updatedItem!;
  },
  deleteActivity: (id: string): void => {
    const list = StorageDB.getActivities();
    setStored('activities', list.filter((a) => a.id !== id));
    StorageDB.recordAuditLog('activity.delete', 'activity', id);
  },

  // Groups
  getGroups: (): Group[] => getStored<Group[]>('groups', INITIAL_GROUPS),
  addGroup: (data: Omit<Group, 'id' | 'created_at' | 'updated_at'>): Group => {
    const list = StorageDB.getGroups();
    const newGrp: Group = {
      ...data,
      id: `grp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored('groups', [newGrp, ...list]);
    StorageDB.recordAuditLog('group.create', 'group', newGrp.id, { name: newGrp.name });
    return newGrp;
  },
  updateGroup: (id: string, data: Partial<Group>): Group => {
    const list = StorageDB.getGroups();
    let updatedItem: Group | null = null;
    const nextList = list.map((g) => {
      if (g.id === id) {
        updatedItem = { ...g, ...data, updated_at: new Date().toISOString() };
        return updatedItem;
      }
      return g;
    });
    setStored('groups', nextList);
    if (updatedItem) {
      StorageDB.recordAuditLog('group.update', 'group', id, data);
    }
    return updatedItem!;
  },
  deleteGroup: (id: string): void => {
    const list = StorageDB.getGroups();
    setStored('groups', list.filter((g) => g.id !== id));
    StorageDB.recordAuditLog('group.delete', 'group', id);
  },

  // Documents
  getDocuments: (): DocumentItem[] => getStored<DocumentItem[]>('documents', INITIAL_DOCUMENTS),
  addDocument: (data: Omit<DocumentItem, 'id' | 'created_at' | 'updated_at'>): DocumentItem => {
    const list = StorageDB.getDocuments();
    const newDoc: DocumentItem = {
      ...data,
      id: `doc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored('documents', [newDoc, ...list]);
    StorageDB.recordAuditLog('document.upload', 'document', newDoc.id, { title: newDoc.title, category: newDoc.category });
    return newDoc;
  },
  updateDocument: (id: string, data: Partial<DocumentItem>): DocumentItem => {
    const list = StorageDB.getDocuments();
    let updatedItem: DocumentItem | null = null;
    const nextList = list.map((d) => {
      if (d.id === id) {
        updatedItem = { ...d, ...data, updated_at: new Date().toISOString() };
        return updatedItem;
      }
      return d;
    });
    setStored('documents', nextList);
    if (updatedItem) {
      StorageDB.recordAuditLog('document.update', 'document', id, data);
    }
    return updatedItem!;
  },
  deleteDocument: (id: string): void => {
    const list = StorageDB.getDocuments();
    setStored('documents', list.filter((d) => d.id !== id));
    StorageDB.recordAuditLog('document.delete', 'document', id);
  },

  // Announcements
  getAnnouncements: (): Announcement[] => getStored<Announcement[]>('announcements', INITIAL_ANNOUNCEMENTS),
  addAnnouncement: (data: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Announcement => {
    const list = StorageDB.getAnnouncements();
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored('announcements', [newAnn, ...list]);
    StorageDB.recordAuditLog('announcement.create', 'announcement', newAnn.id, { title: newAnn.title });
    return newAnn;
  },
  updateAnnouncement: (id: string, data: Partial<Announcement>): Announcement => {
    const list = StorageDB.getAnnouncements();
    let updatedItem: Announcement | null = null;
    const nextList = list.map((a) => {
      if (a.id === id) {
        updatedItem = { ...a, ...data, updated_at: new Date().toISOString() };
        return updatedItem;
      }
      return a;
    });
    setStored('announcements', nextList);
    if (updatedItem) {
      StorageDB.recordAuditLog('announcement.update', 'announcement', id, data);
    }
    return updatedItem!;
  },
  deleteAnnouncement: (id: string): void => {
    const list = StorageDB.getAnnouncements();
    setStored('announcements', list.filter((a) => a.id !== id));
    StorageDB.recordAuditLog('announcement.delete', 'announcement', id);
  },

  // Access Requests
  getAccessRequests: (): AccessRequest[] => getStored<AccessRequest[]>('access_requests', INITIAL_ACCESS_REQUESTS),
  addAccessRequest: (data: Omit<AccessRequest, 'id' | 'created_at' | 'status'>): AccessRequest => {
    const list = StorageDB.getAccessRequests();
    const newReq: AccessRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setStored('access_requests', [newReq, ...list]);
    return newReq;
  },
  updateAccessRequest: (id: string, data: Partial<AccessRequest>): AccessRequest => {
    const list = StorageDB.getAccessRequests();
    let updatedItem: AccessRequest | null = null;
    const nextList = list.map((r) => {
      if (r.id === id) {
        updatedItem = { ...r, ...data };
        return updatedItem;
      }
      return r;
    });
    setStored('access_requests', nextList);
    if (updatedItem) {
      StorageDB.recordAuditLog(`access_request.${data.status || 'update'}`, 'access_request', id, data);
    }
    return updatedItem!;
  },

  // Notifications
  getNotifications: (userId: string): NotificationItem[] => {
    const all = getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
    return all.filter((n) => n.user_id === userId);
  },
  markNotificationRead: (id: string): void => {
    const all = getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
    setStored('notifications', all.map((n) => (n.id === id ? { ...n, read: true } : n)));
  },
  addNotification: (item: Omit<NotificationItem, 'id' | 'created_at' | 'read'>): NotificationItem => {
    const all = getStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setStored('notifications', [newNotif, ...all]);
    return newNotif;
  },

  // Users Directory & Management
  getUsers: (): UserProfile[] => {
    const users = getStored<UserProfile[]>('users', Object.values(DEMO_USERS));
    return users;
  },
  updateUser: (id: string, data: Partial<UserProfile>): UserProfile => {
    const users = StorageDB.getUsers();
    let updatedUser: UserProfile | null = null;
    const next = users.map((u) => {
      if (u.id === id) {
        updatedUser = { ...u, ...data, updated_at: new Date().toISOString() };
        return updatedUser;
      }
      return u;
    });
    setStored('users', next);
    if (updatedUser) {
      StorageDB.recordAuditLog('user.update', 'user', id, data);
    }
    return updatedUser!;
  },

  // Audit Logs
  getAuditLogs: (): AuditLogEntry[] => getStored<AuditLogEntry[]>('audit_logs', INITIAL_AUDIT_LOGS),
  recordAuditLog: (action: string, entity_type: string, entity_id?: string, metadata?: Record<string, any>): AuditLogEntry => {
    const logs = StorageDB.getAuditLogs();
    const currentUser = StorageDB.getCurrentUser();
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      user_id: currentUser?.id,
      user_email: currentUser?.email,
      action,
      entity_type,
      entity_id,
      metadata,
      created_at: new Date().toISOString(),
    };
    setStored('audit_logs', [entry, ...logs]);
    return entry;
  },

  // AI Knowledge Base
  getKnowledgeDocs: (): KnowledgeDocument[] => getStored<KnowledgeDocument[]>('knowledge_docs', INITIAL_KNOWLEDGE_DOCS),
  getKnowledgeChunks: (): DocumentChunk[] => getStored<DocumentChunk[]>('knowledge_chunks', INITIAL_KNOWLEDGE_CHUNKS),
  reindexDoc: (id: string): void => {
    const docs = StorageDB.getKnowledgeDocs();
    const next = docs.map((d) => (d.id === id ? { ...d, status: 'indexed' as const, last_indexed_at: new Date().toISOString() } : d));
    setStored('knowledge_docs', next);
    StorageDB.recordAuditLog('knowledge.reindex', 'knowledge_document', id);
  },

  // Current session user
  getCurrentUser: (): UserProfile => {
    const stored = getStored<UserProfile>('current_user', DEMO_USERS.public);
    return stored;
  },
  setCurrentUser: (user: UserProfile): void => {
    setStored('current_user', user);
  },

  // Reset demo state back to pristine seed
  resetToSeed: (): void => {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
    StorageDB.setCurrentUser(DEMO_USERS.public);
  },
};
