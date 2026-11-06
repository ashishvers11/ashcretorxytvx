// ==============================================================================
// ASH CREATOR STUDIO 2.0 — COMPLETE VIDEO INTELLIGENCE ENGINE TYPES
// Content Director, Video Researcher, Audio Director & Performance Analyst
// ==============================================================================

export type SupportedVideoStyleId =
  | "stickman_doodle"
  | "animation_2d"
  | "pixar_3d"
  | "paper_cutout"
  | "stop_motion"
  | "realistic_cinematic"
  | "documentary"
  | "whiteboard_explainer"
  | "ai_animation"
  | "gaming"
  | "asmr_satisfying"
  | "motion_graphics"
  | "mixed_media";

export interface SupportedVideoStyleDef {
  id: SupportedVideoStyleId;
  name: string;
  badge: string;
  description: string;
  promptModifier: string;
  negativePrompt: string;
  lightingPreference: string;
  cameraPreference: string;
  colorPalette: string;
  previewImage?: string;
}

// Phase 2: 15 Core Attributes per Scene
export interface ProductionSceneItem {
  sceneNumber: number; // 1
  stageName?: string; // Story beat name (e.g. "Viral Hook", "Curiosity Reveal")
  startTime: string; // 2 (e.g. "0:00")
  endTime: string; // 3 (e.g. "0:08")
  durationSeconds: number; // 4
  voiceover: string; // 5 (Conversational, natural)
  visualDescription: string; // 6 (Scientifically & visually 1:1 matching the voiceover)
  aiVideoPrompt: string; // 7 (Ready for Runway Gen-3 / Kling 1.5 / Luma)
  aiImagePrompt: string; // (Ready for Midjourney v6.1 / Flux.1)
  cameraMovement: string; // 8
  characterMovement: string; // 9
  animationInstructions: string; // 10
  backgroundDetails: string; // 11
  soundEffects: string; // 12
  bgmInstructions: string; // 13 (Music mood & ducking level)
  transition: string; // 14 (Hard cut, whip pan, match cut, zoom dissolve)
  onScreenText: string; // 15 (Kinetic typography & subtitle overlay)
}

// Phase 3: Smart Sound Effect Engine
export type SoundEffectCategory =
  | "Nature Sounds"
  | "Animation Sounds"
  | "Science Sounds"
  | "Cinematic Sounds"
  | "ASMR Sounds"
  | "Environment Sounds";

export interface SoundEffectTimelineItem {
  id: string;
  soundName: string;
  startTime: string; // e.g. "0:02"
  endTime: string; // e.g. "0:05"
  volumeLevel: string; // e.g. "-8 dB (70%)"
  audioType: "SFX" | "Foley" | "Ambient" | "Musical Hit" | "Impact";
  category: SoundEffectCategory;
  purpose: "Hook" | "Environment" | "Scientific Explanation" | "Important Reveal" | "Transition" | "Comic Impact";
  sourceName: string; // e.g. "YouTube Audio Library / Freesound"
  sourceUrl: string;
  licenseInfo: string; // e.g. "Royalty-Free / CC0 / Attribution Free"
}

// Phase 4: Background Music Intelligence
export interface BackgroundMusicRecommendation {
  musicName: string;
  category:
    | "Educational"
    | "Documentary"
    | "Curious"
    | "Suspense"
    | "Emotional"
    | "Cinematic"
    | "Funny"
    | "Relaxing"
    | "ASMR"
    | "Science"
    | "Adventure";
  mood: string;
  bpm: number;
  duration: string;
  source: string;
  license: string;
  attributionRequired: boolean;
  attributionText?: string;
  duckingLevel: string; // e.g. "-16 dB ducking when speech active"
}

// Phase 5: Audio Quality Analysis
export interface AudioQualityReport {
  voiceoverClarity: "Passed" | "Needs Review" | "Warning";
  backgroundNoise: "Passed" | "Needs Review" | "Warning";
  volumeConsistency: "Passed" | "Needs Review" | "Warning";
  audioClipping: "Passed" | "Needs Review" | "Warning";
  distortion: "Passed" | "Needs Review" | "Warning";
  bgmBalance: "Passed" | "Needs Review" | "Warning";
  sfxTiming: "Passed" | "Needs Review" | "Warning";
  audioSynchronization: "Passed" | "Needs Review" | "Warning";
  suddenSilence: "Passed" | "Needs Review" | "Warning";
  overallLoudnessLufs: string; // e.g. "-14.1 LUFS (YouTube Standard)"
  overallStatus: "Passed" | "Needs Review" | "Warning";
  mixingInstructions: string;
}

