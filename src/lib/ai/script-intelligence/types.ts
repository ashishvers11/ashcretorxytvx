// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// Complete TypeScript Type Definitions & Schemas
// ==============================================================================

// ------------------------------------------------------------------------------
// PART B: User Input System
// ------------------------------------------------------------------------------

export type ScriptContentFormat =
  | "youtube_shorts"
  | "longform_youtube"
  | "educational_video"
  | "science_explainer"
  | "history_documentary"
  | "interesting_facts"
  | "storytelling"
  | "tutorial"
  | "product_explanation"
  | "custom_format";

export type ScriptLanguage = "Hindi" | "English" | "Hinglish";

export interface UserScriptInput {
  // Required
  channelId: string;
  topic: string;
  format: ScriptContentFormat;
  targetDurationSeconds: number;
  language: ScriptLanguage;

  // Optional
  targetAudience?: string;
  preferredStorytellingStyle?: string;
  tone?: string;
  contentObjective?: string;
  userProvidedResearch?: string;
  referenceVideoOrScript?: string;
  visualStyle?: string;
  ctaPreference?: string;
  specialInstructions?: string;
}

// ------------------------------------------------------------------------------
// PART C: Channel Style Intelligence (Channel Writing DNA)
// ------------------------------------------------------------------------------

export interface ChannelWritingDNA {
  channelId: string;
  channelName: string;
  channelNiche: string;
  channelSubNiche: string;
  targetAudience: string;
  audienceKnowledgeLevel: "Beginner / Curious" | "Intermediate" | "Advanced / Specialist";
  language: ScriptLanguage;
  vocabularyPreference: "Conversational & Vivid" | "Simple & Clear" | "Technical & Precise";
  formality: "Friendly & Casual" | "Passionate & Engaging" | "Documentary Formal";
  sentenceLength: "Short & Punchy (5-10 words)" | "Balanced (10-18 words)" | "Detailed Explanatory";
  narrationStyle: string;
  hookPreferences: string[];
  storytellingStructure: string;
  humorPreference: "None / Serious" | "Subtle Wit" | "Playful & High Energy";
  emotionalIntensity: "Calm & Objective" | "Curious & Wonder-filled" | "Dramatic & High Stakes";
  explanationDepth: "Conceptual / Intuitive" | "Mechanistic & Step-by-Step" | "Academic Rigorous";
  typicalDuration: number;
  ctaPreference: "Seamless Next Video Loop" | "Subtle Channel Subscribe" | "Comment Question" | "None";
  contentRestrictions: string[];
  preferredVideoFormat: ScriptContentFormat;
  characterAnchor?: string;
  characterName?: string;
}

// ------------------------------------------------------------------------------
// STAGE 1: Topic Understanding
// ------------------------------------------------------------------------------

export interface TopicBrief {
  exactTopic: string;
  mainSubject: string;
  centralQuestion: string;
  mainLearningOutcome: string;
  audienceKnowledgeLevel: string;
  interestingDiscovery: string;
  requiredFactualInformation: string[];
  possibleMisconceptions: string[];
  storyOpportunity: string;
  suitableEnding: string;
  needsClarification: boolean;
  clarificationQuestion?: string;
}

// ------------------------------------------------------------------------------
// STAGE 2: Topic Research Engine
// ------------------------------------------------------------------------------

export type SourceTier = "Tier 1 (Authoritative)" | "Tier 2 (Expert/Reputable)" | "Tier 3 (Secondary)";

export interface ResearchItem {
  id: string;
  claim: string;
  sourceTitle: string;
  publisher: string;
  sourceUrl: string;
  publicationDate?: string;
  relevantEvidence: string;
  sourceTier: SourceTier;
  confidenceScore: number; // 0-100
  isDirectObservation: boolean;
}

export interface StructuredResearchReport {
  topic: string;
  extractedClaims: ResearchItem[];
  supportingEvidenceSummary: string[];
  conflictingEvidenceSummary: string[];
  recordedUncertainties: string[];
  scientificMechanismSummary: string;
  totalReliableSourcesFound: number;
}

