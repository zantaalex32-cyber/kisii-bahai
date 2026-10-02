import React from 'react';
import { Users, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Group } from '../types';
import { VisibilityBadge, StatusBadge } from './StatusBadge';

interface GroupCardProps {
  group: Group;
  onViewDetails?: (id: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Type & Visibility */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Users className="w-3 h-3" />
            {group.group_type}
          </span>
          <div className="flex items-center gap-1.5">
            <VisibilityBadge visibility={group.visibility} />
            {group.status !== 'active' && <StatusBadge status={group.status} />}
          </div>
        </div>

        {/* Group Name */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug mb-2">
          {group.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {group.description}
        </p>

        {/* Schedule & Location */}
        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-medium text-slate-800">Every {group.meeting_day}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{group.meeting_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{group.location}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Locality: <strong className="text-slate-600">{group.locality_name || 'Kisii'}</strong>
        </span>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(group.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 transition group/btn"
          >
            <span>View Info</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition" />
          </button>
        )}
      </div>
    </div>
  );
};
