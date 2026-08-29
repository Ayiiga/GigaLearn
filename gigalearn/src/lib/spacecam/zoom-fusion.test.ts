import { describe, expect, it } from "vitest";
import { formatSpaceCamScale, getZoomFusionState, requiresMapView } from "./zoom-fusion";

describe("Zoom Fusion Engine", () => {
  it("uses device capture at the closest scale", () => {
    expect(getZoomFusionState(0)).toMatchObject({ source: "real-capture", scaleMeters: 2.4 });
  });

  it("moves outward through geospatial and conceptual sources", () => {
    expect(getZoomFusionState(45).source).toBe("satellite");
    expect(getZoomFusionState(70).source).toBe("earth");
    expect(getZoomFusionState(98).source).toBe("simulation");
    expect(getZoomFusionState(100).source).toBe("astronomical");
  });

  it("formats scales without presenting them as camera resolution", () => {
    expect(formatSpaceCamScale(2.4)).toBe("2.4 m");
    expect(formatSpaceCamScale(12_600)).toBe("12.6 km");
    expect(formatSpaceCamScale(384_400_000)).toBe("384,400 km");
  });

  it("only requests the existing map at the satellite stage", () => {
    expect(requiresMapView("satellite")).toBe(true);
    expect(requiresMapView("earth")).toBe(false);
  });
});
