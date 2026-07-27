"use client";

import type { ReactNode } from "react";
import { isFeatureEnabled, type FeatureFlagKey } from "@/lib/features/flags";
import { FeatureComingSoon } from "@/components/smart-map/feature-coming-soon";

export function FeatureGate({
  flag,
  title,
  phase,
  description,
  children,
}: {
  flag: FeatureFlagKey;
  title: string;
  phase: "Phase 2" | "Phase 3";
  description: string;
  children: ReactNode;
}) {
  if (!isFeatureEnabled(flag)) {
    return <FeatureComingSoon title={title} phase={phase} description={description} />;
  }
  return <>{children}</>;
}
