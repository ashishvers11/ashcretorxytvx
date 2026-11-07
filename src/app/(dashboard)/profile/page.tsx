"use client";

import React from "react";
import Link from "next/link";
import { User, Youtube, Shield, KeyRound, LogOut, Loader2, Calendar, Mail, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { user, loading, isConfigured, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        <p className="text-xs text-slate-400">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Creator Profile</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your authenticated identity, session security, and channel settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Identity Card */}
        <Card className="p-6 md:col-span-1 text-center flex flex-col justify-between border-slate-800 bg-surface-900/90 shadow-xl">
          <div>
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 text-2xl font-bold shadow-xl shadow-brand-500/20">
              <User className="h-10 w-10" />
            </div>

            <h3 className="text-base font-bold text-white break-all">
              {user?.email || "Creator Account"}
            </h3>

            <p className="text-xs text-slate-400 mt-1 mb-3">
              {user ? "Verified Supabase Identity" : "Unauthenticated Session"}
            </p>

            <Badge variant={user ? "success" : "warning"} className="text-[11px]">
              {user ? "Active Session" : "Guest / Local"}
            </Badge>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6">
            {user ? (
              <Button
                variant="danger"
                size="sm"
                onClick={signOut}
                className="w-full gap-2 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </Button>
            ) : (
              <Link href="/auth/login" className="w-full block">
                <Button variant="primary" size="sm" className="w-full gap-2 text-xs">
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Security & Account Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-400" />
                <span>Authentication Details</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Verified Supabase Auth credentials and session metadata.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/60 gap-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  Account Email:
                </span>
                <span className="font-mono text-slate-200 font-medium">
                  {user?.email || "Not signed in"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/60 gap-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                  User UUID:
                </span>
                <span className="font-mono text-slate-300 text-[11px] truncate max-w-xs">
                  {user?.id || "N/A"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/60 gap-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  Account Created:
                </span>
                <span className="text-slate-300">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-slate-500" />
                  Provider:
                </span>
                <span className="text-brand-400 font-medium">
                  {isConfigured ? "Supabase SSR Auth (Active)" : "Supabase Placeholder"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* YouTube Channel Status Card */}
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                  <span>Connected YouTube Channel</span>
                </CardTitle>
                <Badge variant="warning" className="text-[10px]">
                  Unconnected
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-400">
                Official Google OAuth channel connection is scheduled for Step 4.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 text-xs text-slate-300">
              <div className="flex items-start gap-2 rounded-lg bg-slate-950/40 border border-slate-800 p-3.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  No channel is linked. Step 4 will introduce Google OAuth 2.0 channel authorization with read-only metrics access.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
