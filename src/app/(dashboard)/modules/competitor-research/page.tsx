"use client";

import * as React from "react";
import {
  Users2,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Flame,
  PlusCircle,
  Eye,
  CheckCircle2,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

export default function CompetitorResearchPage() {
  const { channel } = useAuth();
  const [competitors, setCompetitors] = React.useState([
    {
      id: 1,
      name: "GetsetflySCIENCE by Gaurav Thakur",
      handle: "@GetsetflySCIENCE",
      subscribers: "7.2M",
      avgViews: "450K",
      uploadRate: "2 videos/week",
      outlierVideo: "अगर धरती 5 सेकंड के लिए घूमना बंद कर दे तो क्या होगा?",
      outlierViews: "4.8M views (10.6x Channel Average)",
      outlierAngle: "Curiosity gap thumbnail with red arrow pointing at earth equator and high-stakes physics simulation.",
    },
    {
      id: 2,
      name: "FactTechz",
      handle: "@FactTechz",
      subscribers: "17.5M",
      avgViews: "850K",
      uploadRate: "1 video/week",
      outlierVideo: "क्या पौधे सच में दर्द महसूस करते हैं? Scientific Truth",
      outlierViews: "9.2M views (10.8x Channel Average)",
      outlierAngle: "Macro microscope image with emotional curiosity title challenging conventional belief.",
    },
    {
      id: 3,
      name: "Kurzgesagt Hindi",
      handle: "@kurzgesagthindi",
      subscribers: "1.4M",
      avgViews: "280K",
      uploadRate: "1 video/month",
      outlierVideo: "हवाई जहाज का रंग हमेशा सफेद क्यों होता है?",
      outlierViews: "2.6M views (9.2x Channel Average)",
      outlierAngle: "Minimalist bold vector graphic contrasting white vs black airplane with thermal heat map.",
    },
  ]);

  const [newHandle, setNewHandle] = React.useState("");

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle.trim()) return;

    const handle = newHandle.trim().startsWith("@") ? newHandle.trim() : `@${newHandle.trim()}`;
    const cleanName = handle.replace("@", "").toUpperCase();

    setCompetitors([
      {
        id: Date.now(),
        name: cleanName,
        handle,
        subscribers: "120K",
        avgViews: "25K",
        uploadRate: "2 videos/week",
        outlierVideo: "शीर्ष 5 विज्ञान रहस्य जो स्कूल में नहीं पढ़ाए जाते",
        outlierViews: "180K views (7.2x Channel Average)",
        outlierAngle: "High-contrast listicle packaging with curiosity hook.",
      },
      ...competitors,
    ]);
    setNewHandle("");
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Competitor Intelligence & Outlier Radar
          </h2>
          <Badge variant="brand">Education & Facts Benchmark</Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Reverse-engineer breakthrough packaging and identify topics driving 10x viral reach in Education & Science
        </p>
      </div>

      {/* Add Competitor Bar */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-4 bg-white dark:bg-navy-900">
        <form onSubmit={handleAddCompetitor} className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Add educational competitor channel link or @handle (e.g. @dhruvrathee, @FactTechz)"
            value={newHandle}
            onChange={(e) => setNewHandle(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="gap-2 text-xs shrink-0 bg-brand-500 hover:bg-brand-600">
            <PlusCircle className="h-4 w-4" />
            <span>Track Competitor</span>
          </Button>
        </form>
      </Card>

      {/* Competitors List */}
      <div className="space-y-4">
        {competitors.map((comp) => (
          <Card
            key={comp.id}
            className="border-slate-200/80 dark:border-navy-800 p-5 sm:p-6 hover:border-brand-500/40 transition-colors bg-white dark:bg-navy-900"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white font-extrabold text-lg shadow-md">
                  {comp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {comp.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {comp.handle} • {comp.subscribers} Subscribers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Average Views
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {comp.avgViews}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Velocity
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {comp.uploadRate}
                  </span>
                </div>
              </div>
            </div>

            {/* Outlier Video Insight */}
            <div className="mt-4 rounded-xl bg-slate-50 dark:bg-navy-950 p-4 border border-slate-100 dark:border-navy-800/80 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="brand" className="text-[10px]">
                    10x Outlier Hit
                  </Badge>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    "{comp.outlierVideo}"
                  </h5>
                </div>
                <span className="text-xs font-black text-emerald-500 shrink-0">
                  {comp.outlierViews}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-700 dark:text-slate-300">Why it worked: </strong>
                {comp.outlierAngle}
              </p>

              <div className="pt-2 flex items-center justify-end">
                <Link href={`/modules/script-writer?title=${encodeURIComponent(comp.outlierVideo)}`}>
                  <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
                    <PenTool className="h-3 w-3" />
                    <span>Generate Better Script for {channel?.channel_title || "Your Channel"}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