// Phase 6: Video Quality Analysis
export interface VideoQualityReport {
  resolution: string; // e.g. "1080x1920 (9:16 Vertical Shorts)"
  aspectRatio: "9:16" | "16:9";
  frameRate: "30 fps" | "60 fps";
  durationSeconds: number;
  blackFramesDetected: boolean;
  frozenFramesDetected: boolean;
  blankScenesDetected: boolean;
  visualGlitchesDetected: boolean;
  sceneRepetitionDetected: boolean;
  transitionQuality: "Smooth & Dynamic" | "Needs Review";
  characterConsistencyScore: number; // 0 - 100
  visualContinuity: "Passed" | "Needs Review";
  textReadabilitySafeZone: "Passed (100% in YouTube Safe Zone)" | "Needs Adjustment";
  subtitleSync: "Passed" | "Needs Review";
  visualToVoiceoverMatch: "Exact 1:1 Match (Verified)" | "Partial Match";
  overallStatus: "Passed" | "Needs Review";
}

// Phase 7: Retention & Storytelling Analyzer
export interface RetentionWarningItem {
  timeRange: string; // e.g. "0:08–0:13"
  assessment: string; // e.g. "Visual change recommended"
  type: "positive" | "warning" | "opportunity";
  recommendation: string;
}

export interface RetentionAnalysisReport {
  firstTwoSecondsHookRating: "Ultra High (98%)" | "Strong (85%)" | "Average (70%)";
  introductionLengthRating: "Optimal (4.2s)" | "Too Long" | "Needs Trim";
  informationDensity: "High Velocity (YouTube Shorts Calibrated)" | "Moderate" | "Sparse";
  storyProgressionScore: number; // 0 - 100
  visualChangeFrequencySeconds: number; // e.g. 2.5s per scene change
  curiosityGapPresent: boolean;
  payoffClimaxTimingSeconds: number;
  ctaPlacementAssessment: "Optimal (Last 5 seconds, natural endscreen bridge)" | "Early";
  retentionWarnings: RetentionWarningItem[];
}

// Phase 11: Final Video Quality Score (Weighted 100-Point Scoring)
export interface FinalVideoQualityScore {
  scriptQualityScore: number; // Max 15
  factualAccuracyScore: number; // Max 15
  channelStyleMatchScore: number; // Max 10
  visualQualityScore: number; // Max 15
  audioQualityScore: number; // Max 15
  storytellingScore: number; // Max 10
  retentionPotentialScore: number; // Max 10
  editingQualityScore: number; // Max 5
  seoQualityScore: number; // Max 5
  totalScore: number; // Max 100
  approvalStatus: "Approved for Production" | "Needs Review" | "Blocked (Factual Error)";
  scoringBreakdownNotes: string[];
}

// Phase 9: Complete Video Production Package
export interface CompleteVideoIntelligencePackage {
  id: string;
  channelId: string;
  channelName: string;
  channelNiche: string;
  title: string;
  topic: string;
  format: "shorts" | "longform";
  durationSeconds: number;
  aspectRatio: "9:16" | "16:9";

  // Phase 1: Video Style Intelligence
  selectedStyle: SupportedVideoStyleDef;

  // Phase 2: Scenes (15 points per scene)
  scenes: ProductionSceneItem[];
  totalScenes: number;
  fullVoiceoverScript: string;
  totalWords: number;
  estimatedSpeakingWpm: number;

  // Phase 3 & 4: Audio Intelligence (Sound Director)
  soundEffectsTimeline: SoundEffectTimelineItem[];
  bgmRecommendation: BackgroundMusicRecommendation;
  audioDuckingInstructions: string;

  // Phase 5: Audio Quality Report
  audioQualityReport: AudioQualityReport;

  // Phase 6: Video Quality Report
  videoQualityReport: VideoQualityReport;

  // Phase 7: Retention Analysis
  retentionAnalysis: RetentionAnalysisReport;

  // Fact Verification (Google & Wikipedia)
  verifiedFacts: {
    claim: string;
    status: "verified" | "auto_corrected";
    sourceTitle: string;
    sourceUrl: string;
    institution: string;
  }[];

  // Editing Instructions
  editingInstructions: {
    cutRhythm: string;
    zoomEffects: string;
    transitionTiming: string;
    subtitleSafeZone: string;
    colorGradingNotes: string;
  };

  // SEO Package
  seoPackage: {
    title: string;
    description: string;
    keywords: string[];
    tags: string[];
    hashtags: string[];
  };

  // Phase 11: Final 100-Point Score
  qualityScore100: FinalVideoQualityScore;

  // Animation Mode Flag
  isAnimationMode: boolean;
  animationModeNotes?: string;

  createdAt: string;
}
