"use client";

import React from "react";
import { Sparkles, Youtube, Compass, ArrowRight, ShieldCheck, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";

interface WelcomeSectionProps {
  onConnectClick: () => void;
  onExploreClick: () => void;
}

export function WelcomeSection({ onConnectClick, onExploreClick }: WelcomeSectionProps) {
  const { channel, connected } = useYouTubeChannel();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-surface-900 via-surface-900/95 to-brand-950/30 p-6 sm:p-8 shadow-2xl">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="default" className="gap-1.5 py-1 px-3">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>ASH Creator Studio 2.0</span>
          </Badge>
          <Badge variant="outline" className="border-slate-700/80 text-brand-300 text-[11px]">
            8 Core Modules • Production Ready
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Welcome to your Creator Mission Control
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
          ASH Creator Studio is your centralized workspace to understand your YouTube audience,
          discover high-opportunity niche trends, write fact-verified voiceover scripts, and direct
          cinematic video production from one website.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={onConnectClick}
            className="gap-2 shadow-lg shadow-brand-500/20"
          >
            <Youtube className="h-4 w-4" />
            <span>Begin Creator Setup</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={onExploreClick}
            className="gap-2 border-slate-700/80 hover:border-slate-600 text-slate-200"
          >
            <Compass className="h-4 w-4 text-brand-400" />
            <span>Explore 8 Core Modules</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Button>
        </div>

        {/* System Health Indicators */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Layers className="h-4 w-4 text-brand-400" />
            <span>Core Modules: <strong className="text-slate-200 font-medium">8 Operational</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-brand-400" />
            <span>Auth System: <strong className="text-slate-200 font-medium">Supabase Ready</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 col-span-2 sm:col-span-1">
            <div className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400"}`} />
            <span>
              Channel Sync:{" "}
              {connected && channel ? (
                <strong className="text-emerald-400 font-medium truncate max-w-[120px] inline-block align-bottom">
                  {channel.title}
                </strong>
              ) : (
                <strong className="text-amber-400 font-medium">Awaiting Setup</strong>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