// ------------------------------------------------------------------------------
// STAGE 3: Fact Verification Engine
// ------------------------------------------------------------------------------

export type ClaimVerificationStatus =
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "UNVERIFIED"
  | "FALSE_OR_MISLEADING"
  | "CONFLICTING_EVIDENCE";

export interface AtomicClaim {
  id: string;
  claimText: string;
  status: ClaimVerificationStatus;
  verificationEvidence: string;
  primarySourceUrl?: string;
  primaryPublisher?: string;
  isCorrected: boolean;
  correctedClaimText?: string;
  severityIfFalse: "CRITICAL" | "MODERATE" | "MINOR";
}

export interface FactCheckReport {
  status: "PASSED" | "PASSED_WITH_CORRECTIONS" | "FAILED_BLOCKED";
  totalClaimsChecked: number;
  verifiedCount: number;
  partiallyVerifiedCount: number;
  unverifiedCount: number;
  falseOrMisleadingCount: number;
  conflictingCount: number;
  claims: AtomicClaim[];
  blockReasons: string[];
  correctionNotes: string[];
}

// ------------------------------------------------------------------------------
// STAGE 4: Story Architect
// ------------------------------------------------------------------------------

export interface BlueprintSection {
  sectionId: string;
  title: string;
  narrativeFunction:
    | "Opening Curiosity"
    | "Subject Introduction"
    | "Misconception Correction"
    | "First Discovery"
    | "Core Mechanism Explanation"
    | "Surprising Detail"
    | "Main Answer Revelation"
    | "Resolution & Payoff"
    | "Next Video CTA";
  targetDurationSeconds: number;
  verifiedClaimIds: string[];
  coreNarrativeGoal: string;
  pacingNote: string;
}

export interface StoryBlueprint {
  format: ScriptContentFormat;
  storyArcName: string;
  sections: BlueprintSection[];
  totalPlannedDuration: number;
  narrativeTensionStrategy: string;
}

// ------------------------------------------------------------------------------
// STAGE 5: Hook Intelligence Engine
// ------------------------------------------------------------------------------

export type HookType =
  | "Curiosity Hook"
  | "Unexpected Fact"
  | "Visual Discovery"
  | "Question Hook"
  | "Misconception Correction"
  | "Mystery Hook"
  | "Demonstration Hook"
  | "Contrast Hook";

export interface HookCandidate {
  id: string;
  hookType: HookType;
  text: string;
  topicRelevance: number; // 0-100
  clarity: number; // 0-100
  specificity: number; // 0-100
  curiosityScore: number; // 0-100
  truthfulness: number; // 0-100
  naturalLanguage: number; // 0-100
  payoffConnection: number; // 0-100
  totalScore: number; // 0-100
  isClickbaitRejected: boolean;
  rejectionReason?: string;
}

// ------------------------------------------------------------------------------
// STAGE 6: Human Scriptwriter Engine
// ------------------------------------------------------------------------------

export type SentenceFunction =
  | "introduce_information"
  | "explain_mechanism"
  | "answer_question"
  | "create_meaningful_curiosity"
  | "connect_two_ideas"
  | "correct_misconception"
  | "advance_story"
  | "deliver_payoff";

export interface ScriptSentenceItem {
  sentenceId: string;
  text: string;
  primaryFunction: SentenceFunction;
  wordCount: number;
  claimIdReference?: string;
}

export interface ProductionScriptSection {
  sectionId: string;
  sectionType: "HOOK" | "EXPLANATION" | "DISCOVERY" | "CLIMAX" | "PAYOFF" | "OUTRO";
  title: string;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  voiceover: string;
  spokenHindiPhonetic?: string;
  sentences: ScriptSentenceItem[];
  purpose: string;
  onScreenText: string;
  visualPromptMidjourney: string;
  videoMotionPromptRunway: string;
  cameraMovement: string;
  soundEffect: string;
  claimIds: string[];
}

