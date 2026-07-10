import type { Metadata } from "next";
import { StaticPage } from "@/components/media/static-page";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <StaticPage title="Contact Us" subtitle="Get in touch with the GigaTrend TV team">
      <p>Email: contact@gigatrend.tv</p>
      <p className="mt-2">Press inquiries: press@gigatrend.tv</p>
      <p className="mt-2">Partnerships: partners@gigatrend.tv</p>
      <p className="mt-4 text-sm text-giga-muted">We aim to respond within 2 business days.</p>
    </StaticPage>
  );
}
