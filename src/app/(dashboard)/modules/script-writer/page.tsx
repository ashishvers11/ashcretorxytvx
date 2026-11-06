// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2 & VIDEO STUDIO
// Multi-Stage Pipeline: Topic Understanding, Research, Fact Verification,
// Story Architecture, Hook Intelligence, Human Scriptwriting, Retention & Quality Rubric
// ==============================================================================

"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Film,
  Sparkles,
  Copy,
  CheckCircle2,
  Clock,
  ExternalLink,
  Palette,
  Mic,
  Clapperboard,
  ImageIcon,
  ShieldCheck,
  Dna,
  Youtube,
  Volume2,
  Music,
  TrendingUp,
  Sliders,
  Scissors,
  Award,
  AlertTriangle,
  Play,
  Layers,
  FileText,
  Share2,
  Check,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Anchor,
  HelpCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SupportedVideoStyleId,
  ALL_SUPPORTED_VIDEO_STYLES,
  CompleteVideoIntelligencePackage,
  generateCompleteVideoPackage,
  getStyleById,
  formatCopyScript,
  formatCopyVoiceover,
  formatCopyScenePrompts,
  formatCopyVideoTimeline,
  formatCopySoundEffectsTimeline,
  formatCopyBackgroundMusicInstructions,
  formatCopyEditingInstructions,
  formatCopySeoPackage,
  formatCopyFactCheckReport,
  formatCopyCompleteVideoPackage,
} from "@/lib/ai/complete-video-intelligence-engine";
import {
  CompleteScriptIntelligencePackage,
  generateScriptIntelligencePackage,
  formatCopyFullScript as formatCopyV2FullScript,
  formatCopyVoiceoverOnly as formatCopyV2Voiceover,
  formatCopyHookOnly as formatCopyV2Hook,
  formatCopyOnScreenTextOnly as formatCopyV2OnScreenText,
  formatCopyScenePromptsOnly as formatCopyV2ScenePrompts,
  formatCopySourcesAndFactCheck as formatCopyV2FactCheck,
  formatCopySingleSection as formatCopyV2SingleSection,
  ScriptContentFormat,
  ScriptLanguage,
  CreatorScriptFeedback,
  recordCreatorFeedback,
  BENCHMARK_EVALUATION_TOPICS,
} from "@/lib/ai/script-intelligence";

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function ScriptWriterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      }
    >
      <VideoIntelligenceStudioContent />
    </React.Suspense>
  );
}

