"use client";

import { useState } from "react";
import { Compass, Crosshair, Layers, Shield, TrafficCone, Box } from "lucide-react";
import { useMapStore } from "@/stores/map-store";
import { useLiveLocation } from "@/lib/geo/use-live-location";
import { cn } from "@/lib/utils";
import { MapLayerPicker } from "@/components/smart-map/map-layer-picker";
import Link from "next/link";

interface MapFloatingControlsProps {
  onSafetyClick?: () => void;
}

export function MapFloatingControls({ onSafetyClick }: MapFloatingControlsProps) {
  const [layersOpen, setLayersOpen] = useState(false);
  const setFollowUser = useMapStore((s) => s.setFollowUser);
  const followUser = useMapStore((s) => s.followUser);
  const mapStyle = useMapStore((s) => s.mapStyle);
  const setMapStyle = useMapStore((s) => s.setMapStyle);
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
      id: "layers",
      label: "Layers",
      icon: Layers,
      active: mapStyle === "satellite",
      onClick: () => setLayersOpen(true),
    },
    {
      id: "satellite",
      label: "Satellite",
      icon: Box,
      active: mapStyle === "satellite",
      onClick: () => setMapStyle(mapStyle === "satellite" ? "streets" : "satellite"),
    },
    {
      id: "traffic",
      label: "Traffic",
      icon: TrafficCone,
      onClick: () => setLayersOpen(true),
    },
    {
      id: "safety",
      label: "Safety",
      icon: Shield,
      onClick: onSafetyClick,
    },
    {
      id: "compass",
      label: "Navigate",
      icon: Compass,
      onClick: undefined,
    },
  ];

  return (
    <>
      <div
        className="pointer-events-auto absolute right-2 z-30 flex flex-col gap-2 sm:right-3"
        style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
        aria-label="Map controls"
      >
        {controls.map(({ id, label, icon: Icon, active, onClick }) => {
          if (id === "compass") {
            return (
              <Link
                key={id}
                href="/navigate"
                aria-label="Directions"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-[#1A73E8] text-white shadow-lg backdrop-blur-xl"
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          }
          return (
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
          );
        })}
      </div>
      <MapLayerPicker open={layersOpen} onClose={() => setLayersOpen(false)} />
    </>
  );
}
