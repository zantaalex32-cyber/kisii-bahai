import React, { useState } from 'react';
import { ScrollText, Search, Filter, ShieldCheck, Calendar, User, Tag } from 'lucide-react';
import { AuditLogEntry } from '../../types';
import { StorageDB } from '../../lib/storage';

export const AdminAuditView: React.FC = () => {
  const auditLogs = StorageDB.getAuditLogs();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (log.user_email && log.user_email.toLowerCase().includes(q)) ||
        log.action.toLowerCase().includes(q) ||
        log.entity_type.toLowerCase().includes(q) ||
        JSON.stringify(log.metadata || {}).toLowerCase().includes(q);
      if (!match) return false;
    }
    if (actionFilter !== 'all' && !log.action.startsWith(actionFilter)) return false;
    if (entityFilter !== 'all' && log.entity_type !== entityFilter) return false;
    return true;
  });

  const uniqueEntities = Array.from(new Set(auditLogs.map((l) => l.entity_type)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Immutable Administrative Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Records all administrative access request decisions, content publishing, and user role updates.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>RLS Protected (Admins Only)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by user, action key, or details..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Action Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden text-slate-800"
            >
              <option value="all">All Actions</option>
              <option value="access_request">Access Requests</option>
              <option value="activity">Activities</option>
              <option value="document">Documents</option>
              <option value="announcement">Announcements</option>
              <option value="user">User Management</option>
              <option value="group">Groups</option>
              <option value="knowledge">Knowledge Base</option>
            </select>
          </div>

          {/* Entity Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-500">Entity:</span>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden text-slate-800"
            >
              <option value="all">All Entities</option>
              {uniqueEntities.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || actionFilter !== 'all' || entityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActionFilter('all');
                setEntityFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Actor (User)</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Target Entity</th>
                <th className="py-3 px-3">Details & Parameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900">{log.user_email || 'System'}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-600 capitalize">
                    {log.entity_type} {log.entity_id ? `(${log.entity_id})` : ''}
                  </td>
                  <td className="py-3 px-3">
                    <pre className="font-mono text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200 max-w-xs overflow-x-auto">
                      {JSON.stringify(log.metadata || {}, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
