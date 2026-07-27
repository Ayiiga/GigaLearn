import type { Metadata } from "next";

export const metadata: Metadata = { title: "API" };

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold text-sm-primary dark:text-white">Smart Map API</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        Programmatic access to places, community reports, country emergency profiles, and partner integrations.
        Contact partnerships for API keys, rate limits, and commercial access.
      </p>
      <pre className="mt-5 overflow-x-auto rounded-3xl bg-[#071827] p-4 text-xs text-emerald-200">
{`GET /api/health
POST /api/ai { "feature": "map_assistant", "input": "..." }
POST /api/sync`}
      </pre>
    </div>
  );
}
