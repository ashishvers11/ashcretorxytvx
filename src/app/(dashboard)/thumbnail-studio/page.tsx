"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Image as ImageIcon,
  Sparkles,
  Layers,
  Sliders,
  Copy,
  Check,
  Eye,
  Smartphone,
  Monitor,
  AlertTriangle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Palette,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GeneratedThumbnailResult, ThumbnailConcept } from "@/lib/ai/provider";

export default function ThumbnailStudioPage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "Dinosaur extinction mystery";

  const [topic, setTopic] = useState<string>(initialTopic);
  const [videoFormat, setVideoFormat] = useState<"shorts" | "longform">("shorts");
  const [generating, setGenerating] = useState(false);
  const [thumbnailResult, setThumbnailResult] = useState<GeneratedThumbnailResult | null>(null);

  const [selectedConcept, setSelectedConcept] = useState<ThumbnailConcept | null>(null);
  const [customOverlayText, setCustomOverlayText] = useState<string>("");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const handleGenerateThumbnails = async () => {
    if (!topic.trim()) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/studio/thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          title: topic,
          videoFormat,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setThumbnailResult(data.thumbnail);
        if (data.thumbnail.concepts && data.thumbnail.concepts.length > 0) {
          setSelectedConcept(data.thumbnail.concepts[0]);
          setCustomOverlayText(data.thumbnail.concepts[0].overlayText);
        }
      }
    } catch (err) {
      console.error("Failed to generate thumbnails:", err);
    } finally {
      setGenerating(false);
    }
  };

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
            <ImageIcon className="h-6 w-6 text-brand-400" />
            <span>Thumbnail Studio &amp; Click Intelligence</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual concept formulas, Midjourney prompts, and interactive live canvas preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
            <span>Prompt Engine Ready</span>
          </Badge>
          <Link href="/profile">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs">
              <span>Next: Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Input Console */}
      <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">Video Topic or Theme</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Why airplane windows have tiny holes"
              className="bg-slate-950 border-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">Thumbnail Format</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setVideoFormat("shorts")}
                className={`py-2 rounded-lg border text-center font-medium transition-all ${
                  videoFormat === "shorts"
                    ? "border-brand-500 bg-brand-500/10 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                Shorts (9:16)
              </button>
              <button
                type="button"
                onClick={() => setVideoFormat("longform")}
                className={`py-2 rounded-lg border text-center font-medium transition-all ${
                  videoFormat === "longform"
                    ? "border-brand-500 bg-brand-500/10 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                16:9 (Landscape)
              </button>
            </div>
          </div>

          <div>
            <Button
              variant="primary"
              onClick={handleGenerateThumbnails}
              disabled={generating || !topic.trim()}
              className="w-full gap-2 text-xs font-semibold"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Designing Concepts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Concepts</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results View */}
      {thumbnailResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 3 High-CTR Visual Concepts (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-400" />
                <span>3 Tested Visual Concepts</span>
              </h3>
              <span className="text-xs text-slate-500">Select to preview layout</span>
            </div>

            <div className="space-y-3">
              {thumbnailResult.concepts?.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedConcept(c);
                    setCustomOverlayText(c.overlayText);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedConcept?.id === c.id
                      ? "border-brand-500 bg-brand-500/10 text-white shadow-sm"
                      : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-brand-400">{c.conceptType}</span>
                    <Badge variant="outline" className="text-[10px] bg-slate-950">
                      Text: &quot;{c.overlayText}&quot;
                    </Badge>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{c.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{c.visualDescription}</p>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 mb-2 select-all">
                    <span className="text-amber-400 block mb-0.5">Prompt:</span>
                    {c.aiPrompt}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="text-emerald-400 font-medium">💡 Why it clicks: {c.whyItWorks}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyPrompt(c.id, c.aiPrompt);
                      }}
                      className="h-6 text-[10px] px-2 text-slate-300 gap-1 shrink-0"
                    >
                      {copiedPromptId === c.id ? (
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
                </div>
              ))}
            </div>

            {/* Packaging Rules Card */}
            <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-4 space-y-2 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-amber-400" />
                <span>Color &amp; Contrast Guidance:</span>
              </span>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-slate-300">
                  <strong>Palette:</strong> {thumbnailResult.color_guidance.primary} + {thumbnailResult.color_guidance.accent}
                </p>
                <p className="text-slate-400 text-[11px]">
                  <strong>Contrast Ratio:</strong> {thumbnailResult.color_guidance.contrastRatio}
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <strong>Psychology:</strong> {thumbnailResult.color_guidance.psychology}
                </p>
              </div>
            </Card>
          </div>

          {/* Right: Live Interactive Thumbnail Canvas Preview (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="h-4 w-4 text-brand-400" />
                <span>Live Feed Simulation Canvas</span>
              </h3>

              <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded transition-colors ${
                    previewDevice === "mobile" ? "bg-brand-500 text-white" : "text-slate-400"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded transition-colors ${
                    previewDevice === "desktop" ? "bg-brand-500 text-white" : "text-slate-400"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Canvas */}
            <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5 flex flex-col items-center">
              <div
                className={`relative rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 flex flex-col justify-between p-4 transition-all duration-300 ${
                  videoFormat === "shorts"
                    ? previewDevice === "mobile"
                      ? "w-[240px] h-[426px]"
                      : "w-[260px] h-[462px]"
                    : previewDevice === "mobile"
                    ? "w-[320px] h-[180px]"
                    : "w-[440px] h-[247px]"
                }`}
              >
                {/* Background visual concept indicator */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Top overlay badge */}
                <div className="relative z-10">
                  <Badge variant="outline" className="bg-black/60 backdrop-blur-sm text-[10px] text-amber-300 border-amber-500/30">
                    {selectedConcept?.name || "Curiosity Concept"}
                  </Badge>
                </div>

                {/* Big Bold Headline Overlay Text */}
                <div className="relative z-10 my-auto text-center px-2">
                  <span className="font-extrabold uppercase tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] text-xl sm:text-2xl leading-none block font-mono">
                    {customOverlayText || "THEY LIED?"}
                  </span>
                  <span className="text-[10px] text-brand-300 block mt-1 drop-shadow-md">
                    {videoFormat === "shorts" ? "9:16 Feed Safe" : "16:9 Thumbnail"}
                  </span>
                </div>

                {/* Simulated YouTube Duration Badge (Bottom-Right) */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 bg-black/60 px-1.5 py-0.5 rounded">
                    ASH Studio
                  </span>
                  <div className="bg-black/90 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                    {videoFormat === "shorts" ? "SHORTS" : "12:45"}
                  </div>
                </div>
              </div>

              {/* Overlay Text Modifier */}
              <div className="w-full mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold uppercase text-slate-400">On-Screen Overlay Text (Max 3-4 Words)</label>
                  <span className={customOverlayText.split(" ").length <= 4 ? "text-emerald-400 text-[11px]" : "text-amber-400 text-[11px]"}>
                    {customOverlayText.split(" ").filter(Boolean).length}/4 words
                  </span>
                </div>
                <Input
                  value={customOverlayText}
                  onChange={(e) => setCustomOverlayText(e.target.value)}
                  placeholder="e.g. THEY LIED?"
                  className="bg-slate-950 border-slate-800 text-xs font-mono uppercase"
                />
              </div>

              <div className="w-full mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 block mb-0.5">⚠️ Safe Zone Notice:</span>
                {thumbnailResult.composition_guidance.safeZoneWarning}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 bg-surface-900/40 p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4 border border-brand-500/20">
            <ImageIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Thumbnail Concepts Generated</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            Enter your topic to design 3 high-CTR visual concepts, Midjourney generation prompts, and test overlay
            text on our interactive live feed canvas.
          </p>
          <Button variant="primary" onClick={handleGenerateThumbnails} className="gap-2 text-xs">
            <Sparkles className="h-4 w-4" />
            <span>Generate Default Thumbnail Concepts</span>
          </Button>
        </Card>
      )}
    </div>
  );
}
