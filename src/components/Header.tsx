import React, { useState } from 'react';
import { Search, Bell, Menu, Compass } from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';
import { UserMenu } from './UserMenu';
import { NotificationPanel } from './NotificationPanel';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  user: UserProfile;
  notifications: NotificationItem[];
  clusterName: string;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  onSwitchUser: (u: UserProfile) => void;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
  onMarkNotificationRead: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications,
  clusterName,
  onOpenSearch,
  onToggleSidebar,
  onSwitchUser,
  onNavigate,
  onSignOut,
  onMarkNotificationRead,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition">
      {/* Left: Mobile Menu + Cluster Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
                Kisii Cluster Portal
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                {clusterName}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Authorized Information & Resource Gateway
            </p>
          </div>
        </div>
      </div>

      {/* Right: Search, PWA, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] text-slate-400 bg-white border border-slate-200 rounded font-mono">
            ⌘K
          </kbd>
        </button>

        {/* In-App PWA Install */}
        <PWAInstallButton compact />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          <NotificationPanel
            notifications={notifications}
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            onMarkRead={onMarkNotificationRead}
            onNavigate={onNavigate}
          />
        </div>

        {/* User Account Menu */}
        <UserMenu
          user={user}
          onSwitchUser={onSwitchUser}
          onNavigate={onNavigate}
          onSignOut={onSignOut}
        />
      </div>
    </header>
  );
};
