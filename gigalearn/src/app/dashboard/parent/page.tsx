"use client";

import { ProgressBar } from "@/components/gamification/progress-bar";
import { InsightsPanel, LevelAnalytics } from "@/components/dashboard/analytics-panel";
import { LearningPathCard } from "@/components/dashboard/learning-path-card";
import { buildLearnerInsights } from "@/lib/learning-path/recommendations";
import { useGamification } from "@/stores/app-store";
import { GlassCard } from "@/components/ui/glass-card";
import { LESSONS } from "@/content/curriculum";

export default function ParentDashboard() {
  const gamification = useGamification();
  const insights = buildLearnerInsights(gamification);
  const completedCount = gamification.completed_lessons.length;
  const readingDone = LESSONS.filter(
    (lesson) => lesson.level === "reading" && gamification.completed_lessons.includes(lesson.id),
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Parent Dashboard</h1>
      <p className="mt-2 text-giga-muted">Detailed analytics and learning insights for your child</p>

      <GlassCard className="mt-8 p-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl">👧</span>
          <div>
            <p className="font-display text-xl font-bold">Learner Progress Overview</p>
            <p className="text-giga-muted">{completedCount} lessons completed • Level {gamification.level}</p>
          </div>
        </div>
        <div className="mt-6 max-w-md"><ProgressBar /></div>
      </GlassCard>

      <div className="mt-10">
        <InsightsPanel
          strengths={insights.strengths}
          weaknesses={insights.weaknesses}
          recommendations={[
            `Practice ${insights.recommendedLevel} for ${insights.dailyGoalMinutes} minutes today`,
            "Read one story aloud together before bedtime",
            "Celebrate streak milestones to build habits",
          ]}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="font-bold text-lg">📖 Reading Progress</p>
          <p className="mt-2 text-giga-muted">{readingDone} reading lessons completed</p>
          <p className="mt-4 text-sm">Current streak: {gamification.streak} days</p>
        </GlassCard>
        <GlassCard>
          <p className="font-bold text-lg">🏆 Achievements</p>
          <p className="mt-2 text-giga-muted">{gamification.badges.length} badges earned</p>
          <ul className="mt-4 space-y-2 text-sm">
            {gamification.badges.slice(0, 3).map((badge) => (
              <li key={badge.id}>{badge.icon} {badge.name}</li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <LearningPathCard />
        <div>
          <h2 className="font-display text-xl font-bold mb-4">Level Breakdown</h2>
          <LevelAnalytics />
        </div>
      </div>
    </div>
  );
}
