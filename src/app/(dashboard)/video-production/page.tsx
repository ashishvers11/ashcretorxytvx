import { Video, Film, Sliders, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VideoProductionPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Video Production</h1>
          <p className="text-sm text-slate-400 mt-1">
            Convert approved voiceovers into scene-by-scene visual choreography and video motion prompts.
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 py-1">
          <Film className="h-3.5 w-3.5 text-brand-400" />
          Scene Director
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1">
          <div className="flex items-center gap-2 mb-4 font-semibold text-white">
            <Sliders className="h-4 w-4 text-brand-400" />
            Style Settings
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Visual DNA adapts to your connected channel format (e.g. Handmade Paper Cut-Out, 3D Animation, or Cinematic Documentary).
          </p>
          <div className="p-3 rounded-lg bg-surface-950 border border-slate-800 text-xs text-slate-300">
            Aspect Ratio: <span className="font-semibold text-brand-400">9:16 (Shorts)</span>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4 font-semibold text-white">
            <Layers className="h-4 w-4 text-brand-400" />
            Timeline Choreography Preview
          </div>
          <div className="border border-dashed border-slate-800 rounded-lg p-8 text-center text-slate-400 text-xs">
            Generate or select a script in Script Studio to load cinematic scenes, Midjourney image prompts, and Runway motion instructions.
          </div>
        </Card>
      </div>
    </div>
  );
}
