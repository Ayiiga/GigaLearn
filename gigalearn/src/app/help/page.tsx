import { Metadata } from "next";
import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Help Center" };

const FAQ = [
  { q: `How do I install ${BRAND.name}?`, a: "Open GigaTrend TV in Chrome or Edge, tap the install icon in the address bar, or use 'Add to Home Screen' on mobile for the full PWA experience." },
  { q: "Does it work offline?", a: "Yes! Saved articles and cached content are available offline. Breaking news syncs when you're back online." },
  { q: "Where do Live TV streams come from?", a: "We only link to official broadcaster sources. Tap 'Watch Official' to open the authorized stream on the broadcaster's website." },
  { q: "How do I search for content?", a: "Use the Search page or the search bar on the homepage. You can find news, videos, TV stations, radio, teams, players, countries, and trending topics with instant suggestions and search history." },
  { q: "What is GigaTrend AI?", a: "GigaTrend AI is coming soon. It will offer intelligent news summaries, sports insights, multilingual explanations, and voice assistance. Tap 'Notify Me' on the AI page to get notified at launch." },
  { q: "How do I save articles?", a: "Open any article and tap Save, or sign in to sync bookmarks across devices via your profile." },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Help Center</h1>
      <p className="mt-2 text-giga-muted">Get answers and support for {BRAND.name}</p>

      <div className="mt-10 space-y-4">
        {FAQ.map((item) => (
          <Card key={item.q}>
            <CardTitle>{item.q}</CardTitle>
            <CardDescription className="mt-2 text-base">{item.a}</CardDescription>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-giga-muted">Need more help?</p>
        <Link href="/contact" className="text-gtv-purple font-bold hover:underline">
          Contact us
        </Link>
      </div>
    </div>
  );
}
