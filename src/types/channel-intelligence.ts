// ==============================================================================
// ASH CREATOR STUDIO 2.0 — CONTENT INTELLIGENCE TYPE DEFINITIONS
// Multi-Channel Isolation, Channel Style DNA, Fact Verification & Script Quality
// ==============================================================================

export type VisualAnimationType =
  | "stickman_doodle"
  | "paper_cutout"
  | "realistic_cinematic"
  | "asmr_satisfying"
  | "pixar_3d"
  | "unreal_3d"
  | "noir_mystery"
  | "whiteboard_explainer"
  | "anime_ghibli"
  | "stop_motion"
  | "retro_comic"
  | "faceless_documentary"
  | "motion_graphics"
  | "mixed_custom";

export type ScriptApprovalStatus =
  | "draft"
  | "researching"
  | "fact_checking"
  | "needs_correction"
  | "approved"
  | "ready_for_production";

export type FactVerificationStatus =
  | "verified"
  | "partially_verified"
  | "unverified"
  | "false_misleading";

export interface FactCheckClaim {
  id: string;
  claim: string;
  status: FactVerificationStatus;
  sourceTitle: string;
  sourceUrl: string;
  sourceInstitution: string; // e.g. "NASA Goddard", "Nature Journal", "NIH", "Oxford University"
  confidenceScore: number; // 0 - 100
  notes: string;
  originalText: string;
  correctedText?: string;
  isApplied?: boolean;
}

export interface FactCheckReport {
  claims: FactCheckClaim[];
  totalClaimsChecked: number;
  verifiedCount: number;
  partiallyVerifiedCount: number;
  unverifiedCount: number;
  falseCount: number;
  overallStatus: "fully_verified" | "needs_correction" | "unverified_warning" | "high_risk";
  summary: string;
  checkedAt: string;
}

export interface ScriptQualityScore {
  hookStrength: number; // Max 15
  storytelling: number; // Max 15
  humanLanguage: number; // Max 15
  factualAccuracy: number; // Max 20
  audienceRelevance: number; // Max 10
  retentionPotential: number; // Max 10
  originality: number; // Max 10
  channelStyleMatch: number; // Max 5
  totalScore: number; // 0 - 100
  grade: "excellent" | "good" | "needs_revision" | "rewrite_required";
  verdict: string;
  improvementTips: string[];
}

export interface ChannelStyleProfile {
  // 20 Mandatory Channel Intelligence Fields (Phase 1)
  profileId: string;
  channelId: string;
  channelName: string; // 1
  youtubeChannelId: string; // 2
  channelDescription: string; // 3
  channelNiche: string; // 4
  channelSubNiche: string; // 5
  targetAudience: string; // 6
  audienceAgeGroup: string; // 7 (e.g. "18–28 young adult curious thinkers")
  primaryLanguage: "Hindi" | "Hinglish" | "English" | "Bilingual"; // 8
  contentFormat: "YouTube Shorts (9:16)" | "Long-Form Explainer (16:9)" | "Hybrid"; // 9
  videoDuration: string; // 10 (e.g. "45–60s fast-paced shorts")
  visualAnimationStyle: VisualAnimationType; // 11
  visualStyleLabel: string; // Human readable name
  editingStyle: string; // 12
  voiceoverStyle: string; // 13
  storytellingStyle: string; // 14
  hookStyle: string; // 15
  averageVideoLength: number; // 16 (in seconds)
  popularTopics: string[]; // 17
  successfulVideoPatterns: string[]; // 18
  competitorChannels: string[]; // 19
  contentRestrictions: string[]; // 20

  // Visual Prompt Generation Modifiers (Locked to this channel)
  visualPromptModifier: string;
  negativePrompt: string;
  lightingPreference: string;
  cameraPreference: string;
  characterAnchor?: string;
  characterName?: string;
  sampleThumbnailGradient: string;

  // Analysis metadata
  analyzedVideosCount: number;
  dominantFormat: "shorts" | "longform";
  dominantPacingWpm: number;
  lastResearchedAt: string;
  isCustomized: boolean;
}

export interface HumanizedSceneItem {
  sceneNumber: number;
  timeRange: string;
  stageName: "Hook" | "Curiosity" | "Explanation" | "Story Development" | "Payoff" | "Ending & CTA";
  durationSeconds: number;
  voiceoverHindi: string;
  voiceoverEnglish: string;
  visualDescription: string;
  aiVideoPrompt: string; // Ready for Runway Gen-3, Kling, Midjourney, Luma
  midjourneyPrompt: string;
  runwayMotionPrompt: string;
  cameraMovement: string;
  animationInstructions: string;
  soundEffects: string;
  transitionInstructions: string;
  onScreenText: string;
}

export interface HumanizedVideoPackage {
  id: string;
  channelId: string;
  channelName: string;
  title: string;
  topic: string;
  format: "shorts" | "longform";
  durationSeconds: number;
  aspectRatio: "9:16" | "16:9";
  channelStyle: ChannelStyleProfile;
  isStyleOverridden?: boolean;
  overriddenStyleName?: string;

  // Content
  fullVoiceoverHindi: string;
  fullVoiceoverEnglish: string;
  scenes: HumanizedSceneItem[];
  totalScenes: number;
  totalWordsHindi: number;
  totalWordsEnglish: number;
  speakingRateWpm: number;

  // SEO Package
  seoTitle: string;
  seoDescription: string;
  seoTags: string[];

  // Fact Verification & Quality
  factCheckReport: FactCheckReport;
  qualityScore: ScriptQualityScore;
  approvalStatus: ScriptApprovalStatus;

  // Originality Check
  originalityScore: number;
  originalityNotes: string;

  // Research Sources
  researchSources: {
    title: string;
    url: string;
    type: "Journal" | "Institution" | "Official Data" | "Encyclopedia";
  }[];

  createdAt: string;
  updatedAt: string;
}

export type ScriptRegenerationAction =
  | "make_hook_stronger"
  | "make_it_more_natural"
  | "improve_storytelling"
  | "simplify_language"
  | "increase_curiosity"
  | "correct_factual_errors"
  | "match_channel_style"
  | "shorten_script"
  | "expand_script";
