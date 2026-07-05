"use client";

import { InsightsPanel, LevelAnalytics } from "@/components/dashboard/analytics-panel";
import { GlassCard } from "@/components/ui/glass-card";
import { LESSONS } from "@/content/curriculum";
import { useGamification } from "@/stores/app-store";

export default function TeacherDashboard() {
  const gamification = useGamification();
  const classSize = 24;
  const avgLessons = Math.max(1, Math.round(gamification.completed_lessons.length * 0.6));
  const phonicsLessons = LESSONS.filter((lesson) => lesson.level === "phonics").length;
  const mathLessons = LESSONS.filter((lesson) => lesson.level === "mathematics").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Teacher Dashboard</h1>
      <p className="mt-2 text-giga-muted">Class insights, recommendations, and curriculum analytics</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <GlassCard className="text-center">
          <p className="text-3xl font-display font-bold text-giga-purple">{classSize}</p>
          <p className="text-sm text-giga-muted">Students in class</p>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-3xl font-display font-bold text-giga-orange">{avgLessons}</p>
          <p className="text-sm text-giga-muted">Avg lessons completed</p>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-3xl font-display font-bold text-giga-green">{gamification.streak}</p>
          <p className="text-sm text-giga-muted">Top learner streak</p>
        </GlassCard>
      </div>

      <div className="mt-10">
        <InsightsPanel
          strengths={["Phonics engagement", "Interactive lesson completion", "Daily practice consistency"]}
          weaknesses={["Extended reading fluency", "Advanced math practice"]}
          recommendations={[
            `Assign ${phonicsLessons} GigaPhonics lessons this week`,
            `Introduce ${mathLessons} GigaMath activities for numeracy`,
            "Use AI Tutor for differentiated quiz generation",
          ]}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="font-bold text-lg">Suggested Assignments</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>📚 Alphabet letters A–E tracing practice</li>
            <li>🔤 CVC blending with /api/ai pronunciation coach</li>
            <li>🔢 GigaMath counting and addition basics</li>
          </ul>
        </GlassCard>
        <GlassCard>
          <p className="font-bold text-lg">Class Progress Snapshot</p>
          <div className="mt-4">
            <LevelAnalytics />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
