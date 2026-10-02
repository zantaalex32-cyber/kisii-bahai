import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Download, CheckCircle2, ShieldAlert, Layers } from 'lucide-react';
import { Cluster } from '../../types';
import { StorageDB } from '../../lib/storage';

interface AdminSettingsViewProps {
  cluster: Cluster;
  onRefresh: () => void;
  onNavigate: (path: string) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  cluster,
  onRefresh,
  onNavigate,
}) => {
  const [name, setName] = useState(cluster.name);
  const [region, setRegion] = useState(cluster.region);
  const [description, setDescription] = useState(cluster.description);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageDB.updateCluster({ name, region, description });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    onRefresh();
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo cluster data back to pristine seed? All changes will revert.')) {
      StorageDB.resetToSeed();
      onRefresh();
      onNavigate('/');
    }
  };

  const handleExportData = () => {
    const backup = {
      cluster: StorageDB.getCluster(),
      localities: StorageDB.getLocalities(),
      activities: StorageDB.getActivities(),
      groups: StorageDB.getGroups(),
      documents: StorageDB.getDocuments(),
      announcements: StorageDB.getAnnouncements(),
      accessRequests: StorageDB.getAccessRequests(),
      auditLogs: StorageDB.getAuditLogs(),
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kisii_cluster_backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Cluster Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure cluster parameters, multi-cluster provisioning, and database state.
        </p>
      </div>

      {/* Cluster Parameters Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Primary Cluster Information</h2>
          </div>
          {isSaved && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Cluster Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Region / Administrative Node
            </label>
            <input
              type="text"
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Mission Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Multi-cluster Readiness */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Multi-Cluster Federation</h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          The Kisii Cluster Portal is architected so additional regional clusters can connect to the shared schema. Each record maintains an isolated <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">cluster_id</code> key to ensure strict tenancy isolation.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-semibold text-slate-900">Active Tenant Identifier:</div>
          <div className="font-mono text-xs bg-white p-2 rounded-lg border border-slate-200 text-teal-800">
            {cluster.id} (Kisii Cluster)
          </div>
        </div>
      </div>

      {/* Backup and Data Maintenance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Database Backup & Demo Reset</h2>
        <p className="text-xs text-slate-500">
          Download a complete snapshot of all portal records or reset to original sample state.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Cluster Data (JSON)</span>
          </button>
          <button
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
