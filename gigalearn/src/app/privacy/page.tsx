import type { Metadata } from "next";
import { StaticPage } from "@/components/media/static-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" subtitle="How we protect your data">
      <p>GigaTrend TV respects your privacy. We collect only data necessary to provide personalised news, saved articles, and notification preferences. Authentication is handled securely via Supabase.</p>
      <p className="mt-4">We do not sell personal data. Analytics are used to improve the platform. Contact us for data requests or deletion.</p>
    </StaticPage>
  );
}
