"use client";

import { Compass, Crosshair, Layers, Shield, TrafficCone, Box } from "lucide-react";
import { useMapStore } from "@/stores/map-store";
import { useLiveLocation } from "@/lib/geo/use-live-location";
import { cn } from "@/lib/utils";

interface MapFloatingControlsProps {
  onLayersClick?: () => void;
  onSafetyClick?: () => void;
}

export function MapFloatingControls({ onLayersClick, onSafetyClick }: MapFloatingControlsProps) {
  const setFollowUser = useMapStore((s) => s.setFollowUser);
  const followUser = useMapStore((s) => s.followUser);
  const { requestLocation } = useLiveLocation(false);

  const controls = [
    {
      id: "locate",
      label: "Locate me",
      icon: Crosshair,
      active: followUser,
      onClick: () => {
        void requestLocation();
        setFollowUser(true);
      },
    },
    {
      id: "compass",
      label: "Compass",
      icon: Compass,
      onClick: () => {
        /* MapLibre NavigationControl handles compass */
      },
    },
    {
      id: "layers",
      label: "Layers",
      icon: Layers,
      onClick: onLayersClick,
    },
    {
      id: "traffic",
      label: "Traffic",
      icon: TrafficCone,
      onClick: () => {
        /* Traffic overlay toggle via layer toggles */
      },
    },
    {
      id: "safety",
      label: "Safety",
      icon: Shield,
      onClick: onSafetyClick,
    },
    {
      id: "3d",
      label: "3D view",
      icon: Box,
      onClick: () => {
        /* Pitch handled by NavigationControl */
      },
    },
  ];

  return (
    <div
      className="pointer-events-auto absolute right-2 z-30 flex flex-col gap-2 sm:right-3"
      style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
      aria-label="Map controls"
    >
      {controls.map(({ id, label, icon: Icon, active, onClick }) => (
        <button
          key={id}
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-pressed={active ?? false}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-xl transition-colors",
            active
              ? "border-[#0F5B8D] bg-[#0F5B8D] text-white"
              : "border-white/30 bg-white/95 text-[#0B1220] dark:border-white/10 dark:bg-[#0B1220]/95 dark:text-white",
          )}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}
