"use client";

import { useEffect } from "react";
import { registerBackgroundSync, syncOfflineData } from "@/lib/offline/sync";
import { cacheLessons } from "@/lib/offline/db";
import { LESSONS } from "@/content/curriculum";
import { useAppStore } from "@/stores/app-store";

export function OfflineInitializer({ userId }: { userId?: string }) {
  const setOnline = useAppStore((s) => s.setOnline);

  useEffect(() => {
    cacheLessons(LESSONS);
    registerBackgroundSync();

    const handleOnline = async () => {
      setOnline(true);
      if (userId) await syncOfflineData(userId);
    };

    const handleOffline = () => setOnline(false);

    window.addEventListener("gigalearn:online", handleOnline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener("gigalearn:online", handleOnline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [userId, setOnline]);

  return null;
}
