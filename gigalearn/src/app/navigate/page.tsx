"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Bike, Bus, Car, Footprints, Mic, Route } from "lucide-react";
import { useMapStore } from "@/stores/map-store";
import { haversineKm } from "@/content/smart-map/places";
import { DEFAULT_CENTER } from "@/lib/map/styles";
import type { TravelMode } from "@/types/smart-map";
import { cn } from "@/lib/utils";

const MapView = dynamic(
  () => import("@/components/smart-map/map-view").then((m) => m.MapView),
  { ssr: false },
);

const MODES: { id: TravelMode; label: string; icon: typeof Car; speedKmh: number }[] = [
  { id: "driving", label: "Drive", icon: Car, speedKmh: 28 },
  { id: "walking", label: "Walk", icon: Footprints, speedKmh: 5 },
  { id: "cycling", label: "Cycle", icon: Bike, speedKmh: 14 },
  { id: "transit", label: "Transit", icon: Bus, speedKmh: 18 },
];

export default function NavigatePage() {
  const destination = useMapStore((s) => s.destination);
  const travelMode = useMapStore((s) => s.travelMode);
  const setTravelMode = useMapStore((s) => s.setTravelMode);
  const voiceNav = useMapStore((s) => s.voiceNav);
  const setVoiceNav = useMapStore((s) => s.setVoiceNav);
  const userLocation = useMapStore((s) => s.userLocation) ?? DEFAULT_CENTER;
  const [navigating, setNavigating] = useState(false);

  const plan = useMemo(() => {
    if (!destination) return null;
    const distanceKm = haversineKm(userLocation, destination.coordinates);
    const mode = MODES.find((m) => m.id === travelMode) ?? MODES[0];
    const durationMin = Math.max(3, Math.round((distanceKm / mode.speedKmh) * 60));
    const safetyScore = Math.max(62, Math.min(96, Math.round(92 - distanceKm * 1.5)));
    const steps = [
      `Head toward ${destination.city} on the safest available corridor`,
      `Continue for ${distanceKm.toFixed(1)} km via ${mode.label.toLowerCase()}`,
      `Arrive at ${destination.name}`,
    ];
    return { distanceKm, durationMin, safetyScore, steps };
  }, [destination, travelMode, userLocation]);

  return (
    <div className="relative h-[100dvh] w-full">
      <MapView />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto max-w-xl rounded-3xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/92">
          <p className="text-xs font-semibold uppercase tracking-wide text-sm-emerald">Smart Navigation</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold">
            {destination ? destination.name : "Choose a destination"}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            GPS · turn-by-turn · voice · multi-mode · safety-aware routing
          </p>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {MODES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTravelMode(id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-xs font-bold",
                  travelMode === id
                    ? "bg-sm-primary text-white"
                    : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {plan && (
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sm-primary/10 px-3 py-1 font-semibold text-sm-primary">
                  {plan.distanceKm.toFixed(1)} km
                </span>
                <span className="rounded-full bg-sm-emerald/10 px-3 py-1 font-semibold text-sm-emerald">
                  {plan.durationMin} min
                </span>
                <span className="rounded-full bg-sm-safety/15 px-3 py-1 font-semibold text-amber-700">
                  Safety {plan.safetyScore}
                </span>
              </div>
              <ol className="space-y-1.5 text-slate-600 dark:text-slate-300">
                {plan.steps.map((step) => (
                  <li key={step} className="flex gap-2">
                    <Route className="mt-0.5 h-4 w-4 shrink-0 text-sm-primary" />
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={!destination}
              onClick={() => setNavigating(true)}
              className="flex-1 rounded-2xl bg-sm-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
            >
              {navigating ? "Navigating…" : "Start navigation"}
            </button>
            <button
              type="button"
              onClick={() => setVoiceNav(!voiceNav)}
              className={cn(
                "inline-flex items-center justify-center rounded-2xl px-4 py-3",
                voiceNav ? "bg-sm-emerald text-white" : "bg-slate-100 dark:bg-white/10",
              )}
              aria-label="Toggle voice navigation"
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>
          {!destination && (
            <p className="mt-3 text-xs text-slate-500">
              Pick a place from Search or the map, then return here to navigate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
