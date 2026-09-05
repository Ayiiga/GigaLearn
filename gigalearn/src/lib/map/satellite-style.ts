import type { StyleSpecification } from "maplibre-gl";

/** Lightweight satellite raster style for SpaceCam (no native SDK). */
export const SATELLITE_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Esri World Imagery",
    },
  },
  layers: [
    {
      id: "satellite-layer",
      type: "raster",
      source: "satellite",
    },
  ],
};
