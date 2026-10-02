import React from 'react';
import { FileText, Download, Eye, Calendar, Folder } from 'lucide-react';
import { DocumentItem } from '../types';
import { StatusBadge, VisibilityBadge } from './StatusBadge';

interface DocumentCardProps {
  document: DocumentItem;
  onOpenOrDownload: (doc: DocumentItem) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onOpenOrDownload }) => {
  const formattedDate = new Date(document.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Category & Visibility */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Folder className="w-3 h-3" />
            {document.category}
          </span>
          <div className="flex items-center gap-1.5">
            <VisibilityBadge visibility={document.visibility} />
            {document.status !== 'published' && <StatusBadge status={document.status} />}
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-slate-100 text-indigo-700 group-hover:bg-indigo-50 transition shrink-0 mt-0.5">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition leading-snug">
            {document.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 pl-8">
          {document.description}
        </p>
      </div>

      {/* Meta & Download Button */}
      <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
          {document.file_size && <span>• {document.file_size}</span>}
        </div>

        <button
          onClick={() => onOpenOrDownload(document)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
