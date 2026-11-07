"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Youtube,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Unlink,
  ExternalLink,
  ShieldCheck,
  Eye,
  Video,
  Users,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";

export function ChannelConnectCard() {
  const { channel, connected, loading, disconnectChannel, refreshChannel } = useYouTubeChannel();
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const status = searchParams.get("status");

    if (error) {
      if (error === "google_oauth_unconfigured") {
        setErrorMessage(
          "Google OAuth credentials are not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local to enable live connection."
        );
      } else if (error === "oauth_cancelled") {
        setErrorMessage("YouTube channel connection was cancelled. You can try again whenever you're ready.");
      } else if (error === "invalid_csrf_state") {
        setErrorMessage("Security verification failed (invalid CSRF state). Please initiate the connection again.");
      } else {
        setErrorMessage(decodeURIComponent(error));
      }
    }

    if (status === "youtube_connected") {
      setSuccessMessage("YouTube channel successfully connected and verified!");
      refreshChannel();
    }
  }, [searchParams, refreshChannel]);

  const handleStartOAuth = () => {
    setErrorMessage(null);
    setConnecting(true);
    // Initiates server-side protected Google OAuth flow
    window.location.href = "/api/auth/youtube";
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect your YouTube channel?")) {
      return;
    }
    setDisconnecting(true);
    setErrorMessage(null);
    const success = await disconnectChannel();
    if (success) {
      setSuccessMessage("YouTube channel disconnected.");
      router.refresh();
    } else {
      setErrorMessage("Failed to disconnect YouTube channel. Please try again.");
    }
    setDisconnecting(false);
  };

  if (loading) {
    return (
      <Card id="channel-setup" className="border-slate-800 bg-surface-900/90 shadow-xl p-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-brand-400" />
        <p className="text-xs text-slate-400">Loading YouTube connection status...</p>
      </Card>
    );
  }

  // =========================================================================
  // STATE A: CONNECTED STATE
  // =========================================================================
  if (connected && channel) {
    return (
      <Card id="channel-setup" className="border-slate-800 bg-surface-900/90 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Youtube className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">YouTube Channel Connected</CardTitle>
                  <Badge variant="success" className="text-[10px]">
                    Active &amp; Synced
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400 mt-0.5">
                  Official Google OAuth connection verified with read-only scopes.
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 gap-1.5 self-start sm:self-auto"
            >
              {disconnecting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Disconnecting...</span>
                </>
              ) : (
                <>
                  <Unlink className="h-3.5 w-3.5" />
                  <span>Disconnect Channel</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {successMessage && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-start gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Channel Identity Banner */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {channel.thumbnailUrl ? (
                <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-brand-500/40 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={channel.thumbnailUrl}
                    alt={channel.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                  <Youtube className="h-6 w-6 text-red-500" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{channel.title}</h3>
                  <a
                    href={`https://youtube.com/channel/${channel.channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                    title="View Channel on YouTube"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  ID: {channel.channelId}
                </p>
                {channel.customUrl && (
                  <p className="text-xs text-brand-400">
                    {channel.customUrl}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>AES-256 Encrypted Token</span>
            </div>
          </div>

          {/* Real Channel Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Subscribers</span>
                <Users className="h-4 w-4 text-brand-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {channel.subscriberCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Public channel metric</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Views</span>
                <Eye className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {channel.viewCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Public lifetime metric</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Uploaded Videos</span>
                <Video className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {channel.videoCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Public lifetime metric</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // =========================================================================
  // STATE B: DISCONNECTED / ERROR / CONNECTING STATE
  // =========================================================================
  return (
    <Card id="channel-setup" className="border-slate-800 bg-surface-900/90 shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-800/80 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
              <Youtube className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">YouTube Channel Connection</CardTitle>
                <Badge variant="warning" className="text-[10px]">
                  Not Connected
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Connect your YouTube channel using official Google OAuth 2.0.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 w-fit">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>Connection Required</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Error Notification Banner if present */}
        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-300"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartOAuth}
              className="text-rose-300 border-rose-500/30 hover:bg-rose-500/20 shrink-0 self-end sm:self-auto"
            >
              Retry Connection
            </Button>
          </div>
        )}

        {/* Unconnected Channel Action Card */}
        <div className="rounded-xl border border-dashed border-slate-700/80 bg-slate-950/40 p-5 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-200 font-medium text-sm">
              <Lock className="h-4 w-4 text-slate-400" />
              <span>No Channel Currently Linked</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Connect your YouTube channel to allow ASH Creator Studio to calculate accurate view velocities,
              tailor video hooks to your audience, and suggest topics in your exact genre.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={handleStartOAuth}
              disabled={connecting}
              className="gap-2 bg-red-600 hover:bg-red-700 shadow-red-600/20 text-white font-medium"
            >
              {connecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting Google...</span>
                </>
              ) : (
                <>
                  <Youtube className="h-4 w-4" />
                  <span>Connect YouTube Channel</span>
                </>
              )}
            </Button>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              Official Google OAuth 2.0 (Read-Only)
            </span>
          </div>
        </div>

        {/* Explicit Permissions Transparency Section */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-400" />
            <span>Strict Read-Only Permission Scope</span>
          </h4>
          <ul className="text-xs text-slate-400 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span><strong>youtube.readonly:</strong> To inspect channel statistics, subscriber benchmarks, and public videos.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span><strong>yt-analytics.readonly:</strong> To retrieve authorized audience view velocity.</span>
            </li>
            <li className="flex items-center gap-2 text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              <span>Zero upload, delete, edit, or comment permissions requested.</span>
            </li>
          </ul>
        </div>

        {/* Value Proposition Grid: Why Connect a Channel? */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Why Connect Your YouTube Channel?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1.5">
              <div className="h-8 w-8 rounded-md bg-brand-500/10 text-brand-400 flex items-center justify-center mb-2">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <h5 className="text-xs font-semibold text-slate-200">1. Personalized Channel DNA</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Prevents generic scripts. AI adopts your specific pacing, vocabulary, storytelling structure, and target audience language.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1.5">
              <div className="h-8 w-8 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h5 className="text-xs font-semibold text-slate-200">2. Niche Trend Relevance</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                A science channel gets science trends; a gaming channel gets gaming trends. You will never be spammed with irrelevant niches.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1.5">
              <div className="h-8 w-8 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                <Sparkles className="h-4 w-4" />
              </div>
              <h5 className="text-xs font-semibold text-slate-200">3. Verified Benchmarks</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Accurate baseline metrics for your 48-hour velocity, average view duration, and subscriber conversions without manual input.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
