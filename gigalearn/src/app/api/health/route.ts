import { NextResponse } from "next/server";
import { validateSupabaseConfig, getSupabasePublishableKey } from "@/lib/supabase/env";
import { FEATURE_FLAGS } from "@/lib/features/flags";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = validateSupabaseConfig();
  const started = Date.now();

  let authReachable = false;
  if (config.ok) {
    try {
      const response = await fetch(`${config.url}/auth/v1/health`, {
        headers: { apikey: getSupabasePublishableKey() },
        cache: "no-store",
      });
      authReachable = response.ok;
    } catch {
      authReachable = false;
    }
  }

  const status = config.ok && authReachable ? "healthy" : "degraded";
  const httpStatus = status === "healthy" ? 200 : 503;

  return NextResponse.json(
    {
      status,
      service: "smart-map",
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - started,
      features: {
        phase1Foundation: FEATURE_FLAGS.phase1Foundation,
        publicSafetyPhase2: FEATURE_FLAGS.publicSafetyPhase2,
        aiExpansionPhase3: FEATURE_FLAGS.aiExpansionPhase3,
        smartServicesPhase4: FEATURE_FLAGS.smartServicesPhase4,
        businessCommunityPhase5: FEATURE_FLAGS.businessCommunityPhase5,
        africaExpansionPhase6: FEATURE_FLAGS.africaExpansionPhase6,
      },
      supabase: {
        project: config.projectRef,
        configured: config.ok,
        authReachable,
        issues: config.issues,
      },
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    },
    { status: httpStatus },
  );
}
