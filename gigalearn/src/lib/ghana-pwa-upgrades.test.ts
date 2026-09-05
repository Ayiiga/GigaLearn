import { describe, expect, it } from "vitest";
import {
  BEDOMASE_COORDINATES,
  matchesGhanaRoute,
  OFINSO_JUANSA_ROUTE,
  resolveRoutePreviewSteps,
} from "@/content/smart-map/ghana-route-steps";
import { localizeVoiceStep, translateStepToTwi } from "@/lib/navigation/voice-ghana";
import { buildSosMessage, formatSosLocation } from "@/lib/safety/sos-share";
import { ghanaPackTileUrls } from "@/lib/offline/ghana-tile-pack";

describe("Ghana route preview steps", () => {
  it("includes Head south for Ofinso - Juansa Rd", () => {
    expect(OFINSO_JUANSA_ROUTE.previewSteps[0]).toBe("Head south on Ofinso - Juansa Rd");
  });

  it("matches Ofinso Juansa destination labels", () => {
    expect(matchesGhanaRoute("Bedomase", "Ofinso - Juansa Rd")).toEqual(OFINSO_JUANSA_ROUTE);
  });

  it("prefers Ghana preview steps over engine steps", () => {
    const steps = resolveRoutePreviewSteps(["Depart from test"], "Bedomase", "Ofinso - Juansa Rd");
    expect(steps[0]).toContain("Head south");
  });
});

describe("Ghana voice localization", () => {
  it("translates Head south to Twi", () => {
    expect(translateStepToTwi("Head south on Ofinso - Juansa Rd")).toContain("kusiw fam");
  });

  it("localizes preview step by language", () => {
    expect(localizeVoiceStep("Turn left at Agona junction", "tw")).toContain("benkum");
  });
});

describe("SOS share helpers", () => {
  it("formats Bedomase GPS coordinates", () => {
    expect(formatSosLocation(BEDOMASE_COORDINATES)).toBe("6.958492, -1.500275");
  });

  it("builds SOS message with live GPS", () => {
    expect(buildSosMessage(BEDOMASE_COORDINATES)).toContain("6.958492, -1.500275");
  });
});

describe("Ghana offline tile pack", () => {
  it("generates bounded tile URLs for Ashanti hubs", () => {
    const urls = ghanaPackTileUrls();
    expect(urls.length).toBeGreaterThan(20);
    expect(urls.some((u) => u.includes("tiles.openfreemap.org"))).toBe(true);
  });
});
