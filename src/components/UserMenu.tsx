import React, { useState } from 'react';
import { User, LogOut, ShieldCheck, ChevronDown, Check, Sparkles } from 'lucide-react';
import { UserProfile, RoleName } from '../types';
import { ROLE_LABELS } from '../lib/permissions';
import { DEMO_USERS } from '../lib/storage';

interface UserMenuProps {
  user: UserProfile;
  onSwitchUser: (newUser: UserProfile) => void;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onSwitchUser, onNavigate, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  const roleInfo = ROLE_LABELS[user.role];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-2xs"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
            {user.full_name.charAt(0)}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <div className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
            {user.full_name}
          </div>
          <div className="text-[10px] text-teal-700 font-medium">{roleInfo.label}</div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* User Profile Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <div className="text-xs font-bold text-slate-900">{user.full_name}</div>
              <div className="text-xs text-slate-500 truncate">{user.email}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-white border-slate-200 text-slate-700">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                <span>{roleInfo.label}</span>
              </div>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="p-3 border-b border-slate-100 bg-teal-50/30">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  Quick Role Switcher
                </span>
                <span className="text-[10px] text-teal-600 font-normal">Test RLS</span>
              </div>
              <div className="space-y-1">
                {(['public', 'member', 'coordinator', 'cluster_admin', 'super_admin'] as RoleName[]).map((r) => {
                  const demo = DEMO_USERS[r];
                  const isCurrent = user.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        onSwitchUser(demo);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                        isCurrent
                          ? 'bg-teal-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-700 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      <div className="truncate">
                        <span>{ROLE_LABELS[r].label}</span>
                        <span className={`block text-[10px] ${isCurrent ? 'text-teal-100' : 'text-slate-400'}`}>
                          {demo.full_name}
                        </span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-1">
              <button
                onClick={() => {
                  onNavigate('/profile');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>My Profile & Permissions</span>
              </button>
              <button
                onClick={() => {
                  onSignOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
