"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  Copy,
  Layers,
  Palette,
  ExternalLink,
  Flame,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ThumbnailConcept {
  id: string;
  name: string;
  hookType: "Curiosity Contrast" | "Emotional Subject" | "Epic Scale & Action";
  composition: string;
  focalPoint: string;
  colorScheme: string;
  facialExpression: string;
  textOverlay: string;
  psychologicalTrigger: string;
  aiPromptMidjourney: string;
  aiPromptFlux: string;
  previewUrl: string;
}

function ThumbnailStudioContent() {
  const { channel, activeChannelStyle } = useAuth();
  const searchParams = useSearchParams();
  const titleFromUrl = searchParams.get("title");

  const channelTitle = channel?.channel_title || "Connected Channel";
  const defaultTitle =
    titleFromUrl ||
    activeChannelStyle?.popularTopics?.[0] ||
    "Why Are Most Passenger Airplanes White?";

  const [deviceMode, setDeviceMode] = React.useState<"mobile" | "desktop">("mobile");
  const [feedTheme, setFeedTheme] = React.useState<"dark" | "light">("dark");
  const [title, setTitle] = React.useState(defaultTitle);
  const [selectedConceptIndex, setSelectedConceptIndex] = React.useState<number>(0);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Sync with URL parameter
  React.useEffect(() => {
    if (titleFromUrl) {
      setTitle(titleFromUrl);
    }
  }, [titleFromUrl]);

  const styleLabel = activeChannelStyle?.visualStyleLabel || "Cinematic 3D";

  // PRD Section 8.2: 3 High-CTR AI Thumbnail Concepts
  const concepts: ThumbnailConcept[] = React.useMemo(() => {
    const cleanTopic = title.split("(")[0].trim();
    return [
      {
        id: "concept-1",
        name: "The Curiosity Contrast (Split-Screen / Visual Reveal)",
        hookType: "Curiosity Contrast",
        composition:
          "Split-composition or dramatic contrast: left side shows the common everyday object, right side shows a glowing x-ray or startling truth with vibrant red vs green boundary.",
        focalPoint: "High-contrast glowing revelation in the upper-left two-thirds of the frame.",
        colorScheme: "Vibrant Cyan (#06B6D4) and Neon Amber (#F59E0B) on deep Obsidian Black backdrop.",
        facialExpression: "Shocked/incredulous subtle eye focus, eyebrows arched in revelation.",
        textOverlay: "THE 99% MISTAKE!",
        psychologicalTrigger: "Curiosity Gap & Belief Disruption (Viewer feels challenged to verify their knowledge).",
        aiPromptMidjourney: `/imagine prompt: Cinematic high-contrast YouTube thumbnail, bold split-visual composition of ${cleanTopic}, dramatic studio rim lighting, glowing cyan and amber volumetric rays, 8k resolution, photorealistic depth of field, clean negative space for text --ar 16:9 --style raw --v 6.1`,
        aiPromptFlux: `Ultra-sharp YouTube thumbnail art for "${cleanTopic}", hyper-detailed cinematic render, high visual contrast, dramatic volumetric light shafts, pristine focal clarity, 4k 16:9`,
        previewUrl:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "concept-2",
        name: "The Emotional Subject / Character Close-Up",
        hookType: "Emotional Subject",
        composition:
          "Intense character/subject close-up occupying 45% of the right frame, pointing leftward with intense curiosity, looking directly through the viewer's eyes.",
        focalPoint: "Human/character eyes with specular ring reflection and dramatic directional lighting.",
        colorScheme: "Warm Golden Sunlight (#FBBF24) paired with deep Hollywood Teal backdrop.",
        facialExpression: "Intense discovery expression, mouth slightly open in awe, eyes locked on viewer.",
        textOverlay: "DO NOT FLY?",
        psychologicalTrigger: "Fear of Missing Out (FOMO) & Urgent Curiosity.",
        aiPromptMidjourney: `/imagine prompt: YouTube thumbnail focal character, expressive curious eyes looking directly into camera, holding a glowing mysterious artifact relating to ${cleanTopic}, 35mm anamorphic portrait, golden hour rim lighting, bokeh background --ar 16:9 --v 6.1 --style raw`,
        aiPromptFlux: `High CTR YouTube thumbnail portrait, expressive face in dramatic chiaroscuro lighting, sharp eye reflections, cinematic 3D character aesthetic, vivid colors, 16:9 aspect ratio`,
        previewUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "concept-3",
        name: "The Epic Scale & Exploded Blueprint Diorama",
        hookType: "Epic Scale & Action",
        composition:
          "Dramatic tilt-shift or exploded 3D model showing the internal components floating in pristine order with labeled arrows and glowing energy particles.",
        focalPoint: "The central core mechanism with glowing energy lines revealing the secret physics.",
        colorScheme: "Deep Navy Blue (#0F172A) with Electric Neon Green (#10B981) highlights.",
        facialExpression: "N/A (Focus on breathtaking scale and physical wonder).",
        textOverlay: "HOW IT WORKS!",
        psychologicalTrigger: "Intellectual Mastery & Fascination with Technical Perfection.",
        aiPromptMidjourney: `/imagine prompt: Isometric exploded view cutaway diagram of ${cleanTopic}, 3D Octane render, glowing internal circuits and particles, clean studio lighting on dark background, ultra-detailed textures, educational masterpiece --ar 16:9 --v 6.1 --style raw`,
        aiPromptFlux: `Detailed 3D educational cutaway thumbnail of "${cleanTopic}", glossy materials, isometric exploded perspective, studio softbox illumination, 8K render, 16:9`,
        previewUrl:
          "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
      },
    ];
  }, [title]);

  const activeConcept = concepts[selectedConceptIndex];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Thumbnail Studio & Feed Simulator
            </h2>
            <Badge variant="brand">PRD Feature 6</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate 3 AI thumbnail concepts, generate Midjourney/Flux prompts, and test CTR on the mobile simulator
          </p>
        </div>

        {/* View Toggle Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-navy-800 p-1 bg-white dark:bg-navy-900 text-xs">
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                deviceMode === "mobile"
                  ? "bg-brand-500 text-white font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile Feed (72% Viewers)</span>
            </button>
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                deviceMode === "desktop"
                  ? "bg-brand-500 text-white font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop Feed</span>
            </button>
          </div>

          <button
            onClick={() => setFeedTheme(feedTheme === "dark" ? "light" : "dark")}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-xs font-semibold"
          >
            Feed: {feedTheme === "dark" ? "Dark Theme" : "Light Theme"}
          </button>
        </div>
      </div>

      {/* Input Bar */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-8">
            <Input
              label="Video Title / Topic"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title..."
              className="text-xs sm:text-sm font-semibold"
            />
          </div>
          <div className="sm:col-span-4">
            <Badge variant="outline" className="text-xs py-2 px-3 w-full justify-center">
              Active Style: {styleLabel}
            </Badge>
          </div>
        </div>
      </Card>

      {/* PRD Section 8.2: 3 AI Thumbnail Concepts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" />
            <span>3 High-CTR AI Thumbnail Concepts (PRD 8.2)</span>
          </h3>
          <span className="text-xs text-slate-400">Select a concept to preview in YouTube Feed Simulator</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {concepts.map((concept, idx) => {
            const isSelected = selectedConceptIndex === idx;
            return (
              <div
                key={concept.id}
                onClick={() => setSelectedConceptIndex(idx)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 ring-2 ring-brand-500/30 shadow-md"
                    : "border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-slate-300"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-slate-400">CONCEPT 0{idx + 1}</span>
                    <Badge variant={isSelected ? "brand" : "outline"} className="text-[10px] py-0 px-1.5">
                      {concept.hookType}
                    </Badge>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {concept.name}
                  </h4>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {concept.composition}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-navy-800 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Text Overlay:</span>
                      <strong className="text-red-500 font-extrabold uppercase">
                        &quot;{concept.textOverlay}&quot;
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Focal Point:</span>
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                        {concept.focalPoint}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-navy-800 flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(concept.aiPromptMidjourney, `mj_${idx}`);
                    }}
                    className="flex-1 text-[11px] h-7 gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copiedKey === `mj_${idx}` ? "Copied!" : "Midjourney Prompt"}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(concept.aiPromptFlux, `flux_${idx}`);
                    }}
                    className="flex-1 text-[11px] h-7 gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copiedKey === `flux_${idx}` ? "Copied!" : "Flux Prompt"}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator Display */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Eye className="h-4 w-4 text-emerald-500" />
          <span>YouTube Feed Glance Test Simulator</span>
        </h3>

        <div className="flex justify-center pt-2">
          <div
            className={`w-full transition-all duration-300 rounded-2xl border overflow-hidden shadow-2xl ${
              deviceMode === "mobile" ? "max-w-sm" : "max-w-4xl"
            } ${
              feedTheme === "dark"
                ? "bg-[#0f0f0f] text-white border-neutral-800"
                : "bg-white text-black border-slate-200"
            }`}
          >
            {/* Mock YouTube Top App Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/40 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-red-600 font-bold tracking-tight">
                <span>▶ YouTube</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {deviceMode === "mobile" ? "Mobile Feed (72% CTR)" : "Desktop Feed"}
              </span>
            </div>

            {/* YouTube Video Card in Feed */}
            <div className="p-3 sm:p-4 space-y-3">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 group shadow-md">
                {/* Thumbnail Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeConcept.previewUrl}
                  alt={activeConcept.name}
                  className="h-full w-full object-cover"
                />

                {/* Text Overlay Simulated */}
                <div className="absolute top-3 left-3 bg-red-600/90 text-white font-extrabold text-sm sm:text-base px-2.5 py-1 rounded shadow-lg uppercase tracking-wide">
                  {activeConcept.textOverlay}
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-bold text-white tracking-wide">
                  08:45
                </span>
              </div>

              <div className="flex items-start gap-3 pt-1">
                {/* Channel Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs overflow-hidden">
                  {channel?.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={channel.thumbnail_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span>{(channelTitle || "C").charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                    {title}
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    {channelTitle} • 24K views • 3 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRD Section 8.2: CTR Best Practices Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/80 dark:border-navy-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" />
            <span>High Focal Point Contrast</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Main subject is cleanly separated from the background with crisp edge rim-lighting, passing the 0.5s mobile scroll glance test.
          </p>
        </Card>

        <Card className="border-slate-200/80 dark:border-navy-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" />
            <span>Zero Timestamp Obstruction</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bottom-right corner (80px x 40px) is completely free of text and facial expressions to avoid YouTube timestamp occlusion.
          </p>
        </Card>

        <Card className="border-slate-200/80 dark:border-navy-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-brand-500 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            <span>Title-Thumbnail Synergy</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The overlay text ({activeConcept.textOverlay}) complements the video title by creating an emotional mystery without repeating the words.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function ThumbnailStudioPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Thumbnail Studio...</div>}>
      <ThumbnailStudioContent />
    </React.Suspense>
  );
}
