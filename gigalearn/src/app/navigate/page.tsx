"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  Bike,
  Briefcase,
  Bus,
  Car,
  Footprints,
  Home,
  MapPinned,
  Mic,
  Navigation,
  Route,
  ShieldAlert,
} from "lucide-react";
import { PlaceAutocomplete } from "@/components/smart-map/place-autocomplete";
import { LocationHud, LocationPermissionCard } from "@/components/smart-map/location-hud";
import { LiveLayerToggles } from "@/components/smart-map/live-layer-toggles";
import { useMapStore } from "@/stores/map-store";
import type { TravelMode } from "@/types/smart-map";
import type { GeoSearchResult, NavEndpoint } from "@/lib/geo/types";
import { cn } from "@/lib/utils";
import {
  formatDuration,
  planAdvancedRoutes,
} from "@/lib/navigation/route-engine";
import { analyzeRouteSafety } from "@/lib/navigation/safety-analysis";

const MapView = dynamic(
  () => import("@/components/smart-map/map-view").then((m) => m.MapView),
  { ssr: false },
);

const MODES: { id: TravelMode; label: string; icon: typeof Car }[] = [
  { id: "driving", label: "Car", icon: Car },
  { id: "transit", label: "Bus", icon: Bus },
  { id: "motorcycle", label: "Moto", icon: Bike },
  { id: "cycling", label: "Cycle", icon: Bike },
  { id: "walking", label: "Walk", icon: Footprints },
];

function endpointFromGeo(result: GeoSearchResult, source: NavEndpoint["source"]): NavEndpoint {
  return {
    id: result.id,
    label: result.name,
    coordinates: result.coordinates,
    source,
    address: result.label,
  };
}

