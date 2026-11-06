"use client";

import * as React from "react";
import Link from "next/link";
import {
  Palette,
  Sparkles,
  PlusCircle,
  Copy,
  CheckCircle2,
  Trash2,
  Eye,
  Sliders,
  ExternalLink,
  Film,
  Bookmark,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { TRENDING_AI_STYLES, AIVideoStyle } from "@/lib/ai/video-prompt-engine";

const LOCAL_STORAGE_CUSTOM_STYLES = "ash_custom_styles";

export default function AIStyleLabPage() {
  const [trendingStyles] = React.useState<AIVideoStyle[]>(TRENDING_AI_STYLES);
  const [customStyles, setCustomStyles] = React.useState<AIVideoStyle[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Custom Style Form State
  const [newStyleName, setNewStyleName] = React.useState("");
  const [newBasePrompt, setNewBasePrompt] = React.useState("");
  const [newNegativePrompt, setNewNegativePrompt] = React.useState("blurry, cartoon, 2d, watermark, text, low quality, oversaturated");
  const [newLighting, setNewLighting] = React.useState("Volumetric amber key light with subtle cyan rim reflection");
  const [newCamera, setNewCamera] = React.useState("35mm cinematic lens with slow dolly push-in");
  const [newBestFor, setNewBestFor] = React.useState("Science Facts, Documentaries, Mysteries");

  // Load custom styles from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CUSTOM_STYLES);
      if (stored) {
        setCustomStyles(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveCustomStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyleName.trim() || !newBasePrompt.trim()) return;

    const newStyle: AIVideoStyle = {
      id: `custom_${Date.now()}`,
      name: newStyleName.trim(),
      badge: "My Style",
      description: `Custom creator style created for ASH Creator Studio`,
      bestFor: newBestFor.trim() || "General Educational & Curiosity Videos",
      promptModifier: newBasePrompt.trim(),
      negativePrompt: newNegativePrompt.trim(),
      lightingPreference: newLighting.trim(),
      cameraPreference: newCamera.trim(),
      previewGradient: "from-purple-600 via-pink-600 to-indigo-900",
      previewImage: "/styles/stickman.svg",
      isCustom: true,
    };

    const updated = [newStyle, ...customStyles];
    setCustomStyles(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_STYLES, JSON.stringify(updated));
    } catch (e) {}

    // Reset & close
    setNewStyleName("");
    setNewBasePrompt("");
    setIsCreateModalOpen(false);
  };

  const handleDeleteCustomStyle = (id: string) => {
    const updated = customStyles.filter((s) => s.id !== id);
    setCustomStyles(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_STYLES, JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Visual Style Lab
            </h2>
            <Badge variant="brand">7 Market Styles</Badge>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              ★ Channel Signature: 2D Stickman
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual photo previews and prompt modifiers for Midjourney, Runway Gen-3 & Kling AI. Pick or save custom aesthetics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 text-xs bg-brand-500 hover:bg-brand-600 font-bold">
            <PlusCircle className="h-4 w-4" />
            <span>Create Custom Style</span>
          </Button>

          <Link href="/modules/script-writer">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Film className="h-3.5 w-3.5" />
              <span>Open Video Studio</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Custom Styles Section (if any created) */}
      {customStyles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-brand-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Your Saved Custom Styles ({customStyles.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customStyles.map((style) => (
              <Card
                key={style.id}
                className="border-brand-500/30 dark:border-brand-500/40 p-5 bg-white dark:bg-navy-900 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400">
                      ★ Custom Signature
                    </span>
                    <button
                      onClick={() => handleDeleteCustomStyle(style.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete custom style"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {style.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Best For: <strong className="text-slate-700 dark:text-slate-300">{style.bestFor}</strong>
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 dark:bg-navy-950 p-2.5 border border-slate-100 dark:border-navy-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">
                      Base Prompt Modifier:
                    </span>
                    <p className="line-clamp-3 leading-relaxed">{style.promptModifier}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyPrompt(style.id, style.promptModifier)}
                    className="flex-1 text-xs gap-1.5"
                  >
                    {copiedId === style.id ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedId === style.id ? "Copied!" : "Copy Formula"}</span>
                  </Button>

                  <Link href={`/modules/script-writer?style=${style.id}`}>
                    <Button size="sm" className="text-xs bg-brand-500 hover:bg-brand-600">
                      <span>Use in Studio</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 7 Market-Trending Styles Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Market AI Visual Styles & Visual Photo Previews
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trendingStyles.map((style) => (
            <Card
              key={style.id}
              className={`p-4 sm:p-5 bg-white dark:bg-navy-900 flex flex-col justify-between transition-all hover:shadow-lg ${
                style.id === "stickman_doodle"
                  ? "border-2 border-amber-500/60 dark:border-amber-500/50 ring-2 ring-amber-500/10"
                  : "border-slate-200/80 dark:border-navy-800 hover:border-brand-500/50"
              }`}
            >
              <div className="space-y-3">
                {/* Visual Style Preview Photo / Illustration */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200/60 dark:border-navy-700 bg-slate-950 group shadow-inner">
                  {style.previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={style.previewImage}
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-r ${style.previewGradient}`} />
                  )}

                  {/* Top Badge Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md text-white shadow-xs ${
                        style.id === "stickman_doodle"
                          ? "bg-amber-600/90 border border-amber-300/40"
                          : "bg-black/75 border border-white/20"
                      }`}
                    >
                      {style.badge}
                    </span>
                  </div>

                  {/* Bottom Title Bar Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[11px] bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
                    <span className="font-bold truncate">{style.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono shrink-0 ml-2">Preview Photo</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{style.name}</span>
                    {style.id === "stickman_doodle" && (
                      <span className="text-xs">🎯</span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {style.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Best For:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-right truncate max-w-[180px]">
                      {style.bestFor}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Lighting:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-right truncate max-w-[180px]">
                      {style.lightingPreference}
                    </span>
                  </div>
                </div>

                {/* Prompt Formula Snippet */}
                <div className="rounded-lg bg-slate-50 dark:bg-navy-950 p-2.5 border border-slate-100 dark:border-navy-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans">
                    Midjourney / Kling Formula:
                  </span>
                  <p className="line-clamp-2 leading-relaxed">{style.promptModifier}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyPrompt(style.id, style.promptModifier)}
                  className="flex-1 text-xs gap-1.5"
                >
                  {copiedId === style.id ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedId === style.id ? "Copied!" : "Copy Formula"}</span>
                </Button>

                <Link href={`/modules/script-writer?style=${style.id}`}>
                  <Button size="sm" className="text-xs bg-brand-500 hover:bg-brand-600">
                    <span>Use in Studio</span>
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Custom Style Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create & Save Custom AI Video Style"
        description="Define your own signature visual style prompt. It will be saved to your library and available across all script & prompt generations."
      >
        <form onSubmit={handleSaveCustomStyle} className="space-y-4 pt-2">
          <Input
            label="Style Name"
            placeholder="e.g. Ashish Dark Science Noir or Cyber Botany 3D"
            value={newStyleName}
            onChange={(e) => setNewStyleName(e.target.value)}
            required
            autoFocus
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Base Visual Prompt Modifier (appended to every scene prompt)
            </label>
            <textarea
              rows={3}
              value={newBasePrompt}
              onChange={(e) => setNewBasePrompt(e.target.value)}
              placeholder="e.g. 35mm anamorphic film photography, dramatic chiaroscuro rim lighting, Kodak Portra 400 grain, high atmospheric haze, ultra photorealistic, cinematic 8k"
              className="w-full rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Negative Prompt (what to avoid)
            </label>
            <Input
              value={newNegativePrompt}
              onChange={(e) => setNewNegativePrompt(e.target.value)}
              placeholder="e.g. cartoon, low quality, oversaturated, blurry, 2d, watermark"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Lighting Style"
              value={newLighting}
              onChange={(e) => setNewLighting(e.target.value)}
              placeholder="e.g. Golden hour rim lighting"
            />
            <Input
              label="Best For Topic"
              value={newBestFor}
              onChange={(e) => setNewBestFor(e.target.value)}
              placeholder="e.g. Science Facts, Biology, Space"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2 bg-brand-500 hover:bg-brand-600 font-bold">
              <Sparkles className="h-4 w-4" />
              <span>Save to My Styles</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
