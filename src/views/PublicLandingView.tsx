import React from 'react';
import { Compass, Calendar, Bell, ArrowRight, ShieldCheck, Users, BookOpen, MapPin, Sparkles } from 'lucide-react';
import { Activity, Announcement, Locality } from '../types';
import { ActivityCard } from '../components/ActivityCard';
import { AnnouncementCard } from '../components/AnnouncementCard';

interface PublicLandingViewProps {
  publicActivities: Activity[];
  publicAnnouncements: Announcement[];
  localities: Locality[];
  onNavigate: (path: string) => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({
  publicActivities,
  publicAnnouncements,
  localities,
  onNavigate,
}) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white p-6 sm:p-12 overflow-hidden shadow-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Official Community Nexus</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            KISII CLUSTER PORTAL
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed">
            Access approved cluster information, activities, resources and announcements in one place.
          </p>

          <p className="text-xs sm:text-sm text-teal-200/70">
            A secure authorized platform providing seamless coordination across Kisii Central, Kitutu Chache, and Nyaribari Chache localities.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('/login')}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-lg flex items-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/request-access')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition backdrop-blur-xs"
            >
              Request Access
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Architecture Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Authorized & Verified</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminates repeated routine inquiries to individuals by providing a single source of verified, approved schedules and resources.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Neighborhood Growth</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Organizes study circles, devotional gatherings, children classes, and junior youth groups with strict privacy and safeguarding.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Permission-Grounded AI</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The integrated assistant answers queries exclusively using approved cluster records without hallucinating or leaking private data.
          </p>
        </div>
      </section>

      {/* Upcoming Public Activities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Upcoming Public Activities</h2>
            <p className="text-xs text-slate-500">
              Community service and devotional gatherings open to the public in Kisii Cluster.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/activities')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All Activities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {publicActivities.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No public activities are currently published. Members can sign in to view internal gatherings.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicActivities.slice(0, 3).map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onViewDetails={(id) => onNavigate(`/activities/${id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Public Announcements */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Public Announcements</h2>
            <p className="text-xs text-slate-500">
              Official cluster updates published for general awareness.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/announcements')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>All Announcements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {publicAnnouncements.map((ann) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              onViewDetails={(id) => onNavigate(`/announcements/${id}`)}
            />
          ))}
        </div>
      </section>

      {/* About Kisii Cluster Localities */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900">About Kisii Cluster Localities</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            The Kisii Cluster comprises distinct localities working in concert to promote education, moral empowerment, and community fellowship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {localities.map((loc) => (
            <div
              key={loc.id}
              onClick={() => onNavigate(`/communities/${loc.id}`)}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 hover:border-teal-300 transition cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition">
                  {loc.name}
                </h4>
              </div>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {loc.description}
              </p>
              <div className="mt-3 text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                <span>View Locality Hub</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="p-8 rounded-3xl bg-slate-100 text-center space-y-4 border border-slate-200">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
          Are you a member or facilitator in Kisii Cluster?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Sign in or request access to consult the calendar, group schedules, tutor resources, and the permission-aware AI assistant.
        </p>
        <div className="flex justify-center gap-3 pt-1">
          <button
            onClick={() => onNavigate('/login')}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition shadow-xs"
          >
            Sign In to Member Portal
          </button>
          <button
            onClick={() => onNavigate('/request-access')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs transition"
          >
            Submit Access Request
          </button>
        </div>
      </section>
    </div>
  );
};
