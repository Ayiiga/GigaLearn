"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MOCK_STUDENTS = [
  { name: "Amara O.", progress: 78, level: "GigaPhonics", streak: 5 },
  { name: "Kofi M.", progress: 62, level: "Alphabet", streak: 3 },
  { name: "Zara K.", progress: 91, level: "Reading", streak: 12 },
  { name: "James L.", progress: 45, level: "Vocabulary", streak: 1 },
];

const MOCK_CLASSES = [
  { name: "Kindergarten A", students: 24, code: "KG2024A" },
  { name: "Primary 1B", students: 18, code: "P1B2024" },
];

export default function TeacherDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Teacher Dashboard</h1>
          <p className="mt-2 text-giga-muted">Manage classes, assignments, and track student progress</p>
        </div>
        <Button>Create Assignment</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-10">
        <Card className="text-center"><p className="text-3xl font-bold text-giga-purple">42</p><CardDescription>Total Students</CardDescription></Card>
        <Card className="text-center"><p className="text-3xl font-bold text-giga-green">89%</p><CardDescription>Avg. Completion</CardDescription></Card>
        <Card className="text-center"><p className="text-3xl font-bold text-giga-orange">12</p><CardDescription>Active Assignments</CardDescription></Card>
        <Card className="text-center"><p className="text-3xl font-bold text-giga-blue">96%</p><CardDescription>Attendance Today</CardDescription></Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-bold mb-4">My Classes</h2>
          <div className="space-y-4">
            {MOCK_CLASSES.map((c) => (
              <Card key={c.code} hover>
                <CardTitle>{c.name}</CardTitle>
                <CardDescription>{c.students} students • Join code: <strong>{c.code}</strong></CardDescription>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-4">Student Progress</h2>
          <div className="space-y-3">
            {MOCK_STUDENTS.map((s) => (
              <Card key={s.name}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{s.name}</CardTitle>
                    <CardDescription>{s.level} • 🔥 {s.streak} days</CardDescription>
                  </div>
                  <span className="font-bold text-giga-purple">{s.progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-giga-border overflow-hidden">
                  <div className="h-full bg-giga-purple rounded-full" style={{ width: `${s.progress}%` }} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
