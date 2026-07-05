import { Metadata } from "next";
import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = { title: "Help Center" };

const FAQ = [
  { q: "How do I install GigaLearn?", a: "Open GigaLearn in Chrome or Edge, tap the install icon in the address bar, or use 'Add to Home Screen' on mobile." },
  { q: "Does it work offline?", a: "Yes! Lessons, stories, games, and progress tracking work offline. Progress syncs automatically when you're back online." },
  { q: "What is GigaPhonics?", a: "GigaPhonics is our flagship phonics module (Level 2) with sounds, blending, digraphs, CVC words, and pronunciation training." },
  { q: "Is GigaLearn safe for children?", a: "Absolutely. We follow child-safe design principles, filter AI content, and never show ads to learners." },
  { q: "How do teachers add students?", a: "Create a class in the Teacher Dashboard and share the join code with students or parents." },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Help Center</h1>
      <p className="mt-2 text-giga-muted">Get answers and support</p>

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
        <Link href="mailto:support@gigalearn.app" className="text-giga-purple font-bold hover:underline">
          support@gigalearn.app
        </Link>
      </div>
    </div>
  );
}
