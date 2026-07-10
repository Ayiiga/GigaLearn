import type { Metadata } from "next";
import { StaticPage } from "@/components/media/static-page";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <StaticPage title="About GigaTrend TV" subtitle={BRAND.tagline}>
      <p>{BRAND.name} is Africa&apos;s smart news and live TV platform, delivering breaking news, sports coverage, live streams, and AI-powered summaries across the continent and the world.</p>
      <p className="mt-4">We are part of the broader Giga ecosystem, committed to quality journalism, official broadcaster partnerships, and accessible media for all Africans.</p>
    </StaticPage>
  );
}
