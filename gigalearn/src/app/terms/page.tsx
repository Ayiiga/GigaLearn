import type { Metadata } from "next";
import { StaticPage } from "@/components/media/static-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service" subtitle="Usage terms for GigaTrend TV">
      <p>By using GigaTrend TV, you agree to use the platform for lawful purposes. Live TV and radio links redirect to official broadcaster sources only.</p>
      <p className="mt-4">Content is provided for informational purposes. We are not responsible for third-party broadcaster availability. Premium features may require a subscription.</p>
    </StaticPage>
  );
}
