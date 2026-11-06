// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// Channel Writing DNA Resolver (Part C)
// ==============================================================================

import { Channel } from "@/lib/supabase/types";
import { ChannelStyleProfile } from "@/types/channel-intelligence";
import { ChannelWritingDNA, ScriptContentFormat, ScriptLanguage } from "./types";
import { getChannelStyleProfile } from "@/lib/ai/channel-intelligence";

const STORAGE_KEY_WRITING_DNA_PREFIX = "ash_writing_dna_";

/**
 * Resolves a Channel Writing DNA profile for the given channel.
 * Reads creator-approved edits from localStorage if present;
 * otherwise builds a calibrated profile based on the channel's Style DNA.
 */
export function resolveChannelWritingDNA(
  channel: Channel | null,
  activeStyleProfile: ChannelStyleProfile | null,
  formatOverride?: ScriptContentFormat,
  languageOverride?: ScriptLanguage
): ChannelWritingDNA {
  const channelId = channel?.id || activeStyleProfile?.channelId || "default_channel";
  const channelName = channel?.channel_title || activeStyleProfile?.channelName || "Creator Channel";

  // Check for saved user edits/approval
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_WRITING_DNA_PREFIX}${channelId}`);
      if (saved) {
        const parsed = JSON.parse(saved) as ChannelWritingDNA;
        if (formatOverride) parsed.preferredVideoFormat = formatOverride;
        if (languageOverride) parsed.language = languageOverride;
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to load saved writing DNA:", e);
    }
  }

  const niche = activeStyleProfile?.channelNiche || "Education & Science Facts";
  const subNiche = activeStyleProfile?.channelSubNiche || "Curiosities & Practical Explanations";
  const style = activeStyleProfile?.visualAnimationStyle || "stickman_doodle";
  const primaryLanguage = (languageOverride || activeStyleProfile?.primaryLanguage || "Hindi") as ScriptLanguage;

  const isKids =
    style === "pixar_3d" ||
    niche.toLowerCase().includes("kid") ||
    channelName.toLowerCase().includes("kid");

  const isHistory =
    style === "paper_cutout" ||
    niche.toLowerCase().includes("history") ||
    niche.toLowerCase().includes("paper");

  const isAsmr =
    style === "asmr_satisfying" ||
    niche.toLowerCase().includes("asmr") ||
    niche.toLowerCase().includes("satisfying");

  const isGaming =
    style === "unreal_3d" ||
    niche.toLowerCase().includes("game");

  const isTech =
    style === "motion_graphics" ||
    niche.toLowerCase().includes("tech") ||
    niche.toLowerCase().includes("coding");

  const isHorror =
    style === "noir_mystery" ||
    niche.toLowerCase().includes("horror") ||
    niche.toLowerCase().includes("mystery");

  // Determine writing profile attributes based on niche & style
  let vocabularyPreference: ChannelWritingDNA["vocabularyPreference"] = "Conversational & Vivid";
  let formality: ChannelWritingDNA["formality"] = "Passionate & Engaging";
  let sentenceLength: ChannelWritingDNA["sentenceLength"] = "Short & Punchy (5-10 words)";
  let humorPreference: ChannelWritingDNA["humorPreference"] = "Subtle Wit";
  let emotionalIntensity: ChannelWritingDNA["emotionalIntensity"] = "Curious & Wonder-filled";
  let explanationDepth: ChannelWritingDNA["explanationDepth"] = "Mechanistic & Step-by-Step";
  let ctaPreference: ChannelWritingDNA["ctaPreference"] = "Seamless Next Video Loop";
  let audienceKnowledgeLevel: ChannelWritingDNA["audienceKnowledgeLevel"] = "Beginner / Curious";
  let contentRestrictions: string[] = [
    "Never invent unverified statistics",
    "No generic robotic filler like 'in this video we delve into'",
    "Never use clickbait that makes false promises",
  ];

  if (isKids) {
    vocabularyPreference = "Simple & Clear";
    formality = "Friendly & Casual";
    sentenceLength = "Short & Punchy (5-10 words)";
    humorPreference = "Playful & High Energy";
    emotionalIntensity = "Curious & Wonder-filled";
    explanationDepth = "Conceptual / Intuitive";
    ctaPreference = "Seamless Next Video Loop";
    audienceKnowledgeLevel = "Beginner / Curious";
    contentRestrictions.push("Zero scary or violent themes", "No dry textbook jargon");
  } else if (isHistory) {
    vocabularyPreference = "Conversational & Vivid";
    formality = "Documentary Formal";
    sentenceLength = "Balanced (10-18 words)";
    humorPreference = "None / Serious";
    emotionalIntensity = "Dramatic & High Stakes";
    explanationDepth = "Mechanistic & Step-by-Step";
    ctaPreference = "Comment Question";
    audienceKnowledgeLevel = "Intermediate";
    contentRestrictions.push("Never invent historical quotes or unproven events", "State uncertainties explicitly");
  } else if (isAsmr) {
    vocabularyPreference = "Conversational & Vivid";
    formality = "Friendly & Casual";
    sentenceLength = "Short & Punchy (5-10 words)";
    humorPreference = "None / Serious";
    emotionalIntensity = "Calm & Objective";
    explanationDepth = "Conceptual / Intuitive";
    ctaPreference = "None";
    audienceKnowledgeLevel = "Beginner / Curious";
    contentRestrictions.push("No shouting voiceover", "No jarring aggressive pacing");
  } else if (isGaming) {
    vocabularyPreference = "Conversational & Vivid";
    formality = "Passionate & Engaging";
    sentenceLength = "Short & Punchy (5-10 words)";
    humorPreference = "Playful & High Energy";
    emotionalIntensity = "Dramatic & High Stakes";
    explanationDepth = "Mechanistic & Step-by-Step";
    ctaPreference = "Subtle Channel Subscribe";
    audienceKnowledgeLevel = "Intermediate";
    contentRestrictions.push("Tested game mechanics only", "No fake glitch rumors");
  } else if (isTech) {
    vocabularyPreference = "Technical & Precise";
    formality = "Passionate & Engaging";
    sentenceLength = "Balanced (10-18 words)";
    humorPreference = "Subtle Wit";
    emotionalIntensity = "Curious & Wonder-filled";
    explanationDepth = "Mechanistic & Step-by-Step";
    ctaPreference = "Subtle Channel Subscribe";
    audienceKnowledgeLevel = "Intermediate";
    contentRestrictions.push("Verify code/architectural claims with official specs");
  } else if (isHorror) {
    vocabularyPreference = "Conversational & Vivid";
    formality = "Documentary Formal";
    sentenceLength = "Balanced (10-18 words)";
    humorPreference = "None / Serious";
    emotionalIntensity = "Dramatic & High Stakes";
    explanationDepth = "Mechanistic & Step-by-Step";
    ctaPreference = "Comment Question";
    audienceKnowledgeLevel = "Intermediate";
    contentRestrictions.push("Respect real victims", "Maintain atmospheric suspense without cheap jump scares");
  }

  const preferredFormat: ScriptContentFormat =
    formatOverride || (activeStyleProfile?.dominantFormat === "longform" ? "educational_video" : "youtube_shorts");

  return {
    channelId,
    channelName,
    channelNiche: niche,
    channelSubNiche: subNiche,
    targetAudience: activeStyleProfile?.targetAudience || "Curious YouTube audience",
    audienceKnowledgeLevel,
    language: primaryLanguage,
    vocabularyPreference,
    formality,
    sentenceLength,
    narrationStyle:
      activeStyleProfile?.voiceoverStyle ||
      (primaryLanguage === "Hindi"
        ? "Engaging, conversational Hindi narrator with natural cadence"
        : "Articulate, engaging English presenter with clear enunciation"),
    hookPreferences: [
      "Counter-intuitive question",
      "Curiosity gap with physical evidence",
      "Misconception challenge",
    ],
    storytellingStructure:
      activeStyleProfile?.storytellingStyle ||
      "Curiosity Hook -> Misconception -> Mechanism Proof -> Payoff Revelation",
    humorPreference,
    emotionalIntensity,
    explanationDepth,
    typicalDuration: activeStyleProfile?.averageVideoLength || 55,
    ctaPreference,
    contentRestrictions,
    preferredVideoFormat: preferredFormat,
    characterAnchor: activeStyleProfile?.characterAnchor,
    characterName: activeStyleProfile?.characterName,
  };
}

/**
 * Saves user edits or manual approval to a channel's writing DNA.
 */
export function saveChannelWritingDNA(dna: ChannelWritingDNA): void {
  if (typeof window === "undefined" || !dna.channelId) return;
  try {
    localStorage.setItem(
      `${STORAGE_KEY_WRITING_DNA_PREFIX}${dna.channelId}`,
      JSON.stringify(dna)
    );
  } catch (e) {
    console.error("Failed to save channel writing DNA:", e);
  }
}
