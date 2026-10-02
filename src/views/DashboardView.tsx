import React from 'react';
import {
  Calendar,
  Users,
  FileText,
  Bell,
  Sparkles,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { UserProfile, Activity, Announcement, NotificationItem, Locality } from '../types';
import { ActivityCard } from '../components/ActivityCard';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { ROLE_LABELS } from '../lib/permissions';

interface DashboardViewProps {
  user: UserProfile;
  upcomingActivities: Activity[];
  recentAnnouncements: Announcement[];
  notifications: NotificationItem[];
  localities: Locality[];
  onNavigate: (path: string) => void;
  onMarkNotificationRead: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  upcomingActivities,
  recentAnnouncements,
  notifications,
  localities,
  onNavigate,
  onMarkNotificationRead,
}) => {
  const roleMeta = ROLE_LABELS[user.role];
  const unreadNotifs = notifications.filter((n) => !n.read);

  const quickAccessItems = [
    { label: 'Activities', path: '/activities', icon: Calendar, color: 'text-teal-600 bg-teal-50 hover:border-teal-300' },
    { label: 'Calendar', path: '/calendar', icon: Calendar, color: 'text-emerald-600 bg-emerald-50 hover:border-emerald-300' },
    { label: 'Groups', path: '/groups', icon: Users, color: 'text-blue-600 bg-blue-50 hover:border-blue-300' },
    { label: 'Documents', path: '/documents', icon: FileText, color: 'text-indigo-600 bg-indigo-50 hover:border-indigo-300' },
    { label: 'Communities', path: '/communities', icon: MapPin, color: 'text-rose-600 bg-rose-50 hover:border-rose-300' },
    { label: 'Ask Assistant', path: '/assistant', icon: Sparkles, color: 'text-amber-700 bg-amber-50 hover:border-amber-300', highlight: true },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 border border-white/10 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>{roleMeta.label} • Authorized Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl leading-relaxed">
            Welcome to the central portal for Kisii Cluster. Explore upcoming gatherings, community study circles, guidelines, and direct AI assistance.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/assistant')}
          className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Assistant</span>
        </button>
      </section>

      {/* Notifications Bar (if any unread) */}
      {unreadNotifs.length > 0 && (
        <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">
                You have {unreadNotifs.length} unread notification{unreadNotifs.length > 1 ? 's' : ''}
              </div>
              <p className="text-xs text-amber-700 line-clamp-1">{unreadNotifs[0].message}</p>
            </div>
          </div>
          <button
            onClick={() => onMarkNotificationRead(unreadNotifs[0].id)}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 self-end sm:self-auto underline"
          >
            Mark as read
          </button>
        </section>
      )}

      {/* Quick Access Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.path)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition text-center group cursor-pointer ${
                  item.highlight ? 'ring-1 ring-amber-400/50' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition group-hover:scale-105 ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Upcoming Activities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upcoming Activities</h2>
            <p className="text-xs text-slate-500">
              Gatherings and gatherings authorized for your membership level.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/activities')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingActivities.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No upcoming activities listed at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingActivities.slice(0, 3).map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onViewDetails={(id) => onNavigate(`/activities/${id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent Announcements */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Announcements</h2>
            <p className="text-xs text-slate-500">
              Official cluster notices and coordination communications.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/announcements')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recentAnnouncements.slice(0, 2).map((ann) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              onViewDetails={(id) => onNavigate(`/announcements/${id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
