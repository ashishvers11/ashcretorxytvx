/**
 * Professional Script Engine Types
 * ASH Creator Studio — 8-Stage Research-to-Script Pipeline
 */

export interface ScriptPreset {
  id: string;
  name: string;
  niche: string;
  format: "shorts" | "longform";
  aspectRatio: "9:16" | "16:9";
  language: "Hindi" | "Hinglish" | "English";
  screenTextLanguage: "English" | "Hindi";
  visualStyle: string;
  tone: string;
  pacingWpm: number;
  description: string;
}

export interface ResearchBrief {
  centralFact: string;
  commonMisconceptions: string[];
  compellingAngle: string;
  keyClaimsToVerify: string[];
  differentiationFactor: string;
  sourceContext: string;
}

export interface StoryAngle {
  id: string;
  name: string;
  corePremise: string;
  whyItWorks: string;
}

export interface ScriptHook {
  id: string;
  style: "Curiosity Gap" | "Pattern Interrupt" | "Bold Contrarian";
  text: string;
  psychologicalTrigger: string;
  isRecommended: boolean;
  rationale: string;
}

export interface ScenePlanItem {
  sceneNumber: number;
  timeRange: string; // e.g. "0:00 - 0:04"
  startSeconds: number;
  endSeconds: number;
  voiceoverLine: string;
  visualConcept: string;
  imagePrompt: string; // AI Generation ready
  motionPrompt: string;
  onScreenText: string;
  soundEffect: string;
  transition: string;
}

export interface FactCheckItem {
  claim: string;
  sourceTitle: string;
  sourceUrl: string;
  verified: boolean;
  publicationDate?: string;
  researchDate: string;
  notes?: string;
}

export interface QualityGateAssessment {
  overallScore: number; // 0 - 100
  verdict: "Ready for Production" | "Needs Revision" | "Draft";
  metrics: {
    hookStrength: { score: number; feedback: string };
    originality: { score: number; feedback: string };
    factualReliability: { score: number; feedback: string };
    narrativeContinuity: { score: number; feedback: string };
    spokenNaturalness: { score: number; feedback: string };
    retentionPotential: { score: number; feedback: string };
    visualStorytelling: { score: number; feedback: string };
    durationAccuracy: { score: number; feedback: string };
    payoffQuality: { score: number; feedback: string };
  };
  recommendations: string[];
}

export interface ProfessionalScript {
  id: string;
  title: string;
  topic: string;
  niche: string;
  presetId?: string;
  format: "shorts" | "longform";
  targetDurationSeconds: number;
  estimatedDurationSeconds: number;
  wordCount: number;
  language: string;
  
  // 8 Stages
  researchBrief: ResearchBrief;
  angles: StoryAngle[];
  selectedAngleId: string;
  hooks: ScriptHook[];
  selectedHookId: string;
  narrativeStructure: {
    hook: string;
    curiosityDevelopment: string;
    context: string;
    mainExplanation: string;
    unexpectedDetail: string;
    payoff: string;
    cta: string;
  };
  fullVoiceover: string;
  scenes: ScenePlanItem[];
  factChecks: FactCheckItem[];
  qualityGate: QualityGateAssessment;

  createdAt: string;
  updatedAt: string;
}
