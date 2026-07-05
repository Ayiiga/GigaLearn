"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/learn"), 2000);
  };

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md">
          <span className="text-5xl">🎉</span>
          <h2 className="font-display mt-4 text-2xl font-bold">Welcome to GigaLearn!</h2>
          <p className="mt-2 text-giga-muted">Your account is ready. Redirecting...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🌟</span>
          <h1 className="font-display mt-4 text-2xl font-bold">Join GigaLearn</h1>
          <p className="text-giga-muted mt-2">Create your free account</p>
        </div>

        <GoogleSignInButton redirectPath="/learn" className="mb-6" />

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-giga-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-giga-surface px-3 text-giga-muted">or register with email</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-1">Full Name</label>
            <input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-giga-border p-3 min-h-[48px] dark:bg-giga-surface"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-giga-border p-3 min-h-[48px] dark:bg-giga-surface"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-giga-border p-3 min-h-[48px] dark:bg-giga-surface"
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-bold mb-1">I am a...</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-giga-border p-3 min-h-[48px] dark:bg-giga-surface"
            >
              <option value="student">Student / Learner</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          {error && <p className="text-giga-red text-sm" role="alert">{error}</p>}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-giga-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-giga-purple font-bold hover:underline">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
