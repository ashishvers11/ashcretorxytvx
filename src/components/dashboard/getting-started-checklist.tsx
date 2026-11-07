"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Youtube,
  BarChart3,
  Flame,
  FileText,
  Video,
  Search,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";

interface GettingStartedChecklistProps {
  onConnectClick: () => void;
}

const ONBOARDING_STEPS = [
  {
    stepNumber: "01",
    title: "Connect a YouTube Channel",
    description: "Link your verified YouTube channel to activate personalized channel DNA and audience-tailored trends.",
    status: "Pending Setup",
    statusVariant: "warning" as const,
    actionType: "modal" as const,
    actionLabel: "Connect Channel",
    icon: Youtube,
  },
  {
    stepNumber: "02",
    title: "Review Channel Performance",
    description: "Run an initial audit to inspect your views velocity, retention curves, and historical audience benchmarks.",
    status: "Awaiting Channel",
    statusVariant: "secondary" as const,
    actionType: "link" as const,
    href: "/channel-audit",
    actionLabel: "Channel Audit",
    icon: BarChart3,
  },
  {
    stepNumber: "03",
    title: "Research a Content Idea",
    description: "Identify high-opportunity trends and curiosity hooks matched specifically to your audience's niche.",
    status: "Not Started",
    statusVariant: "secondary" as const,
    actionType: "link" as const,
    href: "/trend-script",
    actionLabel: "Trend Research",
    icon: Flame,
  },
  {
    stepNumber: "04",
    title: "Create a Structured Script",
    description: "Generate multi-stage fact-checked voiceover scripts with verified research and zero repetitive phrasing.",
    status: "Not Started",
    statusVariant: "secondary" as const,
    actionType: "link" as const,
    href: "/trend-script",
    actionLabel: "Write Script",
    icon: FileText,
  },
  {
    stepNumber: "05",
    title: "Prepare a Video",
    description: "Direct scene-by-scene choreography, camera motion prompts, and AI visual assets for Runway & Kling.",
    status: "Not Started",
    statusVariant: "secondary" as const,
    actionType: "link" as const,
    href: "/video-production",
    actionLabel: "Produce Scenes",
    icon: Video,
  },
  {
    stepNumber: "06",
    title: "Optimize SEO & Thumbnail",
    description: "Generate click-worthy title variants, algorithmic tags, and high-impact thumbnail visual concepts.",
    status: "Not Started",
    statusVariant: "secondary" as const,
    actionType: "link" as const,
    href: "/seo-studio",
    actionLabel: "Optimize SEO",
    icon: Search,
  },
];

export function GettingStartedChecklist({ onConnectClick }: GettingStartedChecklistProps) {
  const { channel, connected } = useYouTubeChannel();

  const steps = ONBOARDING_STEPS.map((s) => {
    if (s.stepNumber === "01") {
      return {
        ...s,
        status: connected ? "Connected" : "Pending Setup",
        statusVariant: connected ? ("success" as const) : ("warning" as const),
        isCompleted: connected,
      };
    }
    return { ...s, isCompleted: false };
  });

  const completedCount = steps.filter((s) => s.isCompleted).length;

  return (
    <Card id="getting-started" className="border-slate-800 bg-surface-900/90 shadow-xl">
      <CardHeader className="border-b border-slate-800/80 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Getting Started Checklist</CardTitle>
              <Badge variant={completedCount > 0 ? "success" : "outline"} className="text-[10px]">
                {completedCount} of 6 Steps Completed
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-400 mt-1">
              Follow this step-by-step onboarding roadmap to produce your first high-retention video package.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-brand-400" />
            <span>Steps update dynamically with real activity</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.stepNumber}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:border-slate-700/80 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${
                      step.isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    {step.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-brand-400">
                        {step.stepNumber}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-200">
                        {step.title}
                      </h4>
                      <Badge variant={step.statusVariant} className="text-[10px] py-0 px-2">
                        {step.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center self-end sm:self-center shrink-0">
                  {step.actionType === "modal" ? (
                    <button
                      onClick={onConnectClick}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-400 hover:text-brand-300 py-1.5 px-3 rounded-lg bg-brand-500/10 hover:bg-brand-500/15 border border-brand-500/20 transition-all"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{step.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <Link
                      href={step.href}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
                    >
                      <Icon className="h-3.5 w-3.5 text-brand-400" />
                      <span>{step.actionLabel}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
