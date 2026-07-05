"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-giga-muted">Platform management and analytics</p>
        </div>
        <Button variant="secondary">Export Report</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="text-center"><p className="text-3xl font-bold">1,248</p><CardDescription>Total Users</CardDescription></Card>
        <Card className="text-center"><p className="text-3xl font-bold">856</p><CardDescription>Active Students</CardDescription></Card>
        <Card className="text-center"><p className="text-3xl font-bold">42</p><CardDescription>Schools</CardDescription></Card>
        <Card className="text-center"><p className="text-3xl font-bold">128</p><CardDescription>Lessons Published</CardDescription></Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardTitle>👥 User Management</CardTitle>
          <CardDescription className="mt-2">Manage students, teachers, parents, and admins</CardDescription>
          <Button className="mt-4" size="sm">Manage Users</Button>
        </Card>
        <Card>
          <CardTitle>📚 Content Management</CardTitle>
          <CardDescription className="mt-2">Create and publish lessons, stories, and quizzes</CardDescription>
          <Button className="mt-4" size="sm">Lesson Builder</Button>
        </Card>
        <Card>
          <CardTitle>🖼️ Media Library</CardTitle>
          <CardDescription className="mt-2">Upload images, audio, and video assets</CardDescription>
          <Button className="mt-4" size="sm">Open Media</Button>
        </Card>
        <Card>
          <CardTitle>💳 Subscriptions</CardTitle>
          <CardDescription className="mt-2">Manage school and individual subscription plans</CardDescription>
          <Button className="mt-4" size="sm">View Plans</Button>
        </Card>
      </div>
    </div>
  );
}
