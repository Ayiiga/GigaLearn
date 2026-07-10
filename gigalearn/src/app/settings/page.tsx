"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { subscribeToPushNotifications, scheduleBreakingNewsReminder } from "@/lib/pwa/push-notifications";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/supabase/auth-actions";
import { useMediaStore } from "@/stores/media-store";
import { useOnlineStatus } from "@/components/providers/app-providers";
import { BRAND } from "@/lib/brand";
import { MediaPageShell } from "@/components/media/section-header";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const { user, isAuthenticated } = useAuth();
  const preferences = useMediaStore((s) => s.preferences);
  const updateNotifications = useMediaStore((s) => s.updateNotifications);
  const setLanguage = useMediaStore((s) => s.setLanguage);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    scheduleBreakingNewsReminder();
  }, []);

  return (
    <MediaPageShell title="Settings" subtitle={`Manage your ${BRAND.name} preferences`}>
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardTitle>Account</CardTitle>
          <CardDescription className="mt-2">
            {isAuthenticated && user
              ? `Signed in as ${user.email ?? user.user_metadata?.name ?? "user"}`
              : "You are not signed in"}
          </CardDescription>
          <div className="mt-4 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
                <Button variant="outline" onClick={() => router.push("/profile")}>
                  Open Profile
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push("/login")}>Sign In</Button>
                <Button variant="outline" onClick={() => router.push("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>Appearance</CardTitle>
          <CardDescription className="mt-2">Choose light or dark mode</CardDescription>
          <div className="mt-4 flex gap-3">
            <Button variant={theme === "light" ? "primary" : "outline"} onClick={() => setTheme("light")}>
              ☀️ Light
            </Button>
            <Button variant={theme === "dark" ? "primary" : "outline"} onClick={() => setTheme("dark")}>
              🌙 Dark
            </Button>
            <Button variant={theme === "system" ? "primary" : "outline"} onClick={() => setTheme("system")}>
              💻 System
            </Button>
          </div>
        </Card>

        <Card>
          <CardTitle>Language</CardTitle>
          <CardDescription className="mt-2">Preferred language for AI summaries and translations</CardDescription>
          <select
            value={preferences.language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-4 rounded-xl border border-giga-border px-4 py-2 text-sm bg-white dark:bg-giga-surface"
            aria-label="Language preference"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="sw">Kiswahili</option>
            <option value="ha">Hausa</option>
            <option value="tw">Twi</option>
          </select>
        </Card>

        <Card>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription className="mt-2">Breaking news, sports, live matches, and trending stories</CardDescription>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
          <Button
            variant="outline"
            className="mt-4"
            onClick={async () => {
              const ok = await subscribeToPushNotifications();
              alert(ok ? "Push notifications enabled!" : "Notifications not available on this device.");
            }}
          >
            Enable Push Notifications
          </Button>
        </Card>

        <Card>
          <CardTitle>Offline & PWA</CardTitle>
          <CardDescription className="mt-2">
            Status: {isOnline ? "🟢 Online" : "🟠 Offline — cached content available"}
          </CardDescription>
          <p className="mt-4 text-sm text-giga-muted">
            Install {BRAND.name} from your browser menu for offline reading, faster loading, and push notifications.
          </p>
        </Card>

        <Card>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription className="mt-2">
            {BRAND.name} follows WCAG AA guidelines with keyboard navigation, focus indicators, ARIA labels, and screen reader support.
          </CardDescription>
        </Card>

        <Card>
          <CardTitle>Help & Legal</CardTitle>
          <CardDescription className="mt-2">Support, privacy, and terms</CardDescription>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/help"><Button variant="outline" size="sm">Help</Button></Link>
            <Link href="/privacy"><Button variant="outline" size="sm">Privacy</Button></Link>
            <Link href="/terms"><Button variant="outline" size="sm">Terms</Button></Link>
            <Link href="/contact"><Button variant="outline" size="sm">Contact</Button></Link>
          </div>
        </Card>
      </div>
    </MediaPageShell>
  );
}
