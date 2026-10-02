import React, { useState } from 'react';
import { z } from 'zod';
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile, RoleName } from '../types';
import { DEMO_USERS } from '../lib/storage';
import { ROLE_LABELS } from '../lib/permissions';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setNotification(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Match demo user or default to member
    const foundUser = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      // Simulate authenticated member
      const customUser: UserProfile = {
        ...DEMO_USERS.member,
        id: `user-${Date.now()}`,
        email,
        full_name: email.split('@')[0].replace(/\./g, ' '),
      };
      onLoginSuccess(customUser);
    }
  };

  const handleQuickDemoLogin = (role: RoleName) => {
    const demo = DEMO_USERS[role];
    setEmail(demo.email);
    setPassword('ClusterPass2026!');
    onLoginSuccess(demo);
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Kisii Portal
        </h1>
        <p className="text-xs text-slate-500">
          Enter your authorized credentials or select a test role below.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
        {notification && (
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
            <span>{notification}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. faith.nyaboke@kisiicluster.org"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden transition ${
                errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </label>
              <button
                type="button"
                onClick={() => setNotification('Password reset instructions will be sent to your email if registered.')}
                className="text-[11px] font-medium text-teal-700 hover:text-teal-900 transition"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden transition ${
                errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
              }`}
            />
            {errors.password && <p className="text-[11px] text-rose-600">{errors.password}</p>}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition shadow-xs flex items-center justify-center gap-2 mt-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Need access to internal cluster info?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/request-access')}
            className="font-bold text-teal-700 hover:text-teal-900 underline"
          >
            Request Access
          </button>
        </div>
      </div>

      {/* Instant 1-Click Role Testing Switcher */}
      <div className="bg-slate-100/90 rounded-2xl p-4 border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            1-Click Test Role Accounts
          </span>
          <span className="text-[10px] text-teal-700 font-mono">Instant Sign-In</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Click any role to test its authentic permissions, dashboard, and RLS filtering:
        </p>

        <div className="grid grid-cols-1 gap-1.5 pt-1">
          {(['member', 'coordinator', 'cluster_admin', 'super_admin'] as RoleName[]).map((r) => {
            const demo = DEMO_USERS[r];
            const meta = ROLE_LABELS[r];
            return (
              <button
                key={r}
                onClick={() => handleQuickDemoLogin(r)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-teal-50/60 border border-slate-200 text-left transition group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-teal-800">
                    {demo.full_name}
                  </div>
                  <div className="text-[10px] text-slate-500">{demo.email}</div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${meta.badgeColor}`}>
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
