import React, { useState } from 'react';
import { UserProfile, NotificationItem } from '../types';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { SearchModal } from './SearchBar';
import { OfflineIndicator } from './OfflineIndicator';

interface AppShellProps {
  currentPath: string;
  user: UserProfile;
  notifications: NotificationItem[];
  clusterName: string;
  onNavigate: (path: string) => void;
  onSwitchUser: (u: UserProfile) => void;
  onSignOut: () => void;
  onMarkNotificationRead: (id: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPath,
  user,
  notifications,
  clusterName,
  onNavigate,
  onSwitchUser,
  onSignOut,
  onMarkNotificationRead,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop & Mobile Drawer Sidebar */}
        <Sidebar
          currentPath={currentPath}
          role={user.role}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={onNavigate}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header
            user={user}
            notifications={notifications}
            clusterName={clusterName}
            onOpenSearch={() => setIsSearchOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(true)}
            onSwitchUser={onSwitchUser}
            onNavigate={onNavigate}
            onSignOut={onSignOut}
            onMarkNotificationRead={onMarkNotificationRead}
          />

          {/* Page Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileNavigation
        currentPath={currentPath}
        role={user.role}
        onNavigate={onNavigate}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        user={user}
        onNavigate={onNavigate}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Offline Status Banner */}
      <OfflineIndicator />
    </div>
  );
};
