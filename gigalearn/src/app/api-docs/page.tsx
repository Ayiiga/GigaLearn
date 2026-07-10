import type { Metadata } from "next";
import { StaticPage } from "@/components/media/static-page";

export const metadata: Metadata = { title: "API" };

export default function ApiPage() {
  return (
    <StaticPage title="GigaTrend API" subtitle="Programmatic access to news and media data">
      <p>The GigaTrend API provides access to articles, sports data, trending topics, and live station metadata for approved partners.</p>
      <p className="mt-4">API access is available with premium membership. Documentation and keys: developers@gigatrend.tv</p>
    </StaticPage>
  );
}
