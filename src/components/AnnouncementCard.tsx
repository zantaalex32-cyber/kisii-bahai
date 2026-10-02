import React from 'react';
import { Bell, Calendar, User, ArrowRight } from 'lucide-react';
import { Announcement } from '../types';
import { StatusBadge, VisibilityBadge } from './StatusBadge';

interface AnnouncementCardProps {
  announcement: Announcement;
  onViewDetails?: (id: string) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onViewDetails }) => {
  const publishedDate = announcement.published_at || announcement.created_at;
  const formattedDate = new Date(publishedDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
            <Bell className="w-3 h-3" />
            <span>Announcement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <VisibilityBadge visibility={announcement.visibility} />
            {announcement.status !== 'published' && <StatusBadge status={announcement.status} />}
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition leading-snug mb-2">
          {announcement.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {announcement.content}
        </p>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {formattedDate}
          </span>
          {announcement.author_name && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              {announcement.author_name}
            </span>
          )}
        </div>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(announcement.id)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 transition"
          >
            <span>Read More</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
