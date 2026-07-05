import { SUPABASE_PROJECT_REF } from "@/lib/supabase/project";

function cleanAppUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === '""' || trimmed === "''") return undefined;
  return trimmed.replace(/\/$/, "");
}

/**
 * Canonical site URL for OAuth redirects (dev + production).
 * Set NEXT_PUBLIC_APP_URL in production (e.g. https://gigalearn.app).
 */
export function getSiteUrl(): string {
  const configured = cleanAppUrl(process.env.NEXT_PUBLIC_APP_URL);
  if (configured) {
    return configured;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl(redirectPath = "/learn"): string {
  const site = getSiteUrl();
  const safeRedirect = redirectPath.startsWith("/") ? redirectPath : "/learn";
  return `${site}/auth/callback?redirect=${encodeURIComponent(safeRedirect)}`;
}

/** Redirect URLs to register in Supabase Dashboard → Auth → URL Configuration */
export function getRequiredRedirectUrls(): string[] {
  const production = cleanAppUrl(process.env.NEXT_PUBLIC_APP_URL);
  const urls = [
    "http://localhost:3000/auth/callback",
    "http://127.0.0.1:3000/auth/callback",
    "https://giga-learn-ayiigas-projects.vercel.app/auth/callback",
    "https://giga-learn-ayiiga-ayiigas-projects.vercel.app/auth/callback",
  ];
  if (production) {
    urls.push(`${production}/auth/callback`);
  }
  if (process.env.VERCEL_URL) {
    urls.push(`https://${process.env.VERCEL_URL}/auth/callback`);
  }
  return [...new Set(urls)];
}

export function getSupabaseAuthSettingsUrl(): string {
  return `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/auth/url-configuration`;
}

export function getSupabaseGoogleProviderUrl(): string {
  return `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/auth/providers?provider=Google`;
}
