"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, MapPin, Mic, Navigation, Search as SearchIcon } from "lucide-react";
import { PLACE_CATEGORIES, getCategoryMeta } from "@/content/smart-map/categories";
import { haversineKm, nearbyPlaces, searchPlaces } from "@/content/smart-map/places";
import { PHASE1_NEARBY_CATEGORIES } from "@/lib/features/flags";
import { usePublicSafetyEnabled } from "@/lib/features/use-feature-flag";
import { useMapStore } from "@/stores/map-store";
import type { GeoSearchResult } from "@/lib/geo/types";
import type { Place } from "@/types/smart-map";
import { LocationPermissionCard } from "@/components/smart-map/location-hud";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [globalResults, setGlobalResults] = useState<GeoSearchResult[]>([]);
  const [pending, startTransition] = useTransition();
  const [listening, setListening] = useState(false);
  const activeCategory = useMapStore((s) => s.activeCategory);
  const setActiveCategory = useMapStore((s) => s.setActiveCategory);
  const setSelectedPlaceId = useMapStore((s) => s.setSelectedPlaceId);
  const setDestination = useMapStore((s) => s.setDestination);
  const setNavDestination = useMapStore((s) => s.setNavDestination);
  const userLocation = useMapStore((s) => s.userLocation);
  const publicSafety = usePublicSafetyEnabled();

  const categories = publicSafety
    ? PLACE_CATEGORIES
    : PLACE_CATEGORIES.filter((c) =>
        (PHASE1_NEARBY_CATEGORIES as readonly string[]).includes(c.id),
      );

  const localResults = useMemo(() => {
    if (!userLocation) return [];
    const base =
      !query.trim() && activeCategory === "all"
        ? nearbyPlaces(userLocation, "all", 40)
        : searchPlaces(query, activeCategory).map((p) => ({
            ...p,
            distanceKm: haversineKm(userLocation, p.coordinates),
          }));

    if (publicSafety) return base.slice(0, 12);

    return base
      .filter((p) => (PHASE1_NEARBY_CATEGORIES as readonly string[]).includes(p.category))
      .slice(0, 12);
  }, [query, activeCategory, userLocation, publicSafety]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setGlobalResults([]);
      return;
    }
    const timer = window.setTimeout(() => {
      startTransition(() => {
        void (async () => {
          try {
            const res = await fetch(`/api/geo/search?q=${encodeURIComponent(q)}&limit=10`, {
              cache: "no-store",
            });
            const data = (await res.json()) as { results?: GeoSearchResult[] };
            setGlobalResults(data.results ?? []);
          } catch {
            setGlobalResults([]);
          }
        })();
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  function selectGlobal(result: GeoSearchResult) {
    const allowed = new Set(PLACE_CATEGORIES.map((c) => c.id));
    const category = allowed.has(result.category as Place["category"])
      ? (result.category as Place["category"])
      : "attraction";
    const place: Place = {
      id: result.id,
      name: result.name,
      category,
      coordinates: result.coordinates,
      address: result.label,
      city: result.city || "",
      region: result.region || "",
      country: result.country || "",
      countryCode: result.countryCode || "",
    };
    setDestination(place);
    setNavDestination({
      id: result.id,
      label: result.name,
      coordinates: result.coordinates,
      source: "search",
      address: result.label,
    });
  }

  function startVoice() {
    const w = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        start: () => void;
        onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        start: () => void;
        onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
      };
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) setQuery(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-6 sm:px-6">
      <header className="sm-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wide text-sm-emerald">Global Search</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-sm-primary dark:text-white">
          Search anywhere in the world
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Streets, cities, airports, hospitals, hotels, schools, and more — not limited to Ghana.
        </p>
      </header>

      <div className="mt-4">
        <LocationPermissionCard compact />
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-sm-border bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-sm-primary-deep">
        <SearchIcon className="h-5 w-5 text-sm-primary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search London, JFK Airport, Korle Bu, Accra…"
          className="w-full bg-transparent text-base outline-none placeholder:text-slate-400"
          autoFocus
          aria-label="Search places worldwide"
        />
        {pending && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
        <button
          type="button"
          onClick={startVoice}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
            listening ? "bg-sm-emerald text-white" : "bg-slate-100 dark:bg-white/10"
          }`}
          aria-label="Voice search"
        >
          <Mic className="h-4 w-4" />
        </button>
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

      {globalResults.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Worldwide results</h2>
          <ul className="mt-3 space-y-3">
            {globalResults.map((result) => (
              <li
                key={result.id}
                className="rounded-3xl border border-sm-border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-sm-primary-deep"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-sm-emerald">
                      {result.category ?? "place"}
                      {result.country ? ` · ${result.country}` : ""}
                      {userLocation
                        ? ` · ${haversineKm(userLocation, result.coordinates).toFixed(1)} km`
                        : ""}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold">{result.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {result.label}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/"
                      onClick={() => selectGlobal(result)}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-bold dark:bg-white/10"
                    >
                      Map
                    </Link>
                    <Link
                      href="/navigate"
                      onClick={() => selectGlobal(result)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-sm-primary px-3 py-2 text-xs font-bold text-white"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Go
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          {userLocation ? "Nearby curated essentials" : "Enable GPS for nearby essentials"}
        </h2>
        <ul className="mt-3 space-y-3">
          {localResults.map((place) => {
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
                    <h3 className="mt-1 font-display text-lg font-bold">{place.name}</h3>
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
          {query.trim().length >= 2 && globalResults.length === 0 && localResults.length === 0 && !pending && (
            <li className="rounded-3xl border border-dashed border-sm-border p-8 text-center text-sm text-slate-500">
              No places match that search. Try another city, street, or landmark.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
