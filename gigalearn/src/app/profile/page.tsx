"use client";

import Link from "next/link";
import { Bookmark, Shield, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMapStore } from "@/stores/map-store";
import { getPlaceById } from "@/content/smart-map/places";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const savedPlaceIds = useMapStore((s) => s.savedPlaceIds);
  const emergencyContacts = useMapStore((s) => s.emergencyContacts);
  const bloodGroup = useMapStore((s) => s.bloodGroup);
  const womenSafetyMode = useMapStore((s) => s.womenSafetyMode);
  const saved = savedPlaceIds.map(getPlaceById).filter(Boolean);

  if (loading) {
    return <div className="p-12 text-center text-sm-muted">Loading profile…</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 pb-10 pt-10 text-center">
        <User className="mx-auto h-10 w-10 text-sm-primary" />
        <h1 className="mt-3 font-display text-2xl font-extrabold">Your Smart Map profile</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sign in with email, Google, Apple, or phone — or continue exploring in Guest Mode from the map.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Register</Button>
          </Link>
        </div>
        <Link href="/" className="mt-4 inline-block text-sm font-bold text-sm-primary">
          Continue as guest →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-sm-emerald">Profile</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold text-sm-primary dark:text-white">
        {user?.user_metadata?.full_name ?? user?.email ?? "Smart Map member"}
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Saved places, emergency contacts, and privacy-aware safety preferences.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <Bookmark className="h-5 w-5 text-sm-primary" />
            Saved places
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {saved.length > 0 ? (
              saved.map((p) =>
                p ? (
                  <li key={p.id} className="rounded-2xl bg-slate-50 px-3 py-2 dark:bg-white/5">
                    {p.name}
                  </li>
                ) : null,
              )
            ) : (
              <li className="text-slate-500">No saved places yet.</li>
            )}
          </ul>
        </section>

        <section className="rounded-3xl border border-sm-border bg-white p-5 dark:border-white/10 dark:bg-sm-primary-deep">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <Shield className="h-5 w-5 text-sm-danger" />
            Safety profile
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>Blood group: {bloodGroup || "Not set"}</li>
            <li>Emergency contacts: {emergencyContacts.length}</li>
            <li>Women Safety Mode: {womenSafetyMode ? "On" : "Off"}</li>
          </ul>
          <Link href="/safety" className="mt-4 inline-block text-sm font-bold text-sm-primary">
            Open Safety Center →
          </Link>
        </section>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/settings" className="rounded-2xl bg-sm-primary px-4 py-3 text-sm font-bold text-white">
          Privacy settings
        </Link>
        <Link href="/dashboard" className="rounded-2xl border border-sm-border px-4 py-3 text-sm font-bold dark:border-white/15">
          Open dashboard
        </Link>
      </div>
    </div>
  );
}
