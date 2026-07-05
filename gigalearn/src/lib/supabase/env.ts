import { SUPABASE_URL, SUPABASE_PROJECT_REF } from "@/lib/supabase/project";

function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === '""' || trimmed === "''") return undefined;
  return trimmed;
}

/**
 * Resolves the Supabase client API key.
 * Prefers legacy anon JWT when present (best SSR/auth compatibility),
 * then new publishable keys (sb_publishable_*).
 */
export function getSupabasePublishableKey(): string {
  const anon =
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    cleanEnv(process.env.ANON_PUBLIC_KEY);

  if (anon?.startsWith("eyJ")) {
    return anon;
  }

  if (anon && anon !== "placeholder-key") {
    return anon;
  }

  return "placeholder-key";
}

export function getSupabaseUrl(): string {
  return (
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) ??
    cleanEnv(process.env.SUPABASE_URL) ??
    SUPABASE_URL
  );
}

export interface SupabaseConfigStatus {
  ok: boolean;
  url: string;
  hasValidKey: boolean;
  issues: string[];
}

/** Validates client-side Supabase configuration for auth flows. */
export function validateSupabaseConfig(): SupabaseConfigStatus {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  const issues: string[] = [];

  if (!url.startsWith("https://") || !url.includes(".supabase.co")) {
    issues.push("Supabase URL is missing or invalid.");
  }

  if (!key.startsWith("eyJ") && !key.startsWith("sb_publishable_")) {
    issues.push("Supabase anon key is missing or invalid.");
  }

  if (key.startsWith("eyJ")) {
    try {
      const payload = JSON.parse(atob(key.split(".")[1] ?? "")) as { ref?: string };
      if (payload.ref && payload.ref !== SUPABASE_PROJECT_REF) {
        issues.push(
          `Supabase anon key belongs to project "${payload.ref}" but GigaLearn expects "${SUPABASE_PROJECT_REF}".`,
        );
      }
    } catch {
      issues.push("Supabase anon key could not be validated.");
    }
  }

  if (url.includes(".supabase.co") && !url.includes(SUPABASE_PROJECT_REF)) {
    issues.push(`Supabase URL does not match project ${SUPABASE_PROJECT_REF}.`);
  }

  return {
    ok: issues.length === 0,
    url,
    hasValidKey: key.startsWith("eyJ") || key.startsWith("sb_publishable_"),
    issues,
  };
}
