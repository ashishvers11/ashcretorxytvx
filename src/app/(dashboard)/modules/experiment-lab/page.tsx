"use client";

import * as React from "react";
import {
  FlaskConical,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ExperimentLabPage() {
  const [activeTab, setActiveTab] = React.useState<"active" | "create">("active");

  const [titleA, setTitleA] = React.useState("लौंग क्या होता है? (Facts about Clove)");
  const [titleB, setTitleB] = React.useState("लौंग असल में फूल है या फल? (99% लोग गलत जवाब देते हैं)");

  const [ctrA, setCtrA] = React.useState(5.4);
  const [ctrB, setCtrB] = React.useState(9.2);

  const uplift = Math.round(((ctrB - ctrA) / ctrA) * 100);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Packaging Experiment Lab (A/B Testing)
            </h2>
            <Badge variant="brand">Statistical Engine</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulate and evaluate title & thumbnail A/B variations to identify high-converting packaging
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === "active" ? "primary" : "outline"}
            onClick={() => setActiveTab("active")}
            className="text-xs"
          >
            Live Tests (1)
          </Button>
          <Button
            size="sm"
            variant={activeTab === "create" ? "primary" : "outline"}
            onClick={() => setActiveTab("create")}
            className="text-xs gap-1.5"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Experiment</span>
          </Button>
        </div>
      </div>

      {/* Main Experiment Showcase */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Test: Title Curiosity Gap vs Descriptive Statement
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tested across 10,000 simulated search & browse impressions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success">96.8% Statistical Significance</Badge>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Variant A */}
          <div className="rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 p-5 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Variant A (Descriptive)
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                5,000 Impressions
              </span>
            </div>

            <div className="aspect-video w-full rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-semibold overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80"
                alt=""
                className="h-full w-full object-cover opacity-80"
              />
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              "{titleA}"
            </h4>

            <div className="pt-2 border-t border-slate-200 dark:border-navy-800 flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Measured CTR:</span>
              <span className="text-xl font-black text-slate-700 dark:text-slate-300">
                {ctrA}%
              </span>
            </div>
          </div>

          {/* Variant B (Winner) */}
          <div className="rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/15 p-5 space-y-3 relative shadow-md shadow-emerald-500/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                Variant B (Clear Winner)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-500">
                5,000 Impressions
              </span>
            </div>

            <div className="aspect-video w-full rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-semibold overflow-hidden ring-2 ring-emerald-500/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80"
                alt=""
                className="h-full w-full object-cover contrast-125"
              />
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              "{titleB}"
            </h4>

            <div className="pt-2 border-t border-emerald-500/20 flex items-baseline justify-between">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Measured CTR:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-500">
                  {ctrB}%
                </span>
                <span className="text-xs font-bold text-emerald-500">
                  (+{uplift}% Lift)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Experiment Takeaway */}
        <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 dark:bg-brand-950/20 p-4 space-y-1">
          <h5 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            Algorithmic Takeaway:
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Framing the title as a personal narrative with an open curiosity loop ("...and This Happened") generated +59% more clicks than the factual descriptive phrasing.
          </p>
        </div>
      </Card>
    </div>
  );
}
