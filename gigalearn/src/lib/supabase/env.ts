import { SUPABASE_URL, SUPABASE_PROJECT_REF } from "@/lib/supabase/project";

function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === '""' || trimmed === "''") return undefined;
  return trimmed;
}

function isPlaceholderValue(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    lower === "placeholder-key" ||
    lower.startsWith("your-") ||
    lower.includes("placeholder") ||
    lower.includes("changeme")
  );
}

/** True when the value is a Supabase HTTP URL, not a key or placeholder. */
export function isValidSupabaseHttpUrl(value: string | undefined): value is string {
  if (!value || isPlaceholderValue(value)) return false;
  const trimmed = value.trim();
  if (trimmed.startsWith("eyJ") || trimmed.startsWith("sb_publishable_")) return false;
  if (!/^https?:\/\//i.test(trimmed)) return false;
  try {
    return new URL(trimmed).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function isValidSupabaseKey(value: string | undefined): value is string {
  if (!value || isPlaceholderValue(value)) return false;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed) || trimmed.endsWith(".supabase.co")) return false;
  return trimmed.startsWith("eyJ") || trimmed.startsWith("sb_publishable_");
}

/**
 * Resolves the Supabase client API key.
 * Prefers legacy anon JWT when present (best SSR/auth compatibility),
 * then new publishable keys (sb_publishable_*).
 */
export function getSupabasePublishableKey(): string {
  const candidates = [
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    cleanEnv(process.env.ANON_PUBLIC_KEY),
  ];

  for (const candidate of candidates) {
    if (isValidSupabaseKey(candidate)) {
      return candidate;
    }
  }

  return "placeholder-key";
}

export function getSupabaseUrl(): string {
  const candidates = [
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
    cleanEnv(process.env.SUPABASE_URL),
  ];

  for (const candidate of candidates) {
    if (isValidSupabaseHttpUrl(candidate)) {
      return candidate.trim();
    }
  }

  return SUPABASE_URL;
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
          `Supabase anon key belongs to project "${payload.ref}" but GigaTrend TV expects "${SUPABASE_PROJECT_REF}".`,
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
