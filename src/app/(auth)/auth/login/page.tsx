"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldAlert,
  CheckCircle2,
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [redirectDestination, setRedirectDestination] = useState<string>("/dashboard");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const router = useRouter();
  const configured = isSupabaseConfigured();

  const handleResendConfirmation = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address to resend confirmation.");
      return;
    }
    setResending(true);
    setResendSuccess(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: trimmedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setErrorMessage(error.message);
      } else {
        setResendSuccess(`Confirmation link re-sent to ${trimmedEmail}! Check your inbox or spam folder.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend confirmation.";
      setErrorMessage(msg);
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    const messageParam = params.get("message");
    const fromParam = params.get("redirectedFrom");

    if (fromParam && fromParam.startsWith("/")) {
      setRedirectDestination(fromParam);
    }

    if (errorParam === "unconfigured") {
      setErrorMessage(
        "Supabase is not configured yet. Protected dashboard routes require valid Supabase credentials in .env.local."
      );
    } else if (errorParam === "session_error") {
      setErrorMessage("Your session could not be verified. Please sign in again.");
    } else if (errorParam === "auth_callback_failed") {
      setErrorMessage("Authentication callback failed or expired. Please sign in again.");
    }

    if (messageParam === "password_updated") {
      setInfoMessage("Your password has been successfully updated. Please log in with your new password.");
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);

    if (!configured) {
      setErrorMessage(SUPABASE_UNCONFIGURED_MESSAGE);
      return;
    }

    setOauthLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        redirectDestination
      )}`;

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
      const msg = err instanceof Error ? err.message : "Failed to initiate Google sign in.";
      setErrorMessage(msg);
      setOauthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (!configured) {
      setErrorMessage(SUPABASE_UNCONFIGURED_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        router.push(redirectDestination);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected login error occurred.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-surface-900/95 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Sign in to your Studio</CardTitle>
        <CardDescription>
          Enter your creator credentials to access your mission control.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!configured && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 mb-5 flex items-start gap-2.5 text-xs text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Supabase Setup Required</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Supabase credentials are not configured. To enable live login, set{" "}
                <code className="text-amber-300">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-amber-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
                <code className="text-slate-300">.env.local</code>.
              </p>
            </div>
          </div>
        )}

        {infoMessage && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 mb-4 flex items-start gap-2 text-xs text-emerald-300"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {resendSuccess && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 mb-4 flex items-start gap-2 text-xs text-emerald-300"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{resendSuccess}</span>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 mb-4 text-xs text-rose-300 space-y-2.5"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>

            {errorMessage.toLowerCase().includes("email not confirmed") && (
              <div className="pt-2 border-t border-rose-500/20 space-y-2">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Supabase requires email confirmation before signing in. Check your inbox or spam folder for the confirmation link, or resend it below:
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleResendConfirmation}
                    disabled={resending || !email.trim()}
                    className="h-7 text-xs border-rose-500/40 text-rose-200 hover:bg-rose-500/20"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <span>Resend Confirmation Email</span>
                    )}
                  </Button>
                </div>
                <div className="mt-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                  <strong className="text-amber-400">Quick fix in Supabase:</strong> In your Supabase Dashboard &gt; <em>Authentication &gt; Providers &gt; Email</em>, turn OFF <em>&quot;Confirm email&quot;</em> to let users log in immediately without verification.
                </div>
              </div>
            )}
          </div>
        )}

        {/* 1-Click Google Sign In */}
        <div className="space-y-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleGoogleSignIn}
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
                <span>Continue with Google</span>
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
                Or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block"
              >
                Email Address
              </label>
              <Input
                id="login-email"
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
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-brand-400 hover:text-brand-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4 text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-brand-400 hover:text-brand-300 font-semibold ml-1 inline-flex items-center gap-1"
        >
          <span>Create account</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
