"use client";

import * as React from "react";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  TrendingUp,
  Sparkles,
  PenTool,
  Film,
  Search,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

interface DailyTrendItem {
  id: string;
  topic: string;
  category: string;
  whyRelevant: string;
  freshness: "Breakout (Today)" | "Surging (24h)" | "High Velocity" | "Evergreen";
  demandEvidence: string;
  source: string;
  suggestedAngle: string;
  visualStyle: string;
}

export function DailyTrendOverview() {
  const { channel, activeChannelStyle } = useAuth();
  const channelTitle = channel?.channel_title || "Your Channel";
  const niche = activeChannelStyle?.channelNiche || "Curiosity & Education";
  const styleLabel = activeChannelStyle?.visualStyleLabel || "Cinematic 3D";

  // Channel-DNA aware daily trends (PRD 3.2.C)
  const dailyTrends: DailyTrendItem[] = React.useMemo(() => {
    const titleLower = channelTitle.toLowerCase();
    const isKids = titleLower.includes("kid") || titleLower.includes("curio") || activeChannelStyle?.visualAnimationStyle === "pixar_3d";
    const isPaper = activeChannelStyle?.visualAnimationStyle === "paper_cutout" || titleLower.includes("paper") || titleLower.includes("craft");
    const isAsmr = activeChannelStyle?.visualAnimationStyle === "asmr_satisfying" || titleLower.includes("asmr");

    if (isKids || isPaper) {
      return [
        {
          id: "trend-1",
          topic: "What Happens If You Fall Into a Black Hole?",
          category: "Space & Astrophysics",
          whyRelevant: `Matches ${channelTitle}'s young curious minds audience looking for visual space mysteries.`,
          freshness: "Breakout (Today)",
          demandEvidence: "420K+ search velocity this week on YouTube Kids/Edu",
          source: "NASA Astrophysics Data System & James Webb Updates",
          suggestedAngle: "Time-dilation visual comparison showing what the outside observer sees vs what the falling astronaut experiences.",
          visualStyle: styleLabel,
        },
        {
          id: "trend-2",
          topic: "Why Can't Humans Breathe Underwater Like Fish?",
          category: "Biology & Anatomy",
          whyRelevant: "High click-through curiosity question popular among primary school and teenage learners.",
          freshness: "Surging (24h)",
          demandEvidence: "+310% search volume jump in education and science tags",
          source: "Marine Biology Institute & National Geographic Kids",
          suggestedAngle: "Animated side-by-side: Human lung alveoli vs fish gill lamellae extracting dissolved oxygen molecules.",
          visualStyle: styleLabel,
        },
        {
          id: "trend-3",
          topic: "How Was the Great Pyramid of Giza Actually Built?",
          category: "Ancient Engineering",
          whyRelevant: "Top recurring viral history topic with new archaeological thermal-scanning discoveries.",
          freshness: "High Velocity",
          demandEvidence: "1.2M collective monthly search queries across global YouTube",
          source: "Nature Archaeological Reports & British Museum Archive",
          suggestedAngle: "Internal water ramp & wet-sand friction reduction physics debunking alien construction myths.",
          visualStyle: styleLabel,
        },
      ];
    }

    if (isAsmr) {
      return [
        {
          id: "trend-asmr-1",
          topic: "How Bismuth Crystals Grow Into Rainbow Geometries",
          category: "Crystallography",
          whyRelevant: "Hypnotic visual oxidation layers perfect for high-retention macro cinematography.",
          freshness: "Breakout (Today)",
          demandEvidence: "540K weekly views on satisfying chemistry Shorts",
          source: "Journal of Crystal Growth & Materials Science",
          suggestedAngle: "Step-by-step molten cooling with extreme macro shots showing hopper stepped pyramids forming in real time.",
          visualStyle: "Satisfying ASMR",
        },
        {
          id: "trend-asmr-2",
          topic: "What Extreme Pressure Does to Diamond vs Tungsten",
          category: "Material Science",
          whyRelevant: "High curiosity retention benchmark: hydraulic compression with crisp audio dynamics.",
          freshness: "Surging (24h)",
          demandEvidence: "+280% momentum in tactile science explainers",
          source: "Materials Physics Research Lab",
          suggestedAngle: "Microscopic stress-strain rupture points captured with slow-motion fluid and fracture resonance.",
          visualStyle: "Satisfying ASMR",
        },
      ];
    }

    // Default General Science / Tech / Curiosity
    return [
      {
        id: "trend-gen-1",
        topic: "Why Are Commercial Airplanes Painted White?",
        category: "Aviation Physics & Engineering",
        whyRelevant: `Everyday curiosity question with high retention and universal global appeal for ${channelTitle}.`,
        freshness: "Breakout (Today)",
        demandEvidence: "850K+ monthly searches with 84% mobile CTR",
        source: "Federal Aviation Administration (FAA) & Boeing Engineering Reports",
        suggestedAngle: "Solar heat thermal management, composite UV protection, bird strike visibility, and maintenance economics.",
        visualStyle: styleLabel,
      },
      {
        id: "trend-gen-2",
        topic: "Why Does Time Move Slower on Satellites?",
        category: "General Relativity",
        whyRelevant: "Evergreen breakthrough science topic explaining everyday GPS smartphone accuracy.",
        freshness: "Surging (24h)",
        demandEvidence: "+195% search volume across STEM learner demographics",
        source: "Einstein Gravitational Time Dilation & GPS Joint Program Office",
        suggestedAngle: "How your Google Maps would drift 11km every day without Einstein's time dilation equations.",
        visualStyle: styleLabel,
      },
      {
        id: "trend-gen-3",
        topic: "How Deep Sea Creatures Survive Crushing Ocean Pressure",
        category: "Deep Sea Oceanography",
        whyRelevant: "High visual contrast topic with intense curiosity hooks about Mariana Trench biology.",
        freshness: "High Velocity",
        demandEvidence: "670K views on high-production deep ocean documentaries",
        source: "NOAA Ocean Exploration & Woods Hole Oceanographic Institution",
        suggestedAngle: "Cellular piezolyte proteins that prevent cell membranes from collapsing under 1,000 atmospheres.",
        visualStyle: styleLabel,
      },
    ];
  }, [channelTitle, activeChannelStyle, styleLabel]);

  return (
    <Card className="border-slate-200/80 dark:border-navy-800">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <span>Daily Trend Overview</span>
                <Badge variant="brand" className="text-[10px] py-0 px-1.5">
                  Live Radar
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Researched breakout topics aligned with {channelTitle} ({niche})
              </CardDescription>
            </div>
          </div>

          <Link
            href="/modules/trend-research"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore Full Trend Radar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {dailyTrends.map((trend) => (
            <div
              key={trend.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-navy-800/80 bg-slate-50/50 dark:bg-navy-900/40 p-4 transition-all hover:border-brand-500/40 hover:shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 truncate">
                    {trend.category}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold shrink-0"
                  >
                    {trend.freshness}
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {trend.topic}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Angle:</span> {trend.suggestedAngle}
                </p>

                <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-navy-800/60 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="truncate">Demand:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-right truncate">
                      {trend.demandEvidence}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="truncate">Source:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                      {trend.source}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: One-click "Write Script" (PRD 1.1 step 7) */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-navy-800/60 flex items-center gap-2">
                <Link
                  href={`/modules/script-writer?topic=${encodeURIComponent(trend.topic)}&style=${encodeURIComponent(activeChannelStyle?.visualAnimationStyle || "stickman_doodle")}`}
                  className="w-full"
                >
                  <Button
                    size="sm"
                    className="w-full gap-1.5 text-xs bg-brand-500 hover:bg-brand-600 font-bold text-white shadow-sm"
                  >
                    <PenTool className="h-3.5 w-3.5" />
                    <span>Write Script</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
