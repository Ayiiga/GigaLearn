"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressBar } from "@/components/gamification/progress-bar";
import Link from "next/link";
import { LEVELS } from "@/content/curriculum";

export default function StudentDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Student Dashboard</h1>
      <p className="mt-2 text-giga-muted">Your learning command center</p>

      <div className="mt-6 max-w-md"><ProgressBar /></div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/learn"><Card hover className="text-center"><span className="text-4xl">📚</span><CardTitle className="mt-2">Continue Learning</CardTitle></Card></Link>
        <Link href="/gigaphonics"><Card hover className="text-center"><span className="text-4xl">🔤</span><CardTitle className="mt-2">GigaPhonics</CardTitle></Card></Link>
        <Link href="/games"><Card hover className="text-center"><span className="text-4xl">🎮</span><CardTitle className="mt-2">Play Games</CardTitle></Card></Link>
        <Link href="/ai-tutor"><Card hover className="text-center"><span className="text-4xl">🤖</span><CardTitle className="mt-2">AI Tutor</CardTitle></Card></Link>
      </div>

      <h2 className="font-display text-xl font-bold mt-12 mb-6">Your Learning Path</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {LEVELS.slice(0, 4).map((l) => (
          <Card key={l.id}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{l.icon}</span>
              <div>
                <CardTitle>{l.title}</CardTitle>
                <CardDescription>{l.subtitle}</CardDescription>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