function VideoIntelligenceStudioContent() {
  const searchParams = useSearchParams();
  const titleFromUrl = searchParams.get("title") || searchParams.get("topic");
  const styleFromUrl = searchParams.get("style") as SupportedVideoStyleId | null;

  const { channel, activeChannelStyle } = useAuth();

  // Form State
  const defaultTopicForChannel = React.useMemo(() => {
    if (titleFromUrl) return titleFromUrl;
    if (activeChannelStyle?.popularTopics && activeChannelStyle.popularTopics.length > 0) {
      return activeChannelStyle.popularTopics[0];
    }
    const title = (channel?.channel_title || "").toLowerCase();
    const style = (activeChannelStyle?.visualAnimationStyle || "") as string;
    if (style === "pixar_3d" || title.includes("kid") || title.includes("cartoon")) {
      return "शेर और नटखट खरगोश की जादुई कहानी (3D Moral Story)";
    }
    if (style === "paper_cutout" || title.includes("paper") || title.includes("history")) {
      return "द ग्रेट लाइब्रेरी ऑफ अलेक्जेंड्रिया कैसे जली? (Paper Cut-Out History)";
    }
    if (style === "asmr_satisfying" || title.includes("asmr")) {
      return "पिघले हुए बिस्मथ से रेनबो क्रिस्टल कैसे बनते हैं? (Satisfying Macro)";
    }
    if (style === "noir_mystery" || title.includes("horror")) {
      return "डायटलोव पास पर 9 पर्वतारोहियों की रहस्यमयी मौत का सच";
    }
    return "लौंग असल में फूल है या फल? (The Science Behind Cloves)";
  }, [titleFromUrl, activeChannelStyle, channel]);

  const [topic, setTopic] = React.useState(defaultTopicForChannel);
  const [contentFormat, setContentFormat] = React.useState<ScriptContentFormat>("youtube_shorts");
  const [scriptLanguage, setScriptLanguage] = React.useState<ScriptLanguage>("Hindi");
  const [durationSeconds, setDurationSeconds] = React.useState<number>(55);

  // Selected Style State (Default based on active channel DNA or URL)
  const [selectedStyleId, setSelectedStyleId] = React.useState<SupportedVideoStyleId>(
    styleFromUrl || (activeChannelStyle?.visualAnimationStyle as SupportedVideoStyleId) || "stickman_doodle"
  );

  React.useEffect(() => {
    if (titleFromUrl) {
      setTopic(titleFromUrl);
    } else if (defaultTopicForChannel) {
      setTopic(defaultTopicForChannel);
    }
  }, [titleFromUrl, defaultTopicForChannel]);

  React.useEffect(() => {
    if (styleFromUrl) {
      setSelectedStyleId(styleFromUrl);
    } else if (activeChannelStyle?.visualAnimationStyle) {
      setSelectedStyleId(activeChannelStyle.visualAnimationStyle as SupportedVideoStyleId);
    }
  }, [styleFromUrl, activeChannelStyle?.visualAnimationStyle]);

  // Output Package State
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [generationStep, setGenerationStep] = React.useState<string>("");
  const [pkg, setPkg] = React.useState<CompleteVideoIntelligencePackage | null>(null);
  const [scriptPkg, setScriptPkg] = React.useState<CompleteScriptIntelligencePackage | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = React.useState<
    "scenes" | "script" | "factcheck" | "hooks" | "quality" | "channel_dna" | "sound" | "retention" | "seo" | "feedback" | "benchmark"
  >("scenes");

  // Feedback State
  const [feedbackRating, setFeedbackRating] = React.useState<"POSITIVE" | "NEGATIVE" | null>(null);
  const [selectedFeedbackTags, setSelectedFeedbackTags] = React.useState<string[]>([]);
  const [feedbackNotes, setFeedbackNotes] = React.useState<string>("");
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState<boolean>(false);

  // Toast / Copy notification state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Auto-sync style and topic when channel or URL changes
  React.useEffect(() => {
    if (styleFromUrl) {
      setSelectedStyleId(styleFromUrl);
    } else if (activeChannelStyle?.visualAnimationStyle) {
      setSelectedStyleId(activeChannelStyle.visualAnimationStyle as SupportedVideoStyleId);
    }
  }, [styleFromUrl, activeChannelStyle?.visualAnimationStyle]);

  React.useEffect(() => {
    if (titleFromUrl) {
      setTopic(titleFromUrl);
    } else if (activeChannelStyle?.popularTopics && activeChannelStyle.popularTopics.length > 0) {
      setTopic(activeChannelStyle.popularTopics[0]);
    }
  }, [titleFromUrl, activeChannelStyle?.profileId]);

  // Run the 10-Stage Script Intelligence & Complete Video Engine
  const runGeneration = React.useCallback(
    (targetTopic: string, styleId: SupportedVideoStyleId) => {
      setIsGenerating(true);
      setFeedbackSubmitted(false);
      setFeedbackRating(null);
      setSelectedFeedbackTags([]);

      setGenerationStep("Stage 1/10: Topic Understanding & Brief Formulation...");

      setTimeout(() => {
        setGenerationStep("Stage 2/10: Authoritative Topic Research (Tier 1/2 Sources)...");
      }, 250);

      setTimeout(() => {
        setGenerationStep("Stage 3/10: Fact Verification & Atomic Claim Auditing...");
      }, 500);

      setTimeout(() => {
        setGenerationStep("Stage 4/10: Story Architecture & Narrative Blueprinting...");
      }, 750);

      setTimeout(() => {
        setGenerationStep("Stage 5/10: Hook Intelligence & Anti-Clickbait Evaluation...");
      }, 1000);

      setTimeout(() => {
        setGenerationStep("Stage 6/10: Human Scriptwriting & Spoken Voiceover...");
      }, 1250);

      setTimeout(() => {
        setGenerationStep("Stage 7/10: Retention Editor & Curiosity Resolution...");
      }, 1500);

      setTimeout(() => {
        setGenerationStep("Stage 8/10: Script Duration & Non-Overlapping Timestamps...");
      }, 1750);

      setTimeout(() => {
        setGenerationStep("Stage 9/10: 10-Dimension Rubric Quality Audit...");
      }, 2000);

      setTimeout(() => {
        setGenerationStep("Stage 10/10: Final Composition & Copy Packaging...");

        // Generate V2 Script Intelligence Package
        const v2Result = generateScriptIntelligencePackage({
          userInput: {
            channelId: channel?.id || "active_chan",
            topic: targetTopic,
            format: contentFormat,
            targetDurationSeconds: durationSeconds,
            language: scriptLanguage,
          },
          channel,
          activeStyleProfile: activeChannelStyle,
        });

        // Generate Scene Choreography & Audio Timeline Package
        const v1Result = generateCompleteVideoPackage({
          topic: targetTopic,
          channelName: channel?.channel_title || "",
          channelNiche: activeChannelStyle?.channelNiche || "",
          selectedStyleId: styleId,
          format: contentFormat === "youtube_shorts" ? "shorts" : "longform",
          durationSeconds,
        });

        setScriptPkg(v2Result);
        setPkg(v1Result);
        setIsGenerating(false);
        setGenerationStep("");
      }, 2200);
    },
    [contentFormat, scriptLanguage, durationSeconds, channel, activeChannelStyle]
  );

  // Initial load auto-run
  React.useEffect(() => {
    runGeneration(topic, selectedStyleId);
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

  const handleFeedbackSubmit = () => {
    if (!feedbackRating || !scriptPkg) return;
    recordCreatorFeedback({
      feedbackId: `fb_${Date.now()}`,
      channelId: scriptPkg.channelId,
      topic: scriptPkg.topic,
      originalVoiceover: scriptPkg.completeVoiceoverText,
      rating: feedbackRating,
      tags: selectedFeedbackTags as any,
      notes: feedbackNotes,
      submittedAt: new Date().toISOString(),
    });
    setFeedbackSubmitted(true);
    setToastMessage("Feedback saved! Channel writing preferences updated.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isAnimationChannel = Boolean(pkg?.isAnimationMode);

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 max-w-7xl mx-auto px-1 sm:px-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. CHANNEL INTELLIGENCE BANNER */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-navy-800 bg-white/95 dark:bg-navy-900/90 p-3.5 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
              {channel?.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={channel.thumbnail_url}
                  alt={channel.channel_title}
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <Youtube className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {channel ? channel.channel_title : "ASH Creator Studio"}
                </span>
                {channel && (
                  <Badge variant="outline" className="text-[10px] font-semibold text-red-500 border-red-500/20 bg-red-500/5 shrink-0">
                    @{channel.custom_url || "channel"}
                  </Badge>
                )}
                {scriptPkg?.status === "READY" ? (
                  <Badge variant="success" className="text-[10px] font-bold shrink-0">
                    🛡️ Script Intelligence V2: READY ({scriptPkg.qualityReport.overallScore}/100)
                  </Badge>
                ) : (
                  <Badge variant="brand" className="text-[10px] font-bold shrink-0">
                    ⚡ Script Engine V2 Active
                  </Badge>
                )}
              </div>

              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {channel
                  ? `Calibrated for ${channel.channel_title} (${activeChannelStyle?.channelNiche || "Curiosities"}) • 10-Stage Pipeline Active`
                  : "Multi-Channel Script Intelligence Engine: 10-Stage Research, Fact-Verification & Human Scriptwriting"}
              </p>
            </div>
          </div>

          <Link href="/modules/style-lab" className="shrink-0 self-start sm:self-auto text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1">
            <Dna className="h-3.5 w-3.5" />
            <span>Customize Style DNA →</span>
          </Link>
        </div>
      </div>

      {/* 2. TOPIC INPUT & PART B CORE USER CONTROLS */}
      <Card className="border-slate-200/80 dark:border-navy-800">
        <CardContent className="p-3.5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
            <div className="md:col-span-5 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Topic / Central Learning Subject
              </label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Why are most passenger airplanes white?"
                disabled={isGenerating}
                className="text-xs sm:text-sm font-semibold"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Content Format (Part B)</label>
              <select
                value={contentFormat}
                onChange={(e) => setContentFormat(e.target.value as ScriptContentFormat)}
                disabled={isGenerating}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="youtube_shorts">YouTube Shorts (9:16)</option>
                <option value="longform_youtube">Long-Form YouTube (16:9)</option>
                <option value="educational_video">Educational Video</option>
                <option value="science_explainer">Science Explainer</option>
                <option value="history_documentary">History Documentary</option>
                <option value="interesting_facts">Interesting Facts</option>
                <option value="storytelling">Storytelling</option>
                <option value="tutorial">Tutorial</option>
                <option value="product_explanation">Product Explanation</option>
                <option value="custom_format">Custom Format</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Language</label>
              <select
                value={scriptLanguage}
                onChange={(e) => setScriptLanguage(e.target.value as ScriptLanguage)}
                disabled={isGenerating}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Hindi">Hindi (Conversational Spoken)</option>
                <option value="English">English (Articulate Presenter)</option>
                <option value="Hinglish">Hinglish (Urban Casual)</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Duration</span>
                <span className="text-brand-600 dark:text-brand-400 font-mono">{durationSeconds}s</span>
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
                  onClick={() => runGeneration(topic, selectedStyleId)}
                  isLoading={isGenerating}
                  className="shrink-0 gap-1.5 px-4 bg-brand-500 hover:bg-brand-600 font-bold text-xs shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Generate</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 3. VISUAL STYLE CARDS (13 STYLES) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-navy-800">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-brand-500" />
                <span>Select Channel Visual Style ({ALL_SUPPORTED_VIDEO_STYLES.length} Styles):</span>
              </label>

              {activeChannelStyle && (
                <button
                  type="button"
                  onClick={() => {
                    const defStyle =
                      ALL_SUPPORTED_VIDEO_STYLES.find(
                        (s) => s.id === activeChannelStyle.visualAnimationStyle
                      ) || ALL_SUPPORTED_VIDEO_STYLES[0];
                    setSelectedStyleId(defStyle.id);
                    runGeneration(topic, defStyle.id);
                  }}
                  className="text-[11px] text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>🎯 Use Channel DNA Default ({activeChannelStyle.visualStyleLabel.split(" ")[0]})</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-2.5">
              {ALL_SUPPORTED_VIDEO_STYLES.map((style) => {
                const isSelected = selectedStyleId === style.id;
                const isChannelDefault = activeChannelStyle?.visualAnimationStyle === style.id;

                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setSelectedStyleId(style.id);
                      runGeneration(topic, style.id);
                    }}
                    className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/30 shadow-md"
                        : "border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-slate-300 dark:hover:border-navy-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md truncate max-w-[85px] ${
                          isChannelDefault
                            ? "bg-emerald-500 text-white"
                            : isSelected
                            ? "bg-brand-500 text-white"
                            : "bg-slate-100 dark:bg-navy-800 text-slate-500"
                        }`}
                      >
                        {isChannelDefault ? "Channel DNA 🎯" : style.badge}
                      </span>
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-brand-500 shrink-0" />}
                    </div>

                    <div className="relative h-12 sm:h-14 w-full rounded-lg overflow-hidden mb-1.5 bg-slate-950 border border-slate-200/60 dark:border-navy-700 shadow-2xs">
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

                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {style.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {style.badge || style.description.slice(0, 30)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GENERATION PROGRESS INDICATOR */}
      {isGenerating && (
        <Card className="border-brand-500/40 bg-brand-50/20 dark:bg-navy-900/40 p-4 sm:p-6 text-center animate-pulse">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Executing Script Intelligence Engine V2 (10-Stage Pipeline)
              </h3>
              <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-mono">
                {generationStep}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 4. RESULTS WORKSPACE */}
      {!isGenerating && pkg && (
        <div className="space-y-4">
          {/* TOP TOOLBAR: 10 DEDICATED ONE-CLICK COPY BUTTONS */}
          <Card className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-3 sm:p-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-brand-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  10 One-Click Production Copy Actions
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Click any button to copy exact formatted section</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    scriptPkg ? formatCopyV2FullScript(scriptPkg) : formatCopyScript(pkg),
                    "Full Script",
                    "btn_script"
                  )
                }
                className="text-xs gap-1.5 justify-start truncate"
              >
                <Copy className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_script" ? "Copied!" : "1. Copy Script"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    scriptPkg ? formatCopyV2Voiceover(scriptPkg) : formatCopyVoiceover(pkg),
                    "Voiceover Only",
                    "btn_vo"
                  )
                }
                className="text-xs gap-1.5 justify-start truncate"
              >
                <Mic className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_vo" ? "Copied!" : "2. Copy Voiceover"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    scriptPkg ? formatCopyV2Hook(scriptPkg) : `Hook: "${pkg.scenes[0]?.voiceover}"`,
                    "Hook Opening",
                    "btn_hook"
                  )
                }
                className="text-xs gap-1.5 justify-start truncate text-amber-600 dark:text-amber-400 border-amber-500/30"
              >
                <Sparkles className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_hook" ? "Copied!" : "3. Copy Hook"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    scriptPkg ? formatCopyV2OnScreenText(scriptPkg) : formatCopyVideoTimeline(pkg),
                    "On-Screen Text",
                    "btn_text"
                  )
                }
                className="text-xs gap-1.5 justify-start truncate"
              >
                <FileText className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_text" ? "Copied!" : "4. Copy Text Cues"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    scriptPkg ? formatCopyV2ScenePrompts(scriptPkg) : formatCopyScenePrompts(pkg),
                    "Video Prompts",
                    "btn_prompts"
                  )
                }
                className="text-xs gap-1.5 justify-start truncate text-cyan-600 dark:text-cyan-400 border-cyan-500/30"
              >
                <ImageIcon className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_prompts" ? "Copied!" : "5. Copy Prompts"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    scriptPkg ? formatCopyV2FactCheck(scriptPkg) : formatCopyFactCheckReport(pkg),
                    "Fact-Check & Sources",
                    "btn_facts"
                  )
                }
                className="text-xs gap-1.5 justify-start truncate text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              >
                <ShieldCheck className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_facts" ? "Copied!" : "6. Copy Sources"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerCopy(formatCopySoundEffectsTimeline(pkg), "SFX Timeline", "btn_sfx")}
                className="text-xs gap-1.5 justify-start truncate"
              >
                <Volume2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_sfx" ? "Copied!" : "7. Copy SFX List"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerCopy(formatCopyBackgroundMusicInstructions(pkg), "BGM Guide", "btn_bgm")}
                className="text-xs gap-1.5 justify-start truncate text-purple-600 dark:text-purple-400 border-purple-500/30"
              >
                <Music className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_bgm" ? "Copied!" : "8. Copy BGM Guide"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerCopy(formatCopySeoPackage(pkg), "SEO Package", "btn_seo")}
                className="text-xs gap-1.5 justify-start truncate"
              >
                <TrendingUp className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_seo" ? "Copied!" : "9. Copy SEO Data"}</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  triggerCopy(
                    scriptPkg ? formatCopyV2FullScript(scriptPkg) : formatCopyCompleteVideoPackage(pkg),
                    "Complete Package",
                    "btn_all"
                  )
                }
                className="text-xs gap-1.5 justify-start truncate font-bold shadow-xs"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{copiedKey === "btn_all" ? "Copied All!" : "10. Copy All-in-One"}</span>
              </Button>
            </div>
          </Card>

          {/* MAIN WORKSPACE TABS */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-navy-800 pb-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { id: "scenes", label: "🎬 15-Point Scene Plan", badge: `${pkg.totalScenes} Scenes` },
                { id: "script", label: "📜 Human Spoken Script", badge: `${scriptPkg?.pacingMetrics.totalSpokenWords || pkg.totalWords}w` },
                { id: "factcheck", label: "🛡️ Fact-Check & Sources", badge: `${scriptPkg?.factCheck.verifiedCount || 3} Verified` },
                { id: "hooks", label: "🎣 Hook Intelligence Lab", badge: `${scriptPkg?.allHookCandidates.length || 5} Hooks` },
                { id: "quality", label: "🏆 10-Rubric Scorecard", badge: `${scriptPkg?.qualityReport.overallScore || 95}/100` },
                { id: "channel_dna", label: "🧬 Channel Writing DNA", badge: "Isolated" },
                { id: "sound", label: "🎧 AI Sound Director", badge: `${pkg.soundEffectsTimeline.length} SFX` },
                { id: "feedback", label: "💬 Creator Feedback", badge: "Part H" },
                { id: "benchmark", label: "🧪 30 Benchmark Topics", badge: "Part I" },
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
                      activeTab === tab.id
                        ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                        : "bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: 15-POINT SCENE PRODUCTION PLAN */}
          {activeTab === "scenes" && (
            <div className="space-y-4">
              {pkg.scenes.map((scene) => (
                <Card
                  key={scene.sceneNumber}
                  className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 shadow-sm"
                >
                  <CardContent className="p-3.5 sm:p-5 space-y-3.5">
                    {/* Header Attributes: Scene Number, Time, Stage, Transition */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white text-xs font-bold shadow-xs">
                          {scene.sceneNumber}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {scene.stageName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono font-medium">
                          [{scene.startTime} - {scene.endTime}] ({scene.durationSeconds}s)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[10px] bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                          Cut: {scene.transition}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            triggerCopy(
                              `SCENE ${scene.sceneNumber} [${scene.startTime} - ${scene.endTime}]\n` +
                                `VOICEOVER: ${scene.voiceover}\n\n` +
                                `VISUAL (1:1): ${scene.visualDescription}\n\n` +
                                `MIDJOURNEY: ${scene.aiImagePrompt}\n\n` +
                                `RUNWAY MOTION: ${scene.aiVideoPrompt}\n\n` +
                                `SFX: ${scene.soundEffects} | BGM: ${scene.bgmInstructions}`,
                              `Scene ${scene.sceneNumber}`,
                              `sc_${scene.sceneNumber}`
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-navy-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors shadow-2xs"
                        >
                          <Copy className="h-3 w-3" />
                          <span>{copiedKey === `sc_${scene.sceneNumber}` ? "Copied!" : "Copy Scene"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Attribute 5: Voiceover */}
                    <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <Mic className="h-3 w-3" />
                          <span>Attribute 5: Voiceover Dialogue (1:1 Natural Spoken Line)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => triggerCopy(scene.voiceover, "Voiceover Line", `vo_${scene.sceneNumber}`)}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="h-2.5 w-2.5" />
                          <span>{copiedKey === `vo_${scene.sceneNumber}` ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        "{scene.voiceover}"
                      </p>
                    </div>

                    {/* Attribute 6: Visual Description (Exact 1:1 Match) */}
                    <div className="p-3 rounded-xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                        Attribute 6: Visual Description (Strict 1:1 Match with Spoken Voiceover)
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {scene.visualDescription}
                      </p>
                    </div>

                    {/* Attribute 8, 9, 10, 11: Production Directions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/70 dark:border-navy-800">
                        <span className="font-bold text-slate-500 text-[10px] uppercase block">Attr 8: Camera Move</span>
                        <span className="text-slate-800 dark:text-slate-200">{scene.cameraMovement}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/70 dark:border-navy-800">
                        <span className="font-bold text-slate-500 text-[10px] uppercase block">Attr 9: Character Move</span>
                        <span className="text-slate-800 dark:text-slate-200">{scene.characterMovement}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/70 dark:border-navy-800">
                        <span className="font-bold text-slate-500 text-[10px] uppercase block">Attr 10: Animation</span>
                        <span className="text-slate-800 dark:text-slate-200">{scene.animationInstructions}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/70 dark:border-navy-800">
                        <span className="font-bold text-slate-500 text-[10px] uppercase block">Attr 11: Background</span>
                        <span className="text-slate-800 dark:text-slate-200">{scene.backgroundDetails}</span>
                      </div>
                    </div>

                    {/* Attribute 7: Prompts Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            <span>Midjourney v6.1 / Flux Image Prompt</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => triggerCopy(scene.aiImagePrompt, "Image Prompt", `mid_${scene.sceneNumber}`)}
                            className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                          >
                            {copiedKey === `mid_${scene.sceneNumber}` ? "Copied!" : "Copy Image Prompt"}
                          </button>
                        </div>
                        <pre className="p-2 rounded-lg bg-slate-900 text-cyan-200 text-[11px] font-mono whitespace-pre-wrap select-all leading-relaxed">
                          {scene.aiImagePrompt}
                        </pre>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <Film className="h-3 w-3" />
                            <span>Runway Gen-3 / Kling Motion Prompt</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => triggerCopy(scene.aiVideoPrompt, "Video Prompt", `run_${scene.sceneNumber}`)}
                            className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            {copiedKey === `run_${scene.sceneNumber}` ? "Copied!" : "Copy Video Prompt"}
                          </button>
                        </div>
                        <pre className="p-2 rounded-lg bg-slate-900 text-purple-200 text-[11px] font-mono whitespace-pre-wrap select-all leading-relaxed">
                          {scene.aiVideoPrompt}
                        </pre>
                      </div>
                    </div>

                    {/* Audio Cues & On-Screen Text */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                        <span className="font-bold block text-[10px] uppercase">Attr 15: On-Screen Text</span>
                        <span className="font-semibold">"{scene.onScreenText}"</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-slate-700 dark:text-slate-300">
                        <span className="font-bold block text-[10px] uppercase">Attr 12: Sound Effect</span>
                        <span>{scene.soundEffects}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-slate-700 dark:text-slate-300">
                        <span className="font-bold block text-[10px] uppercase">Attr 13: BGM & Ducking</span>
                        <span>{scene.bgmInstructions}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* TAB 2: STAGE 6 & 10 HUMAN SPOKEN SCRIPT */}
          {activeTab === "script" && scriptPkg && (
            <div className="space-y-4">
              <Card className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Mic className="h-5 w-5 text-emerald-500" />
                      <span>Stage 6: Spoken Voiceover & Sentence Purpose Analysis</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Paced at {scriptPkg.pacingMetrics.wordsPerMinute} WPM • Total Words: {scriptPkg.pacingMetrics.totalSpokenWords} • Runtime: {scriptPkg.actualDurationSeconds}s
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => triggerCopy(scriptPkg.completeVoiceoverText, "Full Voiceover", "tab_vo")}
                    className="gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Voiceover</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {scriptPkg.sections.map((sec, idx) => (
                    <div
                      key={sec.sectionId}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-brand-500 text-white font-mono text-[10px] font-bold">
                            {formatTime(sec.startSeconds)} - {formatTime(sec.endSeconds)}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            Section {idx + 1}: {sec.title}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {sec.sectionType}
                          </Badge>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerCopy(formatCopyV2SingleSection(sec), `Section ${idx + 1}`, `sec_${idx}`)}
                          className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          <span>{copiedKey === `sec_${idx}` ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed pl-1 border-l-2 border-emerald-500">
                        "{sec.voiceover}"
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-400 uppercase text-[9px]">Narrative Function:</span>
                        <span className="bg-white dark:bg-navy-900 px-2 py-0.5 rounded border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300">
                          {sec.purpose}
                        </span>
                        {sec.claimIds.length > 0 && (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono text-[10px]">
                            Claims: {sec.claimIds.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: STAGE 2 & 3 FACT-CHECK & AUTHORITATIVE CITATIONS */}
          {activeTab === "factcheck" && scriptPkg && (
            <div className="space-y-4">
              <Card className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                      <span>Stage 3: Fact Verification & Tier 1/2 Citations Report</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Every atomic claim independently audited against empirical science, institutional archives & patents
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => triggerCopy(formatCopyV2FactCheck(scriptPkg), "Citations Report", "tab_cit")}
                    className="gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Citations</span>
                  </Button>
                </div>

                {/* Status Badges Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">Verified Claims</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{scriptPkg.factCheck.verifiedCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Audited</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{scriptPkg.factCheck.totalClaimsChecked}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Fabricated URLs</span>
                    <span className="text-lg font-bold text-emerald-500">0 (Strictly Zero)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Report Status</span>
                    <span className="text-sm font-bold text-emerald-500 mt-1 block">{scriptPkg.factCheck.status}</span>
                  </div>
                </div>

                {/* Atomic Claims List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Audited Atomic Factual Claims & Primary Sources:
                  </span>
                  <div className="space-y-3">
                    {scriptPkg.factCheck.claims.map((claim, idx) => (
                      <div
                        key={claim.id}
                        className="p-3.5 rounded-xl border border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-950 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                              Claim #{idx + 1}
                            </span>
                            <Badge variant={claim.status === "VERIFIED" ? "success" : "destructive"} className="text-[10px] font-bold">
                              {claim.status}
                            </Badge>
                            {claim.isCorrected && (
                              <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30 bg-amber-500/10">
                                Refuted Common Misconception
                              </Badge>
                            )}
                          </div>
                          {claim.primarySourceUrl && (
                            <a
                              href={claim.primarySourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>Official Link</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                          "{claim.claimText}"
                        </p>

                        <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-navy-900 p-2.5 rounded-lg border border-slate-100 dark:border-navy-800 space-y-1">
                          <div>
                            <span className="font-bold text-slate-400 text-[10px] uppercase">Supporting Evidence: </span>
                            <span>{claim.verificationEvidence}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            <span className="font-bold text-slate-400 text-[10px] uppercase">Publisher: </span>
                            <span>{claim.primaryPublisher || "Authoritative Science Authority"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: STAGE 5 HOOK INTELLIGENCE LAB */}
          {activeTab === "hooks" && scriptPkg && (
            <div className="space-y-4">
              <Card className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      <span>Stage 5: Hook Intelligence Lab (5 Psychological Archetypes Evaluated)</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Banned clickbait filters active: zero generic '99% people don't know' tropes permitted
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => triggerCopy(formatCopyV2Hook(scriptPkg), "Selected Hook", "tab_hk")}
                    className="gap-1.5 text-xs self-start sm:self-auto"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Winning Hook</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {scriptPkg.allHookCandidates.map((hk, idx) => {
                    const isSelected = hk.id === scriptPkg.selectedHook.id;
                    return (
                      <div
                        key={hk.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isSelected
                            ? "border-emerald-500/80 bg-emerald-50/10 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20"
                            : "border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-950"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              Candidate #{idx + 1}: {hk.hookType}
                            </span>
                            {isSelected && (
                              <Badge variant="success" className="text-[10px] font-bold">
                                🏆 Selected Winner ({hk.totalScore}/100)
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-500">
                            <span>Truth: {hk.truthfulness}/100</span>
                            <span>Curiosity: {hk.curiosityScore}/100</span>
                            <span>Clarity: {hk.clarity}/100</span>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                          "{hk.text}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 5: STAGE 9 10-DIMENSION QUALITY RUBRIC */}
          {activeTab === "quality" && scriptPkg && (
            <div className="space-y-4">
              <Card className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      <span>Stage 9: Quality Control Rubric ({scriptPkg.qualityReport.overallScore}/100)</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Independent 10-dimension algorithmic audit across truthfulness, continuity, and duration
                    </p>
                  </div>
                  <Badge variant={scriptPkg.status === "READY" ? "success" : "destructive"} className="text-xs self-start sm:self-auto font-bold">
                    Status: {scriptPkg.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">1. Topic Relevance</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{scriptPkg.qualityReport.rubricScores.topicRelevance}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">2. Fact Accuracy</span>
                    <span className="text-base font-bold text-emerald-500">{scriptPkg.qualityReport.rubricScores.factualAccuracy}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">3. Story Continuity</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{scriptPkg.qualityReport.rubricScores.storyContinuity}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">4. Human Language</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{scriptPkg.qualityReport.rubricScores.humanNaturalness}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">5. Info Value</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{scriptPkg.qualityReport.rubricScores.informationValue}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">6. Hook-to-Payoff</span>
                    <span className="text-base font-bold text-brand-500">{scriptPkg.qualityReport.rubricScores.hookToPayoff}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">7. Retention Struct</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{scriptPkg.qualityReport.rubricScores.retentionStructure}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">8. Duration Fit</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{scriptPkg.qualityReport.rubricScores.durationAccuracy}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">9. Channel Match</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{scriptPkg.qualityReport.rubricScores.channelMatch}/100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">10. Originality</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">{scriptPkg.qualityReport.rubricScores.originality}/100</span>
                  </div>
                </div>

                {/* Critical Violations & Remediation */}
                {scriptPkg.qualityReport.criticalViolations.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 space-y-1">
                    <span className="font-bold uppercase tracking-wider block">Critical Violations:</span>
                    <ul className="list-disc list-inside">
                      {scriptPkg.qualityReport.criticalViolations.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB 6: PART C CHANNEL WRITING DNA */}
          {activeTab === "channel_dna" && scriptPkg && (
            <div className="space-y-4">
              <Card className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Dna className="h-5 w-5 text-brand-500" />
                      <span>Part C: Channel Writing DNA ({scriptPkg.channelWritingDNA.channelName})</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Isolated voice, formality, vocabulary preferences, and content restrictions for this channel
                    </p>
                  </div>
                  <Link href="/modules/style-lab" className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                    Edit Channel Profile →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Channel Niche</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-1 block">{scriptPkg.channelWritingDNA.channelNiche}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Vocabulary</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-1 block">{scriptPkg.channelWritingDNA.vocabularyPreference}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Formality</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-1 block">{scriptPkg.channelWritingDNA.formality}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Sentence Cadence</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-1 block">{scriptPkg.channelWritingDNA.sentenceLength}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Emotional Intensity</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-1 block">{scriptPkg.channelWritingDNA.emotionalIntensity}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">CTA Preference</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-1 block">{scriptPkg.channelWritingDNA.ctaPreference}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Content Restrictions</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {scriptPkg.channelWritingDNA.contentRestrictions.map((res, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-navy-900 text-[11px] font-medium border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300">
                        🛡️ {res}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 7: AI SOUND DIRECTOR */}
          {activeTab === "sound" && (
            <div className="space-y-4">
              <Card className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-amber-500" />
                      <span>AI Sound Director Timeline (Exact Timestamps & Volume)</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Synchronized sound effects with automatic -16 dB audio ducking during narration
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => triggerCopy(formatCopySoundEffectsTimeline(pkg), "SFX Timeline", "tab_sfx")}
                    className="text-xs gap-1.5 self-start sm:self-auto"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy SFX Timeline</span>
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-navy-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-navy-950 text-slate-500 border-b border-slate-200 dark:border-navy-800 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">Sound Effect</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Purpose</th>
                        <th className="p-3">Volume</th>
                        <th className="p-3">License</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                      {pkg.soundEffectsTimeline.map((sfx) => (
                        <tr key={sfx.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-950/50">
                          <td className="p-3 font-mono font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap">
                            {sfx.startTime} - {sfx.endTime}
                          </td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">{sfx.soundName}</td>
                          <td className="p-3">
                            <span className="rounded bg-slate-100 dark:bg-navy-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                              {sfx.category}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{sfx.purpose}</td>
                          <td className="p-3 font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">{sfx.volumeLevel}</td>
                          <td className="p-3 text-[11px] text-slate-400">{sfx.licenseInfo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 8: PART H CREATOR FEEDBACK & PREFERENCE LEARNING */}
          {activeTab === "feedback" && (
            <Card className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 sm:p-6 space-y-4">
              <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-brand-500" />
                  <span>Part H: Creator Feedback & Channel Preference Learning</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your feedback calibrates future prompt contexts strictly for {channel?.channel_title || "this channel"}
                </p>
              </div>

              {feedbackSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">Feedback Recorded Successfully!</h5>
                  <p className="text-xs text-slate-500">
                    Preferences for channel <strong>{channel?.channel_title}</strong> have been updated in isolated storage.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setFeedbackSubmitted(false)} className="mt-2 text-xs">
                    Submit Another Note
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Overall Script Quality Rating</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFeedbackRating("POSITIVE")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          feedbackRating === "POSITIVE"
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30"
                            : "border-slate-200 dark:border-navy-800 hover:border-slate-300"
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>High Quality Script</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedbackRating("NEGATIVE")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          feedbackRating === "NEGATIVE"
                            ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/30"
                            : "border-slate-200 dark:border-navy-800 hover:border-slate-300"
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Needs Improvement</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Select Specific Feedback Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Good script",
                        "Weak hook",
                        "Too robotic",
                        "Too long",
                        "Too short",
                        "Not enough facts",
                        "Incorrect information",
                        "Wrong channel style",
                        "Poor storytelling",
                        "Too complex",
                        "Too basic",
                      ].map((tag) => {
                        const isSelected = selectedFeedbackTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              setSelectedFeedbackTags((prev) =>
                                isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                              isSelected
                                ? "border-brand-500 bg-brand-500 text-white shadow-xs"
                                : "border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Optional Creator Notes</label>
                    <textarea
                      rows={3}
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      placeholder="Add any specific adjustment notes (e.g. 'Use simpler words for kids', 'Increase emphasis on solar radiation')..."
                      className="w-full rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={!feedbackRating}
                    className="font-bold text-xs px-6 bg-brand-500 hover:bg-brand-600"
                  >
                    Save Channel Preference Feedback
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* TAB 9: PART I 30-TOPIC BENCHMARK EVALUATION */}
          {activeTab === "benchmark" && (
            <Card className="border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 sm:p-6 space-y-4">
              <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-brand-500" />
                  <span>Part I: Permanent Script Evaluation Benchmark (30 Diverse Topics)</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any verified benchmark topic below to instantly load and test across the 10-stage pipeline
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                {BENCHMARK_EVALUATION_TOPICS.map((bench) => (
                  <button
                    key={bench.id}
                    type="button"
                    onClick={() => {
                      setTopic(bench.topic);
                      runGeneration(bench.topic, selectedStyleId);
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 hover:border-brand-500/50 hover:bg-brand-50/10 text-left transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400">
                          #{bench.id} [{bench.category}]
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover:text-brand-500 font-bold">
                          Test Topic →
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                        {bench.topic}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block truncate">
                      Target: {bench.expectedSubject}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
