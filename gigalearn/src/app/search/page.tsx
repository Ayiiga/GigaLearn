"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Navigation, Search as SearchIcon } from "lucide-react";
import { PLACE_CATEGORIES } from "@/content/smart-map/categories";
import { haversineKm, nearbyPlaces, searchPlaces } from "@/content/smart-map/places";
import { DEFAULT_CENTER } from "@/lib/map/styles";
import { PHASE1_NEARBY_CATEGORIES } from "@/lib/features/flags";
import { usePublicSafetyEnabled } from "@/lib/features/use-feature-flag";
import { useMapStore } from "@/stores/map-store";
import { getCategoryMeta } from "@/content/smart-map/categories";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const activeCategory = useMapStore((s) => s.activeCategory);
  const setActiveCategory = useMapStore((s) => s.setActiveCategory);
  const setSelectedPlaceId = useMapStore((s) => s.setSelectedPlaceId);
  const setDestination = useMapStore((s) => s.setDestination);
  const userLocation = useMapStore((s) => s.userLocation) ?? DEFAULT_CENTER;
  const publicSafety = usePublicSafetyEnabled();

  const categories = publicSafety
    ? PLACE_CATEGORIES
    : PLACE_CATEGORIES.filter((c) =>
        (PHASE1_NEARBY_CATEGORIES as readonly string[]).includes(c.id),
      );

  const results = useMemo(() => {
    const base =
      !query.trim() && activeCategory === "all"
        ? nearbyPlaces(userLocation, "all", 40)
        : searchPlaces(query, activeCategory).map((p) => ({
            ...p,
            distanceKm: haversineKm(userLocation, p.coordinates),
          }));

    if (publicSafety) return base.slice(0, 20);

    return base
      .filter((p) => (PHASE1_NEARBY_CATEGORIES as readonly string[]).includes(p.category))
      .slice(0, 20);
  }, [query, activeCategory, userLocation, publicSafety]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-6 sm:px-6">
      <header className="sm-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wide text-sm-emerald">Smart Search</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-sm-primary dark:text-white">
          Find trusted places nearby
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Phase 1 essentials: police, fire, hospitals, pharmacies, schools, universities, and hostels.
        </p>
      </header>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-sm-border bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-sm-primary-deep">
        <SearchIcon className="h-5 w-5 text-sm-primary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hospitals, police, schools…"
          className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
          autoFocus
          aria-label="Search places"
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold ${
            activeCategory === "all" ? "bg-sm-primary text-white" : "bg-white dark:bg-sm-primary-deep"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold ${
              activeCategory === cat.id ? "bg-sm-primary text-white" : "bg-white dark:bg-sm-primary-deep"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {results.map((place) => {
          const meta = getCategoryMeta(place.category);
          return (
            <li
              key={place.id}
              className="rounded-3xl border border-sm-border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-sm-primary-deep"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-sm-emerald">
                    {meta.emoji} {meta.label}
                    {"distanceKm" in place && place.distanceKm != null
                      ? ` · ${place.distanceKm.toFixed(1)} km`
                      : ""}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold">{place.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {place.address}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/"
                    onClick={() => setSelectedPlaceId(place.id)}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-bold dark:bg-white/10"
                  >
                    Map
                  </Link>
                  <Link
                    href="/navigate"
                    onClick={() => setDestination(place)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-sm-primary px-3 py-2 text-xs font-bold text-white"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    Go
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="rounded-3xl border border-dashed border-sm-border p-8 text-center text-sm text-slate-500">
            No places match that search. Try another category or keyword.
          </li>
        )}
      </ul>
    </div>
  );
}
