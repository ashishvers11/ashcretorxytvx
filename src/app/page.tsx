"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Youtube,
  BarChart3,
  Search,
  CheckCircle2,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function RootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-between overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full max-w-7xl bg-gradient-to-b from-brand-500/10 via-brand-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation */}
      <header className="relative z-10 flex h-20 items-center justify-between px-6 lg:px-12 border-b border-slate-200/60 dark:border-navy-800/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-navy-900 text-white font-bold shadow-md shadow-brand-500/20">
            <Sparkles className="h-5 w-5 text-brand-300" />
          </div>
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg">
            ASH <span className="text-brand-500">STUDIO</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="text-xs font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Beta Access • Built for High-Growth Creators</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          The AI-Powered Operating System for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-sky-400 to-blue-600">
            YouTube Creators
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ASH Creator Studio gives you algorithmic clarity. Connect your channel, run 50-point packaging audits, generate viral title formulas, and scale audience retention.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 shadow-lg shadow-brand-500/25 text-sm sm:text-base font-semibold">
              <span>Launch Creator Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="lg" className="text-sm sm:text-base font-semibold">
              Creator Sign In
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="rounded-2xl border border-slate-200/80 dark:border-navy-800 bg-white/70 dark:bg-navy-900/60 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 mb-4">
              <Youtube className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Authentic Metrics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              No simulated numbers. Live read-only sync directly with YouTube Data API v3 and Supabase PostgreSQL.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-navy-800 bg-white/70 dark:bg-navy-900/60 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 mb-4">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Creator AI Assistant
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Trained on high-CTR packaging models to brainstorm breakout video ideas, viral hooks, and SEO packages.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-navy-800 bg-white/70 dark:bg-navy-900/60 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Bank-Grade Security
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Row Level Security (RLS) on all 15 database tables guarantees your ideas and video drafts remain 100% private.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 dark:border-navy-800/60 py-6 px-6 text-center text-xs text-slate-400">
        <p>© 2026 ASH Creator Studio. Built for beta creators and multi-channel scale.</p>
      </footer>
    </div>
  );
}
