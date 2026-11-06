"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Youtube, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isConfigured } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setIsLoading(true);
    const res = await signIn(email, password);
    setIsLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-navy-950">
      {/* Top Bar with Brand & Theme Toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-navy-900 text-white font-bold shadow-md shadow-brand-500/20">
            <Sparkles className="h-4 w-4 text-brand-300" />
          </div>
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base">
            ASH <span className="text-brand-500">STUDIO</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-navy-800/20 blur-3xl pointer-events-none" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>YouTube Creator Growth OS</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign In to ASH Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your credentials to access your creator dashboard
          </p>
        </div>

        {!isConfigured && (
          <div className="mt-4 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-xs text-sky-700 dark:text-sky-300">
            <p className="font-semibold">Local Creator Demo Mode Active</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Enter any email & password to explore the Phase 1 dashboard immediately.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="creator@youtube.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full gap-2 mt-2">
            <span>Sign In to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-100 dark:border-navy-800 pt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have a creator account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
