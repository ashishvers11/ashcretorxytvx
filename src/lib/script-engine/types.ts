/**
 * Professional Script Engine Types
 * ASH Creator Studio — Phase 2 Enhanced Fact Verification & Quality Gating
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

export type VerificationStatus =
  | "VERIFIED_PRIMARY"
  | "VERIFIED_SECONDARY"
  | "UNVERIFIED"
  | "CONFLICTING_EVIDENCE";

export interface FactCheckItem {
  claim: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: "Primary (Academic / Institutional)" | "Secondary (Reputable Reference)" | "Unverified";
  supportingPassage: string;
  verificationStatus: VerificationStatus;
  researchDate: string;
  conflictingEvidenceNotes?: string;
}

export interface QualityMetricDetail {
  score: number;
  whatIsEvaluated: string;
  howEvaluated: string;
  evidenceUsed: string;
  whyAssigned: string;
  penaltiesApplied: string[];
}

export interface QualityGateAssessment {
  overallScore: number; // 0 - 100 heuristic evaluation
  verdict: "Ready for Production" | "Needs Revision" | "Draft";
  metrics: {
    hookStrength: QualityMetricDetail;
    originality: QualityMetricDetail;
    factualReliability: QualityMetricDetail;
    narrativeContinuity: QualityMetricDetail;
    spokenNaturalness: QualityMetricDetail;
    retentionPotential: QualityMetricDetail;
    visualStorytelling: QualityMetricDetail;
    durationAccuracy: QualityMetricDetail;
    payoffQuality: QualityMetricDetail;
  };
  negativeCheckPenalties: string[];
  recommendations: string[];
  heuristicDisclaimer: string;
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
