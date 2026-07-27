"use client";

import { MAP_LAYERS, basemapStyleForLayers } from "@/lib/navigation/layers";
import type { MapLayerId } from "@/lib/navigation/types";
import { useMapStore } from "@/stores/map-store";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";

const HOME_LAYERS: MapLayerId[] = [
  "standard",
  "satellite",
  "terrain",
  "traffic",
  "vegetation",
  "rivers",
  "lakes",
  "forests",
  "land_cover",
  "night",
];

export function LiveLayerToggles() {
  const setMapStyle = useMapStore((s) => s.setMapStyle);
  const [active, setActive] = useState<MapLayerId[]>(["standard"]);
  const [pending, startTransition] = useTransition();

  function toggle(id: MapLayerId) {
    const def = MAP_LAYERS.find((l) => l.id === id);
    if (!def) return;
    startTransition(() => {
      let next: MapLayerId[];
      if (def.kind === "basemap") {
        const overlays = active.filter((x) => MAP_LAYERS.find((d) => d.id === x)?.kind === "overlay");
        next = [id, ...overlays];
      } else {
        next = active.includes(id) ? active.filter((x) => x !== id) : [...active, id];
      }
      setActive(next);
      setMapStyle(basemapStyleForLayers(next));
    });
  }

  return (
    <div className="rounded-3xl border border-white/30 bg-white/92 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/94">
      <p className="text-xs font-semibold uppercase tracking-wide text-sm-emerald">Live map layers</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {MAP_LAYERS.filter((l) => HOME_LAYERS.includes(l.id)).map((layer) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => toggle(layer.id)}
            className={cn(
              "shrink-0 rounded-2xl px-3 py-2 text-xs font-bold",
              active.includes(layer.id)
                ? "bg-sm-primary text-white"
                : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white",
            )}
          >
            {layer.emoji} {layer.label}
          </button>
        ))}
      </div>
      {pending && <p className="mt-1 text-[11px] text-slate-500">Updating…</p>}
    </div>
  );
}
