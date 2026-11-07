"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, AlertCircle, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!configured) {
      setErrorMessage(SUPABASE_UNCONFIGURED_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/auth/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessEmail(trimmedEmail);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  if (successEmail) {
    return (
      <Card className="border-slate-800 bg-surface-900/95 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Reset link sent</CardTitle>
          <CardDescription className="text-xs text-slate-300 mt-1">
            We sent a password recovery email to{" "}
            <strong className="text-white">{successEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            Please check your inbox and click the reset link to choose a new password. The link will
            expire shortly for security.
          </p>
          <div className="pt-2">
            <Link href="/auth/login">
              <Button variant="secondary" size="md" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Sign In</span>
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
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription>
          Enter the email associated with your creator account and we&apos;ll send a recovery link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!configured && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 mb-5 flex items-start gap-2.5 text-xs text-amber-300">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Supabase Setup Required</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Supabase credentials are not configured. To enable live password recovery, configure{" "}
                <code className="text-amber-300">NEXT_PUBLIC_SUPABASE_URL</code> in{" "}
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

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block"
            >
              Email Address
            </label>
            <Input
              id="reset-email"
              type="email"
              placeholder="creator@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
                <span>Sending Recovery Link...</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Send Recovery Email</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4 text-xs text-slate-400">
        <Link
          href="/auth/login"
          className="text-slate-400 hover:text-white font-medium inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
