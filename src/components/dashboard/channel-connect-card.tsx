"use client";

import React from "react";
import {
  Youtube,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Lock,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChannelConnectCardProps {
  onConnectClick: () => void;
}

export function ChannelConnectCard({ onConnectClick }: ChannelConnectCardProps) {
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
                  Unconnected
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Channel sync is required to activate custom niche intelligence and script tuning.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 w-fit">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>Setup Action Pending</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Unconnected Channel Banner */}
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
              onClick={onConnectClick}
              className="gap-2 bg-red-600 hover:bg-red-700 shadow-red-600/20 text-white"
            >
              <Youtube className="h-4 w-4" />
              <span>Connect YouTube</span>
            </Button>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Visual placeholder (OAuth in Step 3)
            </span>
          </div>
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
