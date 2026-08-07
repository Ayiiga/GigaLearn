"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { SmartMapLogo } from "@/components/smart-map/logo";
import { PlaceSheet } from "@/components/smart-map/place-sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { LocationHud, LocationPermissionCard } from "@/components/smart-map/location-hud";
import { LiveEmergencyPanel } from "@/components/smart-map/live-emergency-panel";
import { LiveLayerToggles } from "@/components/smart-map/live-layer-toggles";
import { SafetyStatusCard } from "@/components/smart-map/safety-status-card";
import { WeatherIntelligenceCard } from "@/components/smart-map/weather-intelligence-card";
import { OfflineBanner } from "@/components/smart-map/offline-banner";
import { BRAND } from "@/lib/brand";
import { usePublicSafetyEnabled } from "@/lib/features/use-feature-flag";

export function HomeOverlay() {
  const publicSafety = usePublicSafetyEnabled();

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 max-h-[100dvh] overflow-x-hidden overflow-y-auto p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex w-full max-w-3xl flex-col gap-3 pb-32">
          {/* Header */}
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href="/"
              className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/30 bg-white/90 px-3 py-2.5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1220]/90"
            >
              <SmartMapLogo size="sm" />
              <div className="min-w-0">
                <p className="truncate font-display text-base font-extrabold leading-tight text-[#0B1220] dark:text-white sm:text-lg">
                  {BRAND.name}
                </p>
                <p className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-300 sm:text-[11px]">
                  Explore · Connect · Stay Safe
                </p>
              </div>
            </Link>
            <ThemeToggle />
            <UserMenu />
          </div>

          <OfflineBanner />

          <Link
            href="/search"
            className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-white/30 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1220]/95"
          >
            <MapPin className="h-5 w-5 shrink-0 text-[#0F5B8D]" />
            <span className="truncate text-sm font-medium text-slate-500 dark:text-slate-300">
              Search worldwide — cities, streets, hospitals, airports…
            </span>
          </Link>

          <LocationPermissionCard />
          <LocationHud />
          <SafetyStatusCard />
          <WeatherIntelligenceCard />
          <LiveEmergencyPanel />
          <LiveLayerToggles />
        </div>
      </div>

      <PlaceSheet showVerification={publicSafety} />
    </>
  );
}
