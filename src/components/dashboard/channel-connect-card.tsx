"use client";

import React, { useState, useEffect } from "react";
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
  Clock,
  ThumbsUp,
  MessageSquare,
  BarChart3,
  Calendar,
  Link2,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";

export function ChannelConnectCard() {
  const { channel, connected, loading, disconnectChannel, refreshChannel, connectByUrl } = useYouTubeChannel();
  const [connecting, setConnecting] = useState(false);
  const [connectingLink, setConnectingLink] = useState(false);
  const [channelInput, setChannelInput] = useState("");
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
      } else if (error === "auth_required") {
        setErrorMessage("Please sign in to ASH Creator Studio first before connecting your YouTube channel.");
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
    // Initiates server-side protected Google OAuth flow with PKCE
    window.location.href = "/api/auth/youtube";
  };

  const handleConnectLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = channelInput.trim();
    if (!trimmed) {
      setErrorMessage("Please enter a YouTube channel link or @handle (e.g. @MrBeast, https://youtube.com/@handle).");
      return;
    }
    setConnectingLink(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    const result = await connectByUrl(trimmed);
    if (result.success) {
      setSuccessMessage("YouTube channel connected successfully!");
      setChannelInput("");
      refreshChannel();
    } else {
      setErrorMessage(result.error || "Failed to connect YouTube channel. Please check the URL.");
    }
    setConnectingLink(false);
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
    const formatMetric = (val: number | null | undefined) => {
      if (val === null || val === undefined) return "Unavailable";
      return val.toLocaleString();
    };

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
                  <CardTitle className="text-lg">Connected YouTube Channel</CardTitle>
                  <Badge variant="success" className="text-[10px]">
                    Active & Synced
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400 mt-0.5">
                  Official Google OAuth 2.0 Integration (Read-Only scopes).
                </CardDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs gap-1.5 self-start sm:self-auto"
            >
              {disconnecting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Unlink className="h-3.5 w-3.5" />
              )}
              <span>Disconnect Channel</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {successMessage && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Primary Channel Identity Banner */}
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
                  <p className="text-xs text-brand-400 font-mono">
                    {channel.customUrl.split("?")[0].split("#")[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshChannel()}
                disabled={loading}
                className="h-8 text-xs gap-1.5 border-brand-500/40 bg-brand-500/10 text-brand-300 hover:bg-brand-500/20"
                title="Re-fetch latest subscribers, views and videos directly from YouTube"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Syncing..." : "🔄 Re-Sync Live YouTube Data"}</span>
              </Button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>AES-256 Encrypted</span>
              </div>
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
                {formatMetric(channel.subscriberCount)}
              </div>
              <span className="text-[10px] text-slate-500">Public channel metric</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Views</span>
                <Eye className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {formatMetric(channel.viewCount)}
              </div>
              <span className="text-[10px] text-slate-500">Public lifetime metric</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Uploaded Videos</span>
                <Video className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-white">
                {formatMetric(channel.videoCount)}
              </div>
              <span className="text-[10px] text-slate-500">Public lifetime metric</span>
            </div>
          </div>

          {/* Recent Uploaded Videos Section */}
          {channel.recentVideos && channel.recentVideos.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Video className="h-4 w-4 text-brand-400" />
                  <span>Recent Uploaded Videos ({channel.recentVideos.length})</span>
                </h4>
                <span className="text-[11px] text-slate-500">Verified from YouTube Data API v3</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {channel.recentVideos.map((video) => (
                  <a
                    key={video.videoId}
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-slate-800 bg-slate-950/60 p-3 hover:border-brand-500/40 hover:bg-slate-900/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {video.thumbnailUrl && (
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-2 bg-slate-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <h5 className="text-xs font-medium text-slate-200 line-clamp-2 group-hover:text-brand-300 transition-colors">
                        {video.title}
                      </h5>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-brand-400">
                        Watch <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* YouTube Analytics Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                <span>Authorized Channel Analytics (Last 30 Days)</span>
              </h4>
              <Badge variant={channel.analytics?.isAvailable ? "success" : "secondary"} className="text-[10px]">
                {channel.analytics?.isAvailable ? "Live Report" : "Report Unavailable"}
              </Badge>
            </div>

            {channel.analytics?.isAvailable ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
                  <span className="text-[10px] text-slate-400 block mb-1">30d Views</span>
                  <strong className="text-sm text-white font-bold">
                    {typeof channel.analytics.views === "number"
                      ? channel.analytics.views.toLocaleString()
                      : channel.analytics.views || "Unavailable"}
                  </strong>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
                  <span className="text-[10px] text-slate-400 block mb-1">Watch Time (Mins)</span>
                  <strong className="text-sm text-white font-bold">
                    {typeof channel.analytics.estimatedMinutesWatched === "number"
                      ? Math.round(channel.analytics.estimatedMinutesWatched).toLocaleString()
                      : channel.analytics.estimatedMinutesWatched || "Unavailable"}
                  </strong>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
                  <span className="text-[10px] text-slate-400 block mb-1">Avg Duration</span>
                  <strong className="text-sm text-white font-bold">
                    {typeof channel.analytics.averageViewDuration === "number"
                      ? `${Math.round(channel.analytics.averageViewDuration)}s`
                      : channel.analytics.averageViewDuration || "Unavailable"}
                  </strong>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
                  <span className="text-[10px] text-slate-400 block mb-1">Subscribers Gained</span>
                  <strong className="text-sm text-white font-bold">
                    {typeof channel.analytics.subscribersGained === "number"
                      ? `+${channel.analytics.subscribersGained.toLocaleString()}`
                      : channel.analytics.subscribersGained || "Unavailable"}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 text-xs text-slate-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-slate-500 shrink-0" />
                <span>
                  {channel.analytics?.reason ||
                    "YouTube Analytics API is not enabled in your Google Cloud Console project or channel is too new."}
                </span>
              </div>
            )}
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
                Connect your YouTube channel using official Google OAuth 2.0 with PKCE.
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

        {/* Option 1: Instant Channel Link Connection (No Google Cloud setup required) */}
        <div className="rounded-xl border border-brand-500/30 bg-gradient-to-br from-slate-950 via-surface-900 to-slate-900 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                <Link2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Connect with YouTube Channel Link or @Handle</span>
                  <Badge variant="success" className="text-[9px] uppercase tracking-wider py-0 px-1.5">
                    Instant
                  </Badge>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Connect instantly using your public channel handle. Zero Google Cloud setup required.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleConnectLink} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="e.g. @MrBeast, https://youtube.com/@mkbhd, or channel link"
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  disabled={connectingLink}
                  className="bg-slate-950/80 border-slate-700 focus:border-brand-500 text-sm h-11 pl-3.5 pr-20 text-slate-100 placeholder:text-slate-500"
                />
              </div>
              <Button
                type="submit"
                disabled={connectingLink || !channelInput.trim()}
                className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold gap-2 shadow-lg shadow-red-600/20 shrink-0"
              >
                {connectingLink ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting Channel...</span>
                  </>
                ) : (
                  <>
                    <Youtube className="h-4 w-4" />
                    <span>Connect Channel</span>
                  </>
                )}
              </Button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <span className="text-[11px] text-slate-500">Quick Test:</span>
              {["@MrBeast", "@mkbhd", "@veritasium"].map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => setChannelInput(handle)}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-[11px] text-brand-300 font-mono transition-colors border border-slate-700/60"
                >
                  {handle}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-surface-900 px-3 text-slate-500 font-medium tracking-wider">
              Or connect via official Google OAuth 2.0
            </span>
          </div>
        </div>

        {/* Option 2: Google OAuth 2.0 Flow */}
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-300 font-medium text-xs">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Google Cloud OAuth 2.0 Flow (Private Analytics)</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-md">
              Enables authorized private YouTube Studio audience analytics. Requires Google OAuth Client ID and Secret in .env.local.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleStartOAuth}
            disabled={connecting}
            className="text-xs gap-2 border-slate-700 hover:bg-slate-800 text-slate-200 shrink-0"
          >
            {connecting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <Youtube className="h-3.5 w-3.5 text-red-500" />
                <span>Connect via Google OAuth</span>
              </>
            )}
          </Button>
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
