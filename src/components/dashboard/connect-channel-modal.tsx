// ==============================================================================
// ASH CREATOR STUDIO 2.0 — CONNECT CHANNEL MODAL
// Clean YouTube Channel Authorization & Public Resolution
// Removed misleading app Google Login buttons — explicitly focused on YouTube OAuth
// ==============================================================================

"use client";

import * as React from "react";
import {
  Youtube,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Globe,
  Dna,
  Lock,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { PRESET_CHANNEL_PROFILES } from "@/lib/ai/channel-intelligence";

interface ConnectChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectChannelModal({ isOpen, onClose }: ConnectChannelModalProps) {
  const { connectChannel } = useAuth();
  const [activeMethod, setActiveMethod] = React.useState<"oauth" | "link">("link");
  const [channelLink, setChannelLink] = React.useState("https://www.youtube.com/@ashishfn");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [analysisStep, setAnalysisStep] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [successData, setSuccessData] = React.useState<any>(null);

  const handleOAuthConnect = () => {
    // Official YouTube OAuth 2.0 flow for analytics & channel management
    window.location.href = "/api/auth/youtube";
  };

  const handleConnectLink = async (targetLink?: string) => {
    setError(null);
    const link = (targetLink || channelLink).trim();

    if (!link) {
      setError("Please enter a valid YouTube channel link or @handle.");
      return;
    }

    setIsSubmitting(true);
    setAnalysisStep("1/3 Resolving YouTube channel metadata...");

    try {
      // 1. Resolve channel link via our API
      const res = await fetch("/api/youtube/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl: link }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Could not resolve YouTube channel from this link.");
      }

      const chan = data.channel;
      setAnalysisStep("2/3 Fetching recent uploads & public video metadata...");

      await new Promise((r) => setTimeout(r, 400));
      setAnalysisStep("3/3 Generating isolated Channel Style DNA Profile...");

      // 2. Connect channel in auth provider (automatically triggers isolated Style DNA generator)
      const connectRes = await connectChannel({
        youtube_channel_id: chan.youtube_channel_id,
        channel_title: chan.channel_title,
        custom_url: chan.custom_url,
        thumbnail_url: chan.thumbnail_url,
        subscriber_count: chan.subscriber_count,
        video_count: chan.video_count,
        view_count: chan.view_count,
        description: chan.description,
      });

      if (connectRes.error) {
        throw new Error(connectRes.error);
      }

      setSuccessData(chan);

      setTimeout(() => {
        setSuccessData(null);
        setAnalysisStep("");
        onClose();
      }, 1600);
    } catch (err: any) {
      setError(err?.message || "Failed to link channel. Please check the URL and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePresetSelect = (presetHandle: string) => {
    setChannelLink(`https://www.youtube.com/${presetHandle}`);
    handleConnectLink(`https://www.youtube.com/${presetHandle}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect YouTube Channel"
      description="Authorize via official YouTube Data API or link via public channel @handle."
    >
      {successData ? (
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
          <div className="relative">
            {successData.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={successData.thumbnail_url}
                alt={successData.channel_title}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-emerald-500/20"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] ring-2 ring-white dark:ring-navy-900">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {successData.channel_title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              @{successData.custom_url} • {successData.subscriber_count.toLocaleString()} Subscribers
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Dna className="h-3.5 w-3.5" />
            <span>Channel Style DNA Generated & Isolated</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Connection Method Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveMethod("link")}
              className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeMethod === "link"
                  ? "bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-brand-500" />
              <span>Public Channel @Handle</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMethod("oauth")}
              className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeMethod === "oauth"
                  ? "bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-red-500" />
              <span>YouTube OAuth 2.0 (API)</span>
            </button>
          </div>

          {activeMethod === "link" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Input
                  label="YouTube Channel URL or @Handle"
                  placeholder="https://www.youtube.com/@ashishfn or @ashishfn"
                  value={channelLink}
                  onChange={(e) => setChannelLink(e.target.value)}
                  helperText="Enter any YouTube channel. Our engine will research its video style & generate its isolated Style DNA."
                  disabled={isSubmitting}
                  required
                />

                {/* Quick Presets to test multi-channel separation */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Quick test channels (multi-style demonstration):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handlePresetSelect("@ashishfn")}
                      className="flex flex-col items-start p-2 rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-brand-500/50 hover:bg-brand-50/20 text-left transition-all group"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-500">
                        @ashishfn
                      </span>
                      <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">
                        🎯 2D Stickman & Doodle
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handlePresetSelect("@curiouspaper")}
                      className="flex flex-col items-start p-2 rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-amber-500/50 hover:bg-amber-50/20 text-left transition-all group"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500">
                        @curiouspaper
                      </span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        📜 Paper Cut-Out Craft
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handlePresetSelect("@zenfacts")}
                      className="flex flex-col items-start p-2 rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-teal-500/50 hover:bg-teal-50/20 text-left transition-all group"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-500">
                        @zenfacts
                      </span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                        🎧 Satisfying ASMR Macro
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {analysisStep && (
                <div className="flex items-center gap-2 rounded-lg bg-brand-500/10 border border-brand-500/20 p-2.5 text-xs text-brand-600 dark:text-brand-400 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>{analysisStep}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => handleConnectLink()}
                  isLoading={isSubmitting}
                  className="gap-2"
                >
                  <span>Connect & Research Style DNA</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            /* YouTube OAuth 2.0 Authorization View (No confusing App Google Login) */
            <div className="space-y-4 py-1">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Youtube className="h-4 w-4 text-red-500" />
                  <span>Official YouTube OAuth 2.0 Channel Authorization</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Grants read-only access to private YouTube Analytics & lifetime retention:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Real 28-day retention stats</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Watch-time & average duration</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Automatic video sync</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Secure token storage (no frontend leak)</span>
                  </div>
                </div>
              </div>

              {/* Explicit 7-Step YouTube Onboarding Guide */}
              <div className="rounded-lg bg-slate-50 dark:bg-navy-950 p-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  Authorization Workflow:
                </div>
                <ol className="list-decimal list-inside space-y-0.5 text-[10px]">
                  <li>Click Authorize YouTube Access below</li>
                  <li>Select your Google Account owning the channel</li>
                  <li>Choose the specific YouTube Brand Channel</li>
                  <li>Confirm read-only analytics permissions</li>
                  <li>Channel connects and launches Style DNA research</li>
                </ol>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Button
                  type="button"
                  onClick={handleOAuthConnect}
                  className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 shadow-sm"
                >
                  <Youtube className="h-4 w-4" />
                  <span>Authorize YouTube Channel via Google</span>
                </Button>

                <p className="text-[11px] text-center text-slate-400">
                  Read-only scopes requested: <code>youtube.readonly</code> & <code>yt-analytics.readonly</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
