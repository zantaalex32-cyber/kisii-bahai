import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../lib/pwa';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center justify-between sm:justify-start gap-2.5 rounded-xl bg-amber-600/95 backdrop-blur-xs px-4 py-2.5 text-xs font-medium text-white shadow-lg border border-amber-500/50 animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
        <span>Offline Mode: Using cached cluster records.</span>
      </div>
      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-700/80 uppercase tracking-wider font-semibold">PWA</span>
    </div>
  );
};
