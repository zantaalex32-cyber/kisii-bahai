import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Bell,
  Sparkles,
  MapPin,
  ShieldAlert,
  UserCheck,
  Key,
  FolderOpen,
  BarChart3,
  ScrollText,
  Settings,
  BrainCircuit,
  X,
  Compass,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { RoleName } from '../types';
import { canAccessAdmin } from '../lib/permissions';

interface SidebarProps {
  currentPath: string;
  role: RoleName;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  role,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const isAdmin = canAccessAdmin(role);

  const mainNavItems = [
    { label: 'Public Portal', path: '/', icon: Home, show: true },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: role !== 'public' },
    { label: 'Activities', path: '/activities', icon: Calendar, show: true },
    { label: 'Calendar', path: '/calendar', icon: Calendar, show: role !== 'public' },
    { label: 'Communities', path: '/communities', icon: MapPin, show: true },
    { label: 'Groups', path: '/groups', icon: Users, show: role !== 'public' },
    { label: 'Documents', path: '/documents', icon: FileText, show: role !== 'public' },
    { label: 'Announcements', path: '/announcements', icon: Bell, show: true },
    { label: 'AI Assistant', path: '/assistant', icon: Sparkles, show: role !== 'public', highlight: true },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Access Requests', path: '/admin/access-requests', icon: UserCheck },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Roles & Permissions', path: '/admin/roles', icon: Key },
    { label: 'Localities', path: '/admin/localities', icon: MapPin },
    { label: 'Activities CMS', path: '/admin/activities', icon: Calendar },
    { label: 'Groups CMS', path: '/admin/groups', icon: Users },
    { label: 'Documents CMS', path: '/admin/documents', icon: FolderOpen },
    { label: 'Announcements CMS', path: '/admin/announcements', icon: Bell },
    { label: 'AI Knowledge Base', path: '/admin/knowledge', icon: BrainCircuit },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Audit Logs', path: '/admin/audit', icon: ScrollText },
    { label: 'Cluster Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight leading-none">
                Kisii Portal
              </div>
              <div className="text-[10px] text-teal-400 font-medium mt-0.5">
                Cluster Architecture
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Community Portal
            </div>
            <div className="space-y-1">
              {mainNavItems
                .filter((item) => item.show)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleLinkClick(item.path)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'bg-teal-600 text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-teal-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.highlight && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Admin Navigation */}
          {isAdmin && (
            <div>
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>Administration</span>
              </div>
              <div className="space-y-0.5">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleLinkClick(item.path)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'bg-amber-600 text-white font-semibold shadow-xs'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Security Badge Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate">RLS Enforced • Kisii Node</span>
          </div>
        </div>
      </aside>
    </>
  );
};
