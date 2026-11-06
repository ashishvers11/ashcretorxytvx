// ==============================================================================
// ASH CREATOR STUDIO 2.0 — HUMAN-CENTERED AI VIDEO SCRIPT & PRODUCTION STUDIO
// Multi-Channel Intelligence: Locked to Active Channel Style DNA
// Visual Style Selector Cards, Image vs Video Prompt Separation, Fact Verification
// ==============================================================================

"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Film,
  Sparkles,
  Save,
  Copy,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Layers,
  Palette,
  Sliders,
  Volume2,
  Video,
  FileText,
  PlusCircle,
  Camera,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Dna,
  Zap,
  ArrowRight,
  TrendingUp,
  Award,
  Globe,
  Share2,
  Lock,
  ImageIcon,
  Clapperboard,
  Mic,
  Maximize2,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HumanizedVideoPackage,
  ScriptRegenerationAction,
  VisualAnimationType,
  ScriptApprovalStatus,
} from "@/types/channel-intelligence";
import {
  generateHumanScriptPackage,
  regenerateScriptWithAction,
} from "@/lib/ai/human-script-engine";
import {
  VISUAL_STYLE_DEFINITIONS,
  PRESET_CHANNEL_PROFILES,
} from "@/lib/ai/channel-intelligence";

interface VisualStyleCardItem {
  id: VisualAnimationType;
  name: string;
  badge: string;
  previewImage: string;
  description: string;
}

const VISUAL_STYLE_CARDS: VisualStyleCardItem[] = [
  {
    id: "stickman_doodle",
    name: "2D Stickman & Doodle",
    badge: "Viral Shorts",
    previewImage: "/styles/stickman.svg",
    description: "Expressive doodle figures, whiteboard sketches & animated curiosity arrows",
  },
  {
    id: "pixar_3d",
    name: "3D Pixar Animation",
    badge: "Kids & Family",
    previewImage: "/styles/pixar_3d.svg",
    description: "Vibrant expressive 3D animated characters, warm lighting & playful wonder",
  },
  {
    id: "unreal_3d",
    name: "Cinematic 3D UE5",
    badge: "Trending #1",
    previewImage: "/styles/unreal_3d.svg",
    description: "Photorealistic 8K raytracing, volumetric god rays & planetary physics",
  },
  {
    id: "noir_mystery",
    name: "Dark Mystery Noir",
    badge: "Investigation",
    previewImage: "/styles/noir_mystery.svg",
    description: "Deep chiaroscuro shadows, 35mm film grain & historical thriller suspense",
  },
  {
    id: "realistic_cinematic",
    name: "Realistic 8K Cinematic",
    badge: "Documentary",
    previewImage: "/styles/micro_world.svg",
    description: "National Geographic & BBC caliber photorealism, macro lenses & science wonders",
  },
  {
    id: "anime_ghibli",
    name: "Studio Ghibli Anime",
    badge: "Poetic & Chill",
    previewImage: "/styles/anime_ghibli.svg",
    description: "Hand-painted watercolor backgrounds, fluffy nostalgic skies & lush greens",
  },
  {
    id: "retro_comic",
    name: "Retro Comic Book",
    badge: "High Energy",
    previewImage: "/styles/retro_comic.svg",
    description: "Bold black ink outlines, dynamic halftone dots & explosive pop art action",
  },
  {
    id: "paper_cutout",
    name: "Paper Cut-Out Craft",
    badge: "Artisanal",
    previewImage: "/styles/stickman.svg",
    description: "Tactile layered craft paper textures, delicate stop-motion & diorama depth",
  },
  {
    id: "asmr_satisfying",
    name: "Satisfying ASMR",
    badge: "Tactile Macro",
    previewImage: "/styles/micro_world.svg",
    description: "Hypnotic tactile close-ups, soothing fluid dynamics & ultra-crisp surfaces",
  },
];

export default function ScriptWriterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      }
    >
      <ScriptWriterContent />
    </React.Suspense>
  );
}

