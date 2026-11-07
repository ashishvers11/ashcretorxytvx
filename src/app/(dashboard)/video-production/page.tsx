"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Film,
  Video,
  Sliders,
  Layers,
  Music,
  Volume2,
  CheckSquare,
  Sparkles,
  Copy,
  Check,
  Download,
  Clock,
  Play,
  Scissors,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function VideoProductionPage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "Dinosaur extinction mystery";

  const [topic, setTopic] = useState<string>(initialTopic);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const [visualStyle, setVisualStyle] = useState<string>("Cinematic Documentary");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Interactive Production Checklist State
  const [checklist, setChecklist] = useState([
    { id: "1", task: "Record voiceover audio at 140 WPM", completed: true, category: "Audio" },
    { id: "2", task: "Apply noise reduction & EQ compression to voice track", completed: true, category: "Audio" },
    { id: "3", task: "Generate scene B-roll via Midjourney/Flux prompts", completed: false, category: "Visuals" },
    { id: "4", task: "Sync on-screen typography & hook text animation", completed: false, category: "Captions" },
    { id: "5", task: "Place sound design (SFX) on every 2-3 second visual cut", completed: false, category: "Sound Design" },
    { id: "6", task: "Duck background music (BGM) -18dB under voiceover", completed: false, category: "Audio Mix" },
    { id: "7", task: "Color grade with high contrast LUT & export 4K ProRes/MP4", completed: false, category: "Export" },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter((c) => c.completed).length;

  // Choreographed Scene Breakdown
  const scenes = [
    {
      id: "sc-1",
      number: 1,
      timecode: "0:00 - 0:03",
      duration: "3s",
      title: "The Impossible Hook",
      visualDirection: "Fast macro zoom into subject with heavy motion blur transition.",
      voiceover: `Everyone thinks ${topic} is simple, until you realize this one terrifying detail.`,
      prompt: `Cinematic macro shot of ${topic}, ominous volumetric lighting, anamorphic lens flare, 8k resolution, photorealistic --ar ${aspectRatio}`,
      sfx: "Sub-bass boom + Vinyl tape stop",
      onScreenText: "WAIT FOR THIS...",
    },
    {
      id: "sc-2",
      number: 2,
      timecode: "0:03 - 0:15",
      duration: "12s",
      title: "The Flawed Assumption",
      visualDirection: "Split screen comparison between traditional belief vs recent scientific scans.",
      voiceover: `For decades, researchers assumed that ${topic} followed standard predictable patterns. But recent data uncovered a massive contradiction.`,
      prompt: `Scientific archival diagram of ${topic}, glowing cyan holographic data interface, dark background, octane render --ar ${aspectRatio}`,
      sfx: "Fast whoosh cut + Digital UI beep",
      onScreenText: "THE UNSEEN DETAIL",
    },
    {
      id: "sc-3",
      number: 3,
      timecode: "0:15 - 0:42",
      duration: "27s",
      title: "The Core Mechanism",
      visualDirection: "Dynamic camera rotation around 3D cross-section demonstrating the catalyst.",
      voiceover: `When you examine the core mechanism, the entire premise flips upside down. The feedback loop was already in motion long before the impact.`,
      prompt: `Extreme dramatic wide angle of ${topic}, particle physics simulation, cinematic dust motes, studio lighting, hyper-detailed --ar ${aspectRatio}`,
      sfx: "Rising cinematic string tension + Heartbeat pulse",
      onScreenText: "WHAT ACTUALLY HAPPENED",
    },
    {
      id: "sc-4",
      number: 4,
      timecode: "0:42 - 0:60",
      duration: "18s",
      title: "Climax & Call to Action",
      visualDirection: "Epic vista reveal transitioning into clean animated channel follow card.",
      voiceover: `The truth is, ${topic} isn't just an isolated anomaly. Hit follow if this blew your mind, and comment what we should investigate next!`,
      prompt: `Breathtaking golden hour cinematic vista of ${topic}, slow backward drone pullout, masterpiece quality --ar ${aspectRatio}`,
      sfx: "Impact slam + Gentle resolving chord",
      onScreenText: "FOLLOW FOR PART 2",
    },
  ];

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Film className="h-6 w-6 text-brand-400" />
            <span>Video Production Workspace</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Convert approved voiceovers into scene-by-scene visual choreography, motion prompts, and sound design.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI Prompts Ready</span>
          </Badge>
          <Link href={`/seo-studio?topic=${encodeURIComponent(topic)}`}>
            <Button variant="primary" size="sm" className="gap-1.5 text-xs">
              <span>Next: SEO Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Style & Production Settings (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5 space-y-4">
            <div className="flex items-center gap-2 font-semibold text-white text-sm border-b border-slate-800/80 pb-3">
              <Sliders className="h-4 w-4 text-brand-400" />
              <span>Production Direction Settings</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-400">Current Production Topic</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-400">Target Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                    aspectRatio === "9:16"
                      ? "border-brand-500 bg-brand-500/10 text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  9:16 (Shorts / Reels)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                    aspectRatio === "16:9"
                      ? "border-brand-500 bg-brand-500/10 text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  16:9 (Landscape)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-400">Visual Art Style</label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Cinematic Documentary">Cinematic Documentary (Photorealistic 8K)</option>
                <option value="3D Octane Render">3D Isometric &amp; Octane Render</option>
                <option value="Handmade Paper Cutout">Handmade Paper Cutout Style</option>
                <option value="Retro Vintage Archival">Retro 1970s Vintage Archival</option>
                <option value="Minimalist Motion Graphics">Minimalist Dark Motion Graphics</option>
              </select>
            </div>

            {/* Provider Transparency Status */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <span className="font-semibold text-slate-300 block">AI Video Generation Status:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                External Video API (Runway/Kling) is in prompt formula mode. Copy Midjourney &amp; motion prompts directly
                into your generation pipeline without incurring API costs.
              </p>
            </div>
          </Card>

          {/* Interactive Production Checklist */}
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 font-semibold text-white text-sm">
                <CheckSquare className="h-4 w-4 text-emerald-400" />
                <span>Production Checklist</span>
              </div>
              <Badge variant={completedCount === checklist.length ? "success" : "outline"} className="text-[10px]">
                {completedCount}/{checklist.length} Complete
              </Badge>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    item.completed
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="accent-emerald-500 rounded"
                    />
                    <span className={item.completed ? "line-through text-slate-400" : ""}>{item.task}</span>
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-500">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Sound Design & Music Director */}
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-white text-sm border-b border-slate-800/80 pb-3">
              <Music className="h-4 w-4 text-indigo-400" />
              <span>Sound Design &amp; Music Guidance</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-semibold text-indigo-300 block mb-0.5">Recommended BGM Genre:</span>
                <p className="text-slate-400">Dark Ambient Synthwave • 115 BPM • Low-pass filtered during explanation</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-semibold text-amber-300 block mb-0.5">Ducking Rule:</span>
                <p className="text-slate-400">-18dB whenever speech is active. Release to -6dB during payoff climax.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Choreographed Scene Timeline (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-400" />
              <span>Visual Choreography &amp; Motion Prompts ({scenes.length} Scenes)</span>
            </h3>
            <span className="text-xs text-slate-500">Total Duration: 60s • {aspectRatio}</span>
          </div>

          <div className="space-y-3.5">
            {scenes.map((scene) => (
              <Card key={scene.id} className="border-slate-800 bg-surface-900/90 shadow-xl overflow-hidden">
                <div className="p-5 space-y-3.5">
                  {/* Scene Title Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-7 w-7 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {scene.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{scene.title}</h4>
                        <span className="text-[11px] text-slate-500">
                          {scene.timecode} ({scene.duration})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] bg-slate-950">
                        On-Screen: &quot;{scene.onScreenText}&quot;
                      </Badge>
                    </div>
                  </div>

                  {/* Director Visual Direction & Voiceover Sync */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                      <span className="font-semibold text-brand-400 block">🎬 Visual Direction:</span>
                      <p className="text-slate-300 leading-relaxed">{scene.visualDirection}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                      <span className="font-semibold text-slate-400 block">🎙️ Voiceover Line:</span>
                      <p className="text-slate-300 italic leading-relaxed">&ldquo;{scene.voiceover}&rdquo;</p>
                    </div>
                  </div>

                  {/* Sound Design SFX */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800">
                    <Volume2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>
                      <strong>SFX Audio Cue:</strong> {scene.sfx}
                    </span>
                  </div>

                  {/* Copyable Midjourney / Runway Prompt */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-amber-400">Midjourney / Flux Generation Prompt:</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyPrompt(scene.id, scene.prompt)}
                        className="h-6 text-[11px] px-2 text-slate-300 gap-1"
                      >
                        {copiedPromptId === scene.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed break-all select-all">
                      {scene.prompt}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
