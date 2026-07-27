/**
 * Smart Map phased rollout flags.
 *
 * Phase 1 (foundation) is always enabled.
 * Phases 2–6 stay OFF unless explicitly enabled via env.
 *
 * Env overrides (string "true" / "1"):
 * - NEXT_PUBLIC_FEATURE_PUBLIC_SAFETY
 * - NEXT_PUBLIC_FEATURE_AI_EXPANSION
 * - NEXT_PUBLIC_FEATURE_SMART_SERVICES
 * - NEXT_PUBLIC_FEATURE_BUSINESS_COMMUNITY
 * - NEXT_PUBLIC_FEATURE_AFRICA_EXPANSION
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

  /** Phase 4 — government/public services, transport, trip planner, smart recommendations */
  smartServicesPhase4: envFlag("NEXT_PUBLIC_FEATURE_SMART_SERVICES", false),

  /** Phase 5 — business portal, community groups, reviews, AI moderation */
  businessCommunityPhase5: envFlag("NEXT_PUBLIC_FEATURE_BUSINESS_COMMUNITY", false),

  /** Phase 6 — Africa expansion, enterprise dashboards, advanced AI, scalability */
  africaExpansionPhase6: envFlag("NEXT_PUBLIC_FEATURE_AFRICA_EXPANSION", false),
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export type FeaturePhaseLabel =
  | "Phase 2"
  | "Phase 3"
  | "Phase 4"
  | "Phase 5"
  | "Phase 6";

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return Boolean(FEATURE_FLAGS[flag]);
}

/** Routes that require Phase 2 public safety. */
export const PHASE2_ROUTES = ["/safety", "/community", "/weather"] as const;

/** Routes that require Phase 3 AI & expansion. */
export const PHASE3_ROUTES = [
  "/ai-assistant",
  "/business",
  "/dashboard/admin",
  "/advertise",
] as const;

/** Routes that require Phase 4 smart services. */
export const PHASE4_ROUTES = ["/services", "/transport", "/trips"] as const;

/** Routes that require Phase 5 business & community. */
export const PHASE5_ROUTES = ["/portal", "/groups", "/reviews"] as const;

/** Routes that require Phase 6 Africa expansion & enterprise. */
export const PHASE6_ROUTES = ["/enterprise", "/countries", "/command-center"] as const;

function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function isPhase2Route(pathname: string): boolean {
  return matchesRoute(pathname, PHASE2_ROUTES);
}

export function isPhase3Route(pathname: string): boolean {
  return matchesRoute(pathname, PHASE3_ROUTES);
}

export function isPhase4Route(pathname: string): boolean {
  return matchesRoute(pathname, PHASE4_ROUTES);
}

export function isPhase5Route(pathname: string): boolean {
  return matchesRoute(pathname, PHASE5_ROUTES);
}

export function isPhase6Route(pathname: string): boolean {
  return matchesRoute(pathname, PHASE6_ROUTES);
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
