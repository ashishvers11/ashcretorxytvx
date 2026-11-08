"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Sparkles,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info,
  X,
  Play,
  Globe2,
  Clock,
  FileText,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DailyResearchReport, TrendOpportunity } from "@/lib/youtube/trend-engine";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";

export default function TrendRadarPage() {
  const router = useRouter();
  const { channel, connected } = useYouTubeChannel();

  // Active Category State
  const [selectedCategory, setSelectedCategory] = useState<string>("channel-tailored");
  const [format, setFormat] = useState<"shorts" | "longform">("shorts");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DailyResearchReport | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchLabel, setActiveSearchLabel] = useState<string | null>(null);

  const handleExecuteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setActiveSearchLabel(`🔍 Custom Research: "${q}"`);
    setSelectedCategory(q);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearchLabel(null);
    setSelectedCategory("channel-tailored");
  };

  // Dynamic Categories based on Connected Channel
  const categories = [
    ...(connected && channel
      ? [
          {
            id: "channel-tailored",
            label: `🎯 Aligned to ${channel.title}`,
            nicheQuery: "channel-tailored",
            desc: `Fresh viral topics tailored to ${channel.title}'s uploads (Under 1 Week)`,
          },
        ]
      : []),
    { id: "Interesting Facts", label: "🧠 Mind-Blowing Facts", nicheQuery: "Interesting Facts", desc: "Viral curiosity & fact shorts topics" },
    { id: "Science & Mysteries", label: "🔬 Science & Mysteries", nicheQuery: "Science & Mysteries", desc: "Unsolved mysteries, Earth & deep science" },
    { id: "Live India Viral", label: "🔥 Live India Viral", nicheQuery: "Live India Viral", desc: "Real-time Google & YouTube trends across India today" },
    { id: "Technology", label: "💻 Tech & AI", nicheQuery: "Technology", desc: "AI, smartphones, and future tech" },
    { id: "Gaming", label: "🎮 Gaming & Esports", nicheQuery: "Gaming", desc: "GTA, BGMI, game secrets & mechanics" },
    { id: "Space & Cosmos", label: "🚀 Space & Cosmos", nicheQuery: "Space", desc: "Black holes, NASA, and universe discoveries" },
  ];

  const fetchTrendingTopics = async (catId: string, isRefresh = false) => {
    setLoading(true);
    try {
      const activeCat = categories.find((c) => c.id === catId);
      const nicheToFetch = activeCat ? activeCat.nicheQuery : catId;
      const endpoint = `/api/studio/trends?niche=${encodeURIComponent(nicheToFetch)}&country=IN&format=${format}&timeframe=7d`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      }
    } catch (err) {
      console.error("Failed to fetch trends:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingTopics(selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, format]);

  const handleWriteScript = (topic: string, oppNiche: string) => {
    router.push(`/trend-script?tab=script&topic=${encodeURIComponent(topic)}&niche=${encodeURIComponent(oppNiche)}&format=${format}&auto=true`);
  };

  const handleCustomScript = (topic: string, oppNiche: string) => {
    router.push(`/trend-script?tab=custom&topic=${encodeURIComponent(topic)}&niche=${encodeURIComponent(oppNiche)}&format=${format}`);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Sleek, Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400">🔥</span>
              <span>YouTube Trend Radar</span>
            </h1>
            <Badge variant="warning" className="text-[10px] uppercase font-bold py-0.5">
              Live Trends
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time viral topics aur breakout ideas jo abhi YouTube & Google par trend kar rahe hain.
          </p>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Info className="h-3.5 w-3.5 text-brand-400" />
            <span>{showGuide ? "Close Guide" : "Kaise Use Karein?"}</span>
          </button>

          {connected && channel && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/70 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Channel:</span>
              <strong className="text-white truncate max-w-[120px]">{channel.title}</strong>
            </div>
          )}

          <Link href="/trend-script">
            <Button variant="primary" size="sm" className="text-xs font-semibold gap-1.5 shadow-md shadow-brand-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Script Studio</span>
            </Button>
          </Link>

          <Link href="/trend-script?tab=custom">
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 shadow-sm">
              <FileText className="h-3.5 w-3.5" />
              <span>Custom Script</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Optional Collapsible Creator Guide (Closed by default so NO clutter) */}
      {showGuide && (
        <div className="p-3.5 rounded-xl border border-brand-500/30 bg-brand-950/30 text-xs text-slate-300 space-y-2 relative animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => setShowGuide(false)}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <strong className="text-white block font-semibold">⚡ Quick 2-Step Workflow:</strong>
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li>Niche select karke trending topic dekhein (Live India Trending ya Niche topics).</li>
            <li>Topic ke saamne <strong>&ldquo;Write Script&rdquo;</strong> dabayein — Script Studio khul kar turant 8-stage viral script likh dega.</li>
          </ol>
        </div>
      )}

      {/* Live Custom Topic Research Search Bar */}
      <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 shadow-inner">
        <form onSubmit={handleExecuteSearch} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Live Research: Type any niche or topic (e.g. Science Experiments, Photosynthesis, Black Holes, AI, BGMI...)"
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              variant="primary"
              size="sm"
              className="w-full sm:w-auto text-xs font-semibold gap-1.5"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5 text-amber-300" />}
              <span>⚡ Live Research</span>
            </Button>
            {activeSearchLabel && (
              <Button
                type="button"
                onClick={handleClearSearch}
                variant="outline"
                size="sm"
                className="text-xs text-slate-400 hover:text-white"
              >
                Reset
              </Button>
            )}
          </div>
        </form>

        {activeSearchLabel && (
          <div className="mt-2 flex items-center justify-between text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
            <span>{activeSearchLabel}</span>
            <span className="text-emerald-400 font-mono">● Real-time Google &amp; YouTube Trend Engine Live</span>
          </div>
        )}
      </div>

      {/* Horizontal Category Selector + Format Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm font-bold"
                    : "bg-surface-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Format Selector + Refresh */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFormat("shorts")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                format === "shorts" ? "bg-brand-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Shorts (9:16)
            </button>
            <button
              type="button"
              onClick={() => setFormat("longform")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                format === "longform" ? "bg-brand-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Long (16:9)
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTrendingTopics(selectedCategory, true)}
            disabled={loading}
            className="text-xs h-8 px-2.5 border-slate-800 text-slate-300 hover:bg-slate-800"
            title="Refresh topics"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* 3x Daily Auto-Refresh Sync Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-white">3x Daily Auto-Sync:</strong> ☀️ Subah • 🌤️ Dopahar 2:00 PM • 🌙 Raat 12:00 AM (Midnight Reset)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-300 font-semibold font-mono">
            {report?.refreshSchedule?.slotLabel || "Active Batch"}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Next Sync: <strong className="text-slate-200">{report?.refreshSchedule?.nextRefreshTime || "Dopahar 2:00 PM"}</strong>
          </span>
        </div>
      </div>

      {/* TRENDING TOPIC CARDS GRID (IMMEDIATELY VISIBLE ON SCREEN) */}
      {loading ? (
        <div className="py-24 text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400 mx-auto" />
          <p className="text-sm font-medium text-slate-300">Fetching Real YouTube Trending Topics...</p>
        </div>
      ) : report && report.opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {report.opportunities.map((opp, idx) => {
            const viewsPerDay = opp.evidence?.avgHistoricalViewsPerDay || 50000;
            const sampleVid = opp.evidence?.sampleVideos?.[0];
            const isLive = selectedCategory === "Live India Viral";

            return (
              <Card
                key={opp.id}
                className="border-slate-800/90 bg-surface-900/95 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between overflow-hidden group"
              >
                <CardContent className="p-4 space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        #{idx + 1}
                      </span>

                      <Badge
                        variant={opp.classification === "Breakout Candidate" ? "default" : "secondary"}
                        className="text-[9px] py-0 font-semibold"
                      >
                        {opp.classification}
                      </Badge>

                      <Badge variant="warning" className="text-[9px] py-0 font-bold gap-1">
                        <Flame className="h-2.5 w-2.5" />
                        <span>
                          {isLive ? `~${viewsPerDay.toLocaleString()} searches today` : `~${viewsPerDay.toLocaleString()} views/day`}
                        </span>
                      </Badge>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      Score: <strong className="text-brand-300">{opp.score}</strong>/100
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                    {opp.topic}
                  </h3>

                  {/* Content Gap & Winning Angle (Clear, Concise) */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold shrink-0">🎯 Angle:</span>
                      <p className="line-clamp-2 text-[11px] text-slate-300">
                        {opp.contentGap.unaddressedAngle || opp.contentGap.description}
                      </p>
                    </div>
                  </div>

                  {/* Sample Context or Thumbnail */}
                  {sampleVid && (
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span className="truncate max-w-[240px]">
                        Source: <strong className="text-slate-300">{sampleVid.channelTitle}</strong>
                      </span>
                      <a
                        href={sampleVid.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                      >
                        <span>Search YouTube</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {/* Dual Action Buttons: AI Script & Custom Script */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleWriteScript(opp.topic, opp.niche)}
                      className="w-full text-xs font-bold gap-1.5 bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white shadow-md shadow-brand-500/15 h-8"
                    >
                      <Zap className="h-3.5 w-3.5 fill-white" />
                      <span>⚡ AI Write Script</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCustomScript(opp.topic, opp.niche)}
                      className="w-full text-xs font-bold gap-1.5 border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/10 h-8"
                    >
                      <FileText className="h-3.5 w-3.5 text-emerald-400" />
                      <span>✍️ Custom Script</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-slate-800 bg-surface-900/80 p-8 text-center">
          <Flame className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-200">No Topics Loaded</h3>
          <p className="text-xs text-slate-400 mt-1 mb-3">Click refresh to load trending topics for {selectedCategory}.</p>
          <Button variant="primary" size="sm" onClick={() => fetchTrendingTopics(selectedCategory, true)} className="text-xs">
            Load Topics Now
          </Button>
        </Card>
      )}
    </div>
  );
}
