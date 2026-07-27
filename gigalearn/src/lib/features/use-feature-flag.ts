"use client";

import { FEATURE_FLAGS, type FeatureFlagKey, isFeatureEnabled } from "@/lib/features/flags";

export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  return isFeatureEnabled(flag);
}

export function usePublicSafetyEnabled(): boolean {
  return FEATURE_FLAGS.publicSafetyPhase2;
}

export function useAiExpansionEnabled(): boolean {
  return FEATURE_FLAGS.aiExpansionPhase3;
}
