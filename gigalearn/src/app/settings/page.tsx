"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/supabase/auth-actions";
import { useOnlineStatus } from "@/components/providers/app-providers";
import { useMapStore } from "@/stores/map-store";
import { BRAND } from "@/lib/brand";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const { user, isAuthenticated } = useAuth();
  const mapStyle = useMapStore((s) => s.mapStyle);
  const setMapStyle = useMapStore((s) => s.setMapStyle);
  const voiceNav = useMapStore((s) => s.voiceNav);
  const setVoiceNav = useMapStore((s) => s.setVoiceNav);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-6 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-sm-emerald">Settings</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-sm-primary dark:text-white">
        Preferences
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Manage your {BRAND.name} account, theme, map style, and privacy-aware defaults.
      </p>

      <section className="mt-6 rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
        <h2 className="font-bold">Account</h2>
        <p className="mt-2 text-sm text-slate-500">
          {isAuthenticated && user
            ? `Signed in as ${user.email ?? user.user_metadata?.name ?? "user"}`
            : "Guest mode — sign in to sync saved places and emergency contacts"}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
        <h2 className="font-bold">Appearance</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`rounded-full px-3 py-2 text-sm font-semibold capitalize ${
                theme === t ? "bg-sm-primary text-white" : "bg-slate-100 dark:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
        <h2 className="font-bold">Map & navigation</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["streets", "dark", "terrain", "satellite"] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setMapStyle(style)}
              className={`rounded-full px-3 py-2 text-sm font-semibold capitalize ${
                mapStyle === style ? "bg-sm-primary text-white" : "bg-slate-100 dark:bg-white/10"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setVoiceNav(!voiceNav)}
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold dark:bg-white/5"
        >
          Voice navigation
          <span>{voiceNav ? "On" : "Off"}</span>
        </button>
      </section>

      <section className="mt-4 rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
        <h2 className="font-bold">Status</h2>
        <p className="mt-2 text-sm text-slate-500">{isOnline ? "Online · sync ready" : "Offline · local cache active"}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/privacy" className="text-sm-primary">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm-primary">
            Terms
          </Link>
          <Link href="/help" className="text-sm-primary">
            Help
          </Link>
          <Link href="/favorites" className="text-sm-primary">
            Favorites
          </Link>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-dashed border-sm-border bg-white/60 p-5 text-sm dark:border-white/10 dark:bg-sm-primary-deep/60">
        <h2 className="font-bold">Rollout flags</h2>
        <p className="mt-2 text-slate-500">
          Phase 1 Foundation: On · Phase 2 Public Safety: Off by default · Phase 3 AI & Expansion: Off by
          default
        </p>
      </section>
    </div>
  );
}
