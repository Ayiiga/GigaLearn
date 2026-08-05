"use client";

import Link from "next/link";
import { Bot, CloudSun, MapPin, Siren } from "lucide-react";
import { SmartMapLogo } from "@/components/smart-map/logo";
import { CategoryChips } from "@/components/smart-map/category-chips";
import { PlaceSheet } from "@/components/smart-map/place-sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { LocationHud, LocationPermissionCard } from "@/components/smart-map/location-hud";
import { LiveEmergencyPanel } from "@/components/smart-map/live-emergency-panel";
import { LiveLayerToggles } from "@/components/smart-map/live-layer-toggles";
import { ACCRA_WEATHER } from "@/content/smart-map/weather";
import { useMapStore } from "@/stores/map-store";
import { BRAND } from "@/lib/brand";
import { useAi40Enabled, useAiExpansionEnabled, usePublicSafetyEnabled } from "@/lib/features/use-feature-flag";

export function HomeOverlay() {
  const setSosActive = useMapStore((s) => s.setSosActive);
  const setAiOpen = useMapStore((s) => s.setAiOpen);
  const reports = useMapStore((s) => s.reports);
  const resolvedAddress = useMapStore((s) => s.resolvedAddress);
  const publicSafety = usePublicSafetyEnabled();
  const aiExpansion = useAiExpansionEnabled();
  const ai40 = useAi40Enabled();
  const alertCount = publicSafety
    ? reports.filter((r) => r.status === "verified" || r.status === "verifying").length
    : 0;

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 max-h-[100dvh] overflow-y-auto p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-3 pb-28">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/30 bg-white/85 px-3 py-2.5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/88"
            >
              <SmartMapLogo size="sm" />
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-extrabold leading-none text-sm-primary dark:text-white">
                  {BRAND.name}
                </p>
                <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-300">
                  {resolvedAddress?.city
                    ? `${resolvedAddress.city}${resolvedAddress.country ? `, ${resolvedAddress.country}` : ""}`
                    : `${BRAND.tagline} · Global GPS`}
                </p>
              </div>
            </Link>
            {publicSafety && (
              <Link
                href="/weather"
                className="inline-flex items-center gap-1.5 rounded-2xl border border-white/30 bg-white/85 px-3 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/88"
              >
                <CloudSun className="h-4 w-4 text-sm-safety" />
                {ACCRA_WEATHER.tempC}°
              </Link>
            )}
            <ThemeToggle />
            <UserMenu />
          </div>

          <Link
            href="/search"
            className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/90 px-4 py-3.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/9"
          >
            <MapPin className="h-5 w-5 text-sm-primary" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
              Search worldwide — cities, streets, hospitals, airports…
            </span>
          </Link>

          <LocationPermissionCard />
          <LocationHud />
          <LiveLayerToggles />
          <CategoryChips phase1Only={!publicSafety} />
          <LiveEmergencyPanel />

          {publicSafety && alertCount > 0 && (
            <Link
              href="/community"
              className="inline-flex items-center gap-2 rounded-full bg-sm-danger/95 px-3.5 py-2 text-xs font-bold text-white shadow-lg"
            >
              <Siren className="h-3.5 w-3.5" />
              {alertCount} community alerts nearby
            </Link>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute right-3 top-[42%] z-20 flex flex-col gap-3 sm:right-5">
        {ai40 && (
          <Link
            href="/smart-safety"
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-sm-primary text-white shadow-xl"
            aria-label="AI 4.0 Predictive Safety"
          >
            <span className="text-lg font-extrabold">4.0</span>
          </Link>
        )}
        {aiExpansion && !ai40 && (
          <Link
            href="/ai-assistant"
            onClick={() => setAiOpen(true)}
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sm-primary to-sm-emerald text-white shadow-xl shadow-sm-primary/30"
            aria-label="Open AI Assistant"
          >
            <Bot className="h-6 w-6" />
          </Link>
        )}
        {publicSafety && (
          <Link
            href="/safety"
            onClick={() => setSosActive(true)}
            className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-sm-danger text-white shadow-xl shadow-red-500/40 animate-pulse"
            aria-label="Emergency SOS"
          >
            <span className="font-display text-xs font-black tracking-wide">SOS</span>
          </Link>
        )}
      </div>

      <PlaceSheet showVerification={publicSafety} />
    </>
  );
}
