import type { Metadata } from "next";
import { StaticPage } from "@/components/media/static-page";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <StaticPage title="Careers" subtitle="Join the GigaTrend TV team">
      <p>We are building Africa&apos;s premier news and media platform. Open roles in journalism, engineering, design, and partnerships.</p>
      <p className="mt-4">Send your CV to careers@gigatrend.tv with the role title in the subject line.</p>
    </StaticPage>
  );
}
