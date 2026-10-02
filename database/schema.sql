-- ============================================================================
-- KISII CLUSTER PORTAL - SUPABASE & POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. CLUSTERS TABLE
-- Multi-cluster ready architecture. Initial cluster is "Kisii Cluster".
CREATE TABLE IF NOT EXISTS public.clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    region VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. LOCALITIES TABLE
CREATE TABLE IF NOT EXISTS public.localities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE CHECK (name IN ('public', 'member', 'coordinator', 'cluster_admin', 'super_admin')),
    description TEXT
);

-- 4. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 5. ROLE_PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 6. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Maps to auth.users id
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    avatar_url TEXT,
    cluster_id UUID REFERENCES public.clusters(id) ON DELETE SET NULL,
    locality_id UUID REFERENCES public.localities(id) ON DELETE SET NULL,
    phone_visibility VARCHAR(50) NOT NULL DEFAULT 'coordinators' CHECK (phone_visibility IN ('public', 'members', 'coordinators', 'admins')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. USER_ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 8. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
    locality_id UUID REFERENCES public.localities(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- 'Study Circle', 'Devotional Meeting', 'Children\'s Class', 'Junior Youth Group', 'Cluster Gathering', 'Conference', 'Reflection Meeting'
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    visibility VARCHAR(50) NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'coordinators', 'admins')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'cancelled', 'archived')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. GROUPS TABLE
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
    locality_id UUID REFERENCES public.localities(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    group_type VARCHAR(100) NOT NULL, -- 'Study Circle', 'Devotional Meeting', 'Children\'s Class', 'Junior Youth Group', 'Other'
    description TEXT,
    meeting_day VARCHAR(50) NOT NULL, -- 'Monday', 'Tuesday', ... 'Sunday'
    meeting_time VARCHAR(50) NOT NULL,
    location TEXT NOT NULL,
    visibility VARCHAR(50) NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'coordinators', 'admins')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Cluster Resources', 'Activity Resources', 'Training Materials', 'Guidelines', 'Forms', 'Reports', 'Other')),
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    file_type VARCHAR(50),
    visibility VARCHAR(50) NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'coordinators', 'admins')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending_review' CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'archived')),
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. DOCUMENT CHUNKS TABLE (AI pgvector embeddings)
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(768), -- pgvector vector embedding
    visibility VARCHAR(50) NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'coordinators', 'admins')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    visibility VARCHAR(50) NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'coordinators', 'admins')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'action_required')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL, -- e.g., 'access_request.approve', 'activity.publish', 'document.delete'
    entity_type VARCHAR(100) NOT NULL, -- 'user', 'activity', 'document', 'announcement', 'group', 'settings'
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. ACCESS REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    locality_id UUID REFERENCES public.localities(id) ON DELETE SET NULL,
    cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    assigned_role VARCHAR(50) DEFAULT 'member',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- HELPER FUNCTIONS & ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Helper: Get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS VARCHAR AS $$
    SELECT r.name
    FROM public.roles r
    JOIN public.user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = p_user_id
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Check if user has granular permission
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id UUID, p_permission_name VARCHAR)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.permissions p
        JOIN public.role_permissions rp ON rp.permission_id = p.id
        JOIN public.user_roles ur ON ur.role_id = rp.role_id
        WHERE ur.user_id = p_user_id AND p.name = p_permission_name
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- 1. CLUSTERS & LOCALITIES RLS
CREATE POLICY "Public can view active clusters"
    ON public.clusters FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active localities"
    ON public.localities FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage clusters"
    ON public.clusters FOR ALL USING (public.has_permission(auth.uid(), 'settings.manage'));

CREATE POLICY "Admins can manage localities"
    ON public.localities FOR ALL USING (public.has_permission(auth.uid(), 'settings.manage'));

-- 2. PROFILES RLS
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Authorized members can view cluster directory profiles"
    ON public.profiles FOR SELECT USING (
        public.has_permission(auth.uid(), 'users.view')
    );

CREATE POLICY "Admins can update and manage profiles"
    ON public.profiles FOR ALL USING (
        public.has_permission(auth.uid(), 'users.edit')
    );

-- 3. ACTIVITIES RLS
CREATE POLICY "Anyone can view public published activities"
    ON public.activities FOR SELECT USING (
        visibility = 'public' AND status = 'published'
    );

