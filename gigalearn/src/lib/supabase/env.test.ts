import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getSupabaseUrl,
  getSupabasePublishableKey,
  validateSupabaseConfig,
} from "@/lib/supabase/env";
import { SUPABASE_URL } from "@/lib/supabase/project";

describe("supabase env resolution", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("falls back to project URL when NEXT_PUBLIC_SUPABASE_URL is empty", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "";
    expect(getSupabaseUrl()).toBe(SUPABASE_URL);
  });

  it("falls back to ANON_PUBLIC_KEY when NEXT_PUBLIC_SUPABASE_ANON_KEY is empty", () => {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "";
    process.env.ANON_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
    expect(getSupabasePublishableKey()).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test");
  });

  it("detects anon key project mismatch", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indyb25ncHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE5MDAwMDAwMDB9.sig";

    const status = validateSupabaseConfig();
    expect(status.ok).toBe(false);
    expect(status.issues.some((issue) => issue.includes("wrongproject"))).toBe(true);
  });

  it("reports invalid config when keys are missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "";
    delete process.env.ANON_PUBLIC_KEY;

    const status = validateSupabaseConfig();
    expect(status.ok).toBe(false);
    expect(status.issues.some((issue) => issue.includes("anon key"))).toBe(true);
  });
});
