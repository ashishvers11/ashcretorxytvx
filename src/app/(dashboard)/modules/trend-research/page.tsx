"use client";

import * as React from "react";
import {
  Flame,
  Search,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Lightbulb,
  PenTool,
  Palette,
  Film,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recommendStyleForTopic } from "@/lib/ai/video-prompt-engine";

interface TrendItem {
  keyword: string;
  volume: string;
  growth: string;
  competition: "Low" | "Medium" | "High";
  category: "science" | "curiosity" | "health" | "space";
  badge: "Breakout" | "Viral Trend" | "High Intent" | "Evergreen";
  angle: string;
}

export default function TrendResearchPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<"all" | "science" | "curiosity" | "health" | "space">("all");
  const [trends, setTrends] = React.useState<TrendItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [source, setSource] = React.useState<string>("curated_education");

  // Fetch live YouTube trends
  const fetchTrends = React.useCallback(async (query: string = "", cat: string = "all") => {
    setIsLoading(true);
    try {
      const url = `/api/youtube/trends?query=${encodeURIComponent(query)}&category=${encodeURIComponent(cat)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.trends)) {
        setTrends(data.trends);
        setSource(data.source || "youtube_live");
      }
    } catch (err) {
      console.error("Failed to load trends:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTrends("", selectedCategory);
  }, [fetchTrends, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrends(searchQuery, selectedCategory);
  };

  const quickSeeds = [
    "लौंग फूल है या फल",
    "Science Facts Hindi",
    "हवाई जहाज का रंग सफेद क्यों",
    "क्या पौधे दर्द महसूस करते हैं",
    "Space Mysteries Hindi",
    "Daily Life Curiosities",
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Real-Time YouTube Trend Radar
            </h2>
            <Badge variant="brand">Live YouTube API</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Uncover high-velocity search queries in Education, Science Facts & Curiosities before competitors
          </p>
        </div>

        <Link href="/modules/video-ideas">
          <Button size="sm" className="gap-2 text-xs">
            <Lightbulb className="h-4 w-4" />
            <span>Generate Video Ideas</span>
          </Button>
        </Link>
      </div>

      {/* Quick Search Seeds */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-4 space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          🔥 Live YouTube Autocomplete Seeds (Click to inspect live trends):
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          {quickSeeds.map((seed) => (
            <button
              key={seed}
              onClick={() => {
                setSearchQuery(seed);
                fetchTrends(seed, selectedCategory);
              }}
              className={`px-3 py-1 text-xs rounded-lg border text-left transition-all ${
                searchQuery === seed
                  ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-semibold"
                  : "border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {seed}
            </button>
          ))}
        </div>
      </Card>

      {/* Search & Filter Bar */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search science queries, biology, mysteries, facts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs w-full sm:w-auto justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: "all", label: "All Topics" },
                { id: "science", label: "Science Facts" },
                { id: "curiosity", label: "Daily Curiosities" },
                { id: "space", label: "Space & Physics" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedCategory(f.id as any)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                    selectedCategory === f.id
                      ? "bg-brand-500 text-white font-semibold"
                      : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <Button type="submit" size="sm" isLoading={isLoading} className="gap-1.5 text-xs shrink-0">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Search Live</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Real-time Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {source === "youtube_live_api"
              ? `Live YouTube Suggest API query results for "${searchQuery}"`
              : "Showing curated high-retention Education & Science trends"}
          </span>
        </span>
        <span>{trends.length} Trending Opportunities</span>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trends.map((item, idx) => (
          <Card
            key={idx}
            className="border-slate-200/80 dark:border-navy-800 hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between p-5 bg-white dark:bg-navy-900"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    item.badge === "Breakout" || item.badge === "Viral Trend"
                      ? "brand"
                      : "default"
                  }
                  className="text-[10px]"
                >
                  {item.badge}
                </Badge>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {item.growth}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {item.keyword}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {item.angle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-navy-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Search Volume</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.volume}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Competition</span>
                  <span
                    className={`font-semibold ${
                      item.competition === "Low"
                        ? "text-emerald-500"
                        : item.competition === "Medium"
                        ? "text-amber-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.competition} (Favorable)
                  </span>
                </div>
              </div>

              {/* Recommended Visual Style Pill */}
              {(() => {
                const rec = recommendStyleForTopic(item.keyword);
                return (
                  <div className="rounded-lg bg-slate-50 dark:bg-navy-950 p-2 border border-slate-100 dark:border-navy-800 flex items-center justify-between text-[11px] gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      {rec.previewImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rec.previewImage}
                          alt={rec.name}
                          className="h-4 w-6 rounded object-cover shrink-0 border border-slate-200 dark:border-navy-700"
                        />
                      ) : (
                        <Palette className="h-3 w-3 text-brand-500 shrink-0" />
                      )}
                      <span className="text-slate-400 text-[10px]">Style:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {rec.name.split("(")[0].trim()}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 shrink-0">
                      {rec.badge}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Actions: Direct link to AI Video Studio and SEO Studio */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between gap-2">
              <Link
                href={`/modules/script-writer?title=${encodeURIComponent(item.keyword)}&style=${recommendStyleForTopic(item.keyword).id}`}
                className="flex-1"
              >
                <Button size="sm" className="w-full gap-1.5 text-xs bg-brand-500 hover:bg-brand-600 font-bold">
                  <Film className="h-3.5 w-3.5" />
                  <span>Create AI Video Prompts</span>
                </Button>
              </Link>

              <Link href={`/modules/seo-studio?title=${encodeURIComponent(item.keyword)}`}>
                <Button size="sm" variant="outline" className="text-xs px-2.5" title="Optimize SEO & Tags">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
