import React, { useState } from 'react';
import { MapPin, Plus, Layers, CheckCircle2, X } from 'lucide-react';
import { Locality, Cluster } from '../../types';
import { StorageDB } from '../../lib/storage';

interface AdminLocalitiesViewProps {
  cluster: Cluster;
  localities: Locality[];
  onRefresh: () => void;
}

export const AdminLocalitiesView: React.FC<AdminLocalitiesViewProps> = ({
  cluster,
  localities,
  onRefresh,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddLocality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    StorageDB.addLocality({
      cluster_id: cluster.id,
      name,
      description,
      status: 'active',
    });

    setIsAddModalOpen(false);
    setName('');
    setDescription('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Localities & Multi-Cluster Nodes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Current active cluster: <strong>{cluster.name}</strong> ({cluster.region})
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Locality</span>
        </button>
      </div>

      {/* Multi-cluster Readiness Notice */}
      <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl flex items-start gap-3">
        <Layers className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 space-y-1">
          <div className="font-bold">Multi-Cluster Ready Schema:</div>
          <p className="text-teal-800/80 leading-relaxed">
            Every locality, activity, group, and document is associated with a distinct <code className="bg-teal-100 px-1 py-0.5 rounded font-mono text-[11px]">cluster_id</code>. While the current operational deployment is <strong>Kisii Cluster</strong>, additional regional clusters can be added dynamically without structural changes.
          </p>
        </div>
      </div>

      {/* Localities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {localities.map((loc) => (
          <div
            key={loc.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {loc.id}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {loc.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>{loc.name}</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{loc.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Cluster: {cluster.name}
            </div>
          </div>
        ))}
      </div>

      {/* Add Locality Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Locality to {cluster.name}</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLocality} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Locality Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bonchari Sector"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description & Boundaries
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe neighborhoods, main centers, and service coverage..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition shadow-xs"
                >
                  Create Locality
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
