/**
 * Smart Map phased rollout flags.
 *
 * Phase 1 (foundation) is always enabled.
 * Phase 2 / Phase 3 stay OFF unless explicitly enabled via env.
 *
 * Env overrides (string "true" / "1"):
 * - NEXT_PUBLIC_FEATURE_PUBLIC_SAFETY
 * - NEXT_PUBLIC_FEATURE_AI_EXPANSION
 */

function envFlag(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw == null || raw === "") return fallback;
  return raw === "true" || raw === "1";
}

export const FEATURE_FLAGS = {
  /** Phase 1 — branding, map, search, nearby essentials, saved places, profile, PWA */
  phase1Foundation: true as const,

  /** Phase 2 — SOS, emergency contacts, community reporting, alerts */
  publicSafetyPhase2: envFlag("NEXT_PUBLIC_FEATURE_PUBLIC_SAFETY", false),

  /** Phase 3 — AI assistant, voice, offline maps, tourism, business, admin, multi-country */
  aiExpansionPhase3: envFlag("NEXT_PUBLIC_FEATURE_AI_EXPANSION", false),
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return Boolean(FEATURE_FLAGS[flag]);
}

/** Routes that require Phase 2 public safety. */
export const PHASE2_ROUTES = [
  "/safety",
  "/community",
  "/weather",
] as const;

/** Routes that require Phase 3 AI & expansion. */
export const PHASE3_ROUTES = [
  "/ai-assistant",
  "/business",
  "/dashboard/admin",
  "/advertise",
] as const;

export function isPhase2Route(pathname: string): boolean {
  return PHASE2_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isPhase3Route(pathname: string): boolean {
  return PHASE3_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/** Phase 1 essential nearby categories shown on the home map. */
export const PHASE1_NEARBY_CATEGORIES = [
  "police",
  "fire",
  "hospital",
  "pharmacy",
  "school",
  "university",
  "hostel",
] as const;
