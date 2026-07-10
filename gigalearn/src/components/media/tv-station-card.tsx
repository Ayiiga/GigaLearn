"use client";

import { ExternalLink, Heart } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { LiveIndicator } from "@/components/media/trending-panel";
import { useMediaStore } from "@/stores/media-store";
import type { TvStation } from "@/types/media";
import { cn } from "@/lib/utils";

export function TvStationCard({ station }: { station: TvStation }) {
  const toggleFavorite = useMediaStore((s) => s.toggleFavoriteTv);
  const isFavorite = useMediaStore((s) => s.preferences.favoriteTvStations.includes(station.id));

  return (
    <div id={station.id}>
    <GlassCard hover className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <span className="text-4xl" aria-hidden>{station.logo}</span>
        {station.isLive && <LiveIndicator />}
      </div>
      <h3 className="font-display mt-3 text-lg font-bold">{station.name}</h3>
      <p className="text-sm text-giga-muted">{station.country} · {station.category}</p>
      <p className="mt-1 text-xs text-giga-muted">Source: {station.officialSource}</p>
      <div className="mt-4 flex gap-2">
        <a href={station.streamUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button className="w-full gap-2">
            <ExternalLink className="h-4 w-4" /> Watch Official
          </Button>
        </a>
        <button
          onClick={() => toggleFavorite(station.id)}
          className={cn(
            "touch-target flex items-center justify-center rounded-xl border px-3",
            isFavorite ? "border-gtv-red bg-gtv-red/10 text-gtv-red" : "border-giga-border hover:border-gtv-purple",
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>
      </div>
    </GlassCard>
    </div>
  );
}
