import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Users,
  Sparkles,
  MoreHorizontal,
  FileText,
  Bell,
  MapPin,
  Shield,
  User,
  X,
} from 'lucide-react';
import { RoleName } from '../types';
import { canAccessAdmin } from '../lib/permissions';

interface MobileNavigationProps {
  currentPath: string;
  role: RoleName;
  onNavigate: (path: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentPath,
  role,
  onNavigate,
}) => {
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const isAdmin = canAccessAdmin(role);

  const homePath = role === 'public' ? '/' : '/dashboard';

  const navItems = [
    { label: 'Home', path: homePath, icon: Home },
    { label: 'Calendar', path: '/calendar', icon: Calendar, requiresAuth: true },
    { label: 'AI Assistant', path: '/assistant', icon: Sparkles, highlight: true, requiresAuth: true },
    { label: 'Groups', path: '/groups', icon: Users, requiresAuth: true },
  ];

  const moreItems = [
    { label: 'Activities', path: '/activities', icon: Calendar },
    { label: 'Communities / Localities', path: '/communities', icon: MapPin },
    { label: 'Document Library', path: '/documents', icon: FileText, requiresAuth: true },
    { label: 'Announcements', path: '/announcements', icon: Bell },
    { label: 'My Profile', path: '/profile', icon: User, requiresAuth: true },
  ];

  return (
    <>
      {/* Bottom Floating Bar for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          if (item.requiresAuth && role === 'public') return null;
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                isActive
                  ? 'text-teal-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600 scale-105' : item.highlight ? 'text-teal-600' : 'text-slate-500'}`} />
                {item.highlight && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-500" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreSheet(true)}
          className="flex flex-col items-center justify-center py-1 px-3 text-slate-500 hover:text-slate-800 transition"
        >
          <MoreHorizontal className="w-5 h-5 text-slate-500" />
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </nav>

      {/* More Bottom Sheet Drawer */}
      {showMoreSheet && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full bg-white rounded-t-3xl p-5 shadow-2xl border-t border-slate-100 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Portal Navigation</h3>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {moreItems.map((item) => {
                if (item.requiresAuth && role === 'public') return null;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setShowMoreSheet(false);
                    }}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:text-teal-900 transition text-left text-xs font-semibold text-slate-800 border border-slate-200/80"
                  >
                    <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {isAdmin && (
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    onNavigate('/admin');
                    setShowMoreSheet(false);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs transition"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Open Admin Dashboard</span>
                  </div>
                  <span className="text-[10px] bg-amber-600 px-2 py-0.5 rounded font-mono uppercase">
                    Authorized
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
