import type { Metadata } from "next";
import { StaticPage } from "@/components/media/static-page";

export const metadata: Metadata = { title: "Advertise" };

export default function AdvertisePage() {
  return (
    <StaticPage title="Advertise with Us" subtitle="Reach millions across Africa">
      <p>GigaTrend TV offers display ads, sponsored articles, and premium placements across news, sports, and live TV sections.</p>
      <p className="mt-4">Google AdSense integration and direct sponsorship packages are available. Contact partners@gigatrend.tv for media kits and rates.</p>
      <div className="mt-6 rounded-xl border border-dashed border-gtv-gold/40 bg-gtv-gold/5 p-4 text-sm text-giga-muted">
        Ad placement architecture ready — non-disruptive monetization slots configured across the platform.
      </div>
    </StaticPage>
  );
}
