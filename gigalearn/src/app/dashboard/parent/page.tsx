"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressBar } from "@/components/gamification/progress-bar";

export default function ParentDashboard() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Parent Dashboard</h1>
      <p className="mt-2 text-giga-muted">Track your child&apos;s learning journey</p>

      <Card className="mt-8 p-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl">👧</span>
          <div>
            <CardTitle>Amara&apos;s Progress</CardTitle>
            <CardDescription>Kindergarten • Active learner</CardDescription>
          </div>
        </div>
        <div className="mt-6 max-w-md"><ProgressBar /></div>
      </Card>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardTitle>📖 Reading This Week</CardTitle>
          <CardDescription className="mt-2">3 stories read • 45 minutes total</CardDescription>
          <ul className="mt-4 space-y-2 text-sm">
            <li>✅ Leo the Learning Lion</li>
            <li>✅ A Rainy Day Adventure</li>
            <li>🔄 The Magic Kite (in progress)</li>
          </ul>
        </Card>
        <Card>
          <CardTitle>🏆 Recent Achievements</CardTitle>
          <CardDescription className="mt-2">Celebrated this week</CardDescription>
          <ul className="mt-4 space-y-2 text-sm">
            <li>⭐ Phonics Star — 5 lessons complete</li>
            <li>🔥 5-day streak!</li>
            <li>🅰️ First Letter traced</li>
          </ul>
        </Card>
        <Card className="sm:col-span-2">
          <CardTitle>🏠 Home Learning Suggestions</CardTitle>
          <CardDescription className="mt-2">Recommended activities for today</CardDescription>
          <ol className="mt-4 space-y-2 list-decimal list-inside text-sm">
            <li>Practice GigaPhonics CVC words for 10 minutes</li>
            <li>Read &ldquo;Leo the Learning Lion&rdquo; together aloud</li>
            <li>Play Letter Match game offline before bedtime</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
