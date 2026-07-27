import { describe, expect, it } from "vitest";
import {
  FEATURE_FLAGS,
  isFeatureEnabled,
  isPhase2Route,
  isPhase3Route,
  PHASE1_NEARBY_CATEGORIES,
} from "./flags";

describe("feature flags", () => {
  it("keeps Phase 1 always on and Phase 2/3 off by default", () => {
    expect(FEATURE_FLAGS.phase1Foundation).toBe(true);
    expect(FEATURE_FLAGS.publicSafetyPhase2).toBe(false);
    expect(FEATURE_FLAGS.aiExpansionPhase3).toBe(false);
    expect(isFeatureEnabled("publicSafetyPhase2")).toBe(false);
    expect(isFeatureEnabled("aiExpansionPhase3")).toBe(false);
  });

  it("classifies phase routes correctly", () => {
    expect(isPhase2Route("/safety")).toBe(true);
    expect(isPhase2Route("/community")).toBe(true);
    expect(isPhase2Route("/weather")).toBe(true);
    expect(isPhase2Route("/search")).toBe(false);
    expect(isPhase3Route("/ai-assistant")).toBe(true);
    expect(isPhase3Route("/business")).toBe(true);
    expect(isPhase3Route("/dashboard/admin")).toBe(true);
    expect(isPhase3Route("/dashboard")).toBe(false);
  });

  it("defines Phase 1 nearby essentials", () => {
    expect(PHASE1_NEARBY_CATEGORIES).toContain("police");
    expect(PHASE1_NEARBY_CATEGORIES).toContain("hospital");
    expect(PHASE1_NEARBY_CATEGORIES).toContain("hostel");
  });
});
