"use client";

import * as React from "react";
import { Sparkles, ArrowUpRight, Flame, Layers } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function WelcomeBanner({ onConnectClick }: { onConnectClick: () => void }) {
  const { profile, channel } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "Creator";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-navy-800 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-950 p-6 sm:p-8 text-white shadow-lg shadow-navy-950/20">
      {/* Decorative Background Glows */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-20 h-48 w-48 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ASH Creator Studio v1.0 • Beta</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="text-brand-400">{firstName}</span> 👋
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {channel ? (
              <>
                Managing <strong className="text-white">{channel.channel_title}</strong>. Your growth engine is active. Monitor audience velocity and optimize packaging.
              </>
            ) : (
              <>
                Your channel workspace is ready. Connect your YouTube channel to begin tracking real-time retention, running automated SEO audits, and generating viral packaging.
              </>
            )}
          </p>
        </div>

        {/* Quick Status / CTA */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!channel ? (
            <Button
              onClick={onConnectClick}
              className="bg-brand-500 hover:bg-brand-400 text-white font-semibold shadow-md shadow-brand-500/20"
            >
              Connect YouTube Channel
            </Button>
          ) : (
            <Link href="/modules/channel-audit">
              <Button
                variant="outline"
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm"
              >
                <span>Run First Audit</span>
                <ArrowUpRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          )}

          <Link href="/profile">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-white/10 text-xs"
            >
              Profile Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
