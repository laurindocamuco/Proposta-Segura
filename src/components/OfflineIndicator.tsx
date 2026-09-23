import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 text-slate-950 backdrop-blur-md px-3.5 py-2 text-xs font-bold shadow-xl border border-amber-400">
      <WifiOff className="w-4 h-4 text-slate-950" />
      <span>Modo Offline Desktop — Operando localmente sem internet.</span>
    </div>
  );
};
