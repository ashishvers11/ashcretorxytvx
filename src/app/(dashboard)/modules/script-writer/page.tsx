// ==============================================================================
// ASH CREATOR STUDIO 2.0 — HUMAN-CENTERED AI VIDEO SCRIPT & PRODUCTION STUDIO
// Multi-Channel Intelligence: Locked to Active Channel Style DNA
// Fact Verification Engine, Quality Scoring (0-100), Regeneration Controls & 10 Copy Buttons
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
  getAvailableVisualStyles,
  VISUAL_STYLE_DEFINITIONS,
  PRESET_CHANNEL_PROFILES,
} from "@/lib/ai/channel-intelligence";

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

  const { channel, activeChannelStyle, updateActiveChannelStyle } = useAuth();

  // Form State
  const [topic, setTopic] = React.useState(
    titleFromUrl || "लौंग असल में फूल है या फल? (The Science Behind Cloves)"
  );
  const [format, setFormat] = React.useState<"shorts" | "longform">("shorts");
  const [durationSeconds, setDurationSeconds] = React.useState<number>(55);

  // Manual Visual Style Override (for this video only, without altering channel DNA)
  const [isOverrideEnabled, setIsOverrideEnabled] = React.useState<boolean>(false);
  const [overrideStyleType, setOverrideStyleType] = React.useState<VisualAnimationType>("stickman_doodle");

  // Output Package State
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [generationStep, setGenerationStep] = React.useState<string>("");
  const [videoPackage, setVideoPackage] = React.useState<HumanizedVideoPackage | null>(null);

  // Active view tabs: "prompts" | "hindi_script" | "english_script" | "facts" | "quality"
  const [activeTab, setActiveTab] = React.useState<
    "prompts" | "hindi_script" | "english_script" | "facts" | "quality" | "seo"
  >("prompts");

  // Toast / Copy feedback state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const availableStyles = React.useMemo(() => getAvailableVisualStyles(), []);

  // Compute active effective style profile
  const effectiveChannelStyle = React.useMemo(() => {
    if (activeChannelStyle) {
      if (isOverrideEnabled) {
        const overrideDef = VISUAL_STYLE_DEFINITIONS[overrideStyleType];
        return {
          ...activeChannelStyle,
          visualAnimationStyle: overrideStyleType,
          visualStyleLabel: overrideDef.label,
          visualPromptModifier: overrideDef.promptModifier,
          negativePrompt: overrideDef.negativePrompt,
          lightingPreference: overrideDef.lightingPreference,
          cameraPreference: overrideDef.cameraPreference,
        };
      }
      return activeChannelStyle;
    }

    // Fallback if no channel is connected yet (use standard clean stickman or custom)
    const basePreset = PRESET_CHANNEL_PROFILES["UCq_9aJ9FOog48qCfPikSKdg"];
    const baseDef = VISUAL_STYLE_DEFINITIONS[overrideStyleType || "stickman_doodle"];
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
      visualAnimationStyle: overrideStyleType || "stickman_doodle",
      visualStyleLabel: baseDef.label,
      editingStyle: "Snappy 1.5–2s cuts with comic sound effects",
      voiceoverStyle: "Energetic conversational narrator",
      storytellingStyle: "Curiosity Question -> Misconception -> Scientific Truth -> Payoff",
      hookStyle: "Bold counter-intuitive question",
      averageVideoLength: 52,
      popularTopics: ["लौंग का सच", "धरती 5 सेकंड रुक जाए तो"],
      successfulVideoPatterns: ["1-2s Curiosity Hook", "Natural Conversational Phrasing"],
      competitorChannels: ["FactTechz", "Science Fiction Hindi"],
      contentRestrictions: ["No generic textbook definitions", "Must be verified"],
      visualPromptModifier: baseDef.promptModifier,
      negativePrompt: baseDef.negativePrompt,
      lightingPreference: baseDef.lightingPreference,
      cameraPreference: baseDef.cameraPreference,
      sampleThumbnailGradient: baseDef.sampleThumbnailGradient,
      analyzedVideosCount: 30,
      dominantFormat: "shorts" as const,
      dominantPacingWpm: 140,
      lastResearchedAt: new Date().toISOString(),
      isCustomized: false,
    };
  }, [activeChannelStyle, isOverrideEnabled, overrideStyleType]);

  // Generate Script Function
  const runGeneration = React.useCallback(
    (targetTopic: string) => {
      setIsGenerating(true);
      setGenerationStep("1/4 Loading channel Style DNA & research patterns...");

      setTimeout(() => {
        setGenerationStep(`2/4 Crafting human-like storytelling in style: ${effectiveChannelStyle.visualStyleLabel}...`);
      }, 350);

      setTimeout(() => {
        setGenerationStep("3/4 Running Fact Verification Engine against verified science sources...");
      }, 700);

      setTimeout(() => {
        setGenerationStep("4/4 Generating scene prompts for Runway Gen-3, Midjourney & Kling...");
      }, 1050);

      setTimeout(() => {
        const pkg = generateHumanScriptPackage({
          topic: targetTopic,
          channelStyle: effectiveChannelStyle,
          format,
          durationSeconds,
          customStyleOverride: isOverrideEnabled ? effectiveChannelStyle : undefined,
        });

        setVideoPackage(pkg);
        setIsGenerating(false);
        setGenerationStep("");
      }, 1400);
    },
    [effectiveChannelStyle, format, durationSeconds, isOverrideEnabled]
  );

  // Initial load or topic change from URL
  React.useEffect(() => {
    runGeneration(topic);
  }, []);

  React.useEffect(() => {
    if (titleFromUrl && titleFromUrl !== topic) {
      setTopic(titleFromUrl);
      runGeneration(titleFromUrl);
    }
  }, [titleFromUrl]);

  // Copy helper with toast
  const triggerCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setToastMessage(`${label} copied to clipboard!`);
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
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. CHANNEL STYLE DNA STATUS BANNER (Multi-Channel Isolation) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-navy-800 bg-white/95 dark:bg-navy-900/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 ring-2 ring-brand-500/20">
              <Dna className="h-6 w-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Channel Intelligence Profile
                </span>
                <Badge variant="success" className="text-[10px] gap-1 font-bold">
                  <Lock className="h-3 w-3" />
                  <span>Channel Isolated</span>
                </Badge>
                {channel && (
                  <Badge variant="outline" className="text-[10px] font-semibold text-red-500 border-red-500/20 bg-red-500/5">
                    @{channel.custom_url || "channel"}
                  </Badge>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {effectiveChannelStyle.channelName} — {effectiveChannelStyle.visualStyleLabel}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {effectiveChannelStyle.channelNiche} • {effectiveChannelStyle.storytellingStyle}
              </p>
            </div>
          </div>

          {/* Manual Style Override Switch */}
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-navy-800">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-navy-950 p-1.5 rounded-xl border border-slate-200/80 dark:border-navy-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isOverrideEnabled}
                  onChange={(e) => setIsOverrideEnabled(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
                />
                <span className="text-[11px]">Override Style for This Video</span>
              </label>

              {isOverrideEnabled && (
                <select
                  value={overrideStyleType}
                  onChange={(e) => setOverrideStyleType(e.target.value as VisualAnimationType)}
                  className="rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {availableStyles.map((s) => (
                    <option key={s.type} value={s.type}>
                      {s.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOPIC INPUT & SCRIPT CONTROLS */}
      <Card className="border-slate-200/80 dark:border-navy-800">
        <CardContent className="p-4 sm:p-6 space-y-4">
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Duration ({durationSeconds}s)
              </label>
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
                  className="shrink-0 gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Generate</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick curiosity topic suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400">Trending Curiosity Prompts:</span>
            {[
              "लौंग असल में फूल है या फल?",
              "धरती 5 सेकंड के लिए घूमना बंद कर दे तो?",
              "हवाई जहाज का रंग हमेशा सफेद ही क्यों होता है?",
              "क्या फोन को 100% चार्ज करना सच में गलत है?",
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

      {/* 3. REGENERATION CONTROLS & QUALITY BAR */}
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
            <div className="flex items-center gap-2">
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

          {/* 4. MAIN OUTPUT TABS (Prompts, Scripts, Facts, Quality, SEO) */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-navy-800 pb-2">
            {[
              { id: "prompts", label: "🎬 Scene-by-Scene AI Prompts", count: `${videoPackage.totalScenes} Scenes` },
              { id: "hindi_script", label: "🇮🇳 Hindi Spoken Script", count: `${videoPackage.totalWordsHindi}w` },
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
                className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
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

          {/* 5. TAB CONTENTS */}

          {/* TAB: SCENE BY SCENE PROMPTS */}
          {activeTab === "prompts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Scene Prompts (Locked to {effectiveChannelStyle.visualStyleLabel})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Optimized prompts for Runway Gen-3, Midjourney v6, Kling & Luma Dream Machine
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    triggerCopy(
                      videoPackage.scenes
                        .map(
                          (s) =>
                            `SCENE ${s.sceneNumber} [${s.timeRange}] (${s.stageName})\n` +
                            `VOICEOVER: ${s.voiceoverHindi}\n` +
                            `VISUAL: ${s.visualDescription}\n` +
                            `MIDJOURNEY: ${s.midjourneyPrompt}\n` +
                            `RUNWAY MOTION: ${s.runwayMotionPrompt}\n`
                        )
                        .join("\n---\n\n"),
                      "All Scene Prompts",
                      "all_prompts"
                    )
                  }
                  className="text-xs gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedKey === "all_prompts" ? "Copied!" : "Copy All Prompts"}</span>
                </Button>
              </div>

              <div className="space-y-3">
                {videoPackage.scenes.map((scene) => (
                  <Card
                    key={scene.sceneNumber}
                    className="border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900"
                  >
                    <CardContent className="p-4 sm:p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500 text-white text-xs font-bold">
                            {scene.sceneNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {scene.stageName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            [{scene.timeRange}]
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[11px] text-slate-400">
                            🔊 SFX: {scene.soundEffects}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              triggerCopy(
                                `SCENE ${scene.sceneNumber}\nVOICEOVER: ${scene.voiceoverHindi}\nMIDJOURNEY: ${scene.midjourneyPrompt}\nRUNWAY: ${scene.runwayMotionPrompt}`,
                                `Scene ${scene.sceneNumber}`,
                                `scene_${scene.sceneNumber}`
                              )
                            }
                            className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-navy-800 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                            <span>
                              {copiedKey === `scene_${scene.sceneNumber}` ? "Copied!" : "Copy"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Voiceover line */}
                      <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-850">
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Spoken Voiceover (Hindi)
                        </div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 leading-relaxed">
                          "{scene.voiceoverHindi}"
                        </p>
                      </div>

                      {/* On-Screen Text & Camera */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                          <span className="font-bold">Text Overlay:</span> {scene.onScreenText}
                        </div>
                        <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/20 text-blue-700 dark:text-blue-400">
                          <span className="font-bold">Camera:</span> {scene.cameraMovement}
                        </div>
                      </div>

                      {/* Prompts for Generators */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                          <span>AI Video Prompt (Midjourney / Kling / Luma):</span>
                          <button
                            type="button"
                            onClick={() =>
                              triggerCopy(
                                scene.midjourneyPrompt,
                                "Midjourney Prompt",
                                `mj_${scene.sceneNumber}`
                              )
                            }
                            className="text-brand-500 hover:underline text-[10px]"
                          >
                            {copiedKey === `mj_${scene.sceneNumber}` ? "Copied!" : "Copy MJ Prompt"}
                          </button>
                        </div>
                        <pre className="p-2.5 rounded-lg bg-slate-100 dark:bg-navy-950 text-slate-800 dark:text-slate-200 text-xs font-mono whitespace-pre-wrap select-all">
                          {scene.midjourneyPrompt}
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
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 whitespace-pre-wrap text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed font-sans select-all">
                  {videoPackage.fullVoiceoverEnglish}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB: FACT VERIFICATION REPORT */}
          {activeTab === "facts" && (
            <div className="space-y-4">
              {/* Overall Verification Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  videoPackage.factCheckReport.overallStatus === "fully_verified"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {videoPackage.factCheckReport.overallStatus === "fully_verified" ? (
                    <ShieldCheck className="h-8 w-8 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-amber-500 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold capitalize">
                      Fact Status: {videoPackage.factCheckReport.overallStatus.replace(/_/g, " ")}
                    </h4>
                    <p className="text-xs opacity-90">{videoPackage.factCheckReport.summary}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    triggerCopy(
                      JSON.stringify(videoPackage.factCheckReport, null, 2),
                      "Fact Check Report",
                      "facts_rep"
                    )
                  }
                  className="text-xs gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedKey === "facts_rep" ? "Copied!" : "Copy Report"}</span>
                </Button>
              </div>

              {/* Claims Table */}
              <Card className="border-slate-200/80 dark:border-navy-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Claim in Script</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Verified Source & Institution</th>
                        <th className="p-3">Source URL</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-navy-800 font-medium">
                      {videoPackage.factCheckReport.claims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-950/40">
                          <td className="p-3 max-w-xs">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {claim.claim}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              Script: "{claim.originalText}"
                            </p>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                claim.status === "verified"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : claim.status === "partially_verified"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              {claim.status === "verified" ? "VERIFIED" : claim.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {claim.sourceInstitution}
                            </div>
                            <div className="text-[11px] text-slate-400">{claim.sourceTitle}</div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <a
                              href={claim.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline text-[11px] font-semibold"
                            >
                              <span>Open Evidence</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {claim.correctedText && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRegenerateAction("correct_factual_errors", "Applied Fact Fix")
                                }
                                className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                              >
                                Apply Fix
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB: SCRIPT QUALITY SCORE */}
          {activeTab === "quality" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="md:col-span-1 border-slate-200/80 dark:border-navy-800 flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 dark:bg-navy-950/40">
                  <div className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">
                    {videoPackage.qualityScore.totalScore}
                    <span className="text-xl text-slate-400 font-normal">/100</span>
                  </div>
                  <div className="mt-2">
                    <Badge variant="success" className="capitalize text-xs font-bold">
                      {videoPackage.qualityScore.grade}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    {videoPackage.qualityScore.verdict}
                  </p>
                </Card>

                <Card className="md:col-span-3 border-slate-200/80 dark:border-navy-800 p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Quality Scoring Breakdown (Phase 9 Standards)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                      <div className="text-[10px] text-slate-400 font-semibold">Hook Strength</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {videoPackage.qualityScore.hookStrength} / 15
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                      <div className="text-[10px] text-slate-400 font-semibold">Storytelling</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {videoPackage.qualityScore.storytelling} / 15
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                      <div className="text-[10px] text-slate-400 font-semibold">Human Language</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {videoPackage.qualityScore.humanLanguage} / 15
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                      <div className="text-[10px] text-slate-400 font-semibold">Factual Accuracy</div>
                      <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {videoPackage.qualityScore.factualAccuracy} / 20
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                      <div className="text-[10px] text-slate-400 font-semibold">Audience Relevance</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {videoPackage.qualityScore.audienceRelevance} / 10
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                      <div className="text-[10px] text-slate-400 font-semibold">Retention Pacing</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {videoPackage.qualityScore.retentionPotential} / 10
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                      <div className="text-[10px] text-slate-400 font-semibold">Originality</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {videoPackage.qualityScore.originality} / 10
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
                      <div className="text-[10px] text-slate-400 font-semibold">Style Match</div>
                      <div className="text-base font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                        {videoPackage.qualityScore.channelStyleMatch} / 5
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB: SEO METADATA */}
          {activeTab === "seo" && (
            <Card className="border-slate-200/80 dark:border-navy-800">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Optimized Video Title</span>
                    <button
                      type="button"
                      onClick={() => triggerCopy(videoPackage.seoTitle, "SEO Title", "seo_title")}
                      className="text-brand-500 hover:underline"
                    >
                      {copiedKey === "seo_title" ? "Copied!" : "Copy Title"}
                    </button>
                  </div>
                  <Input value={videoPackage.seoTitle} readOnly />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Video Description & Chapter Outlines</span>
                    <button
                      type="button"
                      onClick={() =>
                        triggerCopy(videoPackage.seoDescription, "Description", "seo_desc")
                      }
                      className="text-brand-500 hover:underline"
                    >
                      {copiedKey === "seo_desc" ? "Copied!" : "Copy Description"}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={videoPackage.seoDescription}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 p-3 text-xs font-mono text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Rank-Optimized Tags</span>
                    <button
                      type="button"
                      onClick={() =>
                        triggerCopy(videoPackage.seoTags.join(", "), "SEO Tags", "seo_tags")
                      }
                      className="text-brand-500 hover:underline"
                    >
                      {copiedKey === "seo_tags" ? "Copied!" : "Copy Tags"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {videoPackage.seoTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-slate-100 dark:bg-navy-800 px-2 py-1 text-xs text-slate-700 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 6. COMPLETE 10 COPY BUTTONS BAR (Phase 6 Requirements) */}
          <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Copy className="h-4 w-4 text-brand-500" />
                <span>Production Copy Center (Desktop & Mobile Ready)</span>
              </span>
              <span className="text-[10px] text-slate-400">One-click clipboard export</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(videoPackage.fullVoiceoverHindi, "Full Hindi Script", "c_full_hi")
                }
                className="text-xs justify-start truncate"
              >
                <span>{copiedKey === "c_full_hi" ? "Copied!" : "1. Copy Hindi Script"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(videoPackage.fullVoiceoverEnglish, "Full English Script", "c_full_en")
                }
                className="text-xs justify-start truncate"
              >
                <span>{copiedKey === "c_full_en" ? "Copied!" : "2. Copy English Script"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    videoPackage.scenes.map((s) => s.midjourneyPrompt).join("\n\n"),
                    "Scene Prompts",
                    "c_scenes"
                  )
                }
                className="text-xs justify-start truncate"
              >
                <span>{copiedKey === "c_scenes" ? "Copied!" : "3. Copy Scene Prompts"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    videoPackage.scenes.map((s) => `Scene ${s.sceneNumber}: ${s.onScreenText}`).join("\n"),
                    "On-Screen Text",
                    "c_text"
                  )
                }
                className="text-xs justify-start truncate"
              >
                <span>{copiedKey === "c_text" ? "Copied!" : "4. Copy On-Screen Text"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerCopy(videoPackage.seoTitle, "SEO Title", "c_title")}
                className="text-xs justify-start truncate"
              >
                <span>{copiedKey === "c_title" ? "Copied!" : "5. Copy SEO Title"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerCopy(videoPackage.seoDescription, "Description", "c_desc")}
                className="text-xs justify-start truncate"
              >
                <span>{copiedKey === "c_desc" ? "Copied!" : "6. Copy Description"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerCopy(videoPackage.seoTags.join(", "), "Tags", "c_tags")}
                className="text-xs justify-start truncate"
              >
                <span>{copiedKey === "c_tags" ? "Copied!" : "7. Copy Tags"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    JSON.stringify(videoPackage.factCheckReport, null, 2),
                    "Fact Report",
                    "c_facts"
                  )
                }
                className="text-xs justify-start truncate"
              >
                <span>{copiedKey === "c_facts" ? "Copied!" : "8. Copy Fact Report"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    videoPackage.researchSources.map((s) => `${s.title}: ${s.url}`).join("\n"),
                    "Research Sources",
                    "c_sources"
                  )
                }
                className="text-xs justify-start truncate"
              >
                <span>{copiedKey === "c_sources" ? "Copied!" : "9. Copy Sources"}</span>
              </Button>

              {/* Master Copy All Button */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const masterExport =
                    `=== ASH CREATOR STUDIO 2.0 PRODUCTION PACKAGE ===\n` +
                    `CHANNEL: ${videoPackage.channelName} (${effectiveChannelStyle.visualStyleLabel})\n` +
                    `TITLE: ${videoPackage.title}\n` +
                    `STATUS: ${videoPackage.approvalStatus.toUpperCase()}\n` +
                    `QUALITY SCORE: ${videoPackage.qualityScore.totalScore}/100\n\n` +
                    `--- HINDI VOICEOVER ---\n${videoPackage.fullVoiceoverHindi}\n\n` +
                    `--- ENGLISH VOICEOVER ---\n${videoPackage.fullVoiceoverEnglish}\n\n` +
                    `--- SCENE PROMPTS ---\n` +
                    videoPackage.scenes
                      .map(
                        (s) =>
                          `SCENE ${s.sceneNumber} [${s.timeRange}] (${s.stageName})\n` +
                          `MIDJOURNEY: ${s.midjourneyPrompt}\n` +
                          `RUNWAY: ${s.runwayMotionPrompt}\n` +
                          `SFX: ${s.soundEffects}\n`
                      )
                      .join("\n") +
                    `\n\n--- SEO METADATA ---\nTITLE: ${videoPackage.seoTitle}\nTAGS: ${videoPackage.seoTags.join(", ")}`;

                  triggerCopy(masterExport, "Complete Video Production Package", "c_all");
                }}
                className="text-xs justify-start truncate bg-brand-600 hover:bg-brand-700 text-white font-bold"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-300" />
                <span>{copiedKey === "c_all" ? "Copied All!" : "10. Copy All Package"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
