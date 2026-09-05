import { LngLatBounds } from "maplibre-gl";
import type { GeoJSONSource, Map as MapLibreMapType } from "maplibre-gl";
import type { Coordinates } from "@/types/smart-map";
import type { AdvancedRoutePlan } from "@/lib/navigation/types";

const ACTIVE_SOURCE = "sm-route-active";
const ALT_SOURCE = "sm-route-alt";
const ACTIVE_LINE = "sm-route-active-line";
const ACTIVE_OUTLINE = "sm-route-active-outline";
const ALT_LINE = "sm-route-alt-line";
const ORIGIN_LAYER = "sm-route-origin";
const DEST_LAYER = "sm-route-dest";

function lineFeature(polyline: Coordinates[]): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: polyline.map((p) => [p.lng, p.lat]),
    },
  };
}

function removeLayerIfExists(map: MapLibreMapType, id: string): void {
  if (map.getLayer(id)) map.removeLayer(id);
}

function removeSourceIfExists(map: MapLibreMapType, id: string): void {
  if (map.getSource(id)) map.removeSource(id);
}

function clearRouteLayers(map: MapLibreMapType): void {
  [ORIGIN_LAYER, DEST_LAYER, ACTIVE_LINE, ACTIVE_OUTLINE, ALT_LINE].forEach((id) =>
    removeLayerIfExists(map, id),
  );
  [ACTIVE_SOURCE, ALT_SOURCE].forEach((id) => removeSourceIfExists(map, id));
}

function ensureRouteLayers(map: MapLibreMapType): void {
  if (!map.getSource(ALT_SOURCE)) {
    map.addSource(ALT_SOURCE, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
    map.addLayer({
      id: ALT_LINE,
      type: "line",
      source: ALT_SOURCE,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#7CB9E8", "line-width": 5, "line-opacity": 0.85 },
    });
  }

  if (!map.getSource(ACTIVE_SOURCE)) {
    map.addSource(ACTIVE_SOURCE, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
    map.addLayer({
      id: ACTIVE_OUTLINE,
      type: "line",
      source: ACTIVE_SOURCE,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#083344", "line-width": 10, "line-opacity": 0.35 },
    });
    map.addLayer({
      id: ACTIVE_LINE,
      type: "line",
      source: ACTIVE_SOURCE,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#0F5B8D", "line-width": 6.5 },
    });
  }
}

export function renderRoutesOnMap(
  map: MapLibreMapType,
  routes: AdvancedRoutePlan[],
  activeRouteId: string | null,
  fit = true,
): void {
  if (!map.isStyleLoaded()) return;

  clearRouteLayers(map);
  if (routes.length === 0) return;

  ensureRouteLayers(map);

  const active = routes.find((r) => r.id === activeRouteId) ?? routes[0];
  const alternatives = routes.filter((r) => r.id !== active.id);

  const altSource = map.getSource(ALT_SOURCE) as GeoJSONSource;
  altSource.setData({
    type: "FeatureCollection",
    features: alternatives.map((route) => lineFeature(route.polyline)),
  });

  const activeSource = map.getSource(ACTIVE_SOURCE) as GeoJSONSource;
  activeSource.setData({
    type: "FeatureCollection",
    features: [lineFeature(active.polyline)],
  });

  if (fit) {
    const bounds = new LngLatBounds(
      [active.polyline[0].lng, active.polyline[0].lat],
      [active.polyline[0].lng, active.polyline[0].lat],
    );
    active.polyline.forEach((p) => bounds.extend([p.lng, p.lat]));
    map.fitBounds(bounds, {
      padding: { top: 120, bottom: 280, left: 48, right: 48 },
      maxZoom: 14,
      duration: 800,
    });
  }
}

export function clearRoutesFromMap(map: MapLibreMapType): void {
  if (!map.isStyleLoaded()) return;
  clearRouteLayers(map);
}
