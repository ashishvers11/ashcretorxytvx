"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Youtube,
  ShieldCheck,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ExternalLink,
  Loader2,
  Calendar,
  Sparkles,
  ArrowRight,
  Video,
  Eye,
  Users,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";
import { ChannelAuditResult } from "@/lib/ai/provider";

export default function ChannelAuditPage() {
  const { channel, connected, loading: channelLoading } = useYouTubeChannel();
  const [dateRange, setDateRange] = useState<string>("30d");
  const [customChannelName, setCustomChannelName] = useState<string>("");
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<ChannelAuditResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunAudit = async () => {
    setAuditing(true);
    try {
      const channelStats = {
        title: channel?.title || customChannelName || "My YouTube Channel",
        subscriberCount: channel?.subscriberCount ?? null,
        viewCount: channel?.viewCount ?? null,
        videoCount: channel?.videoCount ?? null,
      };

      const res = await fetch("/api/studio/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: channel?.channelId || "manual_channel",
          channelStats,
          recentVideos: channel?.recentVideos || [],
          dateRange,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAuditResult(data.audit);
      }
    } catch (err) {
      console.error("Failed to run channel audit:", err);
    } finally {
      setAuditing(false);
    }
  };

  const handleCopyReport = () => {
    if (!auditResult) return;
    const summary = `ASH Creator Studio — Channel Audit Report
Score: ${auditResult.auditScore}/100 (Grade: ${auditResult.overallGrade})
Date Range: ${dateRange}

TOP RECOMMENDATIONS:
${auditResult.recommendations
  .map(
    (r, i) => `${i + 1}. [${r.priority} Priority] ${r.problem}
- Evidence: ${r.evidence}
- Action: ${r.change}
- Test: ${r.test}`
  )
  .join("\n\n")}
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-brand-400" />
            <span>Channel Audit & Algorithmic Diagnostics</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real performance benchmarks, retention dropoff points, and 5-point actionable growth recommendations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={connected ? "success" : "outline"} className="gap-1.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{connected ? "YouTube OAuth Connected" : "Standalone Audit Mode"}</span>
          </Badge>
        </div>
      </div>

      {/* Control Console */}
      <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1 space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-400">Target Channel</label>
              {connected && channel ? (
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  {channel.thumbnailUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={channel.thumbnailUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                  )}
                  <span className="text-xs font-bold text-white truncate">{channel.title}</span>
                  <Badge variant="success" className="text-[9px] ml-auto py-0">
                    Live Synced
                  </Badge>
                </div>
              ) : (
                <Input
                  placeholder="Enter channel name or niche..."
                  value={customChannelName}
                  onChange={(e) => setCustomChannelName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-400">Date Range</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                {["7d", "30d", "90d", "all"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`py-1.5 rounded text-center font-medium transition-colors ${
                      dateRange === range
                        ? "bg-brand-500 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Button
                variant="primary"
                onClick={handleRunAudit}
                disabled={auditing}
                className="w-full gap-2 text-xs font-semibold"
              >
                {auditing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing Channel Metrics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Run Algorithmic Audit</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Results View */}
      {auditResult ? (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5 flex flex-col justify-between text-center md:text-left">
              <span className="text-xs font-semibold text-slate-400 uppercase">Overall Channel Health</span>
              <div className="flex items-baseline justify-center md:justify-start gap-3 my-2">
                <span className="text-4xl font-extrabold text-white">{auditResult.auditScore}</span>
                <span className="text-slate-500 text-sm">/ 100</span>
                <Badge variant={auditResult.auditScore >= 80 ? "success" : "warning"} className="text-sm font-bold px-2.5">
                  {auditResult.overallGrade}
                </Badge>
              </div>
              <span className="text-[11px] text-slate-500">Based on multi-factor retention benchmarks</span>
            </Card>

            <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5 space-y-1 text-center md:text-left">
              <span className="text-xs text-slate-400">Avg Views Per Video</span>
              <div className="text-2xl font-bold text-white">
                {typeof auditResult.performance_summary.avgViewsPerVideo === "number"
                  ? auditResult.performance_summary.avgViewsPerVideo.toLocaleString()
                  : "Unavailable"}
              </div>
              <span className="text-[11px] text-brand-400">Channel average across library</span>
            </Card>

            <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5 space-y-1 text-center md:text-left">
              <span className="text-xs text-slate-400">Upload Consistency</span>
              <div className="text-lg font-bold text-emerald-400">
                {auditResult.performance_summary.uploadConsistency}
              </div>
              <span className="text-[11px] text-slate-500">Algorithmic pacing factor</span>
            </Card>

            <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5 space-y-1 text-center md:text-left">
              <span className="text-xs text-slate-400">Shorts Opportunity</span>
              <div className="text-lg font-bold text-amber-400">
                {auditResult.performance_summary.shortsAdoptionRate}
              </div>
              <span className="text-[11px] text-slate-500">Growth multiplier format</span>
            </Card>
          </div>

          {/* Actionable 5-Point Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-400" />
                <span>5-Point Actionable Growth Recommendations</span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyReport}
                className="gap-1.5 text-xs text-slate-300"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy Report"}</span>
              </Button>
            </div>

            <div className="space-y-3">
              {auditResult.recommendations.map((rec, idx) => (
                <Card key={idx} className="border-slate-800 bg-surface-900/90 shadow-xl overflow-hidden">
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white">{rec.problem}</h4>
                      </div>
                      <Badge
                        variant={rec.priority === "High" ? "warning" : "secondary"}
                        className="text-[10px] w-fit"
                      >
                        {rec.priority} Priority
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                        <span className="font-semibold text-slate-400 block">📊 Evidence & Analysis:</span>
                        <p className="text-slate-300 leading-relaxed">{rec.evidence}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                        <span className="font-semibold text-amber-400 block">⚠️ Why It Matters:</span>
                        <p className="text-slate-300 leading-relaxed">{rec.whyItMatters}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                        <span className="font-semibold text-emerald-400 block">✅ Exact Change Required:</span>
                        <p className="text-slate-200 leading-relaxed">{rec.change}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-brand-500/5 border border-brand-500/20 space-y-1">
                        <span className="font-semibold text-brand-400 block">🧪 How to A/B Test:</span>
                        <p className="text-slate-200 leading-relaxed">{rec.test}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Content Gaps & Opportunities */}
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" />
                <span>Identified Content Gaps & Untapped Topics</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                High viewer demand with low competitor saturation in your genre.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {auditResult.content_gaps.map((gap, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{gap.title}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {gap.recommendedFormat}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{gap.opportunity}</p>
                  </div>
                  <Link href={`/trend-script?topic=${encodeURIComponent(gap.title)}`}>
                    <Button variant="primary" size="sm" className="gap-1.5 text-xs shrink-0">
                      <span>Write Script</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Empty / Intro State */
        <Card className="border-dashed border-slate-800 bg-surface-900/40 p-10 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4 border border-brand-500/20">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Ready to Audit Your Channel</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            Run an algorithmic audit to uncover baseline view velocities, evaluate hook retention dropoffs,
            and generate a 5-point improvement plan tailored to your channel&apos;s format.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="primary" onClick={handleRunAudit} className="gap-2 text-xs">
              <Sparkles className="h-4 w-4" />
              <span>Launch First Audit</span>
            </Button>
            {!connected && (
              <Link href="/dashboard#channel-setup">
                <Button variant="outline" className="gap-2 text-xs">
                  <Youtube className="h-4 w-4 text-red-500" />
                  <span>Connect YouTube First</span>
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
