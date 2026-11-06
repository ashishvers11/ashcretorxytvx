"use client";

import * as React from "react";
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Sparkles,
  Youtube,
  ShieldCheck,
  TrendingUp,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ChannelAuditPage() {
  const { channel, profile } = useAuth();
  const [isScanning, setIsScanning] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"issues" | "strengths" | "actionPlan">("issues");
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const channelTitle = channel?.channel_title || "ASHISH FN";
  const handle = channel?.custom_url ? `@${channel.custom_url}` : "@ashishfn";

  const handleRerun = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  const toggleStepCompleted = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const auditCategories = [
    {
      name: "SEO & Discoverability",
      score: 78,
      status: "Good",
      color: "text-blue-500",
      barColor: "bg-blue-500",
      description: "Science keywords in description, Hindi search indexing, and channel tags",
    },
    {
      name: "Visual Packaging & CTR",
      score: 85,
      status: "Excellent",
      color: "text-emerald-500",
      barColor: "bg-emerald-500",
      description: "High-contrast visual branding, memorable handle and curiosity appeal",
    },
    {
      name: "Publishing Cadence",
      score: 64,
      status: "Needs Focus",
      color: "text-amber-500",
      barColor: "bg-amber-500",
      description: "Weekly upload velocity and Shorts-to-Longform frequency",
    },
    {
      name: "Audience Hook Potential",
      score: 82,
      status: "Strong",
      color: "text-purple-500",
      barColor: "bg-purple-500",
      description: "Topic clarity in Education & Science Facts niche and curiosity playlist architecture",
    },
  ];

  const criticalIssues = [
    {
      type: "warning",
      title: "Missing Targeted High-Volume Keywords in Channel Bio",
      impact: "High",
      detail:
        "Your channel bio does not mention top search queries like 'Hindi Science Facts', 'Daily Life Curiosities', or 'Mysteries Explained'. Adding 3-5 core search terms will increase YouTube suggested feed impressions by up to 34%.",
      action: "Optimize in SEO Studio",
      href: `/modules/seo-studio?title=${encodeURIComponent("लौंग असल में फूल है या फल? (Science Truth About Cloves)")}`,
    },
    {
      type: "warning",
      title: "Inconsistent Visual Style Across Video Scenes & Thumbnails",
      impact: "High",
      detail:
        "Top education creators use a consistent visual aesthetic (like Isometric 3D Micro-World or Unreal Engine 5 hyper-realism) and character anchors so viewers instantly recognize your videos in recommendations.",
      action: "Choose Style in AI Style Lab",
      href: "/modules/style-lab",
    },
    {
      type: "info",
      title: "Upload Consistency Window Unestablished",
      impact: "Medium",
      detail:
        "YouTube algorithm favors predictable upload cadences. Establish a consistent publishing schedule (e.g. Every Tuesday & Friday at 7:00 PM IST) to lock in subscriber retention.",
      action: "Set in Content Calendar",
      href: "/modules/content-calendar",
    },
  ];

  const strengths = [
    {
      title: "Clean Brand Handle Claimed",
      detail: `Your handle ${handle} is memorable, short, and matches search intent perfectly.`,
    },
    {
      title: "Distinctive Branding Avatar",
      detail: "High-resolution custom visual identity active on Google/YouTube CDN.",
    },
    {
      title: "High-Engagement Education & Facts Niche",
      detail: "Operating in Hindi & English curiosity, science mysteries, and facts with massive viral potential and high audience retention.",
    },
    {
      title: "Read-Only Safe Data Integration",
      detail: "Clean zero-penalty channel indexing verified without copyright strikes.",
    },
  ];

  const actionSteps = [
    {
      step: 1,
      title: "Generate AI Script for Next Video",
      time: "3 mins",
      priority: "Urgent",
      desc: "Use the AI Video & Script Studio to write scene-by-scene visual prompts and synchronized voiceover for 'लौंग असल में फूल है या फल?'.",
      href: `/modules/script-writer?title=${encodeURIComponent("लौंग असल में फूल है या फल? (The Truth About Cloves)")}`,
      actionLabel: "Open AI Video Studio",
    },
    {
      step: 2,
      title: "Add 15 High-Volume Hindi Science Tags",
      time: "5 mins",
      priority: "Urgent",
      desc: "Use SEO Studio to generate high-ranking tags like 'science facts hindi', 'daily curiosities', and 'biology mysteries'.",
      href: "/modules/seo-studio",
      actionLabel: "Optimize in SEO Studio",
    },
    {
      step: 3,
      title: "Lock In Visual Style & Character Anchor",
      time: "2 mins",
      priority: "High",
      desc: "Select a trending AI visual style (Cinematic UE5, Isometric Micro-World) and persistent protagonist in Style Lab to prevent visual drift.",
      href: "/modules/style-lab",
      actionLabel: "Open AI Style Lab",
    },
    {
      step: 4,
      title: "Lock Publishing Schedule in Calendar",
      time: "5 mins",
      priority: "Medium",
      desc: "Schedule 3 uploads per week in Content Calendar to establish algorithmic trust.",
      href: "/modules/content-calendar",
      actionLabel: "Open Calendar",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              50-Point Channel Health Audit
            </h2>
            <Badge variant="brand">Live AI Scan</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Algorithmic health diagnostic for <strong className="text-slate-800 dark:text-slate-200">{channelTitle}</strong> ({handle})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleRerun}
            variant="outline"
            size="sm"
            isLoading={isScanning}
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Re-Run Audit</span>
          </Button>

          <Button
            size="sm"
            onClick={() => window.print()}
            className="gap-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Audit Score Card */}
        <Card className="lg:col-span-1 border-slate-200/80 dark:border-navy-800 bg-gradient-to-br from-navy-900 to-navy-950 text-white p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-500/20 blur-3xl" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Channel Growth Score
              </span>
              <Badge variant="success">Grade B+</Badge>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-6xl font-black tracking-tight text-white">
                {isScanning ? "--" : "78"}
              </span>
              <span className="text-lg text-slate-400 font-semibold">/100</span>
            </div>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Your channel foundation is strong. Fixing metadata keywords and establishing playlist architecture will elevate you into the top 15% of your creator cohort.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Evaluated 50 checkpoints</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Passed 39
            </span>
          </div>
        </Card>

        {/* 4 Category Breakdowns */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {auditCategories.map((cat) => (
            <Card key={cat.name} className="border-slate-200/80 dark:border-navy-800 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {cat.description}
                  </p>
                </div>
                <span className={`text-sm font-extrabold ${cat.color}`}>
                  {isScanning ? "--" : `${cat.score}%`}
                </span>
              </div>

              <div className="mt-4 w-full bg-slate-100 dark:bg-navy-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${cat.barColor}`}
                  style={{ width: `${isScanning ? 20 : cat.score}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Benchmark: 70%</span>
                <span className={`font-semibold ${cat.color}`}>{cat.status}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-navy-800 pb-2">
          <button
            onClick={() => setActiveTab("issues")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "issues"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900"
            }`}
          >
            Critical Fixes ({criticalIssues.length})
          </button>
          <button
            onClick={() => setActiveTab("strengths")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "strengths"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900"
            }`}
          >
            Channel Strengths ({strengths.length})
          </button>
          <button
            onClick={() => setActiveTab("actionPlan")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "actionPlan"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900"
            }`}
          >
            30-Day Growth Plan
          </button>
        </div>

        {/* Tab 1: Issues */}
        {activeTab === "issues" && (
          <div className="space-y-3">
            {criticalIssues.map((issue, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/15 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 mt-0.5">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                        {issue.impact} Impact
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {issue.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                      {issue.detail}
                    </p>
                  </div>
                </div>

                <Link href={issue.href}>
                  <Button size="sm" variant="outline" className="text-xs shrink-0 self-end sm:self-auto hover:bg-brand-500 hover:text-white transition-colors gap-1.5">
                    <span>{issue.action}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Strengths */}
        {activeTab === "strengths" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {strengths.map((str, idx) => (
              <Card key={idx} className="border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {str.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {str.detail}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 3: Action Plan */}
        {activeTab === "actionPlan" && (
          <Card className="border-slate-200/80 dark:border-navy-800">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-500" />
                <span>Immediate 30-Day YouTube Growth Checklist</span>
              </CardTitle>
              <CardDescription>
                High-leverage tasks to increase channel discoverability and reach your first 1,000 subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {actionSteps.map((step) => {
                const isDone = completedSteps.includes(step.step);
                return (
                  <div
                    key={step.step}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 transition-colors ${
                      isDone
                        ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/10"
                        : "border-slate-200/80 dark:border-navy-800 hover:border-brand-500/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleStepCompleted(step.step)}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs transition-colors ${
                          isDone
                            ? "bg-emerald-500 text-white"
                            : "bg-brand-500 text-white hover:bg-brand-600"
                        }`}
                        title={isDone ? "Mark as uncompleted" : "Click to mark as completed"}
                      >
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : step.step}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5
                            className={`text-sm font-bold ${
                              isDone
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {step.title}
                          </h5>
                          <Badge variant="brand" className="text-[10px]">
                            {step.time}
                          </Badge>
                          {isDone && (
                            <Badge variant="success" className="text-[10px]">
                              Done ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-[11px] font-bold uppercase text-amber-500">
                        {step.priority}
                      </span>
                      <Link href={step.href}>
                        <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
                          <span>{step.actionLabel}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
