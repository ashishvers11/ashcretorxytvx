"use client";

import React from "react";
import Link from "next/link";
import {
  HelpCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  FileCode,
  Film,
  Tags,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function WorkflowGuidance() {
  return (
    <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
      <CardHeader className="border-b border-slate-800/80 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">How to Begin Using ASH Creator Studio</CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                A simple guide to the recommended end-to-end content production workflow.
              </CardDescription>
            </div>
          </div>
          <Badge variant="default" className="text-[10px] w-fit">
            Creator Workflow Manual
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Core Philosophy Banner */}
        <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 flex items-start gap-3">
          <CheckCircle className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Individual Channel Intelligence:</strong> ASH Creator Studio never assumes all creators have the same niche. A science channel receives educational research, a gaming channel receives gaming mechanics trends, and a documentary channel receives historical archives.
          </p>
        </div>

        {/* 5-Phase End-to-End Visual Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Phase 1 */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Phase 01</span>
              <Badge variant="outline" className="text-[9px] py-0 px-1.5 text-slate-400">Step 1</Badge>
            </div>
            <h5 className="text-xs font-semibold text-slate-200">Channel Connection</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Connect your channel to establish your audience profile, average duration, and writing DNA.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Phase 02</span>
              <TrendingUp className="h-3 w-3 text-amber-400" />
            </div>
            <h5 className="text-xs font-semibold text-slate-200">Trend Discovery</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Scan high-velocity curiosity queries tailored specifically to your audience demand gaps.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-brand-400 uppercase">Phase 03</span>
              <FileCode className="h-3 w-3 text-brand-400" />
            </div>
            <h5 className="text-xs font-semibold text-slate-200">Script Writing</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Draft scene-by-scene spoken voiceovers with strong hooks, natural pacing, and zero filler phrases.
            </p>
          </div>

          {/* Phase 4 */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Phase 04</span>
              <Film className="h-3 w-3 text-indigo-400" />
            </div>
            <h5 className="text-xs font-semibold text-slate-200">Scene Production</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Direct scene choreography, cinematic lighting, and camera motion prompts for Runway &amp; Kling.
            </p>
          </div>

          {/* Phase 5 */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Phase 05</span>
              <Tags className="h-3 w-3 text-emerald-400" />
            </div>
            <h5 className="text-xs font-semibold text-slate-200">SEO &amp; Thumbnail</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Package click-worthy title options, search descriptions, tags, and focal thumbnail layouts.
            </p>
          </div>
        </div>

        {/* Guidance Action Footer */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-400">
            Ready to explore? You can draft your first script immediately in the Script Studio.
          </span>
          <Link
            href="/trend-script"
            className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-medium"
          >
            <span>Go to Trend Research &amp; Script Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
