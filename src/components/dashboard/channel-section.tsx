// ==============================================================================
// ASH CREATOR STUDIO 2.0 — CONNECTED CHANNEL & STYLE DNA SECTION
// Displays the active channel's isolated metrics and Style DNA profile
// ==============================================================================

"use client";

import * as React from "react";
import {
  Youtube,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Unlink,
  BarChart,
  Shield,
  Zap,
  Dna,
  Layers,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ChannelSectionProps {
  onConnectClick: () => void;
}

export function ChannelSection({ onConnectClick }: ChannelSectionProps) {
  const {
    channel,
    channels,
    activeChannelStyle,
    setActiveChannel,
    disconnectChannel,
  } = useAuth();
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);
  const [showSwitchMenu, setShowSwitchMenu] = React.useState(false);

  const handleDisconnect = async () => {
    if (
      confirm(
        `Are you sure you want to disconnect ${channel?.channel_title} from ASH Creator Studio?`
      )
    ) {
      setIsDisconnecting(true);
      await disconnectChannel(channel?.id);
      setIsDisconnecting(false);
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-navy-800">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
              Connected Channel
            </h3>
            {channel ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span>Isolated DNA Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">
                Not Connected
              </span>
            )}
          </div>
          <CardDescription className="text-xs sm:text-sm mt-1">
            {channel
              ? `Channel intelligence profile isolated for ${channel.channel_title}`
              : "Link your YouTube channel to activate metric tracking, style analysis & script generation"}
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {channel && channels.length > 1 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSwitchMenu(!showSwitchMenu)}
                className="text-xs gap-1.5 h-8 px-2.5"
              >
                <Layers className="h-3.5 w-3.5 text-brand-500" />
                <span>Switch ({channels.length})</span>
                <ChevronDown className="h-3 w-3" />
              </Button>

              {showSwitchMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 p-2 shadow-xl z-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                    Select Active Channel
                  </div>
                  {channels.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setActiveChannel(c.id);
                        setShowSwitchMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-semibold ${
                        channel.id === c.id
                          ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                          : "hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="truncate">{c.channel_title}</span>
                      {channel.id === c.id && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {channel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onConnectClick}
              className="text-xs gap-1.5 h-8 px-2.5"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Channel</span>
            </Button>
          )}

          {channel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              isLoading={isDisconnecting}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 h-8 px-2"
            >
              <Unlink className="h-3.5 w-3.5" />
              <span>Disconnect</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {channel ? (
          <div className="space-y-4">
            {/* Primary Channel Identity Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 dark:border-navy-800/80 bg-slate-50/70 dark:bg-navy-950/60 p-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl overflow-hidden shadow-md ring-2 ring-red-500/20">
                  {channel.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={channel.thumbnail_url}
                      alt={channel.channel_title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-red-600 text-white">
                      <Youtube className="h-7 w-7" />
                    </div>
                  )}
                </div>
                <div className="space-y-0.5 min-w-0 truncate">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {channel.channel_title}
                    </h4>
                    <span className="rounded bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-600 dark:text-brand-400 shrink-0">
                      Primary
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {channel.custom_url ? `@${channel.custom_url}` : "Custom handle not set"} • ID:{" "}
                    <code className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                      {channel.youtube_channel_id}
                    </code>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Connected on {formatDate(channel.connected_at)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:self-auto justify-start sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-navy-800/60">
                <Link href="/modules/script-writer" className="flex-1 sm:flex-initial">
                  <Button size="sm" className="w-full sm:w-auto gap-1.5 text-xs bg-brand-600 hover:bg-brand-700">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Create AI Script</span>
                  </Button>
                </Link>
                <a
                  href={`https://youtube.com/channel/${channel.youtube_channel_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors flex-1 sm:flex-initial"
                >
                  <span>View on YouTube</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* CHANNEL STYLE DNA PROFILE CARD */}
            {activeChannelStyle && (
              <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 dark:bg-brand-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Dna className="h-4 w-4 text-brand-500" />
                    <span>Channel Style DNA (Auto-Researched)</span>
                  </span>
                  <Link
                    href="/modules/style-lab"
                    className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Customize in Style Lab →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800">
                    <div className="text-[10px] text-slate-400 font-semibold">Visual Animation Style</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      {activeChannelStyle.visualStyleLabel}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800">
                    <div className="text-[10px] text-slate-400 font-semibold">Pacing & Speed</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {activeChannelStyle.dominantPacingWpm} WPM ({activeChannelStyle.videoDuration})
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800">
                    <div className="text-[10px] text-slate-400 font-semibold">Target Audience</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      {activeChannelStyle.audienceAgeGroup}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800">
                    <div className="text-[10px] text-slate-400 font-semibold">Voiceover & Language</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      {activeChannelStyle.primaryLanguage} ({activeChannelStyle.voiceoverStyle.split(" ")[0]})
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-navy-700/80 bg-slate-50/50 dark:bg-navy-950/40 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-4">
              <Youtube className="h-7 w-7" />
            </div>

            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              No YouTube Channel Connected
            </h4>
            <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Connect your YouTube channel to fetch your real video catalog, generate deep audit scores, and unlock personalized AI video recommendations.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-left">
              <div className="rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Shield className="h-3.5 w-3.5 text-brand-500" />
                  <span>Read-Only</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Zero upload permissions required. Safe and isolated.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <BarChart className="h-3.5 w-3.5 text-brand-500" />
                  <span>Real Metrics</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Zero fake data. Authentic YouTube Data API metrics.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Zap className="h-3.5 w-3.5 text-brand-500" />
                  <span>AI Workflows</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Automated title tests and video idea generation.
                </p>
              </div>
            </div>

            <Button onClick={onConnectClick} className="mt-6 gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Connect Channel Now</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
