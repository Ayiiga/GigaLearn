"use client";

import { ProgressBar } from "@/components/gamification/progress-bar";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LEVELS, LESSONS } from "@/content/curriculum";
import { useGamification } from "@/stores/app-store";
import { motion } from "framer-motion";

export default function ProgressPage() {
  const { xp, level, streak } = useGamification();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Your Progress</h1>
      <p className="mt-2 text-giga-muted">Track your learning journey across all levels</p>

      <div className="mt-8 max-w-md">
        <ProgressBar />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-4xl font-display font-bold text-giga-purple">{level}</p>
          <CardDescription>Current Level</CardDescription>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-display font-bold text-giga-orange">{streak}</p>
          <CardDescription>Day Streak 🔥</CardDescription>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-display font-bold text-giga-green">{xp}</p>
          <CardDescription>Total XP ⭐</CardDescription>
        </Card>
      </div>

      <h2 className="font-display text-2xl font-bold mt-12 mb-6">Level Progress</h2>
      <div className="space-y-4">
        {LEVELS.map((level, i) => (
          <motion.div key={level.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{level.icon}</span>
                <div className="flex-1">
                  <CardTitle>{level.title}</CardTitle>
                  <div className="mt-2 h-2 rounded-full bg-giga-border overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${level.color}`}
                      style={{ width: `${Math.min(level.number * 10, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="font-bold text-giga-muted">{Math.min(level.number * 10, 100)}%</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="font-display text-2xl font-bold mt-12 mb-6">Recent Lessons</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {LESSONS.slice(0, 4).map((lesson) => (
          <Card key={lesson.id}>
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription>{lesson.level} • {lesson.duration_minutes} min</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}
