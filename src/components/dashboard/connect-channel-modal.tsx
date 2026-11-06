"use client";

import * as React from "react";
import { Youtube, AlertCircle, CheckCircle2, Sparkles, Loader2, ArrowRight, Lock, ExternalLink, Globe } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

interface ConnectChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectChannelModal({ isOpen, onClose }: ConnectChannelModalProps) {
  const { connectChannel } = useAuth();
  const [activeMethod, setActiveMethod] = React.useState<"oauth" | "link">("oauth");
  const [channelLink, setChannelLink] = React.useState("https://www.youtube.com/@ashishfn");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successData, setSuccessData] = React.useState<any>(null);

  const handleOAuthConnect = () => {
    // Redirect to official Google OAuth 2.0 flow
    window.location.href = "/api/auth/youtube";
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const link = channelLink.trim();
    if (!link) {
      setError("Please paste your YouTube channel link or @handle.");
      return;
    }

    setIsSubmitting(true);

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

      // 2. Connect channel to auth provider
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
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to link channel. Please check the link and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect YouTube Channel"
      description="Connect using Google OAuth 2.0 for private analytics, or paste your public channel link."
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
              @{successData.custom_url} • {successData.subscriber_count} Subscribers
            </p>
          </div>

          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Channel Connected to Dashboard
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
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
              onClick={() => setActiveMethod("oauth")}
              className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeMethod === "oauth"
                  ? "bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Lock className="h-3.5 w-3.5 text-brand-500" />
              <span>Google OAuth 2.0 (Full)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMethod("link")}
              className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeMethod === "link"
                  ? "bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>Public Link (Quick)</span>
            </button>
          </div>

          {activeMethod === "oauth" ? (
            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 dark:bg-brand-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Lock className="h-4 w-4 text-brand-500" />
                  <span>Official YouTube Data & Analytics API Authorization</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Connect your channel with Google OAuth to enable:
                </p>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>7-day, 28-day & 90-day private YouTube Analytics</li>
                  <li>Watch time minutes & average view duration</li>
                  <li>Automatic incremental video upload synchronization</li>
                  <li>Zero token exposure on frontend (secure server storage)</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleOAuthConnect}
                  className="w-full gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold py-2.5"
                >
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
                </Button>

                <p className="text-[11px] text-center text-slate-400">
                  Requests read-only access (<code>youtube.readonly</code> & <code>yt-analytics.readonly</code>).
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Input
                  label="YouTube Channel Link or @Handle"
                  placeholder="https://www.youtube.com/@ashishfn or @ashishfn"
                  value={channelLink}
                  onChange={(e) => setChannelLink(e.target.value)}
                  helperText="Paste your public channel URL or @handle."
                  required
                />

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">Quick fill:</span>
                  <button
                    type="button"
                    onClick={() => setChannelLink("https://www.youtube.com/@ashishfn")}
                    className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-navy-800 px-2 py-0.5 text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors"
                  >
                    <span>@ashishfn</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} className="gap-2">
                  <span>Connect Channel Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}
