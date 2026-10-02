import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, Users, FileText, Bell, MapPin, ArrowRight } from 'lucide-react';
import { performGlobalSearch } from '../lib/search';
import { SearchResult, UserProfile } from '../types';

interface SearchBarProps {
  user: UserProfile;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchBarProps> = ({ user, onNavigate, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      const res = performGlobalSearch(query, user);
      setResults(res);
    }, 150);
    return () => clearTimeout(timer);
  }, [query, user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'group':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'announcement':
        return <Bell className="w-4 h-4 text-amber-600" />;
      case 'locality':
        return <MapPin className="w-4 h-4 text-rose-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities, groups, documents, localities..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <div className="py-8 px-4 text-center">
              <p className="text-xs text-slate-400">
                Type keywords like <span className="font-semibold text-slate-600">“Milimani”</span>, <span className="font-semibold text-slate-600">“Study Circle”</span>, <span className="font-semibold text-slate-600">“Guideline”</span>, or <span className="font-semibold text-slate-600">“Reflection”</span>.
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Results are strictly filtered by your permissions ({user.role}).
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm font-medium">No authorized results found</p>
              <p className="text-xs text-slate-400 mt-1">
                You might not have permission to view private records matching “{query}”.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Cluster Records ({results.length})
              </div>
              {results.map((res) => (
                <button
                  key={`${res.type}-${res.id}`}
                  onClick={() => {
                    onNavigate(res.url);
                    onClose();
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 text-left transition group"
                >
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-xs transition shrink-0 mt-0.5">
                    {getIcon(res.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-teal-700 transition">
                        {res.title}
                      </h4>
                      {res.badge && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 uppercase">
                          {res.badge}
                        </span>
                      )}
                    </div>
                    {res.subtitle && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{res.subtitle}</p>
                    )}
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">{res.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition shrink-0 self-center opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Security: Permission-aware global search</span>
          <button onClick={onClose} className="hover:text-slate-800 font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