export default function NavigatePage() {
  const userLocation = useMapStore((s) => s.userLocation);
  const resolvedAddress = useMapStore((s) => s.resolvedAddress);
  const travelMode = useMapStore((s) => s.travelMode);
  const setTravelMode = useMapStore((s) => s.setTravelMode);
  const voiceNav = useMapStore((s) => s.voiceNav);
  const setVoiceNav = useMapStore((s) => s.setVoiceNav);
  const navOrigin = useMapStore((s) => s.navOrigin);
  const navDestination = useMapStore((s) => s.navDestination);
  const setNavOrigin = useMapStore((s) => s.setNavOrigin);
  const setNavDestination = useMapStore((s) => s.setNavDestination);
  const homeLocation = useMapStore((s) => s.homeLocation);
  const workLocation = useMapStore((s) => s.workLocation);
  const setHomeLocation = useMapStore((s) => s.setHomeLocation);
  const setWorkLocation = useMapStore((s) => s.setWorkLocation);
  const recentPlaces = useMapStore((s) => s.recentPlaces) ?? [];
  const savedPlaceIds = useMapStore((s) => s.savedPlaceIds) ?? [];
  const setPickOnMapMode = useMapStore((s) => s.setPickOnMapMode);
  const destination = useMapStore((s) => s.destination);

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [selectedPreference, setSelectedPreference] = useState<"fastest" | "shortest" | "safest">(
    "fastest",
  );
  const [navigating, setNavigating] = useState(false);

  // Default From = current GPS. Only write when missing or values actually changed
  // (avoid Maximum update depth from recreating navOrigin every render / GPS tick).
  useEffect(() => {
    if (!userLocation) return;
    if (navOrigin && navOrigin.source !== "gps") return;

    const label = resolvedAddress?.label
      ? `Current Location · ${resolvedAddress.city || resolvedAddress.label}`
      : "📍 Current Location";
    const address = resolvedAddress?.label;

    if (
      navOrigin?.source === "gps" &&
      Math.abs(navOrigin.coordinates.lat - userLocation.lat) < 1e-7 &&
      Math.abs(navOrigin.coordinates.lng - userLocation.lng) < 1e-7 &&
      navOrigin.label === label &&
      navOrigin.address === address
    ) {
      return;
    }

    setNavOrigin({
      id: "gps-current",
      label,
      coordinates: userLocation,
      source: "gps",
      address,
    });
  }, [userLocation, resolvedAddress, navOrigin, setNavOrigin]);

  // Sync legacy destination place into navDestination
  useEffect(() => {
    if (destination && !navDestination) {
      setNavDestination({
        id: destination.id,
        label: destination.name,
        coordinates: destination.coordinates,
        source: "search",
        placeId: destination.id,
        address: destination.address,
      });
      setToQuery(destination.name);
    }
  }, [destination, navDestination, setNavDestination]);

  const origin = navOrigin;
  const dest = navDestination;

  const routes = useMemo(() => {
    if (!origin || !dest) return [];
    return planAdvancedRoutes({
      from: {
        id: origin.id,
        label: origin.label,
        coordinates: origin.coordinates,
      },
      to: {
        id: dest.id,
        label: dest.label,
        coordinates: dest.coordinates,
      },
      mode: travelMode,
      avoid: { traffic: true, unpaved: true },
      preferences: ["fastest", "shortest", "safest"],
    });
  }, [origin, dest, travelMode]);

  const active = routes.find((r) => r.preference === selectedPreference) ?? routes[0] ?? null;

  const multiModeEta = useMemo(() => {
    if (!origin || !dest) return null;
    const modes: TravelMode[] = ["driving", "walking", "cycling", "transit", "motorcycle"];
    return Object.fromEntries(
      modes.map((mode) => {
        const [plan] = planAdvancedRoutes({
          from: { id: "o", label: "o", coordinates: origin.coordinates },
          to: { id: "d", label: "d", coordinates: dest.coordinates },
          mode,
          preferences: ["fastest"],
        });
        return [mode, plan];
      }),
    ) as Record<TravelMode, (typeof routes)[0]>;
  }, [origin, dest]);

  const safety = useMemo(() => {
    if (!active) return [];
    return analyzeRouteSafety({
      distanceKm: active.distanceKm,
      polyline: active.polyline,
      preference: active.preference,
      mode: travelMode,
    });
  }, [active, travelMode]);

  function useCurrentLocation() {
    if (!userLocation) {
      setPickOnMapMode("origin");
      return;
    }
    setNavOrigin({
      id: "gps-current",
      label: "📍 Current Location",
      coordinates: userLocation,
      source: "gps",
      address: resolvedAddress?.label,
    });
    setFromQuery("");
  }

  return (
    <div className="relative h-[100dvh] w-full">
      <MapView places={[]} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 max-h-[100dvh] overflow-y-auto p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-xl flex-col gap-3 pb-28">
          <LocationPermissionCard compact />
          <LocationHud />

          <section className="rounded-3xl border border-white/30 bg-white/92 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/92">
            <p className="text-xs font-semibold uppercase tracking-wide text-sm-emerald">
              From → To navigation
            </p>
            <h1 className="mt-1 font-display text-2xl font-extrabold">Plan a global route</h1>

            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">From</p>
                <p className="mt-1 text-sm font-semibold">
                  {origin?.label ?? "Set starting point"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="rounded-full bg-sm-primary/10 px-3 py-1.5 text-xs font-bold text-sm-primary"
                  >
                    📍 Current Location
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (homeLocation) setNavOrigin(homeLocation);
                      else if (userLocation) {
                        const ep: NavEndpoint = {
                          id: "home",
                          label: "My Home",
                          coordinates: userLocation,
                          source: "home",
                        };
                        setHomeLocation(ep);
                        setNavOrigin(ep);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold dark:bg-white/10"
                  >
                    <Home className="h-3.5 w-3.5" /> My Home
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (workLocation) setNavOrigin(workLocation);
                      else if (userLocation) {
                        const ep: NavEndpoint = {
                          id: "work",
                          label: "My Work",
                          coordinates: userLocation,
                          source: "work",
                        };
                        setWorkLocation(ep);
                        setNavOrigin(ep);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold dark:bg-white/10"
                  >
                    <Briefcase className="h-3.5 w-3.5" /> My Work
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickOnMapMode("origin")}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold dark:bg-white/10"
                  >
                    <MapPinned className="h-3.5 w-3.5" /> Pick on Map
                  </button>
                </div>
                <PlaceAutocomplete
                  className="mt-2"
                  value={fromQuery}
                  onChange={setFromQuery}
                  placeholder="Search From location worldwide…"
                  onSelect={(result) => setNavOrigin(endpointFromGeo(result, "search"))}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-slate-500">To</p>
                <p className="mt-1 text-sm font-semibold">{dest?.label ?? "Search destination"}</p>
                <PlaceAutocomplete
                  className="mt-2"
                  value={toQuery}
                  onChange={setToQuery}
                  placeholder="Search anywhere in the world…"
                  onSelect={(result) => setNavDestination(endpointFromGeo(result, "search"))}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPickOnMapMode("destination")}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold dark:bg-white/10"
                  >
                    <MapPinned className="h-3.5 w-3.5" /> Pick on Map
                  </button>
                </div>
                {recentPlaces.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[11px] font-semibold text-slate-500">Recent</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {recentPlaces.slice(0, 5).map((place) => (
                        <button
                          key={place.id}
                          type="button"
                          onClick={() => setNavDestination(place)}
                          className="rounded-full bg-sm-emerald/10 px-2.5 py-1 text-[11px] font-semibold text-sm-emerald"
                        >
                          {place.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {savedPlaceIds.length > 0 && (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Favorites available from Search / map sheets ({savedPlaceIds.length} saved).
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {MODES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTravelMode(id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-bold",
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

            {routes.length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {routes.map((route) => (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedPreference(route.preference as "fastest" | "shortest" | "safest")}
                    className={cn(
                      "min-w-[7.5rem] shrink-0 rounded-2xl border px-3 py-2 text-left text-xs",
                      active?.id === route.id
                        ? "border-sm-primary bg-sm-primary/10"
                        : "border-sm-border dark:border-white/10",
                    )}
                  >
                    <p className="font-bold">{route.label}</p>
                    <p>
                      {route.distanceKm.toFixed(1)} km · {formatDuration(route.durationMin)}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {active && (
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sm-primary/10 px-3 py-1 font-semibold text-sm-primary">
                    {active.distanceKm.toFixed(1)} km
                  </span>
                  <span className="rounded-full bg-sm-emerald/10 px-3 py-1 font-semibold text-sm-emerald">
                    {formatDuration(active.durationMin)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold dark:bg-white/10">
                    ETA{" "}
                    {new Date(active.etaIso).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {active.fuelLiters != null && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold dark:bg-white/10">
                      ~{active.fuelLiters} L fuel
                    </span>
                  )}
                </div>
                {multiModeEta && (
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                    <p>🚗 Car {formatDuration(multiModeEta.driving.durationMin)}</p>
                    <p>🚶 Walk {formatDuration(multiModeEta.walking.durationMin)}</p>
                    <p>🚲 Cycle {formatDuration(multiModeEta.cycling.durationMin)}</p>
                    <p>🚌 Bus {formatDuration(multiModeEta.transit.durationMin)}</p>
                    <p>🏍 Moto {formatDuration(multiModeEta.motorcycle.durationMin)}</p>
                  </div>
                )}
                <ol className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  {active.steps.slice(0, 4).map((step) => (
                    <li key={step} className="flex gap-2">
                      <Route className="mt-0.5 h-4 w-4 shrink-0 text-sm-primary" />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {safety.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <p className="inline-flex items-center gap-1 text-xs font-bold uppercase text-amber-700">
                  <ShieldAlert className="h-3.5 w-3.5" /> AI safety
                </p>
                {safety.slice(0, 4).map((w) => (
                  <p
                    key={w.id}
                    className="rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-100"
                  >
                    {w.label} — {w.message}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={!active}
                onClick={() => setNavigating(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sm-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
              >
                <Navigation className="h-4 w-4" />
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
          </section>

          <LiveLayerToggles />
        </div>
      </div>
    </div>
  );
}
