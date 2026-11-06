"use client";

import * as React from "react";
import Link from "next/link";
import { FileSearch, Lightbulb, Film, Palette, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function QuickActions() {
  const actions = [
    {
      title: "AI Video Studio",
      description: "Generate voiceover scripts + Midjourney / Runway scene video prompts",
      href: "/modules/script-writer",
      icon: Film,
      color: "text-brand-500",
      bg: "bg-brand-500/10",
      badge: "AI Prompts",
    },
    {
      title: "AI Style Lab",
      description: "6 trending market styles & custom saved style prompt formulas",
      href: "/modules/style-lab",
      icon: Palette,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      badge: "Styles",
    },
    {
      title: "Generate Video Ideas",
      description: "Curiosity packaging concepts calibrated for Science & Education",
      href: "/modules/video-ideas",
      icon: Lightbulb,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      badge: "Curiosity",
    },
    {
      title: "Channel Health Audit",
      description: "50-point automated SEO, tags, and audience retention analysis",
      href: "/modules/channel-audit",
      icon: FileSearch,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      badge: "Audit AI",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h3>
        <span className="text-xs text-slate-400">Launch creator workflows</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;

          return (
            <Link key={act.title} href={act.href} className="group block">
              <Card className="h-full border-slate-200/80 dark:border-navy-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md bg-white dark:bg-navy-900">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-xl ${act.bg} ${act.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="brand">{act.badge}</Badge>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                        {act.title}
                      </h4>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
