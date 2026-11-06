"use client";

import * as React from "react";
import {
  Shield,
  Bell,
  Palette,
  DollarSign,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { user, settings, updateSettings, resetPassword, isConfigured } = useAuth();
  const { theme, setTheme } = useTheme();

  const [emailNotifs, setEmailNotifs] = React.useState(settings?.email_notifications ?? true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(settings?.weekly_digest ?? true);
  const [marketing, setMarketing] = React.useState(settings?.marketing_updates ?? false);
  const [aiLimit, setAiLimit] = React.useState(settings?.ai_budget_limit ? String(settings.ai_budget_limit) : "25");

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (settings) {
      setEmailNotifs(settings.email_notifications);
      setWeeklyDigest(settings.weekly_digest);
      setMarketing(settings.marketing_updates);
      setAiLimit(String(settings.ai_budget_limit));
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    const res = await updateSettings({
      email_notifications: emailNotifs,
      weekly_digest: weeklyDigest,
      marketing_updates: marketing,
      ai_budget_limit: parseFloat(aiLimit) || 25,
      theme: (theme as "light" | "dark" | "system") || "system",
    });

    setIsSaving(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    const res = await resetPassword(user.email);
    setResetLoading(false);
    if (!res.error) {
      setResetSent(true);
      setTimeout(() => setResetSent(false), 4000);
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Account Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage system preferences, authentication security, notifications, and AI limits.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Account preferences saved successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Database Connection Status Card */}
      <Card className="border-slate-200/80 dark:border-navy-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="h-5 w-5 text-brand-500" />
              <div>
                <CardTitle className="text-base font-bold">
                  Database & Backend Infrastructure
                </CardTitle>
                <CardDescription>
                  Supabase PostgreSQL status & Row Level Security (RLS)
                </CardDescription>
              </div>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isConfigured
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-sky-500/10 text-sky-500 border border-sky-500/20"
              }`}
            >
              {isConfigured ? "Connected" : "Local Demo Mode"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <p>
            {isConfigured ? (
              <>
                Your application is actively communicating with your cloud Supabase database. All 15 schema tables are protected by Row Level Security policies.
              </>
            ) : (
              <>
                The app is operating in local Creator Mode. To connect your cloud Supabase instance, update <code className="rounded bg-slate-100 dark:bg-navy-800 px-1 py-0.5 text-slate-800 dark:text-slate-200">.env.local</code> with your project URL and Anon Key from your Supabase dashboard, then execute <code className="rounded bg-slate-100 dark:bg-navy-800 px-1 py-0.5 text-slate-800 dark:text-slate-200">supabase/migrations/20261106000000_init_schema.sql</code>.
              </>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Preferences Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Appearance Card */}
        <Card className="border-slate-200/80 dark:border-navy-800">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Palette className="h-5 w-5 text-brand-500" />
              <div>
                <CardTitle className="text-base font-bold">Appearance</CardTitle>
                <CardDescription>
                  Select your preferred dashboard theme
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "light", label: "Light Mode", desc: "Clean crisp white" },
                { id: "dark", label: "Dark Mode", desc: "Premium navy blue" },
                { id: "system", label: "System Sync", desc: "Matches OS setting" },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    theme === opt.id
                      ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold ring-1 ring-brand-500"
                      : "border-slate-200 dark:border-navy-800 hover:border-slate-300 dark:hover:border-navy-700"
                  }`}
                >
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="border-slate-200/80 dark:border-navy-800">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Bell className="h-5 w-5 text-brand-500" />
              <div>
                <CardTitle className="text-base font-bold">Notifications</CardTitle>
                <CardDescription>
                  Configure email digests and automated audit alerts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Critical Channel & Audit Alerts
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Receive email warnings if video CTR drops below niche benchmark or copyright notices appear.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Weekly Growth Sprint Digest
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  A high-level summary of your week-over-week velocity and competitor moves.
                </p>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* AI Budget Card */}
        <Card className="border-slate-200/80 dark:border-navy-800">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <DollarSign className="h-5 w-5 text-brand-500" />
              <div>
                <CardTitle className="text-base font-bold">AI Usage & Quota Guard</CardTitle>
                <CardDescription>
                  Set safety spending thresholds for AI script drafting and idea engines
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-w-sm">
            <Input
              label="Monthly AI Budget Limit (USD)"
              type="number"
              min="5"
              max="500"
              value={aiLimit}
              onChange={(e) => setAiLimit(e.target.value)}
              helperText="Default $25.00/month covers approximately 200 full scripts and 1,000 video ideas."
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving}>
            Save All Preferences
          </Button>
        </div>
      </form>

      {/* Security & Password Reset Card */}
      <Card className="border-slate-200/80 dark:border-navy-800">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <KeyRound className="h-5 w-5 text-brand-500" />
            <div>
              <CardTitle className="text-base font-bold">Security & Password</CardTitle>
              <CardDescription>
                Secure password management via encrypted Supabase email verification
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Send a password reset authorization email to{" "}
            <strong>{user?.email || "your email"}</strong>.
          </p>

          {resetSent && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Password reset link sent! Check your inbox.</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handlePasswordReset}
            isLoading={resetLoading}
          >
            Send Password Reset Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
