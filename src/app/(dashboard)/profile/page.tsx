"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Youtube,
  Shield,
  KeyRound,
  LogOut,
  Loader2,
  Calendar,
  Mail,
  AlertTriangle,
  ExternalLink,
  Unlink,
  CheckCircle2,
  Users,
  Eye,
  Video,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";

export default function ProfilePage() {
  const { user, loading: authLoading, isConfigured, signOut } = useAuth();
  const { channel, connected, loading: channelLoading, disconnectChannel } = useYouTubeChannel();
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectMessage, setDisconnectMessage] = useState<string | null>(null);

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect your YouTube channel?")) {
      return;
    }
    setDisconnecting(true);
    const success = await disconnectChannel();
    if (success) {
      setDisconnectMessage("YouTube channel successfully disconnected.");
    }
    setDisconnecting(false);
  };

  if (authLoading) {
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
          Manage your authenticated identity, session security, and connected channel settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Identity Card (Supabase Account) */}
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

        {/* Security & Account Details + YouTube Channel */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Supabase Auth Identity Details */}
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-400" />
                <span>Supabase Account Details</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Creator Studio primary authentication identity and session credentials.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/60 gap-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  Primary Email:
                </span>
                <span className="font-mono text-slate-200 font-medium">
                  {user?.email || "Not signed in"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-800/60 gap-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                  Creator UUID:
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
                  Auth Provider:
                </span>
                <span className="text-brand-400 font-medium">
                  {isConfigured ? "Supabase SSR Auth (Active)" : "Supabase Placeholder"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Connected YouTube Channel Information (Google OAuth) */}
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                  <span>Connected YouTube Channel</span>
                </CardTitle>
                <Badge variant={connected ? "success" : "warning"} className="text-[10px]">
                  {connected ? "Active & Synced" : "Not Connected"}
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-400">
                Official Google OAuth 2.0 integration (Read-Only scopes).
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 text-xs text-slate-300">
              {disconnectMessage && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 mb-4 flex items-center gap-2 text-emerald-300 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{disconnectMessage}</span>
                </div>
              )}

              {channelLoading ? (
                <div className="py-4 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-brand-400 mb-1" />
                  <p className="text-slate-400 text-xs">Checking YouTube connection...</p>
                </div>
              ) : connected && channel ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                    <div className="flex items-center gap-3">
                      {channel.thumbnailUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={channel.thumbnailUrl}
                          alt={channel.title}
                          className="h-12 w-12 rounded-full object-cover border border-brand-500/40"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-red-500">
                          <Youtube className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-sm">{channel.title}</h4>
                          <a
                            href={`https://youtube.com/channel/${channel.channelId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          ID: {channel.channelId}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                      className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs gap-1.5"
                    >
                      {disconnecting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Unlink className="h-3.5 w-3.5" />
                      )}
                      <span>Disconnect</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40">
                      <span className="text-[10px] text-slate-400 block">Subscribers</span>
                      <strong className="text-sm text-white font-bold">
                        {channel.subscriberCount.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40">
                      <span className="text-[10px] text-slate-400 block">Total Views</span>
                      <strong className="text-sm text-white font-bold">
                        {channel.viewCount.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40">
                      <span className="text-[10px] text-slate-400 block">Total Videos</span>
                      <strong className="text-sm text-white font-bold">
                        {channel.videoCount.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 rounded-lg bg-slate-950/40 border border-slate-800 p-3.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      No YouTube channel is currently linked to your creator profile. Connecting your channel establishes your content DNA and enables tailored trend analysis.
                    </p>
                  </div>
                  <Link href="/dashboard#channel-setup">
                    <Button variant="primary" size="sm" className="gap-2">
                      <Youtube className="h-4 w-4" />
                      <span>Connect YouTube Channel</span>
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
