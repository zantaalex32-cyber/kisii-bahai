import React, { useState } from 'react';
import { FileText, Search, Upload, Download, Folder, Filter, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { DocumentItem, DocumentCategory, UserProfile } from '../types';
import { DocumentCard } from '../components/DocumentCard';
import { canViewDocument, hasPermission } from '../lib/permissions';
import { StorageDB } from '../lib/storage';

interface DocumentsViewProps {
  user: UserProfile;
  documents: DocumentItem[];
  onOpenDocument: (doc: DocumentItem) => void;
  onRefresh: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  user,
  documents,
  onOpenDocument,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Guidelines');
  const [visibility, setVisibility] = useState<'public' | 'members' | 'coordinators' | 'admins'>('members');
  const [fileName, setFileName] = useState('cluster_resource_file.pdf');

  const canUpload = hasPermission(user.role, 'documents.upload');
  const canApprove = hasPermission(user.role, 'documents.approve');

  // Filter documents strictly by authorization
  const authorizedDocs = documents.filter((d) => canViewDocument(user.role, d));

  const filtered = authorizedDocs.filter((d) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        d.title.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        d.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    return true;
  });

  const categories: DocumentCategory[] = [
    'Cluster Resources',
    'Activity Resources',
    'Training Materials',
    'Guidelines',
    'Forms',
    'Reports',
    'Other',
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cluster = StorageDB.getCluster();
    const initialStatus = canApprove ? 'published' : 'pending_review';

    StorageDB.addDocument({
      cluster_id: cluster.id,
      title,
      description,
      category,
      file_path: `/documents/approved/${fileName}`,
      file_size: '1.8 MB',
      file_type: 'PDF',
      visibility,
      status: initialStatus,
      uploaded_by: user.id,
      uploader_name: user.full_name,
      approved_by: canApprove ? user.id : undefined,
    });

    setIsUploadModalOpen(false);
    setTitle('');
    setDescription('');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Document & Resource Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access authorized institutional guidelines, tutor handbooks, and statistical reporting templates.
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title or subject..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap font-medium ${
              categoryFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({authorizedDocs.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap font-medium ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Cards */}
      {filtered.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
          <p className="text-sm font-semibold text-slate-700">No authorized documents found</p>
          <p className="text-xs text-slate-400 mt-1">
            Private or unapproved cluster documents are strictly restricted by RLS.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onOpenOrDownload={onOpenDocument}
            />
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {canApprove ? 'Upload & Approve Document' : 'Submit Document for Review'}
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kisii Cluster Reflection Study Unit Guide"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Visibility Authorization
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-500 bg-white"
                  >
                    <option value="members">Members</option>
                    <option value="public">Public</option>
                    <option value="coordinators">Coordinators Only</option>
                    <option value="admins">Admins Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Select File (PDF / DOCX)
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 text-slate-700 focus:outline-hidden focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Supabase Storage integration: files are stored securely with signed access URLs.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the scope and audience of this resource..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs"
                >
                  {canApprove ? 'Upload & Publish' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
