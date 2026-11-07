import { Flame, Sparkles, Wand2, Compass } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function TrendScriptPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Trend Research & Script Studio</h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover validated curiosity topics and author researched, fact-checked scripts.
          </p>
        </div>
        <Badge variant="default" className="gap-1.5 py-1">
          <Sparkles className="h-3.5 w-3.5" />
          Script Engine V2 Ready
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Input Console */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Compass className="h-4 w-4 text-brand-400" />
              Topic Input
            </CardTitle>
            <CardDescription>Enter a curiosity topic or select from researched trends.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400 mb-1.5 block">
                Target Topic
              </label>
              <Input placeholder="e.g. Why are passenger airplanes white?" defaultValue="Dinosaur extinction" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400 mb-1.5 block">
                Target Duration
              </label>
              <Input type="number" defaultValue={55} />
            </div>
            <Button variant="primary" className="w-full gap-2 mt-2">
              <Wand2 className="h-4 w-4" />
              Generate Script
            </Button>
          </CardContent>
        </Card>

        {/* Right: Stage Preview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              Multi-Stage Intelligence Pipeline
            </CardTitle>
            <CardDescription>
              Separate research, planning, writing, editing, and quality validation stages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { stage: "Stage 1", name: "Topic Understanding Engine", desc: "Builds structured TopicBrief with learning outcomes." },
                { stage: "Stage 2", name: "Topic Research Engine", desc: "Retrieves authoritative Tier 1 & Tier 2 citations." },
                { stage: "Stage 3", name: "Fact Verification", desc: "Confirms evidence and eliminates internet myths." },
                { stage: "Stage 4", name: "Story Architect", desc: "Creates 6-beat narrative blueprint." },
                { stage: "Stage 5", name: "Hook Intelligence", desc: "Selects verified high-retention curiosity hook." },
                { stage: "Stage 6", name: "Human Scriptwriter", desc: "Composes voiceovers at natural speaking cadence." },
              ].map((s) => (
                <div key={s.stage} className="flex items-center justify-between p-3 rounded-lg bg-surface-950 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="secondary">{s.stage}</Badge>
                    <span className="font-semibold text-slate-200">{s.name}</span>
                  </div>
                  <span className="text-slate-400">{s.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
