// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// MASTER TEN-STAGE PIPELINE ORCHESTRATOR
// ==============================================================================

import { Channel } from "@/lib/supabase/types";
import { ChannelStyleProfile } from "@/types/channel-intelligence";
import {
  ChannelWritingDNA,
  CompleteScriptIntelligencePackage,
  UserScriptInput,
} from "./types";
import { resolveChannelWritingDNA } from "./channel-writing-dna";
import { buildTopicBrief } from "./stage1-topic-understanding";
import { conductTopicResearch } from "./stage2-topic-research";
import { verifyFactualClaims } from "./stage3-fact-verification";
import { buildStoryBlueprint } from "./stage4-story-architect";
import { generateAndEvaluateHooks } from "./stage5-hook-intelligence";
import { writeProductionScript } from "./stage6-human-scriptwriter";
import { analyzeAndOptimizeRetention } from "./stage7-retention-editor";
import { calibratePacingAndTimestamps } from "./stage8-duration-pacing";
import { auditScriptQuality } from "./stage9-quality-control";
import {
  composeFinalScriptPackage,
  formatCopyFullScript,
  formatCopyHookOnly,
  formatCopyOnScreenTextOnly,
  formatCopyScenePromptsOnly,
  formatCopySingleSection,
  formatCopySourcesAndFactCheck,
  formatCopyVoiceoverOnly,
} from "./stage10-final-composer";

export interface GenerateScriptPipelineOptions {
  userInput: UserScriptInput;
  channel?: Channel | null;
  activeStyleProfile?: ChannelStyleProfile | null;
  writingDNA?: ChannelWritingDNA;
}

/**
 * Runs the full 10-Stage Script Intelligence Engine V2 pipeline.
 */
export function generateScriptIntelligencePackage(
  options: GenerateScriptPipelineOptions
): CompleteScriptIntelligencePackage {
  const { userInput, channel = null, activeStyleProfile = null } = options;

  // -------------------------------------------------------------
  // STAGE 0: Channel Writing DNA Resolution (Part C)
  // -------------------------------------------------------------
  const writingDNA =
    options.writingDNA ||
    resolveChannelWritingDNA(channel, activeStyleProfile, userInput.format, userInput.language);

  // -------------------------------------------------------------
  // STAGE 1: Topic Understanding Engine
  // -------------------------------------------------------------
  const topicBrief = buildTopicBrief(
    userInput.topic,
    writingDNA,
    userInput.format,
    userInput.targetDurationSeconds
  );

  // -------------------------------------------------------------
  // STAGE 2: Topic Research Engine
  // -------------------------------------------------------------
  const researchReport = conductTopicResearch(topicBrief);

  // -------------------------------------------------------------
  // STAGE 3: Fact Verification Engine
  // -------------------------------------------------------------
  const factCheck = verifyFactualClaims(topicBrief, researchReport);

  // -------------------------------------------------------------
  // STAGE 4: Story Architect
  // -------------------------------------------------------------
  const storyBlueprint = buildStoryBlueprint(
    topicBrief,
    factCheck,
    writingDNA,
    userInput.format,
    userInput.targetDurationSeconds
  );

  // -------------------------------------------------------------
  // STAGE 5: Hook Intelligence Engine
  // -------------------------------------------------------------
  const { selectedHook, allCandidates } = generateAndEvaluateHooks(topicBrief, writingDNA);

  // -------------------------------------------------------------
  // STAGE 6: Human Scriptwriter Engine
  // -------------------------------------------------------------
  const rawSections = writeProductionScript(
    topicBrief,
    storyBlueprint,
    factCheck,
    selectedHook,
    writingDNA
  );

  // -------------------------------------------------------------
  // STAGE 7: Retention Editor
  // -------------------------------------------------------------
  const { sections: retentionSections, retention: retentionAnalysis } = analyzeAndOptimizeRetention(
    rawSections,
    topicBrief,
    writingDNA
  );

  // -------------------------------------------------------------
  // STAGE 8: Script Duration & Pacing Engine
  // -------------------------------------------------------------
  const { sections: pacedSections, metrics: pacingMetrics } = calibratePacingAndTimestamps(
    retentionSections,
    userInput.targetDurationSeconds,
    userInput.language,
    writingDNA
  );

  // -------------------------------------------------------------
  // STAGE 9: Quality Control Engine
  // -------------------------------------------------------------
  const qualityReport = auditScriptQuality(
    pacedSections,
    topicBrief,
    factCheck,
    pacingMetrics,
    retentionAnalysis,
    writingDNA
  );

  // -------------------------------------------------------------
  // STAGE 10: Final Script Composer
  // -------------------------------------------------------------
  const masterPackage = composeFinalScriptPackage({
    channelWritingDNA: writingDNA,
    topic: userInput.topic,
    format: userInput.format,
    targetDurationSeconds: userInput.targetDurationSeconds,
    language: userInput.language,
    topicBrief,
    researchReport,
    factCheck,
    storyBlueprint,
    selectedHook,
    allHookCandidates: allCandidates,
    sections: pacedSections,
    retentionAnalysis,
    pacingMetrics,
    qualityReport,
  });

  return masterPackage;
}

// Re-export types and formatters
export * from "./types";
export * from "./channel-writing-dna";
export * from "./stage1-topic-understanding";
export * from "./stage2-topic-research";
export * from "./stage3-fact-verification";
export * from "./stage4-story-architect";
export * from "./stage5-hook-intelligence";
export * from "./stage6-human-scriptwriter";
export * from "./stage7-retention-editor";
export * from "./stage8-duration-pacing";
export * from "./stage9-quality-control";
export * from "./stage10-final-composer";
export * from "./feedback-system";
export * from "./evaluation-dataset";
