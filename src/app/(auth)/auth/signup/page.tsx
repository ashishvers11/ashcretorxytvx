"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, SUPABASE_UNCONFIGURED_MESSAGE } from "@/lib/supabase/config";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const router = useRouter();
  const configured = isSupabaseConfigured();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (!configured) {
      setErrorMessage(SUPABASE_UNCONFIGURED_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // If user was created and session is active (email confirmation turned off in Supabase)
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // If Supabase requires email verification
      if (data.user) {
        setSubmittedEmail(trimmedEmail);
        setVerificationRequired(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected signup error occurred.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Email verification confirmation screen
  if (verificationRequired) {
    return (
      <Card className="border-slate-800 bg-surface-900/95 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription className="text-xs text-slate-300 mt-1">
            We have sent a verification link to{" "}
            <strong className="text-white">{submittedEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            Please check your inbox (and spam folder) and click the confirmation link to activate your
            ASH Creator Studio account.
          </p>
          <div className="pt-2">
            <Link href="/auth/login">
              <Button variant="secondary" size="md" className="w-full gap-2">
                Return to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-surface-900/95 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Create your Creator Account</CardTitle>
        <CardDescription>
          Sign up to connect your channel, research trends, and write cinematic scripts.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!configured && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 mb-5 flex items-start gap-2.5 text-xs text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Supabase Setup Required</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Supabase credentials are not configured. To create real accounts, provide your{" "}
                <code className="text-amber-300">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-amber-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
                <code className="text-slate-300">.env.local</code>.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 mb-4 flex items-start gap-2 text-xs text-rose-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="signup-email"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block"
            >
              Email Address
            </label>
            <div className="relative">
              <Input
                id="signup-email"
                type="email"
                placeholder="creator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block"
            >
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block"
            >
              Confirm Password
            </label>
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full gap-2 mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Create Creator Account</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4 text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-brand-400 hover:text-brand-300 font-semibold ml-1 inline-flex items-center gap-1"
        >
          <span>Sign In</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
