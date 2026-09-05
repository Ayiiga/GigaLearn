import { LngLatBounds } from "maplibre-gl";
import type { GeoJSONSource, Map as MapLibreMapType } from "maplibre-gl";
import type { Coordinates } from "@/types/smart-map";
import type { AdvancedRoutePlan } from "@/lib/navigation/types";
import { clearRouteMarkers, renderRouteMarkers } from "@/lib/map/route-map-markers";

const ACTIVE_SOURCE = "sm-route-active";
const ALT_SOURCE = "sm-route-alt";
const ACTIVE_LINE = "sm-route-active-line";
const ACTIVE_OUTLINE = "sm-route-active-outline";
const ACTIVE_CASING = "sm-route-active-casing";
const ALT_LINE = "sm-route-alt-line";

/** Google Maps–style route colors */
const GOOGLE_ACTIVE = "#1A73E8";
const GOOGLE_ACTIVE_DARK = "#1558B0";
const GOOGLE_ALT = "#8AB4F8";

function lineFeature(
  polyline: Coordinates[],
  props: Record<string, string | number | boolean> = {},
): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: "Feature",
    properties: props,
    geometry: {
      type: "LineString",
      coordinates: densifyPolyline(polyline).map((p) => [p.lng, p.lat]),
    },
  };
}

/** Smooth corridor for Google Maps–style route rendering. */
function densifyPolyline(points: Coordinates[], segments = 24): Coordinates[] {
  if (points.length < 2) return points;
  const dense: Coordinates[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    for (let step = 0; step < segments; step++) {
      const t = step / segments;
      dense.push({
        lat: a.lat + (b.lat - a.lat) * t,
        lng: a.lng + (b.lng - a.lng) * t,
      });
    }
  }
  dense.push(points[points.length - 1]);
  return dense;
}

function styleHasLayers(map: MapLibreMapType): boolean {
  return Boolean(map.getStyle()?.layers?.length);
}

function whenStyleReady(map: MapLibreMapType, run: () => void): void {
  if (styleHasLayers(map)) {
    run();
    return;
  }
  map.once("styledata", () => whenStyleReady(map, run));
}

function removeLayerIfExists(map: MapLibreMapType, id: string): void {
  if (map.getLayer(id)) map.removeLayer(id);
}

function removeSourceIfExists(map: MapLibreMapType, id: string): void {
  if (map.getSource(id)) map.removeSource(id);
}

function clearRouteLineLayers(map: MapLibreMapType): void {
  [ACTIVE_CASING, ACTIVE_OUTLINE, ACTIVE_LINE, ALT_LINE].forEach((id) =>
    removeLayerIfExists(map, id),
  );
  [ACTIVE_SOURCE, ALT_SOURCE].forEach((id) => removeSourceIfExists(map, id));
}

function ensureRouteLineLayers(map: MapLibreMapType): void {
  if (map.getSource(ALT_SOURCE)) return;

  map.addSource(ALT_SOURCE, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });
  map.addLayer({
    id: ALT_LINE,
    type: "line",
    source: ALT_SOURCE,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": GOOGLE_ALT,
      "line-width": ["interpolate", ["linear"], ["zoom"], 8, 4, 14, 7],
      "line-opacity": 0.95,
    },
  });

  map.addSource(ACTIVE_SOURCE, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });
  map.addLayer({
    id: ACTIVE_CASING,
    type: "line",
    source: ACTIVE_SOURCE,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#ffffff",
      "line-width": ["interpolate", ["linear"], ["zoom"], 8, 8, 14, 14],
      "line-opacity": 0.95,
    },
  });
  map.addLayer({
    id: ACTIVE_OUTLINE,
    type: "line",
    source: ACTIVE_SOURCE,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": GOOGLE_ACTIVE_DARK,
      "line-width": ["interpolate", ["linear"], ["zoom"], 8, 7, 14, 12],
    },
  });
  map.addLayer({
    id: ACTIVE_LINE,
    type: "line",
    source: ACTIVE_SOURCE,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": GOOGLE_ACTIVE,
      "line-width": ["interpolate", ["linear"], ["zoom"], 8, 5, 14, 9],
    },
  });
}

export interface RenderRoutesOptions {
  fit?: boolean;
  origin?: Coordinates;
  destination?: Coordinates;
}

export function renderRoutesOnMap(
  map: MapLibreMapType,
  routes: AdvancedRoutePlan[],
  activeRouteId: string | null,
  options: RenderRoutesOptions = {},
): void {
  whenStyleReady(map, () => {
    clearRouteLineLayers(map);
    clearRouteMarkers();

    if (routes.length === 0) return;

    ensureRouteLineLayers(map);

    const active = routes.find((r) => r.id === activeRouteId) ?? routes[0];
    const alternatives = routes.filter((r) => r.id !== active.id);

    const altSource = map.getSource(ALT_SOURCE) as GeoJSONSource;
    altSource.setData({
      type: "FeatureCollection",
      features: alternatives.map((route) => lineFeature(route.polyline, { id: route.id })),
    });

    const activeSource = map.getSource(ACTIVE_SOURCE) as GeoJSONSource;
    activeSource.setData({
      type: "FeatureCollection",
      features: [lineFeature(active.polyline, { id: active.id, active: true })],
    });

    const origin = options.origin ?? active.from.coordinates;
    const destination = options.destination ?? active.to.coordinates;
    renderRouteMarkers(map, routes, activeRouteId, origin, destination);

    if (options.fit !== false) {
      const bounds = new LngLatBounds(
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      );
      for (const route of routes) {
        route.polyline.forEach((p) => bounds.extend([p.lng, p.lat]));
      }
      map.fitBounds(bounds, {
        padding: { top: 100, bottom: 300, left: 40, right: 40 },
        maxZoom: routes.some((r) => r.distanceKm > 80) ? 8 : 13,
        duration: 900,
      });
    }
  });
}

export function clearRoutesFromMap(map: MapLibreMapType): void {
  if (!styleHasLayers(map)) return;
  clearRouteLineLayers(map);
  clearRouteMarkers();
}
