import React from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Tag, User, Shield, Download, ExternalLink, ShieldAlert } from 'lucide-react';
import { Activity, UserProfile } from '../types';
import { canViewActivity } from '../lib/permissions';
import { StatusBadge, VisibilityBadge } from '../components/StatusBadge';

interface ActivityDetailViewProps {
  activityId: string;
  activities: Activity[];
  user: UserProfile;
  onNavigate: (path: string) => void;
}

export const ActivityDetailView: React.FC<ActivityDetailViewProps> = ({
  activityId,
  activities,
  user,
  onNavigate,
}) => {
  const activity = activities.find((a) => a.id === activityId);

  if (!activity) {
    return (
      <div className="py-16 text-center space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Activity Not Found</h2>
        <p className="text-xs text-slate-500">The requested activity record does not exist.</p>
        <button
          onClick={() => onNavigate('/activities')}
          className="text-xs font-semibold text-teal-700 hover:underline"
        >
          Return to Activities
        </button>
      </div>
    );
  }

  // Strict permission check
  const isAuthorized = canViewActivity(user.role, activity, user.id);

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          This activity is marked with visibility <strong>{activity.visibility}</strong> or is currently in <strong>{activity.status}</strong> status. Your current role (<strong>{user.role}</strong>) does not have authorization to view it.
        </p>
        <button
          onClick={() => onNavigate('/activities')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
        >
          Back to Authorized Activities
        </button>
      </div>
    );
  }

  const startDate = new Date(activity.start_time);
  const endDate = new Date(activity.end_time);

  const formattedDate = startDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const downloadIcs = () => {
    const start = startDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kisii Cluster Portal//EN
BEGIN:VEVENT
UID:${activity.id}@kisiicluster.org
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${activity.title}
DESCRIPTION:${activity.description.replace(/\n/g, '\\n')}
LOCATION:${activity.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activity.title.toLowerCase().replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openGoogleCalendar = () => {
    const start = startDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      activity.title
    )}&dates=${start}/${end}&details=${encodeURIComponent(activity.description)}&location=${encodeURIComponent(
      activity.location
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/activities')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Activities</span>
      </button>

      {/* Main Activity Detail Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <Tag className="w-3.5 h-3.5" />
            <span>{activity.activity_type}</span>
          </span>
          <div className="flex items-center gap-2">
            <VisibilityBadge visibility={activity.visibility} />
            <StatusBadge status={activity.status} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          {activity.title}
        </h1>

        {/* Date, Time, Venue Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">Date</div>
              <div className="text-slate-600">{formattedDate}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">Time</div>
              <div className="text-slate-600">{formattedTime}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:col-span-2">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">Location & Locality</div>
              <div className="text-slate-600">
                {activity.location} • <strong className="text-slate-800">{activity.locality_name || 'Kisii Central'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Description & Program
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {activity.description}
          </p>
        </div>

        {/* Personal Calendar Sync */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">Add to your schedule:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadIcs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ICS</span>
            </button>
            <button
              onClick={openGoogleCalendar}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Calendar</span>
            </button>
          </div>
        </div>

        {/* Audit / Creator Footer */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          {activity.creator_name && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Submitted by: {activity.creator_name}</span>
            </span>
          )}
          <span>Cluster: Kisii Cluster (ID: {activity.cluster_id})</span>
        </div>
      </div>
    </div>
  );
};
