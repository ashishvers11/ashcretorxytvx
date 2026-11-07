"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Flame,
  Sparkles,
  Wand2,
  Compass,
  FileText,
  Clock,
  Video,
  Copy,
  Check,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ExternalLink,
  Layers,
  Search,
  BookOpen,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Eye,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Share2,
  CheckCheck,
  Volume2,
  Camera,
  Film,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProfessionalScript } from "@/lib/script-engine/types";
import { BUILT_IN_PRESETS } from "@/lib/script-engine/presets";
import { DailyResearchReport, TrendOpportunity } from "@/lib/youtube/trend-engine";

export default function TrendScriptPage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "Why Airplane Windows Are Round";

  // Tab State
  const [activeTab, setActiveTab] = useState<"research" | "script">("research");

  // Research Filters
  const [niche, setNiche] = useState<string>("Science");
  const [country, setCountry] = useState<string>("IN");
  const [language, setLanguage] = useState<string>("en");
  const [videoFormat, setVideoFormat] = useState<"shorts" | "longform" | "all">("shorts");
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("7d");

  // Research Data State
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchReport, setResearchReport] = useState<DailyResearchReport | null>(null);
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [coveredTopics, setCoveredTopics] = useState<string[]>([]);
  const [expandedOpportunityId, setExpandedOpportunityId] = useState<string | null>(null);

  // Script Engine State
  const [scriptTopic, setScriptTopic] = useState<string>(initialTopic);
  const [scriptNiche, setScriptNiche] = useState<string>("Science");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset-fact-slice");
  const [scriptLanguage, setScriptLanguage] = useState<"Hindi" | "Hinglish" | "English">("Hinglish");
  const [scriptFormat, setScriptFormat] = useState<"shorts" | "longform">("shorts");
  const [scriptDuration, setScriptDuration] = useState<number>(60);
  const [scriptGenerating, setScriptGenerating] = useState(false);
  const [script, setScript] = useState<ProfessionalScript | null>(null);
  const [activeScriptStage, setActiveScriptStage] = useState<"brief" | "hooks" | "voiceover" | "scenes" | "facts" | "quality">("voiceover");

  // Utilities
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchDailyResearch = async (isRefresh = false) => {
    setResearchLoading(true);
    try {
      const endpoint = isRefresh ? "/api/studio/trends/refresh" : `/api/studio/trends?niche=${encodeURIComponent(niche)}&country=${country}&language=${language}&format=${videoFormat}&timeframe=${timeframe}`;
      const options: RequestInit = isRefresh
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ niche, country, language, format: videoFormat, timeframe }),
          }
        : { method: "GET" };

      const res = await fetch(endpoint, options);
      if (res.ok) {
        const data = await res.json();
        setResearchReport(data.report);
      }
    } catch (err) {
      console.error("Failed to load daily trend research:", err);
    } finally {
      setResearchLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyResearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [niche, country, language, videoFormat, timeframe]);

  const handleGenerateScript = async (topicToUse?: string, nicheToUse?: string) => {
    const targetTopic = topicToUse || scriptTopic;
    if (!targetTopic.trim()) return;

    setScriptGenerating(true);
    try {
      const res = await fetch("/api/studio/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetTopic,
          niche: nicheToUse || scriptNiche,
          presetId: selectedPresetId,
          videoFormat: scriptFormat,
          targetDuration: scriptDuration,
          language: scriptLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setScript(data.script);
        setActiveTab("script");
        setActiveScriptStage("voiceover");
      }
    } catch (err) {
      console.error("Failed to generate script:", err);
    } finally {
      setScriptGenerating(false);
    }
  };

  const handleSelectOpportunityForScript = (opp: TrendOpportunity) => {
    setScriptTopic(opp.topic);
    setScriptNiche(opp.niche);
    handleGenerateScript(opp.topic, opp.niche);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleSaveTopic = (id: string) => {
    setSavedTopics((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const toggleCoveredTopic = (id: string) => {
    setCoveredTopics((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Module 3 of 8
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">YouTube API Driven Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Flame className="h-6 w-6 text-brand-400" />
            <span>Trend Research + Script Writing</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Discover real public opportunities via YouTube Data API v3, evaluate historical views-per-day, and construct professional 8-stage scripts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("research")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "research"
                ? "bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Daily Trend Intelligence</span>
          </button>
          <button
            onClick={() => setActiveTab("script")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "script"
                ? "bg-brand-500 text-slate-950 shadow-md shadow-brand-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Professional Script Studio (8 Stages)</span>
            {script && (
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: DAILY TREND INTELLIGENCE                                       */}
      {/* ===================================================================== */}
      {activeTab === "research" && (
        <div className="space-y-6">
          {/* Research Filters & Controls Card */}
          <Card className="border-slate-800 bg-surface-900/95 shadow-xl">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Search className="h-4 w-4 text-brand-400" />
                    <span>Daily Research Parameters</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Targeted YouTube Data API v3 query filters with quota-aware caching.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchDailyResearch(true)}
                    disabled={researchLoading}
                    className="text-xs gap-1.5 border-slate-700 hover:bg-slate-800"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${researchLoading ? "animate-spin" : ""}`} />
                    <span>Refresh Research</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Niche Selector */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Niche / Category
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Science">Science</option>
                    <option value="Interesting Facts">Interesting Facts</option>
                    <option value="Technology">Technology</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Space">Space</option>
                    <option value="Nature">Nature</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Education">Education</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Region
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="IN">India (IN - Default)</option>
                    <option value="US">United States (US)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="CA">Canada (CA)</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                </div>

                {/* Video Format */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Format
                  </label>
                  <select
                    value={videoFormat}
                    onChange={(e) => setVideoFormat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="shorts">Shorts (9:16)</option>
                    <option value="longform">Long-form (16:9)</option>
                    <option value="all">All Formats</option>
                  </select>
                </div>

                {/* Timeframe */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Timeframe
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days (Default)</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
              </div>

              {/* Quota Status & API Notice */}
              {researchReport && (
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="h-3.5 w-3.5 text-brand-400" />
                      <span>Search Requests: <strong>{researchReport.quotaStatus.searchConsumed}</strong> / {researchReport.quotaStatus.searchDailyLimit}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>Shared Units: <strong>{researchReport.quotaStatus.sharedConsumed}</strong> / {researchReport.quotaStatus.sharedDailyLimit}</span>
                    <span className="text-slate-600">•</span>
                    <span>Reset: <strong>Midnight PT</strong> ({researchReport.quotaStatus.resetTimeFormattedPt})</span>
                  </div>

                  <span className="text-slate-500">
                    Day: {researchReport.quotaStatus.currentDayPt} PT
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Unconfigured API Notice Banner */}
          {researchReport && !researchReport.isApiConfigured && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">YouTube Data API v3 Key Required for Live Searches</strong>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Add <code className="text-amber-300">YOUTUBE_API_KEY</code> to your <code className="text-slate-300">.env.local</code> file to run real-time Google API queries.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerateScript("Dinosaur Extinction: The Unknown Physics", "Science")}
                className="text-xs border-amber-500/40 text-amber-200 hover:bg-amber-500/20 shrink-0"
              >
                Test 8-Stage Script Engine
              </Button>
            </div>
          )}

          {/* Research Results Grid */}
          {researchLoading ? (
            <div className="py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-400 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">Conducting YouTube Data API research...</p>
              <p className="text-xs text-slate-500 mt-1">Analyzing view velocities, competitor saturation, and content gaps</p>
            </div>
          ) : researchReport && researchReport.opportunities.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-400" />
                  <span>Verified Research Opportunities ({researchReport.opportunities.length})</span>
                </h2>
                <span className="text-xs text-slate-500">Transparent Mathematical Scoring</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {researchReport.opportunities.map((opp) => {
                  const isExpanded = expandedOpportunityId === opp.id;
                  const isSaved = savedTopics.includes(opp.id);
                  const isCovered = coveredTopics.includes(opp.id);

                  return (
                    <Card
                      key={opp.id}
                      className={`border-slate-800 bg-surface-900/90 shadow-lg transition-all ${
                        isCovered ? "opacity-60" : ""
                      }`}
                    >
                      <CardContent className="p-5 space-y-4">
                        {/* Header Row */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant={
                                  opp.classification === "Breakout Candidate"
                                    ? "default"
                                    : opp.classification === "Rising Opportunity"
                                    ? "success"
                                    : opp.classification === "Content Gap"
                                    ? "warning"
                                    : "secondary"
                                }
                                className="text-[10px]"
                              >
                                {opp.classification}
                              </Badge>

                              <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700">
                                Confidence: {opp.confidence}
                              </Badge>

                              {isCovered && (
                                <Badge variant="secondary" className="text-[10px]">
                                  Marked as Covered
                                </Badge>
                              )}
                            </div>

                            <h3 className="text-base font-bold text-white leading-snug">
                              {opp.topic}
                            </h3>
                          </div>

                          {/* Score Badge */}
                          <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
                              <span className="text-[10px] text-slate-400 block uppercase">Trend Score</span>
                              <span className="text-lg font-extrabold text-brand-400">
                                {typeof opp.score === "number" ? `${opp.score}/100` : opp.score}
                              </span>
                            </div>

                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSelectOpportunityForScript(opp)}
                              className="gap-1.5 text-xs font-semibold"
                            >
                              <Wand2 className="h-3.5 w-3.5" />
                              <span>Generate Script</span>
                            </Button>
                          </div>
                        </div>

                        {/* Evidence & Metrics Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Avg Views / Day</span>
                            <strong className="text-slate-100 font-bold text-sm">
                              {typeof opp.evidence.avgHistoricalViewsPerDay === "number"
                                ? opp.evidence.avgHistoricalViewsPerDay.toLocaleString()
                                : opp.evidence.avgHistoricalViewsPerDay}
                            </strong>
                            <span className="text-[9px] text-slate-500 block mt-0.5">
                              {opp.evidence.hasEarlyVelocityEstimates ? "Normalized rate (<24h)" : "Historical avg rate"}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Median Engagement</span>
                            <strong className="text-slate-100 font-bold text-sm">
                              {opp.evidence.medianEngagementRate}%
                            </strong>
                            <span className="text-[9px] text-slate-500 block mt-0.5">Likes + comments ratio</span>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Verified Sample</span>
                            <strong className="text-slate-100 font-bold text-sm">
                              {opp.sampleSize} videos
                            </strong>
                            <span className="text-[9px] text-slate-500 block mt-0.5">In {opp.evidence.freshnessWindowDays}d window</span>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 block">Format Recommendation</span>
                            <strong className="text-brand-300 font-bold text-sm">
                              {opp.contentGap.recommendedFormat}
                            </strong>
                            <span className="text-[9px] text-slate-500 block mt-0.5">Optimal retention shape</span>
                          </div>
                        </div>

                        {/* Content Gap & Scoring Explanation */}
                        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs space-y-2">
                          <div className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-200">Content Gap &amp; Differentiation Angle:</strong>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                {opp.contentGap.description}
                              </p>
                              <p className="text-[11px] text-brand-400 mt-1">
                                <strong>Recommended Hook Angle:</strong> {opp.contentGap.unaddressedAngle}
                              </p>
                            </div>
                          </div>

                          {opp.channelFit && (
                            <div className="pt-2 border-t border-slate-800/60 flex items-start gap-2 text-[11px]">
                              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-slate-300">Channel Fit Intelligence: </span>
                                <span className="text-slate-400">{opp.channelFit.fitRecommendation}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Collapsible Competitor Sample Videos */}
                        {opp.evidence.sampleVideos && opp.evidence.sampleVideos.length > 0 && (
                          <div>
                            <button
                              onClick={() => setExpandedOpportunityId(isExpanded ? null : opp.id)}
                              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors"
                            >
                              <span>{isExpanded ? "Hide" : "View"} Competitor Video Samples ({opp.evidence.sampleVideos.length})</span>
                            </button>

                            {isExpanded && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
                                {opp.evidence.sampleVideos.map((sample) => (
                                  <a
                                    key={sample.videoId}
                                    href={sample.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-xs group transition-all"
                                  >
                                    <div className="space-y-0.5 truncate">
                                      <p className="text-slate-200 font-medium truncate group-hover:text-brand-300">
                                        {sample.title}
                                      </p>
                                      <p className="text-[10px] text-slate-500">
                                        {sample.channelTitle} • {sample.viewCount.toLocaleString()} views (~{sample.historicalViewsPerDay.toLocaleString()}/day)
                                      </p>
                                    </div>
                                    <ExternalLink className="h-3.5 w-3.5 text-slate-500 shrink-0 group-hover:text-white" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Topic Management Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                          <span className="text-[11px] text-slate-500">
                            Scored on: {new Date(opp.researchDate).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSaveTopic(opp.id)}
                              className="text-[11px] h-7 gap-1 text-slate-400 hover:text-white"
                            >
                              <Bookmark className={`h-3 w-3 ${isSaved ? "text-brand-400 fill-brand-400" : ""}`} />
                              <span>{isSaved ? "Saved" : "Save Topic"}</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCoveredTopic(opp.id)}
                              className="text-[11px] h-7 gap-1 text-slate-400 hover:text-white"
                            >
                              <CheckCheck className={`h-3 w-3 ${isCovered ? "text-emerald-400" : ""}`} />
                              <span>{isCovered ? "Covered" : "Mark Covered"}</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <Card className="border-slate-800 bg-surface-900/80 p-12 text-center">
              <Compass className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Research Opportunities Cached</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Click Refresh Research to perform a fresh YouTube Data API query for {niche} in {country}.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => fetchDailyResearch(true)}
                disabled={researchLoading}
                className="gap-2 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Execute Research Now</span>
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: PROFESSIONAL SCRIPT STUDIO (8 STAGES)                          */}
      {/* ===================================================================== */}
      {activeTab === "script" && (
        <div className="space-y-6">
          {/* Script Generation Input Card */}
          <Card className="border-slate-800 bg-surface-900/95 shadow-xl">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-brand-400" />
                    <span>8-Stage Script Generation Engine</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Constructs research briefs, 3 hooks, scene-by-scene timing, and fact-verified voiceovers.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Creator Preset Picker */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Creator Content Preset (Part 7)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {BUILT_IN_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPresetId(p.id);
                        setScriptLanguage(p.language as any);
                        setScriptFormat(p.format);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPresetId === p.id
                          ? "border-brand-500 bg-brand-500/10 text-white shadow-md shadow-brand-500/10"
                          : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs font-bold text-slate-200">{p.name}</strong>
                        <Badge variant="outline" className="text-[9px]">
                          {p.language}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input Bar */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Script Topic or Verified Research Title
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    value={scriptTopic}
                    onChange={(e) => setScriptTopic(e.target.value)}
                    placeholder="e.g. Why Airplane Windows Are Round, The Physics of Black Holes..."
                    className="flex-1 bg-slate-950 border-slate-700 text-sm h-11 text-slate-100 placeholder:text-slate-500"
                  />
                  <Button
                    onClick={() => handleGenerateScript()}
                    disabled={scriptGenerating || !scriptTopic.trim()}
                    className="h-11 px-6 bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold gap-2 shrink-0 shadow-lg shadow-brand-500/20"
                  >
                    {scriptGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Constructing 8 Stages...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Run Script Pipeline</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Format / Duration / Language Bar */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Format</label>
                  <select
                    value={scriptFormat}
                    onChange={(e) => setScriptFormat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="shorts">YouTube Shorts (9:16)</option>
                    <option value="longform">Long-form Video (16:9)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Target Duration</label>
                  <select
                    value={scriptDuration}
                    onChange={(e) => setScriptDuration(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2 focus:border-brand-500 focus:outline-none"
                  >
                    <option value={30}>30 Seconds</option>
                    <option value={60}>60 Seconds (Standard Shorts)</option>
                    <option value={90}>90 Seconds</option>
                    <option value={300}>5 Minutes (Long-form)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Spoken Language</label>
                  <select
                    value={scriptLanguage}
                    onChange={(e) => setScriptLanguage(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Hinglish">Hinglish (Natural Spoken)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Script Display with 8-Stage Inspector */}
          {script ? (
            <div className="space-y-6">
              {/* Quality Gate Assessment Banner (Stage 8) */}
              <Card className="border-brand-500/40 bg-gradient-to-br from-slate-950 via-surface-900 to-slate-900 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-800/80 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center font-bold text-lg">
                        {script.qualityGate.overallScore}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">Stage 8 — Script Quality Gate</CardTitle>
                          <Badge variant="success" className="text-[10px]">
                            {script.qualityGate.verdict}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs text-slate-400">
                          Transparent 9-metric algorithmic evaluation. No generic template filler.
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span>Duration: <strong>{script.estimatedDurationSeconds}s</strong></span>
                      <span className="text-slate-600">•</span>
                      <span>Word Count: <strong>{script.wordCount} words</strong></span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Hook Strength</span>
                      <span className="font-bold text-brand-300">{script.qualityGate.metrics.hookStrength.score}/100</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Originality</span>
                      <span className="font-bold text-brand-300">{script.qualityGate.metrics.originality.score}/100</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Factual Reliability</span>
                      <span className="font-bold text-brand-300">{script.qualityGate.metrics.factualReliability.score}/100</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Continuity</span>
                      <span className="font-bold text-brand-300">{script.qualityGate.metrics.narrativeContinuity.score}/100</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Retention Potential</span>
                      <span className="font-bold text-brand-300">{script.qualityGate.metrics.retentionPotential.score}/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stage Sub-Navigation */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setActiveScriptStage("voiceover")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeScriptStage === "voiceover" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Stage 4 &amp; 5: Full Voiceover
                </button>
                <button
                  onClick={() => setActiveScriptStage("hooks")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeScriptStage === "hooks" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Stage 3: 3 Hooks Rationale
                </button>
                <button
                  onClick={() => setActiveScriptStage("scenes")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeScriptStage === "scenes" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Stage 6: Scene Plan &amp; Visuals ({script.scenes.length})
                </button>
                <button
                  onClick={() => setActiveScriptStage("brief")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeScriptStage === "brief" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Stage 1 &amp; 2: Research Brief &amp; Angles
                </button>
                <button
                  onClick={() => setActiveScriptStage("facts")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeScriptStage === "facts" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Stage 7: Fact Verification ({script.factChecks.length})
                </button>
              </div>

              {/* SUBSTAGE: FULL VOICEOVER */}
              {activeScriptStage === "voiceover" && (
                <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
                  <CardHeader className="border-b border-slate-800/80 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-brand-400" />
                          <span>Natural Spoken Teleprompter ({script.language})</span>
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-400">
                          Complete spoken script calculated at ~130 WPM. No arbitrary slicing or truncation.
                        </CardDescription>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(script.fullVoiceover, "voiceover")}
                        className="text-xs gap-1.5 border-slate-700"
                      >
                        {copiedText === "voiceover" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedText === "voiceover" ? "Copied!" : "Copy Voiceover"}</span>
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-base leading-relaxed font-sans space-y-4 select-text">
                      <p className="border-l-2 border-brand-500 pl-3 font-semibold text-brand-300">
                        {script.narrativeStructure.hook}
                      </p>
                      <p>{script.narrativeStructure.curiosityDevelopment}</p>
                      <p>{script.narrativeStructure.context}</p>
                      <p>{script.narrativeStructure.mainExplanation}</p>
                      <p className="border-l-2 border-amber-500 pl-3 font-medium text-amber-200">
                        {script.narrativeStructure.payoff}
                      </p>
                      <p className="text-xs text-slate-400 italic">
                        {script.narrativeStructure.cta}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SUBSTAGE: HOOKS */}
              {activeScriptStage === "hooks" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Stage 3 — Three Distinct Psychological Hooks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {script.hooks.map((h, idx) => (
                      <Card
                        key={h.id}
                        className={`border-slate-800 bg-surface-900/90 shadow-md ${
                          h.isRecommended ? "border-brand-500/50 bg-brand-500/5" : ""
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-400">Option {idx + 1}: {h.style}</span>
                            {h.isRecommended && (
                              <Badge variant="success" className="text-[9px]">Recommended</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                          <p className="font-semibold text-white bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                            &ldquo;{h.text}&rdquo;
                          </p>
                          <div className="space-y-1 text-slate-400">
                            <p><strong className="text-slate-300">Trigger:</strong> {h.psychologicalTrigger}</p>
                            <p><strong className="text-slate-300">Why it works:</strong> {h.rationale}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBSTAGE: SCENE PLAN & VISUALS */}
              {activeScriptStage === "scenes" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Stage 6 — Scene-by-Scene Visual Timeline ({script.scenes.length} Scenes)
                    </h3>
                    <span className="text-xs text-slate-400">AI Midjourney / FLUX Generation Prompts</span>
                  </div>

                  <div className="space-y-3">
                    {script.scenes.map((scene) => (
                      <Card key={scene.sceneNumber} className="border-slate-800 bg-surface-900/90 shadow-md">
                        <CardContent className="p-4 space-y-3 text-xs">
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="font-mono text-[10px]">
                                Scene {scene.sceneNumber} ({scene.timeRange})
                              </Badge>
                              <span className="text-slate-400 font-medium">Text: &ldquo;{scene.onScreenText}&rdquo;</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(scene.imagePrompt, `scene-${scene.sceneNumber}`)}
                              className="h-6 text-[10px] gap-1 text-slate-400 hover:text-white"
                            >
                              {copiedText === `scene-${scene.sceneNumber}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              <span>Copy Image Prompt</span>
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-slate-500 uppercase font-semibold">Spoken Line:</span>
                              <p className="text-slate-200 font-medium bg-slate-950/60 p-2 rounded border border-slate-800">
                                {scene.voiceoverLine}
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <span className="text-[10px] text-slate-500 uppercase font-semibold">Visual Concept &amp; Motion:</span>
                              <p className="text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800">
                                {scene.visualConcept} • <em className="text-brand-300">{scene.motionPrompt}</em>
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                            <span>SFX: {scene.soundEffect}</span>
                            <span>Transition: {scene.transition}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBSTAGE: BRIEF & ANGLES */}
              {activeScriptStage === "brief" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2 text-xs">
                    <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">Stage 1 — Research Brief</h4>
                    <p><strong className="text-brand-400">Central Fact:</strong> {script.researchBrief.centralFact}</p>
                    <p><strong className="text-amber-400">Compelling Angle:</strong> {script.researchBrief.compellingAngle}</p>
                    <p><strong className="text-slate-300">Differentiation Factor:</strong> {script.researchBrief.differentiationFactor}</p>
                    <p className="text-slate-500 text-[11px]">{script.researchBrief.sourceContext}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs mb-2">Stage 2 — Original Angles Considered</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {script.angles.map((a) => (
                        <div key={a.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs space-y-1">
                          <strong className="text-white block font-bold">{a.name}</strong>
                          <p className="text-slate-300">{a.corePremise}</p>
                          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">{a.whyItWorks}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBSTAGE: FACTS */}
              {activeScriptStage === "facts" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Stage 7 — Verified Institutional Fact Checks ({script.factChecks.length})
                    </h3>
                    <span className="text-xs text-slate-500">Real Primary &amp; Secondary Citations</span>
                  </div>

                  {script.factChecks.map((f, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-white">{f.claim}</span>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              f.verificationStatus === "VERIFIED_PRIMARY"
                                ? "success"
                                : f.verificationStatus === "VERIFIED_SECONDARY"
                                ? "default"
                                : f.verificationStatus === "CONFLICTING_EVIDENCE"
                                ? "warning"
                                : "outline"
                            }
                            className="text-[10px]"
                          >
                            {f.verificationStatus}
                          </Badge>
                          <Badge variant="outline" className="text-[9px] text-slate-400">
                            {f.sourceType}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
                        <strong className="text-slate-400 block mb-0.5">Supporting Passage / Evidence:</strong>
                        &ldquo;{f.supportingPassage}&rdquo;
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px] pt-1">
                        <div>
                          <span>Source: <strong className="text-slate-200">{f.sourceTitle}</strong></span>
                        </div>
                        <a
                          href={f.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-400 hover:underline flex items-center gap-1"
                        >
                          <span>Direct Institutional Link</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CONNECTED RESEARCH-TO-PRODUCTION WORKFLOW (PART 8) */}
              <div className="p-5 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-slate-950 via-surface-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Script Verified &amp; Ready for Production (Part 8 Workflow)</span>
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Seamlessly push this script, verified scenes, and visual prompts into downstream production modules without copy-pasting.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Link href={`/video-production?topic=${encodeURIComponent(script.topic)}`}>
                    <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                      <Film className="h-3.5 w-3.5" />
                      <span>Video Production</span>
                    </Button>
                  </Link>

                  <Link href={`/seo-studio?topic=${encodeURIComponent(script.topic)}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs border-slate-700">
                      <Search className="h-3.5 w-3.5" />
                      <span>SEO Studio</span>
                    </Button>
                  </Link>

                  <Link href={`/thumbnail-studio?topic=${encodeURIComponent(script.topic)}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs border-slate-700">
                      <Camera className="h-3.5 w-3.5" />
                      <span>Thumbnail Studio</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Card className="border-slate-800 bg-surface-900/80 p-12 text-center">
              <FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">Ready to Generate Professional Script</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Select an opportunity from the Daily Trend Intelligence tab or enter a custom curiosity topic above.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleGenerateScript()}
                disabled={scriptGenerating}
                className="gap-2 text-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate Sample 8-Stage Script</span>
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
