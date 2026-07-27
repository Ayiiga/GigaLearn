"use client";

import dynamic from "next/dynamic";
import { HomeOverlay } from "@/components/smart-map/home-overlay";

const MapView = dynamic(
  () => import("@/components/smart-map/map-view").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center bg-gradient-to-br from-sm-primary via-sm-primary-deep to-sm-emerald text-white">
        <p className="font-display text-xl font-bold">Opening Smart Map…</p>
      </div>
    ),
  },
);

export default function HomePage() {
  return (
    <div className="relative h-[100dvh] w-full">
      <MapView />
      <HomeOverlay />
    </div>
  );
}
