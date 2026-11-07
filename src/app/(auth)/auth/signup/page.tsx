"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
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
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const router = useRouter();
  const configured = isSupabaseConfigured();

  const handleGoogleSignUp = async () => {
    setErrorMessage(null);

    if (!configured) {
      setErrorMessage(SUPABASE_UNCONFIGURED_MESSAGE);
      return;
    }

    setOauthLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/dashboard`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setOauthLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initiate Google sign up.";
      setErrorMessage(msg);
      setOauthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

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

        <div className="space-y-4">
          {/* 1-Click Google Sign Up */}
          <Button
            type="button"
            variant="secondary"
            onClick={handleGoogleSignUp}
            disabled={loading || oauthLoading}
            className="w-full gap-3 py-2.5 bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-100 font-medium shadow-sm transition-all"
          >
            {oauthLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                <span>Redirecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-surface-900 px-2 text-slate-400 font-semibold tracking-wider">
                Or register with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label
                htmlFor="signup-email"
                className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block"
              >
                Email Address
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="creator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading || oauthLoading}
              />
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
                disabled={loading || oauthLoading}
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
                disabled={loading || oauthLoading}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2 mt-2"
              disabled={loading || oauthLoading}
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
        </div>
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
