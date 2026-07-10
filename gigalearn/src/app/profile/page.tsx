"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useMediaStore } from "@/stores/media-store";
import { MediaPageShell } from "@/components/media/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { getArticleBySlug } from "@/content/media/articles";
import { TV_STATIONS } from "@/content/media/tv";
import { RADIO_STATIONS } from "@/content/media/radio";
import { Bookmark, Tv, Radio, Bell, Globe, History } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const preferences = useMediaStore((s) => s.preferences);
  const updateNotifications = useMediaStore((s) => s.updateNotifications);
  const setLanguage = useMediaStore((s) => s.setLanguage);

  if (loading) {
    return <div className="p-12 text-center text-giga-muted">Loading profile...</div>;
  }

  if (!isAuthenticated) {
    return (
      <MediaPageShell title="Profile" subtitle="Sign in to access your saved content and preferences">
        <GlassCard className="max-w-md mx-auto text-center">
          <p className="text-giga-muted mb-4">Create an account to save articles, favourite stations, and manage notifications.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login"><Button>Sign In</Button></Link>
            <Link href="/register"><Button variant="outline">Register</Button></Link>
          </div>
        </GlassCard>
      </MediaPageShell>
    );
  }

  const savedArticles = preferences.savedArticles
    .map((slug) => getArticleBySlug(slug))
    .filter(Boolean);

  const favTv = TV_STATIONS.filter((s) => preferences.favoriteTvStations.includes(s.id));
  const favRadio = RADIO_STATIONS.filter((s) => preferences.favoriteRadioStations.includes(s.id));

  return (
    <MediaPageShell
      title="My Profile"
      subtitle={user?.user_metadata?.full_name ?? user?.email ?? "GigaTrend TV member"}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="h-5 w-5 text-gtv-purple" />
            <h2 className="font-display font-bold">Saved Articles</h2>
          </div>
          {savedArticles.length > 0 ? (
            <ul className="space-y-2">
              {savedArticles.map((a) => a && (
                <li key={a.slug}>
                  <Link href={`/news/${a.slug}`} className="text-sm font-medium hover:text-gtv-purple">{a.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-giga-muted">No saved articles yet.</p>
          )}
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <History className="h-5 w-5 text-gtv-cyan" />
            <h2 className="font-display font-bold">Watch History</h2>
          </div>
          <p className="text-sm text-giga-muted">
            {preferences.watchHistory.length > 0
              ? `${preferences.watchHistory.length} items in history`
              : "Your watch history will appear here."}
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Tv className="h-5 w-5 text-gtv-purple" />
            <h2 className="font-display font-bold">Favourite TV Stations</h2>
          </div>
          {favTv.length > 0 ? (
            <ul className="space-y-1">{favTv.map((s) => <li key={s.id} className="text-sm">{s.logo} {s.name}</li>)}</ul>
          ) : (
            <p className="text-sm text-giga-muted">Favourite stations from <Link href="/live-tv" className="text-gtv-purple hover:underline">Live TV</Link>.</p>
          )}
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Radio className="h-5 w-5 text-gtv-cyan" />
            <h2 className="font-display font-bold">Favourite Radio</h2>
          </div>
          {favRadio.length > 0 ? (
            <ul className="space-y-1">{favRadio.map((s) => <li key={s.id} className="text-sm">{s.logo} {s.name}</li>)}</ul>
          ) : (
            <p className="text-sm text-giga-muted">Favourite stations from <Link href="/live-radio" className="text-gtv-purple hover:underline">Live Radio</Link>.</p>
          )}
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-gtv-gold" />
            <h2 className="font-display font-bold">Notification Preferences</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(preferences.notifications).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateNotifications({ [key]: e.target.checked })}
                  className="h-4 w-4 accent-gtv-purple"
                />
                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              </label>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-gtv-purple" />
            <h2 className="font-display font-bold">Language</h2>
          </div>
          <select
            value={preferences.language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-xl border border-giga-border px-4 py-2 text-sm bg-white dark:bg-giga-surface"
            aria-label="Language preference"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="sw">Kiswahili</option>
            <option value="ha">Hausa</option>
            <option value="tw">Twi</option>
          </select>
        </GlassCard>
      </div>
    </MediaPageShell>
  );
}
