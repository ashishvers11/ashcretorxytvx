"use client";

import * as React from "react";
import {
  Video,
  Play,
  TrendingDown,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  Gauge,
  Sliders,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VideoAnalyzerPage() {
  const [videoTitle, setVideoTitle] = React.useState("लौंग असल में फूल है या फल? (The Science Behind Cloves)");
  const [videoDuration, setVideoDuration] = React.useState("05:30");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1200);
  };

  const markers = [
    {
      time: "0:25",
      title: "Initial Curiosity Hook Window",
      retention: "74%",
      status: "good",
      detail: "Clean visual question kept audience drop-off under 26%. Benchmark for science facts is 35%.",
    },
    {
      time: "2:40",
      title: "Pacing Plateau",
      retention: "54%",
      status: "warning",
      detail: "Long inventory management segment caused 8% drop. Shorten or add background sound design.",
    },
    {
      time: "5:15",
      title: "Highlight Battle Spike",
      retention: "61%",
      status: "excellent",
      detail: "Viewers rewound to rewatch 1v3 clutch battle. Excellent retention retention trigger.",
    },
    {
      time: "8:20",
      title: "Outro Drop-off",
      retention: "38%",
      status: "warning",
      detail: "Audience dropped when verbal outro cues started. Transition faster to End Screen cards.",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Video Retention & Packaging Analyzer
          </h2>
          <Badge variant="brand">Retention Engine</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Simulate audience drop-offs, evaluate hook strength, and optimize per-second retention curves
        </p>
      </div>

      {/* Input Form */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-5">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Input
              label="Video Title or YouTube Video Link"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="e.g. लौंग असल में फूल है या फल? या यूट्यूब वीडियो लिंक"
              required
            />
          </div>
          <div className="w-full sm:w-36">
            <Input
              label="Duration"
              value={videoDuration}
              onChange={(e) => setVideoDuration(e.target.value)}
              placeholder="08:45"
            />
          </div>
          <Button type="submit" isLoading={isAnalyzing} className="w-full sm:w-auto gap-2">
            <Gauge className="h-4 w-4" />
            <span>Diagnose Video</span>
          </Button>
        </form>
      </Card>

      {/* Overview Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/80 dark:border-navy-800 p-5">
          <span className="text-xs font-bold uppercase text-slate-400">Packaging Score</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">88/100</span>
            <Badge variant="success">High Clickability</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Title curiosity gap is strong with high emotional trigger keywords.
          </p>
        </Card>

        <Card className="border-slate-200/80 dark:border-navy-800 p-5">
          <span className="text-xs font-bold uppercase text-slate-400">First 30s Retention</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-500">68.2%</span>
            <Badge variant="brand">+5.4% vs Niche</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Fast hook cut ensures viewer doesn't click off in first 10 seconds.
          </p>
        </Card>

        <Card className="border-slate-200/80 dark:border-navy-800 p-5">
          <span className="text-xs font-bold uppercase text-slate-400">Average Duration Held</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">5m 12s</span>
            <span className="text-xs text-slate-400 font-semibold">(59.4%)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Above 50% average retention qualifies for YouTube algorithm home browse recommendations.
          </p>
        </Card>
      </div>

      {/* Retention Graph */}
      <Card className="border-slate-200/80 dark:border-navy-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Play className="h-4 w-4 text-brand-500" />
                <span>Second-by-Second Audience Retention Graph</span>
              </CardTitle>
              <CardDescription>
                Audience retention trajectory with key drop-off and spike timestamps
              </CardDescription>
            </div>
            <Badge variant="brand">Simulated Timeline</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-60 w-full flex flex-col justify-end pt-4 pb-2">
            <div className="relative h-48 w-full">
              <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area */}
                <path
                  d="M 0,0 C 10,16 25,22 35,24 S 60,19 75,25 S 90,32 100,38 L 100,50 L 0,50 Z"
                  fill="url(#retentionGrad)"
                />
                {/* Line */}
                <path
                  d="M 0,0 C 10,16 25,22 35,24 S 60,19 75,25 S 90,32 100,38"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                {/* Spike marker */}
                <circle cx="60" cy="19" r="2.5" fill="#38bdf8" />
              </svg>
            </div>

            <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400 border-t border-slate-100 dark:border-navy-800">
              <span>0:00 (100%)</span>
              <span>2:30 (55%)</span>
              <span>5:15 (Rewatch Spike)</span>
              <span>7:00 (45%)</span>
              <span>{videoDuration} (38%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Timestamp Markers */}
      <Card className="border-slate-200/80 dark:border-navy-800">
        <CardHeader>
          <CardTitle className="text-base font-bold">Timeline Diagnostics</CardTitle>
          <CardDescription>
            Pacing recommendations to prevent viewer churn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {markers.map((m) => (
            <div
              key={m.time}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 dark:border-navy-800 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-navy-800 text-slate-800 dark:text-slate-200">
                  {m.time}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      {m.title}
                    </h5>
                    <span className="text-xs font-semibold text-emerald-500">
                      ({m.retention} Audience Held)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {m.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
