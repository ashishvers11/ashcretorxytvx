// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// STAGE 10: FINAL SCRIPT COMPOSER & COPY FORMATTERS
// ==============================================================================

import {
  ChannelWritingDNA,
  CompleteScriptIntelligencePackage,
  FactCheckReport,
  HookCandidate,
  PacingMetrics,
  ProductionScriptSection,
  QualityReport,
  RetentionAnalysis,
  ScriptContentFormat,
  ScriptLanguage,
  StoryBlueprint,
  StructuredResearchReport,
  TopicBrief,
} from "./types";

/**
 * Composes the master production package conforming strictly to Part F structured output schema.
 */
export function composeFinalScriptPackage(params: {
  channelWritingDNA: ChannelWritingDNA;
  topic: string;
  format: ScriptContentFormat;
  targetDurationSeconds: number;
  language: ScriptLanguage;
  topicBrief: TopicBrief;
  researchReport: StructuredResearchReport;
  factCheck: FactCheckReport;
  storyBlueprint: StoryBlueprint;
  selectedHook: HookCandidate;
  allHookCandidates: HookCandidate[];
  sections: ProductionScriptSection[];
  retentionAnalysis: RetentionAnalysis;
  pacingMetrics: PacingMetrics;
  qualityReport: QualityReport;
}): CompleteScriptIntelligencePackage {
  const {
    channelWritingDNA,
    topic,
    format,
    targetDurationSeconds,
    language,
    topicBrief,
    researchReport,
    factCheck,
    storyBlueprint,
    selectedHook,
    allHookCandidates,
    sections,
    retentionAnalysis,
    pacingMetrics,
    qualityReport,
  } = params;

  // Generate crisp video title
  const isHindi = language === "Hindi" || language === "Hinglish";
  let videoTitle = "";
  if (topic.includes("?") || topic.length > 25) {
    videoTitle = topic;
  } else {
    videoTitle = isHindi
      ? `${topicBrief.mainSubject} का असली सच | 60-Second Explanation`
      : `The Surprising Truth About ${topicBrief.mainSubject} | Explained`;
  }

  // Concatenate complete voiceover
  const completeVoiceoverText = sections.map((s) => s.voiceover).join("\n\n");

  return {
    schemaVersion: "2.0",
    generatedAt: new Date().toISOString(),
    channelId: channelWritingDNA.channelId,
    channelName: channelWritingDNA.channelName,
    topic,
    format,
    targetDurationSeconds,
    actualDurationSeconds: pacingMetrics.calculatedDurationSeconds,
    language,
    status: qualityReport.overallStatus,

    videoTitle,
    centralIdea: topicBrief.mainLearningOutcome,
    selectedHook,
    allHookCandidates,
    completeVoiceoverText,

    sections,

    topicBrief,
    researchReport,
    factCheck,
    storyBlueprint,
    retentionAnalysis,
    pacingMetrics,
    qualityReport,
    channelWritingDNA,

    promptVersion: "script_intel_v2.0_prod",
  };
}

// ------------------------------------------------------------------------------
// One-Click Independent Copy Formatters
// ------------------------------------------------------------------------------

export function formatCopyFullScript(pkg: CompleteScriptIntelligencePackage): string {
  const header = `🎬 ${pkg.videoTitle.toUpperCase()}
Channel: ${pkg.channelName} (${pkg.channelWritingDNA.channelNiche})
Target Duration: ${pkg.targetDurationSeconds}s | Runtime: ${pkg.actualDurationSeconds}s | Language: ${pkg.language}
Quality Score: ${pkg.qualityReport.overallScore}/100 (${pkg.status})
═══════════════════════════════════════════════════════════════════\n\n`;

  const body = pkg.sections
    .map(
      (sec, idx) =>
        `[SCENE ${idx + 1} | ${sec.sectionType} | ${formatTime(sec.startSeconds)} - ${formatTime(sec.endSeconds)} (${sec.durationSeconds}s)]
VOICEOVER:
"${sec.voiceover}"

ON-SCREEN TEXT: ${sec.onScreenText}
CAMERA MOVEMENT: ${sec.cameraMovement}
SOUND EFFECT: ${sec.soundEffect}
RUNWAY/KLING MOTION PROMPT:
${sec.videoMotionPromptRunway}
MIDJOURNEY/FLUX IMAGE PROMPT:
${sec.visualPromptMidjourney}`
    )
    .join("\n\n───────────────────────────────────────────────────────────────────\n\n");

  return header + body;
}

export function formatCopyVoiceoverOnly(pkg: CompleteScriptIntelligencePackage): string {
  return pkg.sections
    .map((sec, idx) => `[${formatTime(sec.startSeconds)} - ${formatTime(sec.endSeconds)}] ${sec.voiceover}`)
    .join("\n\n");
}

export function formatCopyHookOnly(pkg: CompleteScriptIntelligencePackage): string {
  return `HOOK (${pkg.selectedHook.hookType} | Score: ${pkg.selectedHook.totalScore}/100):
"${pkg.selectedHook.text}"`;
}

export function formatCopyOnScreenTextOnly(pkg: CompleteScriptIntelligencePackage): string {
  return pkg.sections
    .map((sec, idx) => `Scene ${idx + 1} (${formatTime(sec.startSeconds)}): ${sec.onScreenText}`)
    .join("\n");
}

export function formatCopyScenePromptsOnly(pkg: CompleteScriptIntelligencePackage): string {
  return pkg.sections
    .map(
      (sec, idx) =>
        `--- SCENE ${idx + 1} (${formatTime(sec.startSeconds)} - ${formatTime(sec.endSeconds)}) ---
RUNWAY GEN-3 / KLING VIDEO PROMPT:
${sec.videoMotionPromptRunway}

MIDJOURNEY v6.1 / FLUX PROMPT:
${sec.visualPromptMidjourney}`
    )
    .join("\n\n");
}

export function formatCopySourcesAndFactCheck(pkg: CompleteScriptIntelligencePackage): string {
  const claims = pkg.factCheck.claims
    .map(
      (c, idx) =>
        `${idx + 1}. [${c.status}] ${c.claimText}
   - Evidence: ${c.verificationEvidence}
   - Source: ${c.primaryPublisher || "Scientific Authority"} (${c.primarySourceUrl || "Verified Reference"})`
    )
    .join("\n\n");

  return `FACT-CHECK & CITATION REPORT
Status: ${pkg.factCheck.status} (${pkg.factCheck.verifiedCount} Verified / ${pkg.factCheck.totalClaimsChecked} Checked)
═══════════════════════════════════════════════════════════════════
${claims}`;
}

export function formatCopySingleSection(sec: ProductionScriptSection): string {
  return `[${sec.sectionType} | ${formatTime(sec.startSeconds)} - ${formatTime(sec.endSeconds)}]
VOICEOVER:
"${sec.voiceover}"

ON-SCREEN TEXT: ${sec.onScreenText}
CAMERA: ${sec.cameraMovement}
SFX: ${sec.soundEffect}
MOTION PROMPT: ${sec.videoMotionPromptRunway}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}
