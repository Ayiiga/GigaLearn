"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LevelCard } from "@/components/learning/level-card";
import { ProgressBar } from "@/components/gamification/progress-bar";
import { LEVELS, TESTIMONIALS, LESSONS } from "@/content/curriculum";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-giga-purple/10 via-white to-giga-blue/10 dark:from-giga-purple/20 dark:via-giga-surface dark:to-giga-blue/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full bg-giga-purple/10 px-4 py-1.5 text-sm font-bold text-giga-purple">
                <Sparkles className="h-4 w-4" /> GigaPhonics Included
              </span>
              <h1 className="font-display mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Learn, Read, Speak, and{" "}
                <span className="text-gradient">Grow Smarter</span> Every Day
              </h1>
              <p className="mt-6 text-lg text-giga-muted max-w-xl">
                The most engaging English learning platform for toddlers, kindergarten, and primary learners.
                Works offline. Built for African and global classrooms. 🌍
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/learn">
                  <Button size="lg">
                    Start Learning <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/gigaphonics">
                  <Button variant="secondary" size="lg">
                    Try GigaPhonics
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-giga-muted">
                <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-giga-green" /> Child-safe</span>
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4 text-giga-purple" /> Offline-ready</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4 text-giga-blue" /> For schools & homes</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl bg-gradient-to-br from-giga-purple to-giga-blue p-8 text-white shadow-2xl">
                <div className="text-center">
                  <span className="text-8xl">🎓</span>
                  <h2 className="font-display mt-4 text-3xl font-bold">GigaLearn</h2>
                  <p className="mt-2 opacity-90">9 Learning Levels • AI Tutor • Games</p>
                </div>
                <div className="mt-6">
                  <ProgressBar />
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 rounded-2xl bg-giga-yellow px-4 py-2 font-bold text-giga-orange shadow-lg"
              >
                🔤 GigaPhonics
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">9 Learning Adventures</h2>
            <p className="mt-4 text-giga-muted max-w-2xl mx-auto">
              From alphabet tracing to grammar mastery — a complete English learning journey
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {LEVELS.map((level, i) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <LevelCard
                  {...level}
                  href={level.id === "phonics" ? "/gigaphonics" : `/learn?level=${level.id}`}
                  progress={Math.min(level.number * 10, 100)}
                  locked={i > 5}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-giga-purple/5 py-16 dark:bg-giga-purple/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Featured Lessons</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LESSONS.slice(0, 4).map((lesson) => (
              <Link key={lesson.id} href={`/learn/${lesson.level}/${lesson.slug}`}>
                <Card hover gradient>
                  <span className="text-3xl">{lesson.level === "phonics" ? "🔤" : "📚"}</span>
                  <CardTitle className="mt-3">{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                  <p className="mt-3 text-sm font-bold text-giga-purple">+{lesson.xp_reward} XP</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <Link href="/teachers">
              <Card hover className="h-full bg-gradient-to-br from-giga-blue/10 to-giga-purple/10">
                <span className="text-4xl">👩‍🏫</span>
                <CardTitle className="mt-4">For Teachers & Schools</CardTitle>
                <CardDescription>
                  Class management, assignments, progress tracking, analytics, and attendance — all in one dashboard.
                </CardDescription>
              </Card>
            </Link>
            <Link href="/parents">
              <Card hover className="h-full bg-gradient-to-br from-giga-orange/10 to-giga-yellow/10">
                <span className="text-4xl">👨‍👩‍👧</span>
                <CardTitle className="mt-4">For Parents & Homeschoolers</CardTitle>
                <CardDescription>
                  Track your child&apos;s progress, reading activity, achievements, and get home learning suggestions.
                </CardDescription>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-giga-surface py-16 dark:bg-giga-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Loved by Learners Worldwide</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <span className="text-4xl">{t.avatar}</span>
                <p className="mt-4 text-giga-muted italic">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 font-bold">{t.name}</p>
                <p className="text-sm text-giga-muted">{t.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold">Ready to start learning?</h2>
          <p className="mt-4 text-giga-muted">Join thousands of young learners on GigaLearn today.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register"><Button size="xl">Create Free Account</Button></Link>
            <Link href="/learn"><Button variant="outline" size="xl">Explore Lessons</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
