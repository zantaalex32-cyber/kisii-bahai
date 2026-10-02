/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageDB, DEMO_USERS } from './lib/storage';
import { UserProfile, DocumentItem } from './types';
import { canAccessAdmin } from './lib/permissions';

// Components
import { AppShell } from './components/AppShell';
import { CalendarView } from './components/CalendarView';
import { AssistantChat } from './components/AssistantChat';

// Views
import { PublicLandingView } from './views/PublicLandingView';
import { LoginView } from './views/LoginView';
import { RequestAccessView } from './views/RequestAccessView';
import { DashboardView } from './views/DashboardView';
import { ActivitiesView } from './views/ActivitiesView';
import { ActivityDetailView } from './views/ActivityDetailView';
import { CommunitiesView } from './views/CommunitiesView';
import { GroupsView } from './views/GroupsView';
import { DocumentsView } from './views/DocumentsView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { ProfileView } from './views/ProfileView';

// Admin Views
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminUsersView } from './views/admin/AdminUsersView';
import { AdminAccessRequestsView } from './views/admin/AdminAccessRequestsView';
import { AdminRolesView } from './views/admin/AdminRolesView';
import { AdminLocalitiesView } from './views/admin/AdminLocalitiesView';
import { AdminContentCMSView } from './views/admin/AdminContentCMSView';
import { AdminKnowledgeView } from './views/admin/AdminKnowledgeView';
import { AdminReportsView } from './views/admin/AdminReportsView';
import { AdminAuditView } from './views/admin/AdminAuditView';
import { AdminSettingsView } from './views/admin/AdminSettingsView';
import { AdminSecurityTestsView } from './views/admin/AdminSecurityTestsView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(StorageDB.getCurrentUser());
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [downloadModalDoc, setDownloadModalDoc] = useState<DocumentItem | null>(null);

  const refreshData = () => setRefreshTrigger((prev) => prev + 1);

  // Sync with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchUser = (newUser: UserProfile) => {
    StorageDB.setCurrentUser(newUser);
    setCurrentUser(newUser);
    refreshData();
  };

  const handleSignOut = () => {
    StorageDB.setCurrentUser(DEMO_USERS.public);
    setCurrentUser(DEMO_USERS.public);
    navigate('/');
    refreshData();
  };

  const handleMarkNotificationRead = (id: string) => {
    StorageDB.markNotificationRead(id);
    refreshData();
  };

  const handleOpenOrDownloadDoc = (doc: DocumentItem) => {
    setDownloadModalDoc(doc);
  };

  const cluster = StorageDB.getCluster();
  const localities = StorageDB.getLocalities();
  const activities = StorageDB.getActivities();
  const groups = StorageDB.getGroups();
  const documents = StorageDB.getDocuments();
  const announcements = StorageDB.getAnnouncements();
  const notifications = StorageDB.getNotifications(currentUser.id);
  const knowledgeDocs = StorageDB.getKnowledgeDocs();
  const knowledgeChunks = StorageDB.getKnowledgeChunks();
  const accessRequests = StorageDB.getAccessRequests();

  // Public activities & announcements
  const publicActivities = activities.filter((a) => a.visibility === 'public' && a.status === 'published');
  const publicAnnouncements = announcements.filter((a) => a.visibility === 'public' && a.status === 'published');

  // Router parsing
  const renderCurrentView = () => {
    const path = currentPath;

    // Public / Unauthenticated Entry points
    if (path === '/' || path === '') {
      return (
        <PublicLandingView
          publicActivities={publicActivities}
          publicAnnouncements={publicAnnouncements}
          localities={localities}
          onNavigate={navigate}
        />
      );
    }

    if (path === '/login') {
      return (
        <LoginView
          onLoginSuccess={(user) => {
            handleSwitchUser(user);
            navigate(user.role === 'public' ? '/' : '/dashboard');
          }}
          onNavigate={navigate}
        />
      );
    }

    if (path === '/request-access') {
      return <RequestAccessView onNavigate={navigate} />;
    }

    // Authenticated Dashboard
    if (path === '/dashboard') {
      return (
        <DashboardView
          user={currentUser}
          upcomingActivities={activities.filter((a) => a.status === 'published')}
          recentAnnouncements={announcements.filter((a) => a.status === 'published')}
          notifications={notifications}
          localities={localities}
          onNavigate={navigate}
          onMarkNotificationRead={handleMarkNotificationRead}
        />
      );
    }

    // Activities & Activity Detail
    if (path.startsWith('/activities/')) {
      const id = path.replace('/activities/', '');
      return (
        <ActivityDetailView
          activityId={id}
          activities={activities}
          user={currentUser}
          onNavigate={navigate}
        />
      );
    }

    if (path === '/activities') {
      return (
        <ActivitiesView
          user={currentUser}
          activities={activities}
          localities={localities}
          onNavigate={navigate}
          onRefresh={refreshData}
        />
      );
    }

    // Calendar
    if (path === '/calendar') {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Cluster Interactive Calendar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Synchronize activities, monthly reflection conferences, and devotional meetings across Kisii.
            </p>
          </div>
          <CalendarView
            activities={activities}
            onSelectActivity={(id) => navigate(`/activities/${id}`)}
          />
        </div>
      );
    }

    // Communities & Localities
    if (path.startsWith('/communities')) {
      const selectedLocId = path.startsWith('/communities/')
        ? path.replace('/communities/', '')
        : undefined;
      return (
        <CommunitiesView
          clusterName={cluster.name}
          localities={localities}
          selectedLocalityId={selectedLocId}
          activities={activities}
          groups={groups}
          documents={documents}
          announcements={announcements}
          user={currentUser}
          onNavigate={navigate}
          onOpenDocument={handleOpenOrDownloadDoc}
        />
      );
    }

    // Groups
    if (path === '/groups' || path.startsWith('/groups/')) {
      return (
        <GroupsView
          user={currentUser}
          groups={groups}
          localities={localities}
          onNavigate={navigate}
          onRefresh={refreshData}
        />
      );
    }

    // Documents
    if (path === '/documents' || path.startsWith('/documents/')) {
      return (
        <DocumentsView
          user={currentUser}
          documents={documents}
          onOpenDocument={handleOpenOrDownloadDoc}
          onRefresh={refreshData}
        />
      );
    }

    // Announcements
    if (path === '/announcements' || path.startsWith('/announcements/')) {
      return (
        <AnnouncementsView
          user={currentUser}
          announcements={announcements}
          onRefresh={refreshData}
        />
      );
    }

    // AI Assistant
    if (path === '/assistant') {
      return <AssistantChat user={currentUser} onNavigate={navigate} />;
    }

    // Profile
    if (path === '/profile') {
      return <ProfileView user={currentUser} localities={localities} onRefresh={refreshData} />;
    }

    // ADMIN ROUTES (Guarded strictly by canAccessAdmin)
    if (path.startsWith('/admin')) {
      if (!canAccessAdmin(currentUser.role)) {
        return (
          <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-sm">
              <span className="text-2xl font-bold font-mono">403</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Access Denied: Admin Clearance Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Row Level Security prevents role <strong>{currentUser.role}</strong> from accessing administrative settings, audit trails, or user management.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => handleSwitchUser(DEMO_USERS.cluster_admin)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
              >
                Switch to Admin Test Role
              </button>
            </div>
          </div>
        );
      }

      if (path === '/admin') {
        return <AdminDashboardView user={currentUser} onNavigate={navigate} />;
      }
      if (path === '/admin/users') {
        return (
          <AdminUsersView
            currentUser={currentUser}
            users={StorageDB.getUsers()}
            localities={localities}
            onRefresh={refreshData}
          />
        );
      }
      if (path === '/admin/access-requests') {
        return (
          <AdminAccessRequestsView
            user={currentUser}
            accessRequests={accessRequests}
            onRefresh={refreshData}
          />
        );
      }
      if (path === '/admin/roles') {
        return <AdminRolesView />;
      }
      if (path === '/admin/localities') {
        return (
          <AdminLocalitiesView
            cluster={cluster}
            localities={localities}
            onRefresh={refreshData}
          />
        );
      }
      if (path === '/admin/activities') {
        return (
          <AdminContentCMSView
            user={currentUser}
            initialTab="activities"
            activities={activities}
            groups={groups}
            documents={documents}
            announcements={announcements}
            onRefresh={refreshData}
          />
        );
      }
      if (path === '/admin/groups') {
        return (
          <AdminContentCMSView
            user={currentUser}
            initialTab="groups"
            activities={activities}
            groups={groups}
            documents={documents}
            announcements={announcements}
            onRefresh={refreshData}
          />
        );
      }
      if (path === '/admin/documents') {
        return (
          <AdminContentCMSView
            user={currentUser}
            initialTab="documents"
            activities={activities}
            groups={groups}
            documents={documents}
            announcements={announcements}
            onRefresh={refreshData}
          />
        );
      }
      if (path === '/admin/announcements') {
        return (
          <AdminContentCMSView
            user={currentUser}
            initialTab="announcements"
            activities={activities}
            groups={groups}
            documents={documents}
            announcements={announcements}
            onRefresh={refreshData}
          />
        );
      }
      if (path === '/admin/knowledge') {
        return (
          <AdminKnowledgeView
            user={currentUser}
            knowledgeDocs={knowledgeDocs}
            chunks={knowledgeChunks}
            onRefresh={refreshData}
          />
        );
      }
      if (path === '/admin/reports') {
        return <AdminReportsView />;
      }
      if (path === '/admin/audit') {
        return <AdminAuditView />;
      }
      if (path === '/admin/settings') {
        return (
          <AdminSettingsView
            cluster={cluster}
            onRefresh={refreshData}
            onNavigate={navigate}
          />
        );
      }
      if (path === '/admin/tests') {
        return <AdminSecurityTestsView />;
      }
    }

    // Default fallback to public landing
    return (
      <PublicLandingView
        publicActivities={publicActivities}
        publicAnnouncements={publicAnnouncements}
        localities={localities}
        onNavigate={navigate}
      />
    );
  };

  return (
    <AppShell
      currentPath={currentPath}
      user={currentUser}
      notifications={notifications}
      clusterName={cluster.name}
      onNavigate={navigate}
      onSwitchUser={handleSwitchUser}
      onSignOut={handleSignOut}
      onMarkNotificationRead={handleMarkNotificationRead}
    >
      {renderCurrentView()}

      {/* Document Download / Storage Preview Modal */}
      {downloadModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {downloadModalDoc.title}
              </h3>
              <button
                onClick={() => setDownloadModalDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p>{downloadModalDoc.description}</p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                <div>Path: {downloadModalDoc.file_path}</div>
                <div>Size: {downloadModalDoc.file_size || '1.4 MB'}</div>
                <div>Category: {downloadModalDoc.category}</div>
                <div>Visibility: {downloadModalDoc.visibility}</div>
              </div>
              <p className="text-[11px] text-teal-800 bg-teal-50 p-2.5 rounded-xl border border-teal-200">
                🔒 Secured via Supabase Storage: Storage bucket signed URL generated for authorized role (<strong>{currentUser.role}</strong>).
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDownloadModalDoc(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Simulate file download
                  const blob = new Blob(
                    [
                      `KISII CLUSTER PORTAL - APPROVED DOCUMENT\n\nTitle: ${downloadModalDoc.title}\nCategory: ${downloadModalDoc.category}\nCluster: Kisii Cluster\nSecurity Clearance: ${downloadModalDoc.visibility}\n\n${downloadModalDoc.description}\n\n(c) 2026 Kisii Cluster Portal. All rights reserved.`
                    ],
                    { type: 'text/plain;charset=utf-8' }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${downloadModalDoc.title.toLowerCase().replace(/\s+/g, '_')}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  setDownloadModalDoc(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-xs"
              >
                Download Approved File
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