CREATE POLICY "Members can view member-visible published activities"
    ON public.activities FOR SELECT USING (
        status = 'published' AND visibility IN ('public', 'members') AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Coordinators can view all cluster activities"
    ON public.activities FOR SELECT USING (
        public.has_permission(auth.uid(), 'activities.view')
    );

CREATE POLICY "Coordinators and admins can create activities"
    ON public.activities FOR INSERT WITH CHECK (
        public.has_permission(auth.uid(), 'activities.create')
    );

CREATE POLICY "Coordinators can edit their activities; admins can edit any"
    ON public.activities FOR UPDATE USING (
        (created_by = auth.uid() AND public.has_permission(auth.uid(), 'activities.edit'))
        OR public.has_permission(auth.uid(), 'activities.approve')
    );

CREATE POLICY "Admins can delete activities"
    ON public.activities FOR DELETE USING (
        public.has_permission(auth.uid(), 'activities.delete')
    );

-- 4. GROUPS RLS
CREATE POLICY "Anyone can view public groups"
    ON public.groups FOR SELECT USING (
        visibility = 'public' AND status = 'active'
    );

CREATE POLICY "Members can view member-visible groups"
    ON public.groups FOR SELECT USING (
        status = 'active' AND visibility IN ('public', 'members') AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Coordinators can view all groups"
    ON public.groups FOR SELECT USING (
        public.has_permission(auth.uid(), 'groups.view')
    );

CREATE POLICY "Authorized coordinators and admins can manage groups"
    ON public.groups FOR ALL USING (
        public.has_permission(auth.uid(), 'groups.edit')
    );

-- 5. DOCUMENTS RLS
CREATE POLICY "Users can view published documents allowed for their role"
    ON public.documents FOR SELECT USING (
        status = 'published' AND (
            visibility = 'public'
            OR (visibility = 'members' AND auth.uid() IS NOT NULL)
            OR (visibility = 'coordinators' AND public.has_permission(auth.uid(), 'documents.view'))
            OR (visibility = 'admins' AND public.has_permission(auth.uid(), 'documents.approve'))
        )
    );

CREATE POLICY "Admins and coordinators can upload documents"
    ON public.documents FOR INSERT WITH CHECK (
        public.has_permission(auth.uid(), 'documents.upload')
    );

CREATE POLICY "Admins can approve and manage documents"
    ON public.documents FOR ALL USING (
        public.has_permission(auth.uid(), 'documents.approve')
    );

-- 6. DOCUMENT CHUNKS RLS (AI pgvector retrieval)
CREATE POLICY "AI document chunks follow strict role visibility"
    ON public.document_chunks FOR SELECT USING (
        visibility = 'public'
        OR (visibility = 'members' AND auth.uid() IS NOT NULL)
        OR (visibility = 'coordinators' AND public.has_permission(auth.uid(), 'documents.view'))
        OR (visibility = 'admins' AND public.has_permission(auth.uid(), 'documents.approve'))
    );

-- 7. ANNOUNCEMENTS RLS
CREATE POLICY "Public can view public published announcements"
    ON public.announcements FOR SELECT USING (
        visibility = 'public' AND status = 'published'
    );

CREATE POLICY "Members can view member published announcements"
    ON public.announcements FOR SELECT USING (
        status = 'published' AND visibility IN ('public', 'members') AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Admins can manage announcements"
    ON public.announcements FOR ALL USING (
        public.has_permission(auth.uid(), 'announcements.publish')
    );

-- 8. AUDIT LOGS RLS (strictly admin view only)
CREATE POLICY "Strictly admins can view audit logs"
    ON public.audit_logs FOR SELECT USING (
        public.has_permission(auth.uid(), 'audit.view')
    );

CREATE POLICY "System can record audit logs"
    ON public.audit_logs FOR INSERT WITH CHECK (true);

-- 9. ACCESS REQUESTS RLS
CREATE POLICY "Anyone can submit access request"
    ON public.access_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and approve access requests"
    ON public.access_requests FOR ALL USING (
        public.has_permission(auth.uid(), 'users.approve')
    );

-- 10. NOTIFICATIONS RLS
CREATE POLICY "Users can only read their own notifications"
    ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA: KISII CLUSTER INITIALIZATION
-- ============================================================================

-- Seed Roles
INSERT INTO public.roles (name, description) VALUES
('public', 'Unauthenticated public visitor or prospective member'),
('member', 'Approved cluster member with access to internal activities, calendar, groups, documents, announcements, and AI assistant'),
('coordinator', 'Cluster coordinator responsible for planning activities, guiding groups, and submitting content for review'),
('cluster_admin', 'Cluster administrator with approval authorities, user management, and content publishing powers for Kisii Cluster'),
('super_admin', 'Super administrator with full cluster configuration, multi-cluster oversight, audit logs, and system settings')
ON CONFLICT (name) DO NOTHING;

-- Seed Granular Permissions
INSERT INTO public.permissions (name, description) VALUES
('users.view', 'View directory of approved users in cluster'),
('users.approve', 'Review and approve or reject access requests'),
('users.edit', 'Modify user details, status, or assigned locality'),
('users.suspend', 'Suspend or revoke user access'),
('activities.view', 'View all cluster activities including drafts/unapproved'),
('activities.create', 'Draft new activities'),
('activities.edit', 'Edit activities in the cluster'),
('activities.delete', 'Remove activities'),
('activities.approve', 'Approve activities and advance to published status'),
('groups.view', 'View all groups and meeting coordinates'),
('groups.create', 'Register new devotional, study, or youth groups'),
('groups.edit', 'Update group parameters and schedules'),
('groups.delete', 'Archive or delete groups'),
('documents.view', 'View coordinator and cluster level documents'),
('documents.upload', 'Upload resources and materials'),
('documents.edit', 'Modify document metadata'),
('documents.delete', 'Archive or remove documents'),
('documents.approve', 'Review and approve submitted documents'),
('announcements.view', 'View internal announcements'),
('announcements.create', 'Draft cluster announcements'),
('announcements.edit', 'Edit cluster announcements'),
('announcements.publish', 'Approve and publish announcements to members'),
('announcements.delete', 'Archive announcements'),
('reports.view', 'Access aggregate factual cluster statistics and reports'),
('ai.use', 'Interact with permission-aware Kisii Cluster Assistant'),
('ai.manage_knowledge', 'Manage AI knowledge base embeddings and index sources'),
('audit.view', 'View immutable administrative audit trail logs'),
('settings.manage', 'Configure cluster settings, localities, and roles')
ON CONFLICT (name) DO NOTHING;