function ScriptWriterContent() {
  const searchParams = useSearchParams();
  const titleFromUrl = searchParams.get("title");
  const styleFromUrl = searchParams.get("style") as VisualAnimationType | null;

  const { channel, activeChannelStyle } = useAuth();

  // Form State
  const [topic, setTopic] = React.useState(
    titleFromUrl || "लौंग असल में फूल है या फल? (The Science Behind Cloves)"
  );
  const [format, setFormat] = React.useState<"shorts" | "longform">("shorts");
  const [durationSeconds, setDurationSeconds] = React.useState<number>(55);

  // Selected Visual Style (Defaults to channel DNA style, or URL style, or stickman)
  const defaultChannelStyleType: VisualAnimationType =
    activeChannelStyle?.visualAnimationStyle || "stickman_doodle";

  const [selectedStyleId, setSelectedStyleId] = React.useState<VisualAnimationType>(
    styleFromUrl || defaultChannelStyleType
  );

  // Sync when active channel changes
  React.useEffect(() => {
    if (activeChannelStyle?.visualAnimationStyle && !styleFromUrl) {
      setSelectedStyleId(activeChannelStyle.visualAnimationStyle);
    }
  }, [activeChannelStyle, styleFromUrl]);

  // Sync if titleFromUrl or styleFromUrl changes
  React.useEffect(() => {
    if (titleFromUrl && titleFromUrl !== topic) {
      setTopic(titleFromUrl);
    }
    if (styleFromUrl) {
      setSelectedStyleId(styleFromUrl);
    }
  }, [titleFromUrl, styleFromUrl]);

  // Output Package State
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [generationStep, setGenerationStep] = React.useState<string>("");
  const [videoPackage, setVideoPackage] = React.useState<HumanizedVideoPackage | null>(null);

  // Active view tabs: "prompts" | "hindi_script" | "english_script" | "facts" | "quality" | "seo"
  const [activeTab, setActiveTab] = React.useState<
    "prompts" | "hindi_script" | "english_script" | "facts" | "quality" | "seo"
  >("prompts");

  // Toast / Copy feedback state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Compute active effective style profile
  const effectiveChannelStyle = React.useMemo(() => {
    const overrideDef = VISUAL_STYLE_DEFINITIONS[selectedStyleId] || VISUAL_STYLE_DEFINITIONS["stickman_doodle"];

    if (activeChannelStyle) {
      return {
        ...activeChannelStyle,
        visualAnimationStyle: selectedStyleId,
        visualStyleLabel: overrideDef.label,
        visualPromptModifier: overrideDef.promptModifier,
        negativePrompt: overrideDef.negativePrompt,
        lightingPreference: overrideDef.lightingPreference,
        cameraPreference: overrideDef.cameraPreference,
      };
    }

    // Fallback if no channel connected yet
    const basePreset = PRESET_CHANNEL_PROFILES["UCq_9aJ9FOog48qCfPikSKdg"];
    return {
      profileId: "demo-profile-fallback",
      channelId: "chan-demo-temp",
      channelName: "ASH Creator Studio",
      youtubeChannelId: "UC_temp",
      channelDescription: "Curious science and fact breakdowns",
      channelNiche: "Education & Science",
      channelSubNiche: "Everyday Mysteries",
      targetAudience: "Curious Hindi & English learners",
      audienceAgeGroup: "18–28 Curious Minds",
      primaryLanguage: "Hindi" as const,
      contentFormat: "YouTube Shorts (9:16)" as const,
      videoDuration: "45–60s fast-paced shorts",
      visualAnimationStyle: selectedStyleId,
      visualStyleLabel: overrideDef.label,
      editingStyle: "Snappy cuts with curiosity sound effects",
      voiceoverStyle: "Energetic conversational narrator",
      storytellingStyle: "Curiosity Question -> Misconception -> Scientific Truth -> Payoff",
      hookStyle: "Bold counter-intuitive question",
      averageVideoLength: 52,
      popularTopics: ["लौंग का सच", "धरती 5 सेकंड रुक जाए तो"],
      successfulVideoPatterns: ["1-2s Curiosity Hook", "Natural Conversational Phrasing"],
      competitorChannels: ["FactTechz", "Science Fiction Hindi"],
      contentRestrictions: ["No generic textbook definitions", "Must be verified"],
      visualPromptModifier: overrideDef.promptModifier,
      negativePrompt: overrideDef.negativePrompt,
      lightingPreference: overrideDef.lightingPreference,
      cameraPreference: overrideDef.cameraPreference,
      sampleThumbnailGradient: overrideDef.sampleThumbnailGradient,
      analyzedVideosCount: 30,
      dominantFormat: "shorts" as const,
      dominantPacingWpm: 140,
      lastResearchedAt: new Date().toISOString(),
      isCustomized: false,
    };
  }, [activeChannelStyle, selectedStyleId]);

  // Generate Script Function
  const runGeneration = React.useCallback(
    (targetTopic: string) => {
      setIsGenerating(true);
      setGenerationStep("1/4 Loading channel Style DNA & research patterns...");

      setTimeout(() => {
        setGenerationStep(`2/4 Crafting human-like storytelling in style: ${effectiveChannelStyle.visualStyleLabel}...`);
      }, 350);

      setTimeout(() => {
        setGenerationStep("3/4 Running Fact Verification Engine against verified institutional sources...");
      }, 700);

      setTimeout(() => {
        setGenerationStep("4/4 Generating separate Midjourney Image & Runway Video motion prompts...");
      }, 1050);

      setTimeout(() => {
        const pkg = generateHumanScriptPackage({
          topic: targetTopic,
          channelStyle: effectiveChannelStyle,
          format,
          durationSeconds,
        });

        setVideoPackage(pkg);
        setIsGenerating(false);
        setGenerationStep("");
      }, 1400);
    },
    [effectiveChannelStyle, format, durationSeconds]
  );

  // Initial load auto-generation
  React.useEffect(() => {
    runGeneration(topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Copy helper
  const triggerCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setToastMessage(`Copied ${label} to clipboard!`);
    setTimeout(() => {
      setCopiedKey(null);
      setToastMessage(null);
    }, 2500);
  };

  // Regeneration Handler
  const handleRegenerateAction = (action: ScriptRegenerationAction, actionLabel: string) => {
    if (!videoPackage) return;
    const updated = regenerateScriptWithAction(videoPackage, action);
    setVideoPackage(updated);
    setToastMessage(`Script regenerated: ${actionLabel}!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Approval status handler
  const handleApprovalChange = (status: ScriptApprovalStatus) => {
    if (!videoPackage) return;
    setVideoPackage({ ...videoPackage, approvalStatus: status });
    setToastMessage(`Script status updated to: ${status.replace(/_/g, " ").toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 max-w-7xl mx-auto px-1 sm:px-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. CHANNEL STYLE DNA STATUS BANNER */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-navy-800 bg-white/95 dark:bg-navy-900/90 p-3.5 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 ring-2 ring-brand-500/20">
              <Dna className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  Channel Intelligence Active
                </span>
                <Badge variant="success" className="text-[10px] gap-1 font-bold shrink-0">
                  <Lock className="h-3 w-3" />
                  <span>Channel Isolated</span>
                </Badge>
                {channel && (
                  <Badge variant="outline" className="text-[10px] font-semibold text-red-500 border-red-500/20 bg-red-500/5 shrink-0">
                    @{channel.custom_url || "channel"}
                  </Badge>
                )}
              </div>

              <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                {effectiveChannelStyle.channelName} — {effectiveChannelStyle.visualStyleLabel}
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {effectiveChannelStyle.channelNiche} • {effectiveChannelStyle.targetAudience}
              </p>
            </div>
          </div>

          <Link href="/modules/style-lab" className="shrink-0 self-start sm:self-auto text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1">
            <span>Style Lab →</span>
          </Link>
        </div>
      </div>

      {/* 2. TOPIC INPUT & SCRIPT CONTROLS */}
      <Card className="border-slate-200/80 dark:border-navy-800">
        <CardContent className="p-3.5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
            <div className="lg:col-span-7 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Video Topic / Research Question
              </label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. लौंग असल में फूल है या फल? (The Science Behind Cloves)"
                disabled={isGenerating}
                className="text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="lg:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                disabled={isGenerating}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="shorts">YouTube Shorts (9:16)</option>
                <option value="longform">Long-Form Explainer (16:9)</option>
              </select>
            </div>

            <div className="lg:col-span-3 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Duration</span>
                <span className="text-brand-600 dark:text-brand-400">{durationSeconds}s</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Number(e.target.value))}
                  disabled={isGenerating}
                  className="w-full accent-brand-500"
                />
                <Button
                  onClick={() => runGeneration(topic)}
                  isLoading={isGenerating}
                  className="shrink-0 gap-1.5 px-4 bg-brand-500 hover:bg-brand-600 font-bold text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Generate</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 3. VISUAL STYLE SELECTOR CARDS (FRONT & CENTER) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-navy-800">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-brand-500" />
                <span>Choose AI Video Visual Style ({VISUAL_STYLE_CARDS.length} Styles Available):</span>
              </label>

              {activeChannelStyle && (
                <button
                  type="button"
                  onClick={() => setSelectedStyleId(defaultChannelStyleType)}
                  className="text-[11px] text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>🎯 Reset to Channel Default ({activeChannelStyle.visualStyleLabel.split(" ")[0]})</span>
                </button>
              )}
            </div>

            {/* Visual Style Cards Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-2 sm:gap-2.5">
              {VISUAL_STYLE_CARDS.map((style) => {
                const isSelected = selectedStyleId === style.id;
                const isChannelDefault = activeChannelStyle?.visualAnimationStyle === style.id;

                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setSelectedStyleId(style.id);
                    }}
                    className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/30 shadow-md"
                        : "border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-slate-300 dark:hover:border-navy-700"
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                        isChannelDefault
                          ? "bg-emerald-500 text-white"
                          : isSelected
                          ? "bg-brand-500 text-white"
                          : "bg-slate-100 dark:bg-navy-800 text-slate-500"
                      }`}>
                        {isChannelDefault ? "Channel DNA 🎯" : style.badge}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-3 w-3 text-brand-500 shrink-0" />
                      )}
                    </div>

                    {/* Preview Artwork */}
                    <div className="relative h-14 sm:h-16 w-full rounded-lg overflow-hidden mb-1.5 bg-slate-950 border border-slate-200/60 dark:border-navy-700 shadow-2xs">
                      {style.previewImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={style.previewImage}
                          alt={style.name}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-400">
                          <Film className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                        {style.name}
                      </div>
                      <p className="text-[9px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                        {style.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick curiosity topic suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400 text-xs">Trending Topics:</span>
            {[
              "लौंग असल में फूल है या फल?",
              "धरती 5 सेकंड के लिए घूमना बंद कर दे तो?",
              "डायनासोर असल में कैसे गायब हुए?",
              "हवाई जहाज का रंग सफेद क्यों होता है?",
              "चींटी अपने वजन से 50 गुना भार कैसे उठाती है?",
            ].map((suggested) => (
              <button
                key={suggested}
                type="button"
                onClick={() => {
                  setTopic(suggested);
                  runGeneration(suggested);
                }}
                disabled={isGenerating}
                className="rounded-lg bg-slate-100 dark:bg-navy-950 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/30 dark:hover:text-brand-400 transition-colors"
              >
                {suggested}
              </button>
            ))}
          </div>

          {isGenerating && generationStep && (
            <div className="flex items-center gap-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 p-3 text-xs font-semibold text-brand-600 dark:text-brand-400 animate-pulse">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent shrink-0" />
              <span>{generationStep}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. REGENERATION CONTROLS & QUALITY BAR */}
      {videoPackage && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/90 dark:border-navy-800 bg-slate-50/60 dark:bg-navy-950/60">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-brand-500" />
                <span>Script Controls:</span>
              </span>

              {[
                { action: "make_hook_stronger" as const, label: "⚡ Stronger Hook" },
                { action: "make_it_more_natural" as const, label: "🗣️ More Natural" },
                { action: "increase_curiosity" as const, label: "❓ Increase Curiosity" },
                { action: "simplify_language" as const, label: "💡 Simplify Language" },
                { action: "correct_factual_errors" as const, label: "✅ Apply Fact Fixes" },
                { action: "shorten_script" as const, label: "⏱️ Snappier (-15s)" },
              ].map((btn) => (
                <button
                  key={btn.action}
                  type="button"
                  onClick={() => handleRegenerateAction(btn.action, btn.label)}
                  className="rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all shadow-2xs active:scale-95"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Script Approval Workflow */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={videoPackage.approvalStatus}
                onChange={(e) => handleApprovalChange(e.target.value as ScriptApprovalStatus)}
                className="rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="draft">Draft</option>
                <option value="researching">Researching</option>
                <option value="fact_checking">Fact Checking</option>
                <option value="needs_correction">Needs Correction</option>
                <option value="approved">Approved</option>
                <option value="ready_for_production">Ready for Production</option>
              </select>
            </div>
          </div>

          {/* 5. MAIN OUTPUT TABS (Prompts, Scripts, Facts, Quality, SEO) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200/80 dark:border-navy-800 pb-2">
            {[
              { id: "prompts", label: "🎬 Scene-by-Scene AI Prompts", count: `${videoPackage.totalScenes} Scenes` },
              { id: "hindi_script", label: "🇮🇳 Spoken Hindi Voiceover", count: `${videoPackage.totalWordsHindi}w` },
              { id: "english_script", label: "🇬🇧 English Voiceover", count: `${videoPackage.totalWordsEnglish}w` },
              {
                id: "facts",
                label: "🛡️ Fact Verification Report",
                count: `${videoPackage.factCheckReport.verifiedCount}/${videoPackage.factCheckReport.totalClaimsChecked} Verified`,
                isAlert: videoPackage.factCheckReport.overallStatus !== "fully_verified",
              },
              {
                id: "quality",
                label: "📊 Quality Score (100)",
                count: `${videoPackage.qualityScore.totalScore}/100`,
              },
              { id: "seo", label: "🏷️ SEO & Metadata", count: "Title + Tags" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 sm:gap-2 transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.2 text-[10px] font-semibold ${
                    tab.isAlert
                      ? "bg-amber-500 text-white"
                      : activeTab === tab.id
                      ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                      : "bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* 6. TAB CONTENTS */}

          {/* TAB: SCENE BY SCENE PROMPTS (WITH CRYSTAL-CLEAR IMAGE VS VIDEO PROMPT SEPARATION) */}
          {activeTab === "prompts" && (
            <div className="space-y-4">
              {/* Prompts Top Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Scene-by-Scene AI Production Prompts</span>
                    <Badge variant="brand" className="text-[10px]">
                      {effectiveChannelStyle.visualStyleLabel}
                    </Badge>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Separated Image Prompts (Midjourney/Flux) & Video Motion Prompts (Runway/Kling)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Master Copy Image Prompts */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      triggerCopy(
                        videoPackage.scenes
                          .map((s) => `SCENE ${s.sceneNumber} (${s.stageName}):\n${s.midjourneyPrompt}`)
                          .join("\n\n"),
                        "All Midjourney Image Prompts",
                        "all_mj"
                      )
                    }
                    className="text-xs gap-1.5 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>{copiedKey === "all_mj" ? "Copied!" : "Copy All Image Prompts"}</span>
                  </Button>

                  {/* Master Copy Video Motion Prompts */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      triggerCopy(
                        videoPackage.scenes
                          .map((s) => `SCENE ${s.sceneNumber} (${s.stageName}):\n${s.runwayMotionPrompt}`)
                          .join("\n\n"),
                        "All Runway Video Prompts",
                        "all_runway"
                      )
                    }
                    className="text-xs gap-1.5 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                  >
                    <Clapperboard className="h-3.5 w-3.5" />
                    <span>{copiedKey === "all_runway" ? "Copied!" : "Copy All Video Prompts"}</span>
                  </Button>

                  {/* Master Copy Full Production Script */}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      triggerCopy(
                        videoPackage.scenes
                          .map(
                            (s) =>
                              `========================================\n` +
                              `SCENE ${s.sceneNumber} [${s.timeRange}] (${s.stageName})\n` +
                              `========================================\n` +
                              `🎙️ VOICEOVER: ${s.voiceoverHindi}\n` +
                              `📝 TEXT OVERLAY: ${s.onScreenText}\n` +
                              `🔊 SOUND EFFECT: ${s.soundEffects}\n\n` +
                              `🖼️ IMAGE PROMPT (Midjourney / Flux):\n${s.midjourneyPrompt}\n\n` +
                              `🎥 VIDEO MOTION PROMPT (Runway Gen-3 / Kling):\n${s.runwayMotionPrompt}\n`
                          )
                          .join("\n\n"),
                        "Full Production Script",
                        "all_prompts"
                      )
                    }
                    className="text-xs gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedKey === "all_prompts" ? "Copied All!" : "Copy Full Package"}</span>
                  </Button>
                </div>
              </div>

              {/* Individual Scene Cards */}
              <div className="space-y-4">
                {videoPackage.scenes.map((scene) => (
                  <Card
                    key={scene.sceneNumber}
                    className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 shadow-sm"
                  >
                    <CardContent className="p-3.5 sm:p-5 space-y-3.5">
                      {/* Scene Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white text-xs font-bold shadow-xs">
                            {scene.sceneNumber}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {scene.stageName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            [{scene.timeRange}] ({scene.durationSeconds}s)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[11px] text-slate-400 hidden sm:inline">
                            🔊 SFX: {scene.soundEffects}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              triggerCopy(
                                `SCENE ${scene.sceneNumber} [${scene.timeRange}]\n` +
                                `VOICEOVER: ${scene.voiceoverHindi}\n\n` +
                                `IMAGE PROMPT:\n${scene.midjourneyPrompt}\n\n` +
                                `VIDEO PROMPT:\n${scene.runwayMotionPrompt}`,
                                `Scene ${scene.sceneNumber}`,
                                `scene_${scene.sceneNumber}`
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-navy-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors shadow-2xs"
                          >
                            <Copy className="h-3 w-3" />
                            <span>
                              {copiedKey === `scene_${scene.sceneNumber}` ? "Copied!" : "Copy Scene"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* 1. SPOKEN VOICEOVER LINE */}
                      <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <Mic className="h-3 w-3" />
                            <span>Spoken Voiceover Line (Hindi / Natural Speech)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              triggerCopy(scene.voiceoverHindi, "Voiceover Line", `vo_${scene.sceneNumber}`)
                            }
                            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="h-2.5 w-2.5" />
                            <span>{copiedKey === `vo_${scene.sceneNumber}` ? "Copied!" : "Copy Voiceover"}</span>
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                          "{scene.voiceoverHindi}"
                        </p>
                      </div>

                      {/* On-Screen Text & SFX */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-between">
                          <div>
                            <span className="font-bold">Text Overlay:</span> {scene.onScreenText}
                          </div>
                          <button
                            type="button"
                            onClick={() => triggerCopy(scene.onScreenText, "Text Overlay", `txt_${scene.sceneNumber}`)}
                            className="text-[10px] hover:underline shrink-0 ml-1"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-slate-700 dark:text-slate-300">
                          <span className="font-bold">🔊 Audio Cue:</span> {scene.soundEffects}
                        </div>
                      </div>

                      {/* 2. AI IMAGE GENERATION PROMPT (MIDJOURNEY / FLUX / DALL-E) */}
                      <div className="p-3 rounded-xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/25 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                              <ImageIcon className="h-3.5 w-3.5" />
                              <span>AI Image Prompt (Midjourney v6.1 / Flux.1 / DALL-E 3)</span>
                            </span>
                            <span className="text-[9px] font-semibold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-1.5 py-0.2 rounded">
                              Aspect Ratio 9:16
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              triggerCopy(scene.midjourneyPrompt, "Midjourney Image Prompt", `mj_${scene.sceneNumber}`)
                            }
                            className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{copiedKey === `mj_${scene.sceneNumber}` ? "Copied!" : "Copy Image Prompt"}</span>
                          </button>
                        </div>
                        <pre className="p-2.5 rounded-lg bg-slate-900 text-cyan-200 text-xs font-mono whitespace-pre-wrap select-all leading-relaxed">
                          {scene.midjourneyPrompt}
                        </pre>
                      </div>

                      {/* 3. AI VIDEO MOTION PROMPT (RUNWAY GEN-3 / KLING 1.5 / LUMA) */}
                      <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/25 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                              <Clapperboard className="h-3.5 w-3.5" />
                              <span>AI Video Motion Prompt (Runway Gen-3 / Kling 1.5 / Luma)</span>
                            </span>
                            <span className="text-[9px] font-semibold bg-purple-500/20 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded">
                              Camera Motion & Physics
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              triggerCopy(scene.runwayMotionPrompt, "Runway Video Prompt", `runway_${scene.sceneNumber}`)
                            }
                            className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{copiedKey === `runway_${scene.sceneNumber}` ? "Copied!" : "Copy Video Prompt"}</span>
                          </button>
                        </div>
                        <pre className="p-2.5 rounded-lg bg-slate-900 text-purple-200 text-xs font-mono whitespace-pre-wrap select-all leading-relaxed">
                          {scene.runwayMotionPrompt}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HINDI SCRIPT */}
          {activeTab === "hindi_script" && (
            <Card className="border-slate-200/80 dark:border-navy-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold">Natural Spoken Hindi Voiceover</CardTitle>
                  <CardDescription>
                    Paced at {videoPackage.speakingRateWpm} WPM • Spoken duration ~{videoPackage.durationSeconds}s
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    triggerCopy(videoPackage.fullVoiceoverHindi, "Hindi Voiceover", "hindi_vo")
                  }
                  className="gap-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedKey === "hindi_vo" ? "Copied!" : "Copy Hindi Voiceover"}</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 whitespace-pre-wrap text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed font-sans select-all">
                  {videoPackage.fullVoiceoverHindi}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB: ENGLISH SCRIPT */}
          {activeTab === "english_script" && (
            <Card className="border-slate-200/80 dark:border-navy-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold">English Voiceover Script</CardTitle>
                  <CardDescription>
                    {videoPackage.totalWordsEnglish} words • Natural human documentary enunciation
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    triggerCopy(videoPackage.fullVoiceoverEnglish, "English Voiceover", "eng_vo")
                  }
                  className="gap-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedKey === "eng_vo" ? "Copied!" : "Copy English Voiceover"}</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 whitespace-pre-wrap text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed font-sans select-all">
                  {videoPackage.fullVoiceoverEnglish}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB: FACT VERIFICATION REPORT */}
          {activeTab === "facts" && (
            <div className="space-y-4">
              <Card className="border-slate-200/80 dark:border-navy-800">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        <span>Institutional Fact Verification Engine</span>
                      </CardTitle>
                      <CardDescription>
                        Cross-referenced against verified botanical, physics and aerospace archives
                      </CardDescription>
                    </div>

                    <Badge
                      variant={
                        videoPackage.factCheckReport.overallStatus === "fully_verified"
                          ? "success"
                          : videoPackage.factCheckReport.overallStatus === "needs_correction"
                          ? "warning"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {videoPackage.factCheckReport.overallStatus === "fully_verified"
                        ? "100% Fully Verified"
                        : videoPackage.factCheckReport.overallStatus === "needs_correction"
                        ? "Needs Minor Correction"
                        : "Unverified Claims Detected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Claims Checked</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                        {videoPackage.factCheckReport.totalClaimsChecked}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Verified</div>
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {videoPackage.factCheckReport.verifiedCount}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Needs Fix</div>
                      <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                        {videoPackage.factCheckReport.partiallyVerifiedCount}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <div className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">False / Misleading</div>
                      <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">
                        {videoPackage.factCheckReport.falseCount}
                      </div>
                    </div>
                  </div>

                  {/* Fact Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-navy-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-navy-950 text-slate-500 border-b border-slate-200 dark:border-navy-800 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Claim in Script</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Evidence Source</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                        {videoPackage.factCheckReport.claims.map((claim) => (
                          <tr key={claim.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-950/50">
                            <td className="p-3 font-medium text-slate-900 dark:text-white max-w-xs">
                              <div>"{claim.originalText}"</div>
                              {claim.correctedText && (
                                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                                  Correction: "{claim.correctedText}"
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  claim.status === "verified"
                                    ? "success"
                                    : claim.status === "partially_verified"
                                    ? "warning"
                                    : "destructive"
                                }
                                className="text-[10px]"
                              >
                                {claim.status.replace(/_/g, " ")}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <a
                                href={claim.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
                              >
                                <span>{claim.sourceTitle}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </td>
                            <td className="p-3 text-right">
                              {claim.correctedText && !claim.isApplied && (
                                <Button
                                  size="sm"
                                  onClick={() => handleRegenerateAction("correct_factual_errors", "Fact Correction")}
                                  className="text-[11px] h-7"
                                >
                                  Apply Fix
                                </Button>
                              )}
                              {claim.status === "verified" && (
                                <span className="text-[11px] font-bold text-emerald-500">Verified ✓</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB: QUALITY SCORE (0 - 100) */}
          {activeTab === "quality" && (
            <Card className="border-slate-200/80 dark:border-navy-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      <span>Script Retention & Quality Score</span>
                    </CardTitle>
                    <CardDescription>
                      Evaluated on 8 algorithmic pillars for high YouTube audience retention
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-brand-600 dark:text-brand-400">
                      {videoPackage.qualityScore.totalScore}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">/ 100</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">AI Verdict: </span>
                  {videoPackage.qualityScore.verdict}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Hook Strength</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {videoPackage.qualityScore.hookStrength} / 15
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Storytelling</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {videoPackage.qualityScore.storytelling} / 15
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Human Phrasing</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {videoPackage.qualityScore.humanLanguage} / 15
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Factual Accuracy</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {videoPackage.qualityScore.factualAccuracy} / 20
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Audience Relevance</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {videoPackage.qualityScore.audienceRelevance} / 10
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Retention Potential</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {videoPackage.qualityScore.retentionPotential} / 10
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Originality Rating</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {videoPackage.qualityScore.originality} / 10
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Channel Style Match</div>
                    <div className="text-base font-bold text-emerald-500 mt-0.5">
                      {videoPackage.qualityScore.channelStyleMatch} / 5
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB: SEO & METADATA */}
          {activeTab === "seo" && (
            <Card className="border-slate-200/80 dark:border-navy-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold">YouTube Packaging & Tags</CardTitle>
                  <CardDescription>
                    Curiosity-driven title, search description and high-volume tags
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    triggerCopy(
                      `TITLE:\n${videoPackage.seoTitle}\n\nDESCRIPTION:\n${videoPackage.seoDescription}\n\nTAGS:\n${videoPackage.seoTags.join(", ")}`,
                      "SEO Package",
                      "seo_all"
                    )
                  }
                  className="gap-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedKey === "seo_all" ? "Copied!" : "Copy SEO Data"}</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Recommended Video Title</label>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{videoPackage.seoTitle}</span>
                    <button
                      type="button"
                      onClick={() => triggerCopy(videoPackage.seoTitle, "Title", "seo_title")}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {videoPackage.seoDescription}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">High-Volume Tags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {videoPackage.seoTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
