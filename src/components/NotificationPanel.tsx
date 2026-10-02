import React from 'react';
import { Bell, CheckCheck, ExternalLink, X } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationPanelProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onNavigate: (url: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" />
          <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-600 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-8 px-4 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-xs">No notifications right now.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 transition text-left ${
                notif.read ? 'bg-white hover:bg-slate-50' : 'bg-teal-50/40 hover:bg-teal-50/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h5 className="text-xs font-semibold text-slate-900">{notif.title}</h5>
                {!notif.read && (
                  <button
                    onClick={() => onMarkRead(notif.id)}
                    title="Mark as read"
                    className="p-1 text-teal-600 hover:text-teal-800 transition"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              <div className="flex items-center justify-between mt-2 pt-1">
                <span className="text-[10px] text-slate-400">
                  {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {notif.link_url && (
                  <button
                    onClick={() => {
                      onNavigate(notif.link_url!);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900 transition"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
