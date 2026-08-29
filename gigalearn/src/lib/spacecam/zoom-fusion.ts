export type SpaceCamSource =
  | "real-capture"
  | "optical"
  | "computational"
  | "satellite"
  | "earth"
  | "simulation"
  | "astronomical";

export interface ZoomFusionState {
  source: SpaceCamSource;
  scaleMeters: number;
  label: string;
  description: string;
  isExternal: boolean;
}

interface SourceDefinition extends ZoomFusionState {
  maxScaleMeters: number;
}

const SOURCES: SourceDefinition[] = [
  {
    source: "real-capture",
    maxScaleMeters: 10,
    scaleMeters: 2.4,
    label: "REAL CAPTURE",
    description: "Captured by this device camera.",
    isExternal: false,
  },
  {
    source: "optical",
    maxScaleMeters: 25,
    scaleMeters: 12,
    label: "OPTICAL",
    description: "Using available physical camera optics.",
    isExternal: false,
  },
  {
    source: "computational",
    maxScaleMeters: 100,
    scaleMeters: 50,
    label: "COMPUTATIONAL",
    description: "Enhanced from captured frames; not additional optical detail.",
    isExternal: false,
  },
  {
    source: "satellite",
    maxScaleMeters: 100_000,
    scaleMeters: 12_600,
    label: "SATELLITE",
    description: "Map imagery from the configured geospatial provider.",
    isExternal: true,
  },
  {
    source: "earth",
    maxScaleMeters: 7_000_000,
    scaleMeters: 6_400_000,
    label: "EARTH VIEW",
    description: "3D-style Earth scale visualization.",
    isExternal: true,
  },
  {
    source: "simulation",
    maxScaleMeters: 10_000_000_000,
    scaleMeters: 384_400_000,
    label: "SIMULATION",
    description: "Conceptual orbital-scale visualization, not live camera footage.",
    isExternal: true,
  },
  {
    source: "astronomical",
    maxScaleMeters: Number.POSITIVE_INFINITY,
    scaleMeters: 1_500_000_000,
    label: "ASTRONOMICAL DATA",
    description: "Conceptual deep-space view; no live astronomical feed is loaded.",
    isExternal: true,
  },
];

export function getZoomFusionState(zoom: number): ZoomFusionState {
  const normalizedZoom = Math.max(0, Math.min(100, zoom));
  const scaleMeters = 2.4 * 10 ** (normalizedZoom / 15);
  const source = SOURCES.find((item) => scaleMeters <= item.maxScaleMeters) ?? SOURCES.at(-1)!;
  return { ...source, scaleMeters };
}

export function formatSpaceCamScale(meters: number): string {
  if (meters >= 1_000_000) {
    return `${Math.round(meters / 1_000).toLocaleString()} km`;
  }
  if (meters >= 1_000) return `${(meters / 1_000).toFixed(meters >= 100_000 ? 0 : 1)} km`;
  return `${meters.toFixed(meters < 10 ? 1 : 0)} m`;
}

export function requiresMapView(source: SpaceCamSource): boolean {
  return source === "satellite";
}
