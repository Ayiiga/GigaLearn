"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function FeatureComingSoon({
  title,
  phase,
  description,
}: {
  title: string;
  phase: "Phase 2" | "Phase 3";
  description: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sm-primary/10 text-sm-primary">
        <Lock className="h-7 w-7" />
      </span>
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-sm-emerald">{phase} · Coming soon</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-sm-primary dark:text-white">{title}</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      <p className="mt-2 text-xs text-slate-500">
        This feature is implemented but disabled by feature flag until release approval.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-2xl bg-sm-primary px-5 py-3 text-sm font-bold text-white"
      >
        Back to {BRAND.name}
      </Link>
    </div>
  );
}
