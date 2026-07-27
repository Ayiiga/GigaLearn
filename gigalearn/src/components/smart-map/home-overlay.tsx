"use client";

import Link from "next/link";
import { Bot, CloudSun, MapPin, Siren } from "lucide-react";
import { SmartMapLogo } from "@/components/smart-map/logo";
import { CategoryChips } from "@/components/smart-map/category-chips";
import { PlaceSheet } from "@/components/smart-map/place-sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { ACCRA_WEATHER } from "@/content/smart-map/weather";
import { LAUNCH_COUNTRY } from "@/content/smart-map/countries";
import { useMapStore } from "@/stores/map-store";
import { BRAND } from "@/lib/brand";

export function HomeOverlay() {
  const setSosActive = useMapStore((s) => s.setSosActive);
  const setAiOpen = useMapStore((s) => s.setAiOpen);
  const reports = useMapStore((s) => s.reports);
  const alertCount = reports.filter((r) => r.status === "verified" || r.status === "verifying").length;

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-2">
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
                {BRAND.tagline} · {LAUNCH_COUNTRY.flag} Ghana
              </p>
            </div>
          </Link>
          <Link
            href="/weather"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-white/30 bg-white/85 px-3 py-2.5 text-sm font-semibold shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/88"
          >
            <CloudSun className="h-4 w-4 text-sm-safety" />
            {ACCRA_WEATHER.tempC}°
          </Link>
          <ThemeToggle />
          <UserMenu />
        </div>

        <div className="pointer-events-auto mx-auto mt-3 max-w-3xl">
          <Link
            href="/search"
            className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/90 px-4 py-3.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/9"
          >
            <MapPin className="h-5 w-5 text-sm-primary" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
              Search places, services, routes…
            </span>
          </Link>
        </div>

        <div className="mx-auto mt-3 max-w-3xl">
          <CategoryChips />
        </div>

        {alertCount > 0 && (
          <div className="pointer-events-auto mx-auto mt-3 max-w-3xl">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 rounded-full bg-sm-danger/95 px-3.5 py-2 text-xs font-bold text-white shadow-lg"
            >
              <Siren className="h-3.5 w-3.5" />
              {alertCount} community alerts nearby
            </Link>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute right-3 top-[42%] z-20 flex flex-col gap-3 sm:right-5">
        <Link
          href="/ai-assistant"
          onClick={() => setAiOpen(true)}
          className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sm-primary to-sm-emerald text-white shadow-xl shadow-sm-primary/30"
          aria-label="Open AI Assistant"
        >
          <Bot className="h-6 w-6" />
        </Link>
        <Link
          href="/safety"
          onClick={() => setSosActive(true)}
          className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-sm-danger text-white shadow-xl shadow-red-500/40 animate-pulse"
          aria-label="Emergency SOS"
        >
          <span className="font-display text-xs font-black tracking-wide">SOS</span>
        </Link>
      </div>

      <PlaceSheet />
    </>
  );
}
