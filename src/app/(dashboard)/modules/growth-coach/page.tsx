"use client";

import * as React from "react";
import {
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
  Circle,
  Award,
  Zap,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GrowthCoachPage() {
  const { channel, activeChannelStyle } = useAuth();
  const channelTitle = channel?.channel_title || "Connected Channel";
  const styleLabel = activeChannelStyle?.visualStyleLabel || "Original Video Style";
  const nicheLabel = activeChannelStyle?.channelNiche || "Content Creation";
  const storageKey = `ash_coach_completed_${channel?.id || "default"}`;

  const [completedActions, setCompletedActions] = React.useState<number[]>([1]);

  // Load from localStorage
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompletedActions(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load coach actions:", e);
    }
  }, [storageKey]);

  const toggleAction = (id: number) => {
    setCompletedActions((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (e) {
          console.warn("Failed to save coach actions:", e);
        }
      }
      return next;
    });
  };

  const sprintGoals = [
    {
      id: 1,
      title: "Establish 3 Signature Video Pillars",
      detail: `Define repeating content formats tailored to ${nicheLabel}: 1. Core Mysteries & Discoveries, 2. Visual Story Breakdown (${styleLabel}), 3. High-Curiosity Shorts.`,
      reward: "+15% Channel Authority",
    },
    {
      id: 2,
      title: "Publish 2 High-Retention Shorts Weekly",
      detail: `Use your signature ${styleLabel} aesthetic as a top-of-funnel discoverability engine. Link the full breakdown in comments.`,
      reward: "+500 Monthly Views",
    },
    {
      id: 3,
      title: "Achieve 8%+ Impression CTR on Next Upload",
      detail: "Use our Thumbnail Studio and Title Optimizer to test your packaging before publishing.",
      reward: "Algorithm Home Feed Boost",
    },
    {
      id: 4,
      title: "Keep First 30s Retention Above 65%",
      detail: "Cut fluff animated intros. Deliver on the promise made in your title within the first 3 seconds.",
      reward: "Recommended Feed Velocity",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Personalized Growth Coach
          </h2>
          <Badge variant="brand">Sprint 1: 0 to 1,000 Subs</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          AI advisory sprints calibrated to accelerate audience momentum for <strong className="text-slate-800 dark:text-slate-200">{channelTitle}</strong>
        </p>
      </div>

      {/* Main Sprint Banner */}
      <Card className="border-slate-200/80 dark:border-navy-800 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-950 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 px-3 py-1 text-xs font-semibold text-brand-300">
              <Target className="h-3.5 w-3.5" />
              <span>Active Objective: Reach First 1,000 Subscribers</span>
            </span>

            <h3 className="text-2xl font-black text-white">
              The Packaging-First Velocity Sprint
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              For early-stage education & science creators, curiosity packaging matters 3x more than quantity of uploads. YouTube's recommendation system will test your video with broader audiences if your initial click-through rate exceeds 6.5%.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 text-right">
            <span className="text-xs font-semibold text-slate-400">Sprint Progress</span>
            <div className="text-3xl font-black text-white">
              {Math.round((completedActions.length / sprintGoals.length) * 100)}%
            </div>
            <span className="text-[11px] text-brand-400 font-medium">
              {completedActions.length} of {sprintGoals.length} milestones complete
            </span>
          </div>
        </div>
      </Card>

      {/* Sprint Milestones */}
      <Card className="border-slate-200/80 dark:border-navy-800">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-500" />
            <span>Weekly Growth Action Milestones</span>
          </CardTitle>
          <CardDescription>
            Check off each milestone as you execute your weekly content cycle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sprintGoals.map((goal) => {
            const isDone = completedActions.includes(goal.id);

            return (
              <div
                key={goal.id}
                onClick={() => toggleAction(goal.id)}
                className={`cursor-pointer rounded-xl border p-4 flex items-start gap-4 transition-all ${
                  isDone
                    ? "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10"
                    : "border-slate-200/80 dark:border-navy-800 hover:border-brand-500/30"
                }`}
              >
                <button type="button" className="pt-0.5 shrink-0 text-slate-400">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? "text-emerald-900 dark:text-emerald-200 line-through" : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {goal.title}
                    </h4>
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400">
                      {goal.reward}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {goal.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Algorithm Tip of the Week */}
      <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 dark:bg-brand-950/20 p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Algorithm Law: The "First 30 Seconds" Rule
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Never waste your opening on an animated channel logo intro or saying "Welcome back guys, don't forget to like and subscribe". The first 15 seconds must visually reinforce the promise made in your thumbnail to prevent immediate click-aways.
          </p>
        </div>
      </div>
    </div>
  );
}
