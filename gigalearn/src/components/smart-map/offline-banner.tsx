"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/lib/hooks/use-online-status";

export function OfflineBanner() {
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div
      className="pointer-events-auto rounded-2xl border border-amber-400/50 bg-amber-50/95 p-3 shadow-lg dark:border-amber-500/30 dark:bg-amber-950/90"
      role="alert"
    >
      <div className="flex items-start gap-2">
        <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200">
            Offline mode
          </p>
          <p className="text-sm text-amber-900 dark:text-amber-100">
            You&apos;re offline. Showing your last available map and location data.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#0F5B8D] px-3 py-2 text-xs font-bold text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry connection
          </button>
        </div>
      </div>
    </div>
  );
}
