"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { type Map, type Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PLACES } from "@/content/smart-map/places";
import { getCategoryMeta } from "@/content/smart-map/categories";
import { MAP_STYLE_URLS, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/map/styles";
import { useMapStore } from "@/stores/map-store";
import { getCountry } from "@/content/smart-map/countries";
import type { Place } from "@/types/smart-map";

interface MapViewProps {
  places?: Place[];
  className?: string;
  interactive?: boolean;
  onPlaceSelect?: (place: Place) => void;
}

export function MapView({
  places = PLACES,
  className = "",
  interactive = true,
  onPlaceSelect,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const userMarkerRef = useRef<Marker | null>(null);
  const [ready, setReady] = useState(false);

  const mapStyle = useMapStore((s) => s.mapStyle);
  const countryCode = useMapStore((s) => s.countryCode);
  const userLocation = useMapStore((s) => s.userLocation);
  const selectedPlaceId = useMapStore((s) => s.selectedPlaceId);
  const activeCategory = useMapStore((s) => s.activeCategory);
  const setSelectedPlaceId = useMapStore((s) => s.setSelectedPlaceId);
  const setUserLocation = useMapStore((s) => s.setUserLocation);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const country = getCountry(countryCode);
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE_URLS[mapStyle] ?? MAP_STYLE_URLS.streets,
      center: [country.center.lng, country.center.lat],
      zoom: country.zoom || DEFAULT_ZOOM,
      attributionControl: { compact: true },
      interactive,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }), "bottom-right");
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100 }), "bottom-left");

    map.on("load", () => setReady(true));
    mapRef.current = map;

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
        },
        () => {
          setUserLocation(DEFAULT_CENTER);
        },
        { enableHighAccuracy: true, timeout: 8000 },
      );
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      userMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // Intentionally init once per mount / country; style updates handled separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, setUserLocation, countryCode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const styleUrl = MAP_STYLE_URLS[mapStyle];
    if (styleUrl) map.setStyle(styleUrl);
  }, [mapStyle, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered =
      activeCategory === "all" ? places : places.filter((p) => p.category === activeCategory);

    filtered.forEach((place) => {
      const meta = getCategoryMeta(place.category);
      const el = document.createElement("button");
      el.type = "button";
      el.className = "sm-map-marker";
      el.style.cssText = `
        width: 34px; height: 34px; border-radius: 999px; border: 2px solid white;
        background: ${meta.color}; color: white; font-size: 14px; line-height: 1;
        display: grid; place-items: center; box-shadow: 0 8px 20px rgba(15,76,129,0.35);
        cursor: pointer; transform: translateY(0); transition: transform .15s ease;
      `;
      el.textContent = meta.emoji;
      el.setAttribute("aria-label", place.name);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedPlaceId(place.id);
        onPlaceSelect?.(place);
        map.flyTo({ center: [place.coordinates.lng, place.coordinates.lat], zoom: 14, essential: true });
      });

      if (selectedPlaceId === place.id) {
        el.style.transform = "scale(1.2)";
        el.style.zIndex = "2";
      }

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([place.coordinates.lng, place.coordinates.lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [places, activeCategory, ready, selectedPlaceId, setSelectedPlaceId, onPlaceSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !userLocation) return;

    userMarkerRef.current?.remove();
    const el = document.createElement("div");
    el.style.cssText = `
      width: 18px; height: 18px; border-radius: 999px; background: #0E9F6E;
      border: 3px solid white; box-shadow: 0 0 0 6px rgba(14,159,110,0.25);
    `;
    userMarkerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map);
  }, [userLocation, ready]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-gradient-to-br from-sm-primary via-[#0B3A63] to-sm-emerald">
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/20" />
            <p className="font-display text-lg font-bold tracking-tight">Loading Smart Map…</p>
          </div>
        </div>
      )}
    </div>
  );
}
