import React, { useState } from 'react';
import { BrainCircuit, RefreshCw, FileText, Database, ShieldCheck, CheckCircle2, AlertCircle, Plus, Eye } from 'lucide-react';
import { KnowledgeDocument, DocumentChunk, UserProfile } from '../../types';
import { StorageDB } from '../../lib/storage';
import { VisibilityBadge } from '../../components/StatusBadge';

interface AdminKnowledgeViewProps {
  user: UserProfile;
  knowledgeDocs: KnowledgeDocument[];
  chunks: DocumentChunk[];
  onRefresh: () => void;
}

export const AdminKnowledgeView: React.FC<AdminKnowledgeViewProps> = ({
  user,
  knowledgeDocs,
  chunks,
  onRefresh,
}) => {
  const [reindexingId, setReindexingId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);

  const handleReindex = (id: string) => {
    setReindexingId(id);
    setTimeout(() => {
      StorageDB.reindexDoc(id);
      setReindexingId(null);
      onRefresh();
    }, 800);
  };

  const selectedChunks = selectedDoc
    ? chunks.filter((c) => c.document_id === selectedDoc.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Knowledge Base & Semantic Index
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            pgvector semantic chunking, embedding generation, and permission-aware RAG synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-semibold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span>pgvector: Active (768-dim)</span>
          </span>
        </div>
      </div>

      {/* Architecture & Pipeline Info Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-slate-300 border border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <BrainCircuit className="w-4 h-4 text-teal-400" />
          <span>Automated RAG Indexing & Permission Pipeline</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="text-teal-400 font-mono text-[10px] font-bold">STEP 1</span>
            <div className="font-semibold text-white">Extract & Clean</div>
            <p className="text-slate-400 text-[11px]">Sanitizes document text, stripping boilerplate.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="text-teal-400 font-mono text-[10px] font-bold">STEP 2</span>
            <div className="font-semibold text-white">Semantic Chunking</div>
            <p className="text-slate-400 text-[11px]">Splits into overlap-aware contextual units.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="text-teal-400 font-mono text-[10px] font-bold">STEP 3</span>
            <div className="font-semibold text-white">pgvector Embeddings</div>
            <p className="text-slate-400 text-[11px]">Stores dense vectors alongside visibility tags.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
            <span className="text-teal-400 font-mono text-[10px] font-bold">STEP 4</span>
            <div className="font-semibold text-white">Pre-Retrieval Filter</div>
            <p className="text-slate-400 text-[11px]">Blocks private chunks before passing to LLM.</p>
          </div>
        </div>
      </div>

      {/* Indexed Knowledge Documents */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Indexed Knowledge Documents ({knowledgeDocs.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {knowledgeDocs.map((doc) => {
            const isReindexing = reindexingId === doc.id;
            return (
              <div
                key={doc.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{doc.title}</h3>
                    <VisibilityBadge visibility={doc.visibility} />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      {doc.chunks_count} Chunks
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.content_preview}
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                    <span>Source: {doc.source_type}</span>
                    <span>• Last Indexed: {new Date(doc.last_indexed_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Chunks</span>
                  </button>
                  <button
                    disabled={isReindexing}
                    onClick={() => handleReindex(doc.id)}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin' : ''}`} />
                    <span>{isReindexing ? 'Indexing...' : 'Re-Index'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chunks Inspector Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  pgvector Chunks for "{selectedDoc.title}"
                </h3>
                <p className="text-xs text-slate-500">
                  Visibility: <strong className="uppercase">{selectedDoc.visibility}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                Done
              </button>
            </div>

            <div className="space-y-3">
              {selectedChunks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Chunks are compiled on re-index.
                </div>
              ) : (
                selectedChunks.map((chunk, idx) => (
                  <div
                    key={chunk.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span className="font-semibold text-teal-800">Chunk #{idx + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                        Embedding vector [768 floats]
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-sans">{chunk.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
