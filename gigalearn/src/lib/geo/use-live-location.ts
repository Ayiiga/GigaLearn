"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  formatAccuracy,
  getCurrentFix,
  isValidCoordinates,
  readGeolocationPermission,
  watchLocation,
} from "@/lib/geo/geolocation";
import type { ResolvedAddress } from "@/lib/geo/types";
import { useMapStore } from "@/stores/map-store";

async function fetchReverse(lat: number, lng: number): Promise<ResolvedAddress | null> {
  try {
    const res = await fetch(`/api/geo/reverse?lat=${lat}&lng=${lng}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { address?: ResolvedAddress };
    return data.address ?? null;
  } catch {
    return null;
  }
}

/**
 * Starts continuous GPS tracking and reverse-geocoding into the map store.
 * Safe to mount once in the app shell.
 */
export function useLiveLocation(enabled = true) {
  const setUserLocation = useMapStore((s) => s.setUserLocation);
  const setLocationMeta = useMapStore((s) => s.setLocationMeta);
  const setLocationPermission = useMapStore((s) => s.setLocationPermission);
  const setResolvedAddress = useMapStore((s) => s.setResolvedAddress);
  const locationPermission = useMapStore((s) => s.locationPermission);
  const lastReverseAt = useRef(0);
  const lastReverseKey = useRef("");

  const reverseIfNeeded = useCallback(
    async (lat: number, lng: number) => {
      const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      const now = Date.now();
      if (key === lastReverseKey.current && now - lastReverseAt.current < 45_000) return;
      lastReverseKey.current = key;
      lastReverseAt.current = now;
      const address = await fetchReverse(lat, lng);
      if (address) setResolvedAddress(address);
    },
    [setResolvedAddress],
  );

  const applyFix = useCallback(
    (fix: {
      coordinates: { lat: number; lng: number };
      accuracyM: number | null;
      speedMps: number | null;
      timestamp: number;
    }) => {
      if (!isValidCoordinates(fix.coordinates)) return;
      setUserLocation(fix.coordinates);
      setLocationMeta({
        accuracyM: fix.accuracyM,
        speedMps: fix.speedMps,
        updatedAt: fix.timestamp,
        source: "gps",
      });
      setLocationPermission("granted");
      void reverseIfNeeded(fix.coordinates.lat, fix.coordinates.lng);
    },
    [reverseIfNeeded, setLocationMeta, setLocationPermission, setUserLocation],
  );

  const requestLocation = useCallback(async () => {
    setLocationPermission("prompt");
    try {
      const fix = await getCurrentFix();
      applyFix(fix);
      return true;
    } catch {
      const permission = await readGeolocationPermission();
      setLocationPermission(permission === "granted" ? "denied" : permission);
      setLocationMeta({
        accuracyM: null,
        speedMps: null,
        updatedAt: Date.now(),
        source: "none",
      });
      return false;
    }
  }, [applyFix, setLocationMeta, setLocationPermission]);

  useEffect(() => {
    if (!enabled) return;
    let stopWatch: () => void = () => undefined;
    let cancelled = false;

    void (async () => {
      const permission = await readGeolocationPermission();
      if (cancelled) return;
      setLocationPermission(permission);
      if (permission === "denied" || permission === "unavailable") return;

      try {
        const fix = await getCurrentFix();
        if (cancelled) return;
        applyFix(fix);
      } catch {
        if (!cancelled) {
          const next = await readGeolocationPermission();
          setLocationPermission(next === "granted" ? "denied" : next);
        }
      }

      stopWatch = watchLocation(
        (fix) => {
          if (!cancelled) applyFix(fix);
        },
        async () => {
          if (cancelled) return;
          const next = await readGeolocationPermission();
          if (next === "denied") setLocationPermission("denied");
        },
      );
    })();

    return () => {
      cancelled = true;
      stopWatch();
    };
  }, [applyFix, enabled, setLocationPermission]);

  return {
    requestLocation,
    locationPermission,
    formatAccuracy,
  };
}
