import React from 'react';
import { Key, Shield, Check, Minus } from 'lucide-react';
import { ROLE_PERMISSIONS, ROLE_LABELS } from '../../lib/permissions';
import { RoleName, PermissionName } from '../../types';

export const AdminRolesView: React.FC = () => {
  const roles: RoleName[] = ['public', 'member', 'coordinator', 'cluster_admin', 'super_admin'];

  const allPermissions: { name: PermissionName; desc: string; domain: string }[] = [
    { name: 'users.view', desc: 'View cluster directory', domain: 'Users' },
    { name: 'users.approve', desc: 'Approve access requests', domain: 'Users' },
    { name: 'users.edit', desc: 'Update profile and status', domain: 'Users' },
    { name: 'users.suspend', desc: 'Suspend user access', domain: 'Users' },

    { name: 'activities.view', desc: 'View drafts & review queue', domain: 'Activities' },
    { name: 'activities.create', desc: 'Draft new activities', domain: 'Activities' },
    { name: 'activities.edit', desc: 'Edit existing activities', domain: 'Activities' },
    { name: 'activities.approve', desc: 'Approve & publish activities', domain: 'Activities' },
    { name: 'activities.delete', desc: 'Delete or cancel activities', domain: 'Activities' },

    { name: 'groups.view', desc: 'View all cluster groups', domain: 'Groups' },
    { name: 'groups.create', desc: 'Register study & youth groups', domain: 'Groups' },
    { name: 'groups.edit', desc: 'Update schedules & locations', domain: 'Groups' },
    { name: 'groups.delete', desc: 'Archive or delete groups', domain: 'Groups' },

    { name: 'documents.view', desc: 'Access coordinator materials', domain: 'Documents' },
    { name: 'documents.upload', desc: 'Upload documents & forms', domain: 'Documents' },
    { name: 'documents.edit', desc: 'Update document metadata', domain: 'Documents' },
    { name: 'documents.approve', desc: 'Approve uploaded documents', domain: 'Documents' },
    { name: 'documents.delete', desc: 'Delete cluster documents', domain: 'Documents' },

    { name: 'announcements.view', desc: 'View internal announcements', domain: 'Announcements' },
    { name: 'announcements.create', desc: 'Draft announcements', domain: 'Announcements' },
    { name: 'announcements.edit', desc: 'Edit cluster notices', domain: 'Announcements' },
    { name: 'announcements.publish', desc: 'Publish notices to cluster', domain: 'Announcements' },
    { name: 'announcements.delete', desc: 'Archive notices', domain: 'Announcements' },

    { name: 'reports.view', desc: 'Access factual stats & reports', domain: 'Reports' },
    { name: 'ai.use', desc: 'Consult permission-grounded AI', domain: 'AI' },
    { name: 'ai.manage_knowledge', desc: 'Manage RAG knowledge chunks', domain: 'AI' },
    { name: 'audit.view', desc: 'Inspect immutable audit logs', domain: 'Audit' },
    { name: 'settings.manage', desc: 'Configure cluster & localities', domain: 'Settings' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Roles & Granular Permissions Matrix
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          The cluster security model relies on granular permissions rather than simple role names.
        </p>
      </div>

      {/* Role Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {roles.map((r) => {
          const meta = ROLE_LABELS[r];
          const count = r === 'super_admin' ? allPermissions.length : (ROLE_PERMISSIONS[r] || []).length;
          return (
            <div key={r} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${meta.badgeColor}`}>
                {meta.label}
              </span>
              <div className="text-xl font-extrabold text-slate-900 pt-1">{count} Permissions</div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{meta.description}</p>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs overflow-hidden">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Granular Permission Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Domain</th>
                <th className="py-3 px-3">Permission Key</th>
                <th className="py-3 px-3">Description</th>
                {roles.map((r) => (
                  <th key={r} className="py-3 px-3 text-center">
                    {ROLE_LABELS[r].label.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {allPermissions.map((perm) => (
                <tr key={perm.name} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-semibold text-slate-500 text-[11px]">{perm.domain}</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-teal-800 text-[11px]">{perm.name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{perm.desc}</td>
                  {roles.map((r) => {
                    const has = r === 'super_admin' || (ROLE_PERMISSIONS[r] || []).includes(perm.name);
                    return (
                      <td key={r} className="py-2.5 px-3 text-center">
                        {has ? (
                          <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        ) : (
                          <Minus className="w-3.5 h-3.5 text-slate-200 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
