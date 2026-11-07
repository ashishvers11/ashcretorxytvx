import Link from "next/link";
import { Youtube, Sparkles, ArrowRight, Flame, BarChart3, Video } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-surface-900 via-surface-900 to-brand-950/40 p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="default" className="mb-3">
            ASH Creator Studio 2.0
          </Badge>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Creator Mission Control
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Connect your verified YouTube channel to activate personalized style DNA, discover validated trends, generate structured scripts, and direct cinematic video scenes.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/channel-audit">
              <Button variant="primary" className="gap-2">
                <Youtube className="h-4 w-4" />
                Connect YouTube Channel
              </Button>
            </Link>
            <Link href="/trend-script">
              <Button variant="secondary" className="gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" />
                Explore Script Engine
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Core Workflow Pillars */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span>End-to-End Content Pipeline</span>
          <span className="text-xs text-slate-500 font-normal">(8 Core Modules)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center mb-2">
                <BarChart3 className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">1. Channel Audit</CardTitle>
              <CardDescription>
                Analyze verified subscriber metrics, view velocity, and audience benchmarks directly via the official YouTube integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/channel-audit" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium">
                Open Channel Audit <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <Flame className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">2. Trend Research + Script</CardTitle>
              <CardDescription>
                Discover niche-relevant curiosity topics and write multi-stage verified scripts with zero hallucinations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/trend-script" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium">
                Open Script Studio <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-slate-700 transition-all">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                <Video className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">3. Video Production</CardTitle>
              <CardDescription>
                Convert approved voiceovers into cinematic scene choreography with matching Runway and Midjourney prompts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/video-production" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
                Open Video Director <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
