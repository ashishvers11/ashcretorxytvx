import { Image as ImageIcon, Sparkles, Layers, Sliders } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ThumbnailStudioPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Thumbnail Studio</h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual thumbnail concepts, Midjourney/Flux generation prompts, and text overlays.
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 py-1">
          <ImageIcon className="h-3.5 w-3.5 text-brand-400" />
          Click Intelligence
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1">
          <div className="flex items-center gap-2 mb-4 font-semibold text-white">
            <Sliders className="h-4 w-4 text-brand-400" />
            Packaging Rules
          </div>
          <ul className="text-xs text-slate-400 space-y-2.5">
            <li>• Maximum 3 to 4 words of on-screen text</li>
            <li>• High-contrast focal point with rule of thirds</li>
            <li>• Emotional facial expression or intriguing object</li>
            <li>• 16:9 widescreen or 9:16 Shorts thumbnail format</li>
          </ul>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4 font-semibold text-white">
            <Layers className="h-4 w-4 text-brand-400" />
            Prompt & Concept Canvas
          </div>
          <div className="border border-dashed border-slate-800 rounded-lg p-10 text-center text-slate-400 text-xs">
            Connect a video topic from Script Studio to generate 3 high-CTR visual thumbnail concepts and Midjourney prompts.
          </div>
        </Card>
      </div>
    </div>
  );
}
