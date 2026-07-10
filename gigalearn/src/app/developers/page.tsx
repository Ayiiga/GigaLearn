import type { Metadata } from "next";
import { StaticPage } from "@/components/media/static-page";

export const metadata: Metadata = { title: "Developers" };

export default function DevelopersPage() {
  return (
    <StaticPage title="Developers" subtitle="Build on GigaTrend TV">
      <p>Integrate GigaTrend news widgets, embed live TV directories, or build custom apps using our API and PWA architecture.</p>
      <p className="mt-4">Stack: Next.js, React, TypeScript, Supabase, Tailwind CSS, PWA. Open-source contributions welcome.</p>
    </StaticPage>
  );
}
