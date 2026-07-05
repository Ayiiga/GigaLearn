import { SUPABASE_PROJECT_REF } from "@/lib/supabase/project";

/**
 * Canonical site URL for OAuth redirects (dev + production).
 * Set NEXT_PUBLIC_APP_URL in production (e.g. https://gigalearn.app).
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
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
  const production = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const urls = [
    "http://localhost:3000/auth/callback",
    "http://127.0.0.1:3000/auth/callback",
  ];
  if (production) {
    urls.push(`${production}/auth/callback`);
  }
  return urls;
}

export function getSupabaseAuthSettingsUrl(): string {
  return `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/auth/url-configuration`;
}

export function getSupabaseGoogleProviderUrl(): string {
  return `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/auth/providers?provider=Google`;
}
