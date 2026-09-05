"use client";

import { useEffect } from "react";
import type { Map as MapLibreMapType } from "maplibre-gl";
import type { AdvancedRoutePlan } from "@/lib/navigation/types";
import { getRegisteredMap, subscribeMapInstance } from "@/lib/map/map-instance-registry";
import { clearRoutesFromMap, renderRoutesOnMap } from "@/lib/map/route-map-layer";

interface RouteMapOverlayProps {
  routes: AdvancedRoutePlan[];
  activeRouteId: string | null;
}

export function RouteMapOverlay({ routes, activeRouteId }: RouteMapOverlayProps) {
  useEffect(() => {
    let cancelled = false;
    let detachMapListeners: (() => void) | undefined;

    const draw = (map: MapLibreMapType) => {
      if (cancelled) return;
      if (routes.length === 0) {
        clearRoutesFromMap(map);
        return;
      }
      renderRoutesOnMap(map, routes, activeRouteId);
    };

    const bindMap = (map: MapLibreMapType | null) => {
      detachMapListeners?.();
      detachMapListeners = undefined;
      if (!map || cancelled) return;

      const onStyle = () => draw(map);
      map.on("styledata", onStyle);
      detachMapListeners = () => map.off("styledata", onStyle);

      if (map.isStyleLoaded()) draw(map);
      else map.once("load", () => draw(map));
    };

    bindMap(getRegisteredMap());
    const unsubscribe = subscribeMapInstance(bindMap);

    return () => {
      cancelled = true;
      detachMapListeners?.();
      unsubscribe();
      const map = getRegisteredMap();
      if (map) clearRoutesFromMap(map);
    };
  }, [routes, activeRouteId]);

  return null;
}
