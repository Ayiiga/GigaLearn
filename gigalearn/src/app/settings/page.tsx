"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/supabase/auth-actions";
import { useAppStore } from "@/stores/app-store";
import { useOnlineStatus } from "@/components/providers/app-providers";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { userRole, setUserRole } = useAppStore();
  const isOnline = useOnlineStatus();
  const { user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Settings</h1>

      <div className="mt-8 space-y-6">
        <Card>
          <CardTitle>Account</CardTitle>
          <CardDescription className="mt-2">
            {isAuthenticated && user
              ? `Signed in as ${user.email ?? user.user_metadata?.name ?? "user"}`
              : "You are not signed in"}
          </CardDescription>
          {isAuthenticated ? (
            <Button variant="outline" className="mt-4" onClick={handleLogout}>
              Sign Out
            </Button>
          ) : (
            <Button className="mt-4" onClick={() => router.push("/login")}>
              Sign In
            </Button>
          )}
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
          <CardTitle>Role & Dashboard</CardTitle>
          <CardDescription className="mt-2">Switch between student, teacher, parent, and administrator views</CardDescription>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["student", "teacher", "parent", "admin"] as const).map((role) => (
              <Button
                key={role}
                variant={userRole === role ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  setUserRole(role);
                  router.push(role === "student" ? "/" : `/dashboard/${role}`);
                }}
              >
                {role === "admin" ? "Administrator" : role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={() => router.push(userRole === "student" ? "/" : `/dashboard/${userRole}`)}>
            Open {userRole === "admin" ? "Administrator" : userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
          </Button>
        </Card>

        <Card>
          <CardTitle>Offline & PWA</CardTitle>
          <CardDescription className="mt-2">
            Status: {isOnline ? "🟢 Online" : "🟠 Offline — cached content available"}
          </CardDescription>
          <p className="mt-4 text-sm text-giga-muted">
            Install GigaLearn from your browser menu for the best offline experience.
          </p>
        </Card>

        <Card>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription className="mt-2">
            GigaLearn follows WCAG guidelines with large touch targets, focus indicators, and screen reader support.
          </CardDescription>
        </Card>
      </div>
    </div>
  );
}
