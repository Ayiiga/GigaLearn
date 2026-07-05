import { SUPABASE_URL } from "@/lib/supabase/project";

/**
 * Resolves the Supabase client API key.
 * Prefers legacy anon JWT when present (best SSR/auth compatibility),
 * then new publishable keys (sb_publishable_*).
 */
export function getSupabasePublishableKey(): string {
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (anon?.startsWith("eyJ")) {
    return anon;
  }

  return publishable ?? anon ?? "placeholder-key";
}

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? SUPABASE_URL;
}
