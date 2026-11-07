"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Film,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Play,
  RotateCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ContentWorkflowStage {
  id: string;
  label: string;
  description: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  targetHref: string;
}

export function ContentWorkflowOverview() {
  const [stages, setStages] = React.useState<{ [key: string]: number }>({
    script_generated: 1,
    waiting_video: 1,
    scenes_ready: 2,
    seo_ready: 1,
    thumbnail_ready: 1,
    completed: 4,
  });

  const [activeProject, setActiveProject] = React.useState<{
    title: string;
    stage: string;
    style: string;
    updatedAt: string;
  } | null>(null);

  // Load from localStorage if present
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("ash_active_project");
      if (stored) {
        const parsed = JSON.parse(stored);
        setActiveProject({
          title: parsed.title || "Commercial Airplane Paint Physics",
          stage: parsed.stage || "Video Scenes Ready",
          style: parsed.style || "Handmade Paper Cut-Out",
          updatedAt: parsed.updatedAt || "Just now",
        });
      } else {
        // Sensible initial active project
        setActiveProject({
          title: "Why Are Commercial Airplanes Painted White?",
          stage: "Video Scenes Ready",
          style: "Handmade Paper Cut-Out",
          updatedAt: "Today",
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // PRD Section 3.2.D: 6 Canonical Content Workflow Stages
  const workflowStages: ContentWorkflowStage[] = [
    {
      id: "script_generated",
      label: "Script Generated",
      description: "Researched 10-stage voiceover draft ready",
      count: stages.script_generated,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      targetHref: "/modules/script-writer",
    },
    {
      id: "waiting_video",
      label: "Waiting for Video",
      description: "Awaiting visual style & scene division",
      count: stages.waiting_video,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      targetHref: "/modules/script-writer?tab=scenes",
    },
    {
      id: "scenes_ready",
      label: "Scenes Ready",
      description: "1:1 AI video & image prompts generated",
      count: stages.scenes_ready,
      icon: Film,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      targetHref: "/modules/script-writer?tab=scenes",
    },
    {
      id: "seo_ready",
      label: "SEO Ready",
      description: "High-CTR title, tags & timestamps structured",
      count: stages.seo_ready,
      icon: Search,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      targetHref: "/modules/seo-studio",
    },
    {
      id: "thumbnail_ready",
      label: "Thumbnail Ready",
      description: "3 AI concepts tested on feed simulator",
      count: stages.thumbnail_ready,
      icon: ImageIcon,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      targetHref: "/modules/thumbnail-studio",
    },
    {
      id: "completed",
      label: "Completed",
      description: "Full content package ready to publish",
      count: stages.completed,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      targetHref: "/dashboard",
    },
  ];

  return (
    <Card className="border-slate-200/80 dark:border-navy-800">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <span>Content Workflow Overview</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold">
                PRD Production Pipeline
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Live status tracking across your multi-stage content creation lifecycle
            </CardDescription>
          </div>

          {activeProject && (
            <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-slate-100 dark:bg-navy-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-800">
              <span className="text-slate-400">Current Project:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                {activeProject.title}
              </span>
              <Badge variant="brand" className="text-[10px] py-0 px-1.5 shrink-0">
                {activeProject.stage}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Pipeline Bar / Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {workflowStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <Link
                key={stage.id}
                href={stage.targetHref}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-navy-800/80 bg-slate-50/40 dark:bg-navy-900/40 p-3 transition-all hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-navy-900 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-lg ${stage.bg} ${stage.color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors leading-tight">
                    {stage.label}
                  </h5>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-navy-800/60 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                    {stage.count} {stage.count === 1 ? "project" : "projects"}
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
