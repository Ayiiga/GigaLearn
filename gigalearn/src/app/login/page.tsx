"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/learn";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleDemo = () => {
    router.push("/learn");
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <span className="text-4xl">🎓</span>
        <h1 className="font-display mt-4 text-2xl font-bold">Welcome to GigaLearn</h1>
        <p className="text-giga-muted mt-2">Sign in to continue learning</p>
      </div>

      <GoogleSignInButton redirectPath={redirect} className="mb-6" />

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-giga-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-giga-surface px-3 text-giga-muted">or sign in with email</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-giga-border p-3 min-h-[48px] focus:ring-4 focus:ring-giga-purple/20 dark:bg-giga-surface"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-bold mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-giga-border p-3 min-h-[48px] focus:ring-4 focus:ring-giga-purple/20 dark:bg-giga-surface"
            required
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-giga-red text-sm font-medium" role="alert">{error}</p>}

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={handleDemo} className="w-full">
          Continue as Guest (Demo)
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-giga-muted">
        No account?{" "}
        <Link href="/register" className="text-giga-purple font-bold hover:underline">
          Create one free
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
