import React from 'react';
import { Calendar, Clock, MapPin, Tag, ArrowRight } from 'lucide-react';
import { Activity } from '../types';
import { StatusBadge, VisibilityBadge } from './StatusBadge';

interface ActivityCardProps {
  activity: Activity;
  onViewDetails: (id: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onViewDetails }) => {
  const startDate = new Date(activity.start_time);
  const endDate = new Date(activity.end_time);

  const formattedDate = startDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            <Tag className="w-3 h-3" />
            {activity.activity_type}
          </span>
          <div className="flex items-center gap-1.5">
            <VisibilityBadge visibility={activity.visibility} />
            {activity.status !== 'published' && <StatusBadge status={activity.status} />}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition leading-snug mb-2">
          {activity.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {activity.description}
        </p>

        {/* Date, Time, Location */}
        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="font-medium text-slate-800">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">
              {activity.location} {activity.locality_name ? `• ${activity.locality_name}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Locality: <strong className="text-slate-600">{activity.locality_name || 'Kisii'}</strong>
        </span>
        <button
          onClick={() => onViewDetails(activity.id)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 transition group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition" />
        </button>
      </div>
    </div>
  );
};
