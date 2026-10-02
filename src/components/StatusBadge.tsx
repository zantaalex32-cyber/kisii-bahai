import React from 'react';
import { ContentStatus, Visibility } from '../types';

export const StatusBadge: React.FC<{ status: ContentStatus | 'active' | 'inactive' | 'pending' | 'suspended' | 'approved' | 'rejected' }> = ({ status }) => {
  const configs: Record<string, { label: string; bg: string; text: string; border: string }> = {
    published: { label: 'Published', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    approved: { label: 'Approved', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    pending_review: { label: 'Pending Review', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    rejected: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    suspended: { label: 'Suspended', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    archived: { label: 'Archived', bg: 'bg-zinc-100', text: 'text-zinc-600', border: 'border-zinc-200' },
    inactive: { label: 'Inactive', bg: 'bg-zinc-100', text: 'text-zinc-600', border: 'border-zinc-200' },
  };

  const config = configs[status] || {
    label: status,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
};

export const VisibilityBadge: React.FC<{ visibility: Visibility }> = ({ visibility }) => {
  const configs: Record<Visibility, { label: string; bg: string; text: string; border: string }> = {
    public: { label: 'Public', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    members: { label: 'Members', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    coordinators: { label: 'Coordinators', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    admins: { label: 'Admins Only', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  };

  const config = configs[visibility];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border uppercase tracking-wider ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};
