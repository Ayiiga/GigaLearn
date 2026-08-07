"use client";

import dynamic from "next/dynamic";
import { HomeOverlay } from "@/components/smart-map/home-overlay";
import { MapFloatingControls } from "@/components/smart-map/map-floating-controls";

const MapView = dynamic(
  () => import("@/components/smart-map/map-view").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center bg-gradient-to-br from-[#0F5B8D] via-[#0B1220] to-sm-emerald text-white">
        <p className="font-display text-xl font-bold">Opening Smart Map…</p>
      </div>
    ),
  },
);

export default function HomePage() {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <MapView />
      <MapFloatingControls />
      <HomeOverlay />
    </div>
  );
}