// ------------------------------------------------------------------------------
// STAGE 7: Retention Editor
// ------------------------------------------------------------------------------

export interface RetentionAnalysis {
  hookStrengthScore: number; // 0-100
  timeToFirstUsefulFactSeconds: number;
  informationDensityScore: number; // 0-100
  sentenceFlowScore: number; // 0-100
  storyProgressionScore: number; // 0-100
  hasRepeatedInformation: boolean;
  repeatedSectionsIdentified: string[];
  curiosityResolved: boolean;
  payoffQualityScore: number; // 0-100
  editsApplied: string[];
}

// ------------------------------------------------------------------------------
// STAGE 8: Script Duration & Pacing
// ------------------------------------------------------------------------------

export interface PacingMetrics {
  targetDurationSeconds: number;
  calculatedDurationSeconds: number;
  durationVarianceSeconds: number;
  withinTolerance: boolean;
  totalSpokenWords: number;
  wordsPerMinute: number;
  languagePacingFactor: number;
  pauseAllowanceSeconds: number;
  isPacingCalibrated: boolean;
}

// ------------------------------------------------------------------------------
// STAGE 9: Quality Control Engine
// ------------------------------------------------------------------------------

export type FinalQualityStatus = "READY" | "NEEDS_REVISION" | "BLOCKED";

export interface QualityReport {
  overallStatus: FinalQualityStatus;
  overallScore: number; // 0-100
  rubricScores: {
    topicRelevance: number; // 0-100
    factualAccuracy: number; // 0-100
    storyContinuity: number; // 0-100
    humanNaturalness: number; // 0-100
    informationValue: number; // 0-100
    hookToPayoff: number; // 0-100
    retentionStructure: number; // 0-100
    durationAccuracy: number; // 0-100
    channelMatch: number; // 0-100
    originality: number; // 0-100
  };
  criticalViolations: string[];
  warnings: string[];
  remediationSuggestions: string[];
}

// ------------------------------------------------------------------------------
// STAGE 10: Final Script Composer (Master Output Schema)
// ------------------------------------------------------------------------------

export interface CompleteScriptIntelligencePackage {
  schemaVersion: "2.0";
  generatedAt: string;
  channelId: string;
  channelName: string;
  topic: string;
  format: ScriptContentFormat;
  targetDurationSeconds: number;
  actualDurationSeconds: number;
  language: ScriptLanguage;
  status: FinalQualityStatus;

  // Master narrative outputs
  videoTitle: string;
  centralIdea: string;
  selectedHook: HookCandidate;
  allHookCandidates: HookCandidate[];
  completeVoiceoverText: string;

  // Granular Production Sections
  sections: ProductionScriptSection[];

  // Supporting Intelligence Reports
  topicBrief: TopicBrief;
  researchReport: StructuredResearchReport;
  factCheck: FactCheckReport;
  storyBlueprint: StoryBlueprint;
  retentionAnalysis: RetentionAnalysis;
  pacingMetrics: PacingMetrics;
  qualityReport: QualityReport;
  channelWritingDNA: ChannelWritingDNA;

  // Metadata
  promptVersion: string;
}

// ------------------------------------------------------------------------------
// PART H: Creator Feedback & Channel Preference Learning
// ------------------------------------------------------------------------------

export interface CreatorScriptFeedback {
  feedbackId: string;
  channelId: string;
  topic: string;
  originalVoiceover: string;
  editedVoiceover?: string;
  rating: "POSITIVE" | "NEGATIVE";
  tags: Array<
    | "Good script"
    | "Weak hook"
    | "Too robotic"
    | "Too long"
    | "Too short"
    | "Not enough facts"
    | "Incorrect information"
    | "Wrong channel style"
    | "Poor storytelling"
    | "Too complex"
    | "Too basic"
  >;
  notes?: string;
  submittedAt: string;
}
