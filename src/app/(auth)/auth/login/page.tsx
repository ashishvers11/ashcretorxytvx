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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [redirectDestination, setRedirectDestination] = useState<string>("/dashboard");

  const router = useRouter();
  const configured = isSupabaseConfigured();

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

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 mb-4 flex items-start gap-2 text-xs text-rose-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

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
              disabled={loading}
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
