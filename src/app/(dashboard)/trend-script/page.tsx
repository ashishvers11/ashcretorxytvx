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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GeneratedScriptResult, TrendResearchResult } from "@/lib/ai/provider";

export default function TrendScriptPage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "Dinosaur extinction mystery";

  const [activeTab, setActiveTab] = useState<"research" | "script">("script");
  const [topic, setTopic] = useState<string>(initialTopic);
  const [videoFormat, setVideoFormat] = useState<"shorts" | "longform">("shorts");
  const [duration, setDuration] = useState<number>(60);
  const [audience, setAudience] = useState<string>("Curious & General");
  const [language, setLanguage] = useState<string>("English");

  const [generating, setGenerating] = useState(false);
  const [script, setScript] = useState<GeneratedScriptResult | null>(null);
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);

  const [trendsNiche, setTrendsNiche] = useState<string>("Science & Mysteries");
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsData, setTrendsData] = useState<TrendResearchResult | null>(null);

  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Fetch niche trends
  const fetchTrends = async (niche: string) => {
    setTrendsLoading(true);
    try {
      const res = await fetch(`/api/studio/trends?niche=${encodeURIComponent(niche)}`);
      if (res.ok) {
        const data = await res.json();
        setTrendsData(data.trends);
      }
    } catch (err) {
      console.error("Failed to fetch trends:", err);
    } finally {
      setTrendsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "research" && !trendsData) {
      fetchTrends(trendsNiche);
    }
  }, [activeTab, trendsData, trendsNiche]);

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/studio/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          videoFormat,
          targetDuration: duration,
          audience,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setScript(data.script);
        setSavedSuccess(true);
        setActiveTab("script");
      }
    } catch (err) {
      console.error("Failed to generate script:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectTrendTopic = (trendTopic: string) => {
    setTopic(trendTopic);
    setActiveTab("script");
  };

  const handleCopyVoiceover = () => {
    if (!script) return;
    navigator.clipboard.writeText(script.full_voiceover);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Flame className="h-6 w-6 text-brand-400" />
            <span>Trend Research & Script Studio</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover validated curiosity topics and generate researched, fact-checked YouTube scripts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("script")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "script"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Script Studio</span>
          </button>
          <button
            onClick={() => setActiveTab("research")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "research"
                ? "bg-brand-500 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Trend Research</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SCRIPT STUDIO */}
      {activeTab === "script" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Console (4 Cols) */}
          <Card className="lg:col-span-4 border-slate-800 bg-surface-900/90 shadow-xl h-fit">
            <CardHeader className="border-b border-slate-800/80 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Compass className="h-4 w-4 text-brand-400" />
                <span>Script Parameters</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Configure your target topic, duration, and audience pacing.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-400">Target Topic</label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Why airplane windows have tiny holes"
                  className="bg-slate-950 border-slate-800 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-400">Video Format</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFormat("shorts");
                      setDuration(60);
                    }}
                    className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                      videoFormat === "shorts"
                        ? "border-brand-500 bg-brand-500/10 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    Shorts (9:16)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFormat("longform");
                      setDuration(300);
                    }}
                    className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                      videoFormat === "longform"
                        ? "border-brand-500 bg-brand-500/10 text-white"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    Longform (16:9)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold uppercase text-slate-400">Target Duration</label>
                  <span className="font-bold text-brand-400">{duration}s</span>
                </div>
                <input
                  type="range"
                  min={videoFormat === "shorts" ? 15 : 60}
                  max={videoFormat === "shorts" ? 60 : 600}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">
                  ~{Math.round((duration / 60) * 140)} estimated words at 140 WPM pacing
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-400">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Curious & General">Curious &amp; General (Broad)</option>
                  <option value="Beginners & Learners">Beginners &amp; Learners</option>
                  <option value="Advanced Enthusiasts">Advanced Enthusiasts</option>
                  <option value="Casual Entertainment">Casual Entertainment</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-slate-400">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi / Hinglish</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                </select>
              </div>

              <Button
                variant="primary"
                onClick={handleGenerateScript}
                disabled={generating || !topic.trim()}
                className="w-full gap-2 text-xs font-semibold mt-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Writing Cinematic Script...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    <span>Generate Script Engine</span>
                  </>
                )}
              </Button>

              {savedSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Script saved to your studio library!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Script Viewer & Scene Director (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {script ? (
              <>
                {/* Script Header Banner */}
                <Card className="border-slate-800 bg-surface-900/90 shadow-xl overflow-hidden">
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="text-[10px]">
                          Script Ready
                        </Badge>
                        <span className="text-[11px] text-slate-400">
                          {script.videoFormat.toUpperCase()} • {script.targetDuration}s
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{script.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyVoiceover}
                        className="gap-1.5 text-xs text-slate-300"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? "Copied" : "Copy Voiceover"}</span>
                      </Button>
                      <Link href={`/video-production?topic=${encodeURIComponent(script.topic)}`}>
                        <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                          <span>Send to Production</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <CardContent className="pt-5 space-y-5">
                    {/* Hook Selector */}
                    <div>
                      <span className="text-xs font-semibold uppercase text-slate-400 block mb-2">
                        🎣 Tested Hook Variations (First 1-2 Seconds):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {script.hookVariations?.map((h, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedHookIndex(i)}
                            className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                              selectedHookIndex === i
                                ? "border-brand-500 bg-brand-500/10 text-white shadow-sm"
                                : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase text-brand-400 block mb-1">
                              {h.angle}
                            </span>
                            <p className="line-clamp-3 leading-relaxed">{h.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Full Voiceover Reader */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold uppercase text-slate-400">
                          🎙️ Full Teleprompter Voiceover ({script.estimated_word_count} words):
                        </span>
                        <span className="text-slate-500 text-[11px]">~140 WPM optimal speed</span>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                        {script.full_voiceover}
                      </div>
                    </div>

                    {/* Scene-by-Scene Visual Choreography */}
                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                      <span className="text-xs font-semibold uppercase text-slate-400 block">
                        🎬 Scene-by-Scene Choreography &amp; Midjourney Motion Prompts:
                      </span>
                      <div className="space-y-2.5">
                        {script.scenes?.map((scene) => (
                          <div
                            key={scene.sceneNumber}
                            className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between text-slate-400 text-[11px]">
                              <span className="font-bold text-white">Scene {scene.sceneNumber}</span>
                              <Badge variant="outline" className="text-[10px]">
                                {scene.duration}
                              </Badge>
                            </div>
                            <p className="text-slate-300">
                              <strong className="text-brand-400">Director Note:</strong> {scene.visualDirection}
                            </p>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                              <span className="text-amber-400">Prompt:</span> {scene.motionPrompt}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Educational Fact Checking & Citations */}
                    {script.fact_sources && script.fact_sources.length > 0 && (
                      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 text-xs space-y-2">
                        <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-brand-400" />
                          <span>Fact-Checked Sources &amp; Citations:</span>
                        </span>
                        <div className="space-y-1">
                          {script.fact_sources.map((fact, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                              <span>• {fact.claim} ({fact.source})</span>
                              {fact.url && (
                                <a
                                  href={fact.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-400 hover:underline flex items-center gap-1 ml-2"
                                >
                                  Source <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-dashed border-slate-800 bg-surface-900/40 p-12 text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4 border border-brand-500/20">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Script Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                  Enter your topic on the left or select a trending curiosity concept from the Trend Research tab
                  to author a high-retention script with tested hooks, scene choreography, and citations.
                </p>
                <Button variant="primary" onClick={handleGenerateScript} className="gap-2 text-xs">
                  <Wand2 className="h-4 w-4" />
                  <span>Generate Default Script</span>
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TREND RESEARCH */}
      {activeTab === "research" && (
        <div className="space-y-6">
          {/* Niche Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              "Science & Mysteries",
              "Technology & AI",
              "History & Discoveries",
              "Finance & Money",
              "True Crime & Psychology",
              "Gaming & Lore",
            ].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setTrendsNiche(n);
                  fetchTrends(n);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  trendsNiche === n
                    ? "border-brand-500 bg-brand-500/10 text-white"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {trendsLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-400 mb-2" />
              <p className="text-xs text-slate-400">Researching high-demand curiosity topics...</p>
            </div>
          ) : trendsData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trendsData.trendingTopics.map((trend) => (
                  <Card key={trend.id} className="border-slate-800 bg-surface-900/90 shadow-xl flex flex-col justify-between p-5">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            trend.searchDemand === "Breakout"
                              ? "warning"
                              : trend.searchDemand === "Rising"
                              ? "secondary"
                              : "success"
                          }
                          className="text-[10px]"
                        >
                          {trend.searchDemand} Demand
                        </Badge>
                        <span className="text-[10px] text-slate-500">{trend.estimatedVolume}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-2">{trend.topic}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{trend.contentGap}</p>

                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                        <span className="text-amber-400 font-bold block mb-0.5">Hook Angle:</span>
                        {trend.suggestedHook}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 mt-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSelectTrendTopic(trend.topic)}
                        className="w-full gap-2 text-xs"
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        <span>Turn into Script</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Related High-Intent Keywords */}
              <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5">
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-brand-400" />
                  <span>Validated YouTube Search Queries in this Niche:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {trendsData.relatedKeywords.map((kw, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectTrendTopic(kw.keyword)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-brand-500 text-xs text-slate-300 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>{kw.keyword}</span>
                      <span className="text-[10px] text-brand-400">{kw.searchVolumeEstimate}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
