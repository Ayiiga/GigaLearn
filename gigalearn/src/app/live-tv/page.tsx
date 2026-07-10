import type { Metadata } from "next";
import { MediaPageShell, SectionHeader } from "@/components/media/section-header";
import { TvStationCard } from "@/components/media/tv-station-card";
import { TV_CATEGORIES, getTvByCategory } from "@/content/media";

export const metadata: Metadata = {
  title: "Live TV",
  description: "Official live TV streams from Ghana, Nigeria, Kenya, South Africa, and international broadcasters.",
};

export default function LiveTvPage() {
  return (
    <MediaPageShell
      title="Live TV"
      subtitle="Official broadcaster streams only — we link to authorized sources"
    >
      {TV_CATEGORIES.map((category) => {
        const stations = getTvByCategory(category);
        if (!stations.length) return null;
        return (
          <section key={category} className="mb-10">
            <SectionHeader title={category} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stations.map((station) => (
                <TvStationCard key={station.id} station={station} />
              ))}
            </div>
          </section>
        );
      })}
    </MediaPageShell>
  );
}
