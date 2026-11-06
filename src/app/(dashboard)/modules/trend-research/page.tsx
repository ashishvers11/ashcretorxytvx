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
  Dna,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { recommendStyleForTopic } from "@/lib/ai/video-prompt-engine";

interface TrendItem {
  keyword: string;
  volume: string;
  growth: string;
  competition: "Low" | "Medium" | "High";
  category: string;
  badge: "Breakout" | "Viral Trend" | "High Intent" | "Evergreen";
  angle: string;
}

export default function TrendResearchPage() {
  const { channel, activeChannelStyle, isLoading: authLoading } = useAuth();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [trends, setTrends] = React.useState<TrendItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [source, setSource] = React.useState<string>("channel_curated");

  const channelTitle = channel?.channel_title || "";
  const niche = activeChannelStyle?.channelNiche || "";
  const style = (activeChannelStyle?.visualAnimationStyle || "") as string;

  const isPaper =
    style === "paper_cutout" ||
    (!style &&
      (channelTitle.toLowerCase().includes("paper") ||
        channelTitle.toLowerCase().includes("craft") ||
        niche.toLowerCase().includes("paper") ||
        niche.toLowerCase().includes("history")));

  const isKids =
    style === "pixar_3d" ||
    style === "animation_2d" ||
    (!style &&
      (channelTitle.toLowerCase().includes("kid") ||
        channelTitle.toLowerCase().includes("cartoon") ||
        channelTitle.toLowerCase().includes("story") ||
        niche.toLowerCase().includes("kid") ||
        niche.toLowerCase().includes("animation") ||
        niche.toLowerCase().includes("family")));

  const isAsmr =
    style === "asmr_satisfying" ||
    (!style &&
      (channelTitle.toLowerCase().includes("asmr") ||
        channelTitle.toLowerCase().includes("satisfying") ||
        niche.toLowerCase().includes("asmr")));

  const isStickman =
    style === "stickman_doodle" ||
    (!style &&
      (channelTitle.toLowerCase().includes("stickman") ||
        channelTitle.toLowerCase().includes("doodle")));

  const isNoir =
    style === "noir_mystery" ||
    (!style &&
      (channelTitle.toLowerCase().includes("mystery") ||
        channelTitle.toLowerCase().includes("horror") ||
        niche.toLowerCase().includes("mystery")));

  // Fetch live YouTube trends with channel intelligence parameters
  const fetchTrends = React.useCallback(
    async (query: string = "", cat: string = "all") => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (cat) params.set("category", cat);
        if (channelTitle) params.set("channelTitle", channelTitle);
        if (niche) params.set("niche", niche);
        if (style) params.set("style", style);

        const res = await fetch(`/api/youtube/trends?${params.toString()}`);
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
    },
    [channelTitle, niche, style]
  );

  React.useEffect(() => {
    if (authLoading) return;
    fetchTrends(searchQuery, selectedCategory);
  }, [fetchTrends, authLoading, selectedCategory, channel?.id, activeChannelStyle?.visualAnimationStyle, activeChannelStyle?.channelNiche]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrends(searchQuery, selectedCategory);
  };

  // Channel-Aware Quick Autocomplete Seeds (dynamically uses channel's own researched topics)
  const quickSeeds = React.useMemo(() => {
    if (activeChannelStyle?.popularTopics && activeChannelStyle.popularTopics.length > 0) {
      return activeChannelStyle.popularTopics.slice(0, 6).map((t) => t.replace(/\(.*?\)/g, "").trim());
    }
    if (isPaper) {
      return [
        "द ग्रेट लाइब्रेरी ऑफ अलेक्जेंड्रिया",
        "रोम की 9वीं सेना का रहस्य",
        "वाइकिंग्स का जादुई सनस्टोन",
        "सिंधु घाटी सभ्यता का सच",
        "ताजमहल के 22 बंद कमरे",
        "पिरामिड बनाने वालों की डायरी",
      ];
    }
    if (isKids) {
      return [
        "शेर और खरगोश की कहानी",
        "डायनासोर कैसे गायब हुए",
        "चींटी की ताकत का रहस्य",
        "आसमान नीला क्यों होता है",
        "चाँद दिन में क्यों दिखता है",
        "इंद्रधनुष के जादुई 7 रंग",
      ];
    }
    if (isAsmr) {
      return [
        "पिघला हुआ बिस्मथ क्रिस्टल",
        "हाइड्रोलिक प्रेस vs स्टील",
        "काइनेटिक सैंड हॉट नाइफ",
        "प्रिंस रूपर्ट ड्रॉप बुलेट",
        "लिक्विड नाइट्रोजन ग्लास",
        "Hypnotic Kinetic Loops",
      ];
    }
    if (isStickman) {
      return [
        "हम काम को कल पर क्यों टालते हैं",
        "स्कूल पैसे का सच क्यों नहीं सिखाते",
        "सोशल मीडिया एल्गोरिदम का जाल",
        "उम्र के साथ समय तेज क्यों बीतता है",
        "80/20 नियम से सुपर सफलता",
        "5 सेकंड में ओवरथिंकिंग बंद",
      ];
    }
    if (isNoir) {
      return [
        "डायटलोव पास पर 9 पर्वतारोहियों की मौत",
        "मैरी सेलेस्टे जहाज का रहस्य",
        "एरिया 51 की डीक्लासिफाइड फाइलें",
        "अमेलिया इयरहार्ट का गायब विमान",
        "बरमूडा ट्रायंगल का सच",
        "वॉयेनिच पांडुलिपि का रहस्य",
      ];
    }
    return [
      "लौंग फूल है या फल",
      "Science Facts Hindi",
      "हवाई जहाज का रंग सफेद क्यों",
      "क्या पौधे दर्द महसूस करते हैं",
      "धरती 5 सेकंड रुक जाए तो",
      "Daily Life Curiosities",
    ];
  }, [activeChannelStyle, isKids, isPaper, isAsmr, isStickman, isNoir]);

  // Categories adapt to channel
  const categories = React.useMemo(() => {
    if (isKids) {
      return [
        { id: "all", label: "All Topics" },
        { id: "kids", label: "Kids Animation" },
        { id: "curiosity", label: "Curious Questions" },
        { id: "animals", label: "Animal Wonders" },
        { id: "stories", label: "Moral Stories" },
      ];
    }
    if (isPaper) {
      return [
        { id: "all", label: "All Topics" },
        { id: "stories", label: "Historical Mysteries" },
        { id: "curiosity", label: "Tactile Paper Craft" },
        { id: "science", label: "Ancient Engineering" },
      ];
    }
    if (isAsmr) {
      return [
        { id: "all", label: "All Topics" },
        { id: "science", label: "Macro Physics" },
        { id: "curiosity", label: "Satisfying Textures" },
      ];
    }
    return [
      { id: "all", label: "All Topics" },
      { id: "science", label: "Science Facts" },
      { id: "curiosity", label: "Daily Curiosities" },
      { id: "space", label: "Space & Physics" },
    ];
  }, [isKids, isPaper, isAsmr]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 max-w-6xl mx-auto px-1 sm:px-0">
      {/* 1. Header & Channel Intelligence Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
              Real-Time YouTube Trend Radar
            </h2>
            <Badge variant="brand" className="text-[10px] shrink-0">
              Live YouTube API
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Uncover high-velocity search queries tailored to your active channel audience before competitors
          </p>
        </div>

        <Link href="/modules/video-ideas" className="self-start sm:self-auto shrink-0">
          <Button size="sm" className="gap-2 text-xs">
            <Lightbulb className="h-4 w-4" />
            <span>Generate Video Ideas</span>
          </Button>
        </Link>
      </div>

      {/* 2. Connected Channel DNA Active Banner */}
      <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 dark:bg-brand-950/20 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-xs shadow-sm">
            {channel?.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={channel.thumbnail_url}
                alt={channel.channel_title}
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <Youtube className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {channel ? channel.channel_title : "No Channel Connected"}
              </span>
              <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 shrink-0">
                Channel Tailored
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {activeChannelStyle
                ? `${activeChannelStyle.visualStyleLabel} • Niche: ${activeChannelStyle.channelNiche}`
                : "Connect a channel to isolate audience trends"}
            </p>
          </div>
        </div>

        <Link href="/modules/style-lab" className="shrink-0 text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1">
          <Dna className="h-3.5 w-3.5" />
          <span>Style DNA Profile →</span>
        </Link>
      </div>

      {/* 3. Quick Search Seeds (Channel-Aware) */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-3.5 sm:p-4 space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-amber-500" />
          <span>Live YouTube Trending Seeds for {channelTitle || "Your Channel"}:</span>
        </span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
          {quickSeeds.map((seed) => (
            <button
              key={seed}
              type="button"
              onClick={() => {
                setSearchQuery(seed);
                fetchTrends(seed, selectedCategory);
              }}
              className={`px-2.5 sm:px-3 py-1 text-xs rounded-lg border text-left transition-all ${
                searchQuery === seed
                  ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-semibold"
                  : "border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {seed}
            </button>
          ))}
        </div>
      </Card>

      {/* 4. Search & Filter Bar (Mobile Optimized) */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-3 sm:p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                isKids
                  ? "Search kids questions, 3D animations, cartoons, moral stories..."
                  : "Search science queries, biology, mysteries, facts..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
              {categories.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedCategory(f.id)}
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

            <Button type="submit" size="sm" isLoading={isLoading} className="gap-1.5 text-xs shrink-0 ml-auto sm:ml-0">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Search Live</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* 5. Real-time Status Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="flex items-center gap-1.5 truncate">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate">
            {source === "youtube_live_api"
              ? `Live YouTube Suggest API query results for "${searchQuery}"`
              : `Showing high-retention trends for ${channelTitle || "Connected Channel"}`}
          </span>
        </span>
        <span className="shrink-0 font-medium">{trends.length} Opportunities</span>
      </div>

      {/* 6. Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {trends.map((item, idx) => (
          <Card
            key={idx}
            className="border-slate-200/80 dark:border-navy-800 hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between p-4 sm:p-5 bg-white dark:bg-navy-900"
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
                // If channel has active style, suggest channel's style or recommended
                const styleType = activeChannelStyle?.visualAnimationStyle;
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

            {/* Actions: Direct link to AI Video Studio */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between gap-2">
              <Link
                href={`/modules/script-writer?title=${encodeURIComponent(item.keyword)}&style=${(activeChannelStyle?.visualAnimationStyle as string) || recommendStyleForTopic(item.keyword).id}`}
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
