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
  User,
  Sliders,
  Volume2,
  Video,
  FileText,
  PlusCircle,
  Camera,
  Play,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TRENDING_AI_STYLES,
  DEFAULT_CHARACTERS,
  AIVideoStyle,
  ConsistentCharacter,
  GeneratedVideoPackage,
  generateScenePackage,
  recommendStyleForTopic,
} from "@/lib/ai/video-prompt-engine";

function ScriptWriterContent() {
  const searchParams = useSearchParams();
  const titleFromUrl = searchParams.get("title");
  const styleFromUrl = searchParams.get("style");

  // Form State
  const [title, setTitle] = React.useState(
    titleFromUrl || "लौंग असल में फूल है या फल? (The Science Behind Cloves)"
  );

  const [format, setFormat] = React.useState<"shorts" | "longform">("shorts");
  const [durationSeconds, setDurationSeconds] = React.useState<number>(60);

  // Styles State (combining trending + saved custom styles)
  const [allStyles, setAllStyles] = React.useState<AIVideoStyle[]>(TRENDING_AI_STYLES);
  const [selectedStyleId, setSelectedStyleId] = React.useState<string>(styleFromUrl || "stickman_doodle");

  // Character Consistency State
  const [characterEnabled, setCharacterEnabled] = React.useState<boolean>(true);
  const [selectedCharId, setSelectedCharId] = React.useState<string>("ashish_stickman");
  const [customCharText, setCustomCharText] = React.useState<string>("");

  // Generator & Output State
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [generationStep, setGenerationStep] = React.useState<string>("");
  const [videoPackage, setVideoPackage] = React.useState<GeneratedVideoPackage | null>(null);

  // Active view tab: "prompts" (Scene-by-scene AI video prompts) or "script" (Full voiceover script)
  const [activeTab, setActiveTab] = React.useState<"prompts" | "script">("prompts");
  const [copiedSceneIndex, setCopiedSceneIndex] = React.useState<number | null>(null);
  const [copiedAllPrompts, setCopiedAllPrompts] = React.useState<boolean>(false);
  const [copiedScript, setCopiedScript] = React.useState<boolean>(false);
  const [saved, setSaved] = React.useState<boolean>(false);

  // Load custom styles from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("ash_custom_styles");
      if (stored) {
        const custom: AIVideoStyle[] = JSON.parse(stored);
        setAllStyles([...TRENDING_AI_STYLES, ...custom]);
      }
    } catch (e) {}
  }, []);

  // Auto-switch to stickman character anchor if stickman style is chosen
  React.useEffect(() => {
    if (selectedStyleId === "stickman_doodle") {
      setSelectedCharId("ashish_stickman");
    }
  }, [selectedStyleId]);

  // Compute recommended style for active title
  const recommendedStyle = React.useMemo(() => recommendStyleForTopic(title), [title]);

  const activeStyle = allStyles.find((s) => s.id === selectedStyleId) || allStyles[0];
  const activeCharacter = DEFAULT_CHARACTERS.find((c) => c.id === selectedCharId) || {
    id: "custom",
    name: "Custom Character",
    description: customCharText || "Custom protagonist",
    anchorPrompt: customCharText || "Consistent Protagonist: South Asian science investigator",
    avatarSeed: "custom",
  };

  // Generate package on initial load or title change from URL
  const runGeneration = React.useCallback(
    (
      targetTitle: string,
      targetFormat: "shorts" | "longform",
      targetDuration: number,
      styleObj: AIVideoStyle
    ) => {
      setIsGenerating(true);
      setGenerationStep("Analyzing curiosity hook & narrative pacing...");

      setTimeout(() => {
        setGenerationStep(`Applying visual style: ${styleObj.name}...`);
      }, 400);

      setTimeout(() => {
        setGenerationStep(
          characterEnabled
            ? `Locking consistent character: ${activeCharacter.name}...`
            : "Composing scene camera motion & lighting..."
        );
      }, 800);

      setTimeout(() => {
        setGenerationStep("Formatting Midjourney, Runway Gen-3 & Kling prompts...");
      }, 1200);

      setTimeout(() => {
        const pkg = generateScenePackage({
          title: targetTitle,
          format: targetFormat,
          durationSeconds: targetDuration,
          style: styleObj,
          characterEnabled,
          character: characterEnabled ? activeCharacter : undefined,
          language: "hindi",
        });

        setVideoPackage(pkg);
        setIsGenerating(false);
        setGenerationStep("");
      }, 1500);
    },
    [characterEnabled, activeCharacter]
  );

  // Initial load
  React.useEffect(() => {
    runGeneration(title, format, durationSeconds, activeStyle);
  }, []);

  // Sync when titleFromUrl changes
  React.useEffect(() => {
    if (titleFromUrl && titleFromUrl !== title) {
      setTitle(titleFromUrl);
      const rec = recommendStyleForTopic(titleFromUrl);
      setSelectedStyleId(rec.id);
      runGeneration(titleFromUrl, format, durationSeconds, rec);
    }
  }, [titleFromUrl]);

  // Copy helpers
  const handleCopyScenePrompt = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSceneIndex(index);
    setTimeout(() => setCopiedSceneIndex(null), 2000);
  };

  const handleCopyAllPrompts = () => {
    if (!videoPackage) return;
    const all = videoPackage.scenes
      .map(
        (s) =>
          `SCENE ${s.sceneNumber} [${s.timeRange}] (${s.stageName})\n` +
          `CAMERA: ${s.cameraDirection}\n` +
          `MIDJOURNEY / KLING PROMPT:\n${s.midjourneyPrompt}\n\n` +
          `RUNWAY MOTION PROMPT:\n${s.runwayMotionPrompt}\n\n` +
          `VOICEOVER DIALOG:\n${s.dialogVoiceover}\n` +
          `ON-SCREEN TEXT: ${s.onScreenText}\n` +
          `SFX CUE: ${s.sfxCue}\n` +
          `--------------------------------------------------`
      )
      .join("\n\n");

    navigator.clipboard.writeText(all);
    setCopiedAllPrompts(true);
    setTimeout(() => setCopiedAllPrompts(false), 2000);
  };

  const handleCopyScriptOnly = () => {
    if (!videoPackage) return;
    navigator.clipboard.writeText(videoPackage.fullVoiceoverScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!videoPackage) return;
    const full =
      `==================================================\n` +
      `ASH CREATOR STUDIO — AI VIDEO PRODUCTION SHEET\n` +
      `TITLE: ${videoPackage.title}\n` +
      `FORMAT: ${videoPackage.format.toUpperCase()} (${videoPackage.aspectRatio})\n` +
      `TARGET DURATION: ${videoPackage.durationSeconds} Seconds\n` +
      `VISUAL STYLE: ${videoPackage.selectedStyle.name}\n` +
      `CHARACTER CONSISTENCY: ${characterEnabled ? activeCharacter.name : "Disabled"}\n` +
      `TOTAL SCENES: ${videoPackage.totalScenes}\n` +
      `TOTAL WORDS: ${videoPackage.totalWords} (~${videoPackage.estimatedSpeakingMinutes} mins speaking)\n` +
      `==================================================\n\n` +
      videoPackage.scenes
        .map(
          (s) =>
            `### SCENE ${s.sceneNumber}: [${s.timeRange}] - ${s.stageName}\n` +
            `CAMERA DIRECTION: ${s.cameraDirection}\n\n` +
            `[AI VIDEO GENERATOR PROMPT (Midjourney / Kling)]:\n` +
            `${s.midjourneyPrompt}\n\n` +
            `[RUNWAY / LUMA MOTION PROMPT]:\n` +
            `${s.runwayMotionPrompt}\n\n` +
            `[VOICEOVER DIALOG]:\n"${s.dialogVoiceover}"\n\n` +
            `[ON-SCREEN TEXT]: "${s.onScreenText}"\n` +
            `[SFX CUE]: ${s.sfxCue}\n` +
            `--------------------------------------------------`
        )
        .join("\n\n");

    const blob = new Blob([full], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.slice(0, 30).replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, "_")}_AI_Video_Prompts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!videoPackage) return;
    localStorage.setItem("ash_saved_video_package", JSON.stringify(videoPackage));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const quickPresets = [
    "लौंग असल में फूल है या फल? (The Science Behind Cloves)",
    "अगर धरती 5 सेकंड के लिए घूमना बंद कर दे तो क्या होगा?",
    "हवाई जहाज का रंग हमेशा सफेद ही क्यों होता है?",
    "मोबाइल की बैटरी को 80% पर ही क्यों रोक देना चाहिए?",
    "क्या पौधे सच में दर्द महसूस करते हैं? Science Truth",
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Video & Script Studio
            </h2>
            <Badge variant="brand">Scene-by-Scene AI Prompts</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate synchronized Hindi voiceovers + Midjourney / Runway Gen-3 / Kling visual prompts with consistent character
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadTxt} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Export Scene Sheet</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleCopyAllPrompts} className="gap-1.5 text-xs">
            {copiedAllPrompts ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedAllPrompts ? "Copied All Prompts!" : "Copy All Prompts"}</span>
          </Button>

          <Button size="sm" onClick={handleSave} className="gap-1.5 text-xs bg-brand-500 hover:bg-brand-600 font-bold">
            <Save className="h-3.5 w-3.5" />
            <span>{saved ? "Saved!" : "Save Package"}</span>
          </Button>
        </div>
      </div>

      {/* Quick Topic Presets */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-4 space-y-2 bg-white dark:bg-navy-900">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          ⚡ Quick Educational Topic Presets (Click to Load):
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          {quickPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setTitle(preset);
                const rec = recommendStyleForTopic(preset);
                setSelectedStyleId(rec.id);
                runGeneration(preset, format, durationSeconds, rec);
              }}
              className={`px-3 py-1 text-xs rounded-lg border text-left transition-all ${
                title === preset
                  ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-semibold shadow-xs"
                  : "border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </Card>

      {/* Video Settings Configuration Bar */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-5 space-y-5 bg-white dark:bg-navy-900">
        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Video Topic or Question:</span>
            <span className="text-[11px] text-brand-500 font-semibold">
              Channel: @ashishfn (Science & Curiosities)
            </span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. लौंग असल में फूल है या फल? या कोई भी विज्ञान का सवाल..."
              className="text-sm font-semibold flex-1"
            />
            <Button
              onClick={() => runGeneration(title, format, durationSeconds, activeStyle)}
              isLoading={isGenerating}
              className="gap-2 shrink-0 bg-brand-500 hover:bg-brand-600 font-bold px-6"
            >
              <Sparkles className="h-4 w-4" />
              <span>⚡ Generate Script & AI Prompts</span>
            </Button>
          </div>
        </div>

        {/* 1. Format & Custom Duration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-navy-800">
          {/* Format Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Video Format & Aspect Ratio:</span>
              <span className="text-[11px] font-mono text-brand-500">
                {format === "shorts" ? "9:16 Vertical (Shorts / Reels)" : "16:9 Landscape (YouTube Video)"}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormat("shorts");
                  setDurationSeconds(60);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  format === "shorts"
                    ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold shadow-xs"
                    : "border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                <div className="h-7 w-5 rounded bg-brand-500 text-white flex items-center justify-center font-bold text-[10px]">
                  9:16
                </div>
                <div>
                  <div className="text-xs font-bold">YouTube Shorts</div>
                  <div className="text-[10px] text-slate-400 font-normal">Under 60s Fast Paced</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormat("longform");
                  setDurationSeconds(300); // 5 mins default
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  format === "longform"
                    ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold shadow-xs"
                    : "border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                <div className="h-5 w-7 rounded bg-brand-500 text-white flex items-center justify-center font-bold text-[10px]">
                  16:9
                </div>
                <div>
                  <div className="text-xs font-bold">Long-Form Video</div>
                  <div className="text-[10px] text-slate-400 font-normal">Deep Explainer (3 - 12m)</div>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Custom Target Duration:</span>
              <span className="text-[11px] font-bold text-emerald-500">
                {durationSeconds >= 60 ? `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60 ? (durationSeconds % 60) + 's' : ''}` : `${durationSeconds}s`}
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {format === "shorts" ? (
                [15, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDurationSeconds(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      durationSeconds === sec
                        ? "bg-brand-500 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {sec} Seconds
                  </button>
                ))
              ) : (
                [
                  { sec: 180, label: "3 Mins" },
                  { sec: 300, label: "5 Mins" },
                  { sec: 480, label: "8 Mins" },
                  { sec: 600, label: "10 Mins" },
                  { sec: 720, label: "12 Mins" },
                ].map((item) => (
                  <button
                    key={item.sec}
                    type="button"
                    onClick={() => setDurationSeconds(item.sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      durationSeconds === item.sec
                        ? "bg-brand-500 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 2. Visual Style Selector (6 Trending Styles + Custom Styles) */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-navy-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-brand-500" />
              <span>Select AI Visual Style ({allStyles.length} Styles Available):</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedStyleId(recommendedStyle.id)}
                className="text-[11px] text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>⚡ Use Recommended: {recommendedStyle.name.split(" ")[0]}</span>
              </button>
              <Link href="/modules/style-lab" className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <span>+ Custom Style Lab</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {allStyles.map((s) => {
              const isSelected = selectedStyleId === s.id;
              const isRec = recommendedStyle.id === s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStyleId(s.id)}
                  className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                    isSelected
                      ? s.id === "stickman_doodle"
                        ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30"
                        : "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20"
                      : "border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800"
                  }`}
                >
                  {isRec && (
                    <span className="absolute -top-2 right-2 text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full shadow-xs z-10">
                      Rec
                    </span>
                  )}
                  {/* Style Preview Photo */}
                  <div className="relative h-16 sm:h-20 w-full rounded-lg overflow-hidden mb-2 bg-slate-950 border border-slate-200/60 dark:border-navy-700 shadow-xs">
                    {s.previewImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.previewImage}
                        alt={s.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-r ${s.previewGradient}`} />
                    )}
                    <span className="absolute bottom-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs">
                      {s.badge}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                      {s.name}
                    </h5>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {s.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Character Consistency Lock Controller */}
        <div className="pt-2 border-t border-slate-100 dark:border-navy-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={characterEnabled}
                  onChange={(e) => setCharacterEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-navy-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-navy-600 peer-checked:bg-brand-500"></div>
              </label>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-brand-500" />
                  <span>Lock Character Consistency Across All Scenes</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Injects an identical protagonist anchor prompt into every scene so AI video models don't morph faces
                </p>
              </div>
            </div>

            {characterEnabled && (
              <Badge variant="brand" className="text-[10px] self-start sm:self-auto">
                Anchor Active: {activeCharacter.name}
              </Badge>
            )}
          </div>

          {characterEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
              {DEFAULT_CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => setSelectedCharId(char.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedCharId === char.id
                      ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold ring-1 ring-brand-500/20 shadow-xs"
                      : "border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span className="truncate">{char.name}</span>
                    {char.id === "ashish_stickman" && (
                      <span className="text-[9px] text-amber-500 font-bold px-1 rounded bg-amber-500/10 shrink-0 ml-1">
                        🎯 Signature
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                    {char.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Generation Progress Indicator */}
        {isGenerating && (
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center gap-3 text-xs font-bold text-brand-600 dark:text-brand-400 animate-pulse">
            <Sparkles className="h-4 w-4 animate-spin text-brand-500" />
            <span>{generationStep || "Generating AI Video Package..."}</span>
          </div>
        )}
      </Card>

      {/* Output Studio Package Cards */}
      {videoPackage && (
        <div className="space-y-4">
          {/* Metrics & Overview Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-3 border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Scenes</span>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {videoPackage.totalScenes} Prompts
              </p>
            </Card>

            <Card className="p-3 border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Duration</span>
              <p className="text-lg font-black text-brand-500 mt-0.5">
                {videoPackage.durationSeconds}s ({videoPackage.aspectRatio})
              </p>
            </Card>

            <Card className="p-3 border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Word Count</span>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {videoPackage.totalWords} Words
              </p>
            </Card>

            <Card className="p-3 border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Visual Style</span>
              <p className="text-sm font-black text-emerald-500 truncate mt-1">
                {videoPackage.selectedStyle.name.split(" ")[0]}
              </p>
            </Card>
          </div>

          {/* View Mode Toggle: Scene Prompts vs Voiceover Script */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("prompts")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "prompts"
                    ? "bg-brand-500 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Scene-by-Scene AI Video Prompts ({videoPackage.scenes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("script")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "script"
                    ? "bg-brand-500 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Full Voiceover Script</span>
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={activeTab === "prompts" ? handleCopyAllPrompts : handleCopyScriptOnly}
              className="gap-1.5 text-xs h-8"
            >
              <Copy className="h-3 w-3" />
              <span>{activeTab === "prompts" ? "Copy All Prompts" : "Copy Script Text"}</span>
            </Button>
          </div>

          {/* TAB 1: SCENE-BY-SCENE AI VIDEO PROMPTS */}
          {activeTab === "prompts" && (
            <div className="space-y-4">
              {videoPackage.scenes.map((scene, idx) => (
                <Card
                  key={scene.sceneNumber}
                  className="border-slate-200/80 dark:border-navy-800 p-5 bg-white dark:bg-navy-900 space-y-4 hover:border-brand-500/40 transition-colors"
                >
                  {/* Scene Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-navy-800">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white font-extrabold text-xs">
                        {scene.sceneNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Scene {scene.sceneNumber}: {scene.stageName}
                      </h4>
                      <Badge variant="brand" className="text-[10px]">
                        {scene.timeRange}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        Camera: <strong className="text-slate-700 dark:text-slate-300">{scene.cameraDirection.split(" ")[0]}</strong>
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyScenePrompt(idx, scene.midjourneyPrompt)}
                        className="text-xs gap-1.5 h-7 px-2.5"
                      >
                        {copiedSceneIndex === idx ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedSceneIndex === idx ? "Copied!" : "Copy Prompt"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* AI Video Prompts Grid */}
                  <div className="space-y-3">
                    {/* Prompt Box 1: Midjourney / Kling */}
                    <div className="rounded-xl bg-slate-900 text-slate-100 p-3.5 space-y-1.5 font-mono text-xs border border-slate-800">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans uppercase font-bold">
                        <span className="text-cyan-400">🎨 Midjourney / Kling Visual Prompt:</span>
                        <span>{videoPackage.aspectRatio}</span>
                      </div>
                      <p className="leading-relaxed select-all text-slate-200">
                        {scene.midjourneyPrompt}
                      </p>
                    </div>

                    {/* Prompt Box 2: Runway Gen-3 / Luma Motion */}
                    <div className="rounded-xl bg-slate-50 dark:bg-navy-950 p-3 space-y-1 text-xs border border-slate-200/80 dark:border-navy-800">
                      <div className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 font-sans">
                        🎬 Runway Gen-3 / Luma Motion Direction:
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                        {scene.runwayMotionPrompt}
                      </p>
                    </div>

                    {/* Voiceover Dialog & Visual Cues */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="md:col-span-2 rounded-lg bg-emerald-500/5 dark:bg-emerald-950/15 border border-emerald-500/20 p-3 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                          🎙️ Voiceover Dialog (Hindi):
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                          "{scene.dialogVoiceover}"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-2 text-[11px]">
                          <span className="font-bold text-amber-600 dark:text-amber-400 block text-[10px] uppercase">
                            🔤 On-Screen Text:
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {scene.onScreenText}
                          </span>
                        </div>

                        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-2 text-[11px]">
                          <span className="font-bold text-blue-600 dark:text-blue-400 block text-[10px] uppercase">
                            🔊 SFX Cue:
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {scene.sfxCue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* TAB 2: FULL VOICEOVER SCRIPT */}
          {activeTab === "script" && (
            <Card className="p-6 border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Synchronized Voiceover Script
                  </h4>
                  <p className="text-xs text-slate-400">
                    Paced at 140 WPM • Ideal for clear engaging Hindi narration
                  </p>
                </div>
                <Button size="sm" onClick={handleCopyScriptOnly} className="gap-1.5 text-xs">
                  {copiedScript ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedScript ? "Script Copied!" : "Copy Full Script"}</span>
                </Button>
              </div>

              <textarea
                rows={16}
                readOnly
                value={videoPackage.fullVoiceoverScript}
                className="w-full rounded-xl border border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 p-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-sans leading-relaxed focus:outline-none"
              />
            </Card>
          )}

          {/* Next Step Action Cards */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-brand-500/10 to-indigo-500/10 border border-brand-500/20">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Prompts Ready? Optimize your metadata next
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-CTR tags and description in SEO Studio for "{title}".
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/modules/seo-studio?title=${encodeURIComponent(title)}`}>
                <Button size="sm" className="gap-1.5 text-xs bg-brand-500 hover:bg-brand-600 font-bold">
                  <span>Generate SEO Tags</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScriptWriterPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading AI Video Studio...</div>}>
      <ScriptWriterContent />
    </React.Suspense>
  );
}
