"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CircleDot,
  Focus,
  Moon,
  RefreshCw,
  Satellite,
  SwitchCamera,
} from "lucide-react";
import Link from "next/link";
import { useMapStore } from "@/stores/map-store";
import { cn } from "@/lib/utils";
import { hasConsent } from "@/lib/ai40/privacy";
import {
  formatSpaceCamScale,
  getZoomFusionState,
  requiresMapView,
  type SpaceCamSource,
} from "@/lib/spacecam/zoom-fusion";

const MapView = dynamic(
  () => import("@/components/smart-map/map-view").then((module) => module.MapView),
  { ssr: false },
);

type CameraStatus = "idle" | "requesting" | "ready" | "denied" | "unavailable";
type CameraCapability = { zoom?: { min?: number; max?: number; step?: number } };

const CAMERA_SOURCES = new Set<SpaceCamSource>(["real-capture", "optical", "computational"]);

export function SpaceCamExplorer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [zoom, setZoom] = useState(0);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [opticalZoom, setOpticalZoom] = useState({ min: 1, max: 1, value: 1 });
  const [isOnline, setIsOnline] = useState(true);
  const userLocation = useMapStore((state) => state.userLocation);
  const mapStyle = useMapStore((state) => state.mapStyle);
  const privacyConsents = useMapStore((state) => state.privacyConsents);
  const setPrivacyConsent = useMapStore((state) => state.setPrivacyConsent);

  const fusion = useMemo(() => getZoomFusionState(zoom), [zoom]);
  const cameraStage = CAMERA_SOURCES.has(fusion.source);
  const displaySource =
    cameraStage && cameraStatus !== "ready"
      ? {
          label: "CAMERA OFF",
          description: "Camera access is disabled until you explicitly enable it.",
        }
      : fusion;

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(
    async (facingMode = cameraFacing) => {
      if (!hasConsent(privacyConsents, "camera")) {
        setPrivacyConsent("camera", true);
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus("unavailable");
        return;
      }
      stopCamera();
      setCameraStatus("requesting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const track = stream.getVideoTracks()[0];
        const capability = track?.getCapabilities?.() as CameraCapability | undefined;
        const range = capability?.zoom;
        setOpticalZoom({
          min: range?.min ?? 1,
          max: range?.max ?? 1,
          value: range?.min ?? 1,
        });
        setCameraStatus("ready");
      } catch (error) {
        setCameraStatus(error instanceof DOMException && error.name === "NotAllowedError" ? "denied" : "unavailable");
      }
    },
    [cameraFacing, privacyConsents, setPrivacyConsent, stopCamera],
  );

  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine);
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (!cameraStage) stopCamera();
  }, [cameraStage, stopCamera]);

  async function setDeviceZoom(value: number) {
    setOpticalZoom((current) => ({ ...current, value }));
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track?.applyConstraints || opticalZoom.max <= opticalZoom.min) return;
    try {
      await track.applyConstraints({ advanced: [{ zoom: value } as MediaTrackConstraintSet] });
    } catch {
      // Device/browser may expose capabilities but reject runtime constraints.
    }
  }

  function captureLocally() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `spacecam-${Date.now()}.jpg`;
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/jpeg", 0.92);
  }

  const visual = requiresMapView(fusion.source) ? (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#155e75,transparent_45%),#020617]">
      <MapView className="absolute inset-0" places={[]} />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 z-10 text-center">
        <p className="inline-block rounded-full bg-slate-950/70 px-3 py-1.5 text-xs text-white/85 backdrop-blur">
          Smart Map geospatial view
        </p>
      </div>
    </div>
  ) : cameraStage ? (
    <div className="absolute inset-0 bg-slate-950">
      <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
      {cameraStatus !== "ready" && (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#061b30] via-[#103d5c] to-[#031018] p-6 text-center">
          <div className="max-w-sm">
            <Camera className="mx-auto h-12 w-12 text-cyan-200" />
            <h2 className="mt-4 font-display text-xl font-bold">Open your device camera</h2>
            <p className="mt-2 text-sm text-slate-200">
              SpaceCam uses your camera only after you choose to enable it. This grants Smart Map&apos;s camera permission preference; captures stay on this device unless you download them.
            </p>
            <button
              type="button"
              onClick={() => void startCamera()}
              disabled={cameraStatus === "requesting"}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#0B3A63] disabled:opacity-60"
            >
              <Camera className="h-4 w-4" />
              {cameraStatus === "requesting" ? "Requesting camera…" : "Enable camera"}
            </button>
            {cameraStatus === "denied" && <p className="mt-3 text-xs text-amber-200">Camera permission was denied. You can enable it in browser settings and try again.</p>}
            {cameraStatus === "unavailable" && <p className="mt-3 text-xs text-amber-200">No compatible camera is available. Explore the map and space stages with the zoom control.</p>}
          </div>
        </div>
      )}
    </div>
  ) : (
    <SpaceVisualization source={fusion.source} />
  );

  return (
    <main key={fusion.source} className="relative h-[100dvh] w-full overflow-hidden bg-[#020915] text-white">
      {visual}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 sm:p-5">
        <Link href="/" className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-slate-950/75 px-3 py-2 text-sm font-bold shadow-lg backdrop-blur" aria-label="Return to Smart Map">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Smart Map</span>
        </Link>
        <div className="rounded-2xl bg-slate-950/75 px-3 py-2 text-right shadow-lg backdrop-blur">
          <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-200">{displaySource.label}</p>
          <p className="text-xs text-white/75">{displaySource.description}</p>
        </div>
      </div>

      {!isOnline && fusion.isExternal && (
        <p className="absolute inset-x-3 top-20 z-20 rounded-xl bg-amber-400 px-3 py-2 text-center text-xs font-bold text-slate-950">
          Offline — external imagery is unavailable; showing only local or conceptual views.
        </p>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 pb-24 sm:p-5 sm:pb-28">
        <div className="pointer-events-auto mx-auto max-w-xl rounded-3xl border border-white/20 bg-slate-950/80 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-3xl font-extrabold">{formatSpaceCamScale(fusion.scaleMeters)}</p>
              <p className="mt-1 text-xs text-slate-300">{displaySource.label}{userLocation ? " · centered on your Smart Map location" : ""}</p>
            </div>
            {cameraStatus === "ready" && cameraStage && (
              <button type="button" onClick={captureLocally} className="grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-transparent" aria-label="Capture locally">
                <CircleDot className="h-6 w-6" />
              </button>
            )}
          </div>
          <input
            className="mt-4 w-full accent-cyan-300"
            type="range"
            min="0"
            max="100"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            aria-label="Explore visual scale"
          />
          <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Camera</span><span>Map</span><span>Earth</span><span>Deep space</span>
          </div>
          {cameraStatus === "ready" && cameraStage && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {opticalZoom.max > opticalZoom.min && (
                <>
                  <Focus className="h-4 w-4 text-cyan-200" aria-hidden />
                  <input type="range" min={opticalZoom.min} max={opticalZoom.max} step="0.1" value={opticalZoom.value} onChange={(event) => void setDeviceZoom(Number(event.target.value))} aria-label="Available optical zoom" />
                </>
              )}
              <button type="button" onClick={() => { const next = cameraFacing === "environment" ? "user" : "environment"; setCameraFacing(next); void startCamera(next); }} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                <SwitchCamera className="h-3.5 w-3.5" /> Switch camera
              </button>
              <button type="button" onClick={() => void startCamera()} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                <RefreshCw className="h-3.5 w-3.5" /> Restart
              </button>
            </div>
          )}
          {fusion.source === "map" && <p className="mt-3 text-xs text-slate-300">Using your existing Smart Map view in {mapStyle} style. It is geospatial map data, not device camera or satellite imagery.</p>}
        </div>
      </div>
    </main>
  );
}

