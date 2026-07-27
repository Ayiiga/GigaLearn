import type { MapStyle } from "@/types/smart-map";

/** Free vector styles via OpenFreeMap — no API key required. */
export const MAP_STYLE_URLS: Record<MapStyle, string> = {
  streets: "https://tiles.openfreemap.org/styles/liberty",
  dark: "https://tiles.openfreemap.org/styles/dark",
  terrain: "https://tiles.openfreemap.org/styles/liberty",
  satellite: "https://tiles.openfreemap.org/styles/liberty",
};

export const DEFAULT_CENTER = { lat: 5.6037, lng: -0.187 };
export const DEFAULT_ZOOM = 12;
