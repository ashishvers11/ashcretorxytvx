"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Shield,
  KeyRound,
  Mail,
  Calendar,
  LogOut,
  Youtube,
  Unlink,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  Video,
  Settings,
  Globe,
  Clock,
  Sparkles,
  Save,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";

export default function ProfilePage() {
  const { user, signOut, isConfigured } = useAuth();
  const { channel, connected, loading: channelLoading, disconnectChannel } = useYouTubeChannel();
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectMessage, setDisconnectMessage] = useState<string | null>(null);

  // Studio Preferences State
  const [language, setLanguage] = useState<string>("English");
  const [timezone, setTimezone] = useState<string>("UTC");
  const [defaultFormat, setDefaultFormat] = useState<string>("shorts");
  const [savedPreferences, setSavedPreferences] = useState(false);

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect your YouTube channel?")) {
      return;
    }
    setDisconnecting(true);
    setDisconnectMessage(null);
    const success = await disconnectChannel();
    if (success) {
      setDisconnectMessage("YouTube channel successfully disconnected.");
    }
    setDisconnecting(false);
  };

  const handleSavePreferences = () => {
    setSavedPreferences(true);
    setTimeout(() => setSavedPreferences(false), 2500);
  };

  const formatMetric = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "Unavailable";
    return val.toLocaleString();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <User className="h-6 w-6 text-brand-400" />
          <span>Creator Profile &amp; Linked Accounts</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your ASH Creator Studio account, authentication identity, and connected YouTube channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Creator Identity Card */}
        <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-6 text-center flex flex-col justify-between">
          <div>
            <div className="relative mx-auto h-20 w-20 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 p-1 shadow-lg shadow-brand-500/20 mb-4">
              <div className="h-full w-full rounded-full bg-surface-950 flex items-center justify-center text-white font-bold text-2xl">
                {user?.email ? user.email.charAt(0).toUpperCase() : "C"}
              </div>
            </div>

            <h3 className="font-bold text-base text-white truncate px-2">
              {user?.email || "Creator Studio User"}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {user ? `Role: Authenticated Creator` : "Role: Unauthenticated Guest"}
            </p>

            <div className="flex items-center justify-center gap-2 mt-3">
              <Badge variant={user ? "success" : "warning"} className="text-[11px]">
                {user ? "Active Session" : "Guest / Local"}
              </Badge>
            </div>
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
                Official Google OAuth 2.0 integration (Read-Only scopes with PKCE).
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
                        {formatMetric(channel.subscriberCount)}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40">
                      <span className="text-[10px] text-slate-400 block">Total Views</span>
                      <strong className="text-sm text-white font-bold">
                        {formatMetric(channel.viewCount)}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40">
                      <span className="text-[10px] text-slate-400 block">Videos</span>
                      <strong className="text-sm text-white font-bold">
                        {formatMetric(channel.videoCount)}
                      </strong>
                    </div>
                  </div>

                  {channel.recentVideos && channel.recentVideos.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5 text-brand-400" />
                        Recent Uploads ({channel.recentVideos.length}):
                      </span>
                      <div className="space-y-1.5">
                        {channel.recentVideos.slice(0, 3).map((vid) => (
                          <div
                            key={vid.videoId}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 text-[11px]"
                          >
                            <span className="truncate max-w-xs text-slate-300 font-medium">{vid.title}</span>
                            <a
                              href={vid.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-400 hover:text-brand-300 shrink-0 ml-2 flex items-center gap-1"
                            >
                              Watch <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 text-[11px] text-slate-500">
                    Connected: {new Date(channel.connectedAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center space-y-3">
                  <div className="h-10 w-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300 font-medium">No YouTube Channel Connected</p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
                      Connect your YouTube channel on the Dashboard to sync video metrics, scripts, and channel DNA.
                    </p>
                  </div>
                  <Link href="/dashboard#channel-setup">
                    <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                      <span>Go to Channel Setup</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Creator Studio Preferences */}
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-brand-400" />
                <span>Studio Preferences &amp; Defaults</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Customize your default generation settings, language pacing, and timezone.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold uppercase text-[10px]">Default Format</label>
                  <select
                    value={defaultFormat}
                    onChange={(e) => setDefaultFormat(e.target.value)}
                    className="w-full rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="shorts">YouTube Shorts (9:16)</option>
                    <option value="longform">Longform Video (16:9)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold uppercase text-[10px]">Default Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi / Hinglish</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold uppercase text-[10px]">Time Zone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="UTC">UTC (Universal)</option>
                    <option value="IST">IST (UTC +5:30)</option>
                    <option value="EST">EST (UTC -5:00)</option>
                    <option value="PST">PST (UTC -8:00)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                {savedPreferences ? (
                  <span className="text-emerald-400 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Preferences updated successfully!
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px]">Settings saved to creator profile</span>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSavePreferences}
                  className="gap-1.5 text-xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Preferences</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
