"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  User,
  Youtube,
  FileSearch,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GettingStartedChecklist({ onConnectClick }: { onConnectClick: () => void }) {
  const { profile, channel } = useAuth();

  const isProfileComplete = Boolean(profile?.full_name && profile?.channel_niche);
  const isChannelConnected = Boolean(channel);
  const isAuditRun = false; // Phase 1 blueprint
  const isIdeasGenerated = false; // Phase 1 blueprint

  const steps = [
    {
      id: "profile",
      title: "Complete Creator Profile",
      description: "Set your creator persona, channel niche, and preferred language",
      completed: isProfileComplete,
      actionHref: "/profile",
      actionText: "Edit Profile",
      icon: User,
    },
    {
      id: "channel",
      title: "Connect YouTube Channel",
      description: "Authorize read-only access to synchronize videos and performance data",
      completed: isChannelConnected,
      actionClick: onConnectClick,
      actionText: "Connect Channel",
      icon: Youtube,
    },
    {
      id: "audit",
      title: "Run First Channel Audit",
      description: "Generate a 50-point diagnostic scan on tags, descriptions, and packaging",
      completed: isAuditRun,
      actionHref: "/modules/channel-audit",
      actionText: "View Audit Blueprint",
      icon: FileSearch,
    },
    {
      id: "ideas",
      title: "Generate First 5 Video Ideas",
      description: "Use our algorithm-trained idea generator for viral packaging concepts",
      completed: isIdeasGenerated,
      actionHref: "/modules/video-ideas",
      actionText: "Explore Ideas",
      icon: Lightbulb,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className="border-slate-200/80 dark:border-navy-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg">
              Getting Started Checklist
            </CardTitle>
            <CardDescription>
              Complete these initial onboarding milestones to maximize your channel growth velocity
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="w-28 bg-slate-100 dark:bg-navy-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {progressPercent}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {steps.map((step, index) => {
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3.5 transition-all",
                step.completed
                  ? "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10"
                  : "border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900/40"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Step {index + 1}
                    </span>
                    <h5
                      className={cn(
                        "text-sm font-semibold",
                        step.completed
                          ? "text-emerald-900 dark:text-emerald-200 line-through opacity-75"
                          : "text-slate-900 dark:text-white"
                      )}
                    >
                      {step.title}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center self-end sm:self-auto shrink-0">
                {step.actionClick ? (
                  <Button
                    variant={step.completed ? "ghost" : "outline"}
                    size="sm"
                    onClick={step.actionClick}
                    className="text-xs h-8"
                  >
                    {step.actionText}
                  </Button>
                ) : (
                  <Link href={step.actionHref || "#"}>
                    <Button
                      variant={step.completed ? "ghost" : "outline"}
                      size="sm"
                      className="text-xs h-8"
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
