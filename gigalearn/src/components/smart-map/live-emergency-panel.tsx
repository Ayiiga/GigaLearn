"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navigation, Phone } from "lucide-react";
import type { NearbyPoi } from "@/lib/geo/types";
import { getCategoryMeta } from "@/content/smart-map/categories";
import { formatDuration } from "@/lib/navigation/route-engine";
import { useMapStore } from "@/stores/map-store";
import type { Place } from "@/types/smart-map";

function telHref(phone?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function LiveEmergencyPanel() {
  const userLocation = useMapStore((s) => s.userLocation);
  const permission = useMapStore((s) => s.locationPermission);
  const setDestination = useMapStore((s) => s.setDestination);
  const setNavDestination = useMapStore((s) => s.setNavDestination);
  const [items, setItems] = useState<NearbyPoi[]>([]);
  const [source, setSource] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLocation || permission === "denied") {
      setItems([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const res = await fetch(
          `/api/geo/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radiusM=8000`,
          { signal: controller.signal, cache: "no-store" },
        );
        const data = (await res.json()) as { results?: NearbyPoi[]; source?: string; error?: string };
        if (!res.ok) throw new Error(data.error || "Nearby lookup failed");
        setItems(data.results ?? []);
        setSource(data.source ?? "");
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : "Nearby lookup failed");
          setItems([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [userLocation, permission]);

  if (!userLocation || permission === "denied") return null;

  return (
    <section className="rounded-3xl border border-white/30 bg-white/92 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/94">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sm-danger">Live nearby</p>
          <h2 className="font-bold">Emergency services near you</h2>
        </div>
        {source && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold dark:bg-white/10">
            {source === "overpass" ? "Live OSM" : "Fallback"}
          </span>
        )}
      </div>
      {loading && <p className="mt-2 text-xs text-slate-500">Finding nearest services…</p>}
      {error && <p className="mt-2 text-xs text-sm-danger">{error}</p>}
      <ul className="mt-3 space-y-2">
        {items.map((item) => {
          const meta = getCategoryMeta(item.category);
          const call = telHref(item.phone);
          return (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-2xl border border-sm-border px-3 py-2 dark:border-white/10"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {meta.emoji} {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  {item.distanceKm.toFixed(1)} km · {formatDuration(item.durationMin)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Link
                  href="/navigate"
                  className="inline-flex items-center gap-1 rounded-xl bg-sm-primary px-2.5 py-2 text-xs font-bold text-white"
                  onClick={() => {
                    const place: Place = {
                      id: item.id,
                      name: item.name,
                      category: item.category,
                      coordinates: item.coordinates,
                      address: item.address || item.name,
                      city: "",
                      region: "",
                      country: "",
                      countryCode: "",
                      phone: item.phone,
                    };
                    setDestination(place);
                    setNavDestination({
                      id: item.id,
                      label: item.name,
                      coordinates: item.coordinates,
                      source: "search",
                      address: item.address,
                    });
                  }}
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Go
                </Link>
                {call && (
                  <a
                    href={call}
                    className="inline-flex items-center justify-center rounded-xl bg-sm-emerald px-2.5 py-2 text-white"
                    aria-label={`Call ${item.name}`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </li>
          );
        })}
        {!loading && items.length === 0 && !error && (
          <li className="text-xs text-slate-500">No emergency POIs found within range yet.</li>
        )}
      </ul>
    </section>
  );
}
