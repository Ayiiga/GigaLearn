import { NextResponse } from "next/server";
import { validateSupabaseConfig, getSupabasePublishableKey } from "@/lib/supabase/env";

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
