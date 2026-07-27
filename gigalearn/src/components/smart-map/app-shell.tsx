"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/smart-map/bottom-nav";
import { useLiveLocation } from "@/lib/geo/use-live-location";

const MAP_FULLSCREEN = new Set(["/", "/navigate"]);

function LiveLocationBootstrap() {
  useLiveLocation(true);
  return null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullscreen = MAP_FULLSCREEN.has(pathname ?? "/");

  return (
    <div className={fullscreen ? "relative h-[100dvh] w-full overflow-hidden" : "min-h-[100dvh] pb-24"}>
      <LiveLocationBootstrap />
      {children}
      <BottomNav />
    </div>
  );
}
