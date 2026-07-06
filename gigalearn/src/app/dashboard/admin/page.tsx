"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, School, BookOpen, BarChart3 } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/hooks/use-auth";
import { fetchSchoolStats, type SchoolStats } from "@/lib/classroom";

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    fetchSchoolStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, [isAuthenticated]);

  const display = stats ?? { total_users: 0, active_students: 0, schools: 0, lessons_published: 0 };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-giga-purple hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <h1 className="font-display text-3xl font-bold">School Administrator Dashboard</h1>
      <p className="mt-2 text-giga-muted">School management, analytics, and platform oversight</p>

      {!isAuthenticated && (
        <p className="mt-4 rounded-xl bg-giga-orange/10 px-4 py-3 text-sm">
          Sign in with an administrator account to view live school data from Supabase.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8 mb-10">
        <GlassCard className="text-center">
          <Users className="h-6 w-6 text-giga-purple mx-auto" />
          <p className="text-3xl font-bold mt-2">{loading ? "…" : display.total_users}</p>
          <CardDescription>Total Users</CardDescription>
        </GlassCard>
        <GlassCard className="text-center">
          <BarChart3 className="h-6 w-6 text-giga-orange mx-auto" />
          <p className="text-3xl font-bold mt-2">{loading ? "…" : display.active_students}</p>
          <CardDescription>Active Students</CardDescription>
        </GlassCard>
        <GlassCard className="text-center">
          <School className="h-6 w-6 text-giga-green mx-auto" />
          <p className="text-3xl font-bold mt-2">{loading ? "…" : display.schools}</p>
          <CardDescription>Schools</CardDescription>
        </GlassCard>
        <GlassCard className="text-center">
          <BookOpen className="h-6 w-6 text-giga-blue mx-auto" />
          <p className="text-3xl font-bold mt-2">{loading ? "…" : display.lessons_published}</p>
          <CardDescription>Lessons Published</CardDescription>
        </GlassCard>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardTitle>School Notifications</CardTitle>
          <CardDescription className="mt-2">Send announcements to teachers and parents</CardDescription>
          <p className="mt-4 text-sm text-giga-muted">
            School-wide notifications are managed through Supabase. Connect your school account to enable messaging.
          </p>
          <Link href="/settings" className="mt-4 inline-block text-giga-purple font-bold text-sm hover:underline">
            Configure in Settings →
          </Link>
        </Card>
        <Card>
          <CardTitle>Learning Analytics</CardTitle>
          <CardDescription className="mt-2">Platform-wide progress and engagement metrics</CardDescription>
          <Link href="/progress" className="mt-4 inline-block text-giga-purple font-bold text-sm hover:underline">
            View progress analytics →
          </Link>
        </Card>
        <Card>
          <CardTitle>Classroom Oversight</CardTitle>
          <CardDescription className="mt-2">Monitor classrooms across your school</CardDescription>
          <Link href="/dashboard/teacher" className="mt-4 inline-block text-giga-purple font-bold text-sm hover:underline">
            Open teacher tools →
          </Link>
        </Card>
        <Card>
          <CardTitle>Community & Rankings</CardTitle>
          <CardDescription className="mt-2">Optional school leaderboards and competitions</CardDescription>
          <Link href="/community" className="mt-4 inline-block text-giga-purple font-bold text-sm hover:underline">
            Manage community features →
          </Link>
        </Card>
      </div>
    </div>
  );
}
