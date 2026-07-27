"use client";

import { Crosshair, MapPinned, RefreshCw } from "lucide-react";
import { formatAccuracy } from "@/lib/geo/geolocation";
import { useLiveLocation } from "@/lib/geo/use-live-location";
import { useMapStore } from "@/stores/map-store";

export function LocationPermissionCard({ compact = false }: { compact?: boolean }) {
  const permission = useMapStore((s) => s.locationPermission);
  const { requestLocation } = useLiveLocation(false);
  const setPickOnMapMode = useMapStore((s) => s.setPickOnMapMode);

  if (permission === "granted") return null;
  if (permission === "unknown" || permission === "prompt") {
    return (
      <div className="rounded-3xl border border-white/30 bg-white/92 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/94">
        <p className="text-xs font-semibold uppercase tracking-wide text-sm-emerald">Location access</p>
        <h2 className="mt-1 font-display text-lg font-extrabold">Enable GPS to continue</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Smart Map needs your location to show <strong>You are here</strong>, find nearby emergency
          services, and navigate accurately — in Ghana and worldwide.
        </p>
        <button
          type="button"
          onClick={() => void requestLocation()}
          className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-sm-primary px-4 py-2.5 text-sm font-bold text-white"
        >
          <Crosshair className="h-4 w-4" />
          Allow location
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-amber-300/60 bg-amber-50/95 p-4 shadow-xl dark:border-amber-500/30 dark:bg-amber-950/80">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
        Location denied
      </p>
      <h2 className="mt-1 font-display text-lg font-extrabold text-amber-950 dark:text-amber-50">
        We can’t find you yet
      </h2>
      {!compact && (
        <p className="mt-1 text-sm text-amber-900/80 dark:text-amber-100/80">
          Location powers live GPS, nearest police/hospitals, and From → To routes. You can retry
          permission or pick a point on the map manually.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void requestLocation()}
          className="inline-flex items-center gap-2 rounded-2xl bg-sm-primary px-4 py-2.5 text-sm font-bold text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Retry permission
        </button>
        <button
          type="button"
          onClick={() => setPickOnMapMode("origin")}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-sm-primary dark:bg-white/10 dark:text-white"
        >
          <MapPinned className="h-4 w-4" />
          Pick on map
        </button>
      </div>
    </div>
  );
}

export function LocationHud() {
  const userLocation = useMapStore((s) => s.userLocation);
  const address = useMapStore((s) => s.resolvedAddress);
  const meta = useMapStore((s) => s.locationMeta);
  const permission = useMapStore((s) => s.locationPermission);
  const setFollowUser = useMapStore((s) => s.setFollowUser);

  if (permission !== "granted" || !userLocation) return null;

  return (
    <div className="rounded-3xl border border-white/30 bg-white/92 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0B3A63]/94">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#2563EB]">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2563EB]" />
            You are here
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug">
            {address?.label ?? "Resolving address…"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFollowUser(true)}
          className="rounded-xl bg-[#2563EB]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#2563EB]"
        >
          Recenter
        </button>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300">
        <div>
          <dt className="font-semibold text-slate-500">Town / City</dt>
          <dd>{address?.city ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">District</dt>
          <dd>{address?.district ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Region</dt>
          <dd>{address?.region ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Country</dt>
          <dd>{address?.country ?? "—"}</dd>
        </div>
        <div className="col-span-2">
          <dt className="font-semibold text-slate-500">Latitude & Longitude</dt>
          <dd>
            {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">GPS accuracy</dt>
          <dd>{formatAccuracy(meta.accuracyM)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Updated</dt>
          <dd>{meta.updatedAt ? new Date(meta.updatedAt).toLocaleTimeString() : "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