const SOLAR_TARGETS = [
  { name: "Earth", distance: "12,742 km diameter", color: "from-sky-200 via-blue-500 to-blue-950" },
  { name: "Moon", distance: "384,400 km away", color: "from-slate-100 via-slate-400 to-slate-800" },
  { name: "Mars", distance: "227.9m km from Sun", color: "from-orange-200 via-orange-500 to-red-950" },
  { name: "Jupiter", distance: "778.5m km from Sun", color: "from-amber-100 via-orange-300 to-orange-900" },
  { name: "Saturn", distance: "1.43b km from Sun", color: "from-yellow-100 via-amber-300 to-amber-800" },
] as const;

const RECENT_EXOPLANETS = [
  { name: "Gliese 12 b", detail: "Confirmed 2024 · 12 pc away" },
  { name: "TOI-715 b", detail: "Confirmed 2024 · 42 pc away" },
] as const;

function SpaceVisualization({ source }: { source: SpaceCamSource }) {
  const isEarth = source === "earth";
  const [targetIndex, setTargetIndex] = useState(0);
  const target = isEarth ? SOLAR_TARGETS[0] : SOLAR_TARGETS[targetIndex];
  const planetary = source === "simulation" || source === "astronomical";
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#0b4d77_0,transparent_35%),radial-gradient(circle_at_82%_18%,#4c1d95_0,transparent_26%),#020617]">
      <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(white_1.2px,transparent_1.2px)] [background-size:52px_52px]" />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#bae6fd_1px,transparent_1px)] [background-size:137px_137px]" />
      <div className={cn(
        "absolute left-1/2 top-[43%] h-[min(76vw,540px)] w-[min(76vw,540px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 shadow-[0_0_120px_36px_rgba(34,211,238,0.25)]",
        `bg-gradient-to-br ${target.color}`,
      )}>
        {target.name === "Earth" && (
          <>
            <div className="absolute left-[17%] top-[22%] h-[18%] w-[25%] rounded-[55%_45%_40%_60%] bg-emerald-300/65 blur-[1px]" />
            <div className="absolute bottom-[22%] right-[13%] h-[13%] w-[30%] rounded-[48%_52%_60%_40%] bg-emerald-200/50 blur-[1px]" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,.9),transparent_13%),radial-gradient(circle_at_45%_36%,rgba(255,255,255,.5),transparent_18%),linear-gradient(105deg,transparent_55%,rgba(0,0,0,.65)_100%)]" />
          </>
        )}
        {target.name === "Saturn" && <div className="absolute left-[-25%] top-[38%] h-[25%] w-[150%] rotate-[-14deg] rounded-[50%] border-[min(5vw,24px)] border-amber-100/65" />}
        {target.name === "Jupiter" && <div className="absolute left-[15%] top-[68%] h-[10%] w-[48%] rounded-full bg-red-900/60 blur-sm" />}
      </div>
      <div className="absolute inset-x-0 top-[63%] px-5 text-center">
        {isEarth ? <Satellite className="mx-auto h-8 w-8 text-cyan-200" /> : <Moon className="mx-auto h-8 w-8 text-indigo-200" />}
        <p className="mt-2 text-base font-bold">{target.name} · SIMULATED SCALE VIEW</p>
        <p className="mt-1 text-xs text-cyan-100">{target.distance}</p>
        <p className="mt-1 text-xs text-white/80">Illustrative visualization using real reference distances — not live camera footage.</p>
      </div>
      {planetary && (
        <div className="absolute inset-x-3 top-28 z-10 mx-auto max-w-lg rounded-2xl border border-white/15 bg-slate-950/65 p-2 backdrop-blur-md">
          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Solar system targets</p>
          <div className="flex gap-1 overflow-x-auto">
            {SOLAR_TARGETS.map((item, index) => (
              <button key={item.name} type="button" onClick={() => setTargetIndex(index)} className={cn("shrink-0 rounded-xl px-3 py-2 text-xs font-bold", index === targetIndex ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white")}>
                {item.name}
              </button>
            ))}
          </div>
          {source === "astronomical" && (
            <p className="px-2 pt-2 text-[11px] text-slate-200">
              Recent confirmed exoplanets: {RECENT_EXOPLANETS.map((planet) => `${planet.name} (${planet.detail})`).join(" · ")}. Reference data: NASA Exoplanet Archive.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
