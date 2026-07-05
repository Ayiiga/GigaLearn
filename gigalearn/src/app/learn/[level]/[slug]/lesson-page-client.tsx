"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LetterTracing } from "@/components/learning/letter-tracing";
import { PhonicsCard, BlendingActivity } from "@/components/learning/phonics-card";
import { FlashcardDeck } from "@/components/learning/flashcard";
import { CelebrationEffect, XPBadge } from "@/components/gamification/progress-bar";
import { LESSONS, STORIES, VOCABULARY_CATEGORIES, CVC_WORDS, PHONICS_SOUNDS } from "@/content/curriculum";
import { useAppStore } from "@/stores/app-store";
import { saveLocalProgress } from "@/lib/offline/db";
import { speak } from "@/lib/speech";
import { Volume2 } from "lucide-react";

export function LessonPageClient({
  level,
  slug,
}: {
  level: string;
  slug: string;
}) {
  const lesson = LESSONS.find((l) => l.level === level && l.slug === slug);
  const [celebrate, setCelebrate] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { addXP, addCoins, incrementStreak, unlockLesson } = useAppStore();

  if (!lesson) notFound();

  const handleComplete = async () => {
    setCompleted(true);
    setCelebrate(true);
    addXP(lesson.xp_reward);
    addCoins(lesson.coin_reward);
    incrementStreak();
    unlockLesson(lesson.id);

    await saveLocalProgress({
      id: crypto.randomUUID(),
      user_id: "local-user",
      lesson_id: lesson.id,
      level: lesson.level,
      completed: true,
      score: 100,
      time_spent_seconds: lesson.duration_minutes * 60,
      completed_at: new Date().toISOString(),
      synced: false,
    });

    setTimeout(() => setCelebrate(false), 3000);
  };

  const renderActivity = () => {
    switch (lesson.level) {
      case "alphabet": {
        const letter =
          (lesson.content.activities.find((a) => a.type === "tracing")?.data.letter as string) ?? "A";
        const word = lesson.content.activities.find((a) => a.type === "matching")?.data
          .word as string | undefined;
        const emoji = lesson.content.activities.find((a) => a.type === "matching")?.data
          .emoji as string | undefined;
        return (
          <div className="space-y-10">
            <LetterTracing letter={letter} onComplete={() => {}} />
            {word && (
              <div className="text-center space-y-4">
                <span className="text-7xl block">{emoji}</span>
                <p className="text-2xl font-bold font-display">{word}</p>
                <Button type="button" variant="secondary" onClick={() => speak(word)}>
                  <Volume2 className="h-4 w-4" /> Hear &ldquo;{word}&rdquo;
                </Button>
              </div>
            )}
          </div>
        );
      }
      case "mathematics": {
        const quiz = lesson.content.activities.find((a) => a.type === "quiz");
        const count = lesson.content.activities.find((a) => a.type === "matching");
        if (quiz?.data.a != null) {
          const a = quiz.data.a as number;
          const b = quiz.data.b as number;
          const answer = quiz.data.answer as number;
          const options = [...new Set([answer, answer + 1, Math.max(1, answer - 1), answer + 2])].sort(
            (x, y) => x - y,
          );
          return (
            <div className="text-center space-y-6">
              <p className="text-5xl font-bold font-display">
                {a} + {b} = ?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {options.map((option) => (
                    <Button
                      key={option}
                      size="lg"
                      variant="secondary"
                      onClick={() => option === answer && handleComplete()}
                    >
                      {option}
                    </Button>
                  ))}
              </div>
            </div>
          );
        }
        if (count?.data.range) {
          const [min, max] = count.data.range as [number, number];
          const seed = lesson.id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
          const target = min + (seed % (max - min + 1));
          const emoji = (count.data.emoji as string) ?? "⭐";
          return (
            <div className="text-center space-y-6">
              <p className="text-xl text-giga-muted">How many do you see?</p>
              <div className="flex flex-wrap justify-center gap-2 text-4xl">
                {Array.from({ length: target }, (_, i) => (
                  <span key={i}>{emoji}</span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
                  <Button key={n} variant="secondary" onClick={() => n === target && handleComplete()}>
                    {n}
                  </Button>
                ))}
              </div>
            </div>
          );
        }
        return null;
      }
      case "phonics":
        return (
          <div className="space-y-12">
            <PhonicsCard {...PHONICS_SOUNDS[0]} />
            <BlendingActivity {...CVC_WORDS[0]} onComplete={handleComplete} />
          </div>
        );
      case "vocabulary":
        return (
          <FlashcardDeck
            cards={VOCABULARY_CATEGORIES[0].words.map((w) => ({
              word: w.word,
              meaning: w.meaning,
              image: w.image,
              synonym: "synonym" in w ? w.synonym : undefined,
              antonym: "antonym" in w ? w.antonym : undefined,
            }))}
          />
        );
      case "reading": {
        const story = STORIES.find((s) => s.id === "leo-the-lion");
        return story ? (
          <div className="max-w-2xl mx-auto">
            <span className="text-6xl block text-center mb-6">{story.illustration}</span>
            <h2 className="font-display text-2xl font-bold text-center mb-6">{story.title}</h2>
            <div className="prose dark:prose-invert whitespace-pre-line text-lg leading-relaxed">
              {story.content}
            </div>
          </div>
        ) : null;
      }
      default:
        return (
          <div className="text-center py-12">
            <span className="text-6xl">📚</span>
            <p className="mt-4 text-giga-muted">Interactive activities coming up!</p>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <CelebrationEffect show={celebrate} />

      <Link href={`/learn?level=${level}`} className="inline-flex items-center gap-2 text-giga-purple font-semibold hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to lessons
      </Link>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">{lesson.title}</h1>
          <p className="mt-2 text-giga-muted">{lesson.description}</p>
          <div className="mt-4 flex gap-3">
            <XPBadge amount={lesson.xp_reward} />
            <span className="text-sm text-giga-muted">⏱ {lesson.duration_minutes} min</span>
          </div>
        </div>

        <div className="rounded-3xl border border-giga-border bg-white p-6 sm:p-10 dark:bg-giga-surface dark:border-giga-border-dark">
          {renderActivity()}
        </div>

        {!completed && lesson.level !== "phonics" && (
          <div className="mt-8 text-center">
            <Button size="lg" onClick={handleComplete}>
              Complete Lesson 🎉
            </Button>
          </div>
        )}

        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-giga-green/10 p-6 text-giga-green font-bold text-xl"
          >
            <CheckCircle className="h-8 w-8" />
            Lesson Complete! +{lesson.xp_reward} XP earned
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
