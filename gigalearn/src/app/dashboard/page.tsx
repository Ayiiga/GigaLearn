"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Bookmark,
  CloudSun,
  Compass,
  Shield,
  Sparkles,
  TrafficCone,
} from "lucide-react";
import { nearbyPlaces, getPlaceById } from "@/content/smart-map/places";
import { ACCRA_WEATHER, weatherAdvice } from "@/content/smart-map/weather";
import { DEFAULT_CENTER } from "@/lib/map/styles";
import { useMapStore } from "@/stores/map-store";

export default function DashboardPage() {
  const userLocation = useMapStore((s) => s.userLocation) ?? DEFAULT_CENTER;
  const reports = useMapStore((s) => s.reports);
  const savedPlaceIds = useMapStore((s) => s.savedPlaceIds);
  const nearby = nearbyPlaces(userLocation, "all", 5);
  const saved = savedPlaceIds.map(getPlaceById).filter(Boolean);
  const safetyScore = Math.max(
    55,
    94 - reports.filter((r) => r.status === "verified").length * 4,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-6 sm:px-6">
      <header className="sm-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wide text-sm-emerald">Smart Dashboard</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-sm-primary dark:text-white">
          Your safety & travel hub
        </h1>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Safety Score", value: `${safetyScore}`, icon: Shield, tone: "text-sm-emerald" },
          { label: "Weather", value: `${ACCRA_WEATHER.tempC}°`, icon: CloudSun, tone: "text-sm-safety" },
          { label: "Alerts", value: `${reports.length}`, icon: AlertTriangle, tone: "text-sm-danger" },
          { label: "Saved", value: `${savedPlaceIds.length}`, icon: Bookmark, tone: "text-sm-primary" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="rounded-3xl border border-sm-border bg-white p-4 dark:border-white/10 dark:bg-sm-primary-deep"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <Icon className={`h-5 w-5 ${tone}`} />
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Compass className="h-5 w-5 text-sm-primary" />
            Nearby places
          </h2>
          <ul className="mt-4 space-y-3">
            {nearby.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span className="font-semibold">{p.name}</span>
                <span className="text-slate-500">{p.distanceKm.toFixed(1)} km</span>
              </li>
            ))}
          </ul>
          <Link href="/search" className="mt-4 inline-block text-sm font-bold text-sm-primary">
            Browse all →
          </Link>
        </section>

        <section className="rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <AlertTriangle className="h-5 w-5 text-sm-danger" />
            Community alerts
          </h2>
          <ul className="mt-4 space-y-3">
            {reports.slice(0, 4).map((r) => (
              <li key={r.id}>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-slate-500">{r.status} · {r.city}</p>
              </li>
            ))}
          </ul>
          <Link href="/community" className="mt-4 inline-block text-sm font-bold text-sm-primary">
            Open reports →
          </Link>
        </section>

        <section className="rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <CloudSun className="h-5 w-5 text-sm-safety" />
            Weather & environment
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{weatherAdvice(ACCRA_WEATHER)}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <span>Rain {ACCRA_WEATHER.rainChance}%</span>
            <span>AQI {ACCRA_WEATHER.aqi}</span>
            <span>UV {ACCRA_WEATHER.uvIndex}</span>
            <span>Wind {ACCRA_WEATHER.windKph} km/h</span>
          </div>
          <Link href="/weather" className="mt-4 inline-block text-sm font-bold text-sm-primary">
            Full forecast →
          </Link>
        </section>

        <section className="rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Sparkles className="h-5 w-5 text-sm-emerald" />
            AI suggestions
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• Fuel up before Spintex — evening traffic building</li>
            <li>• Prefer Ring Road West if flood reports persist</li>
            <li>• Save Korle Bu & nearest police for SOS quick access</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/ai-assistant" className="rounded-full bg-sm-primary px-3 py-2 text-xs font-bold text-white">
              Ask AI
            </Link>
            <Link href="/navigate" className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold dark:bg-white/10">
              <TrafficCone className="h-3.5 w-3.5" />
              Navigate
            </Link>
          </div>
        </section>
      </div>

      {saved.length > 0 && (
        <section className="mt-6 rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
          <h2 className="font-display text-xl font-bold">Saved locations</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {saved.map((p) =>
              p ? (
                <li key={p.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold dark:bg-white/5">
                  {p.name}
                </li>
              ) : null,
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
