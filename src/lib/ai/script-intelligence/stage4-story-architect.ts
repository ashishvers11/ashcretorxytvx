// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// STAGE 4: STORY ARCHITECT
// ==============================================================================

import {
  BlueprintSection,
  ChannelWritingDNA,
  FactCheckReport,
  ScriptContentFormat,
  StoryBlueprint,
  TopicBrief,
} from "./types";

/**
 * Constructs a structural narrative blueprint mapping verified evidence to story beats.
 * Never writes final dialogue at this stage.
 */
export function buildStoryBlueprint(
  topicBrief: TopicBrief,
  factCheck: FactCheckReport,
  writingDNA: ChannelWritingDNA,
  format: ScriptContentFormat,
  targetDurationSeconds: number
): StoryBlueprint {
  const isShorts = format === "youtube_shorts" || targetDurationSeconds <= 60;
  const isHistory =
    format === "history_documentary" ||
    writingDNA.channelNiche.toLowerCase().includes("history");
  const isScience =
    format === "science_explainer" ||
    writingDNA.channelNiche.toLowerCase().includes("science");

  const sections: BlueprintSection[] = [];
  const claimIds = factCheck.claims.map((c) => c.id);

  if (isHistory) {
    // -------------------------------------------------------------
    // Historical Documentary / Mystery Blueprint
    // -------------------------------------------------------------
    const sec1Duration = Math.round(targetDurationSeconds * 0.12);
    const sec2Duration = Math.round(targetDurationSeconds * 0.15);
    const sec3Duration = Math.round(targetDurationSeconds * 0.18);
    const sec4Duration = Math.round(targetDurationSeconds * 0.20);
    const sec5Duration = Math.round(targetDurationSeconds * 0.20);
    const sec6Duration = targetDurationSeconds - (sec1Duration + sec2Duration + sec3Duration + sec4Duration + sec5Duration);

    sections.push({
      sectionId: "sec_1_mystery",
      title: "The Historical Enigma",
      narrativeFunction: "Opening Curiosity",
      targetDurationSeconds: sec1Duration,
      verifiedClaimIds: claimIds.slice(0, 1),
      coreNarrativeGoal: `Hook viewer with the lasting historical mystery surrounding ${topicBrief.mainSubject}.`,
      pacingNote: "Atmospheric, evocative opening setting the stakes.",
    });

    sections.push({
      sectionId: "sec_2_setting",
      title: "Historical Context & Last Known Record",
      narrativeFunction: "Subject Introduction",
      targetDurationSeconds: sec2Duration,
      verifiedClaimIds: claimIds.slice(0, 2),
      coreNarrativeGoal: "Establish the exact era, verified documentary inscriptions, and original location.",
      pacingNote: "Grounded in physical artifacts, stone inscriptions, and records.",
    });

    sections.push({
      sectionId: "sec_3_myth",
      title: "The Popular Legend vs Archaeological Clues",
      narrativeFunction: "Misconception Correction",
      targetDurationSeconds: sec3Duration,
      verifiedClaimIds: claimIds.slice(1, 3),
      coreNarrativeGoal: "Contrast the romantic film myth against tangible archaeological discoveries across Europe.",
      pacingNote: "Fast transition from rumor to excavated fact.",
    });

    sections.push({
      sectionId: "sec_4_evidence",
      title: "The Decisive Artifact",
      narrativeFunction: "Core Mechanism Explanation",
      targetDurationSeconds: sec4Duration,
      verifiedClaimIds: claimIds.slice(1, 4),
      coreNarrativeGoal: "Break down the tile stamps, imperial rosters, and troop movements that explain what happened.",
      pacingNote: "High information density, authoritative evidence reveal.",
    });

    sections.push({
      sectionId: "sec_5_uncertainty",
      title: "What History Truly Tells Us",
      narrativeFunction: "Main Answer Revelation",
      targetDurationSeconds: sec5Duration,
      verifiedClaimIds: claimIds.slice(2, 4),
      coreNarrativeGoal: "State clearly what is proven versus what remains an ongoing historical debate.",
      pacingNote: "Intellectual honesty and satisfying perspective.",
    });

    sections.push({
      sectionId: "sec_6_resolution",
      title: "The Lasting Heritage",
      narrativeFunction: "Resolution & Payoff",
      targetDurationSeconds: sec6Duration,
      verifiedClaimIds: [],
      coreNarrativeGoal: topicBrief.suitableEnding,
      pacingNote: "Resonant closing thought connecting ancient history to modern human memory.",
    });

    return {
      format,
      storyArcName: "Historical Investigative Blueprint",
      sections,
      totalPlannedDuration: targetDurationSeconds,
      narrativeTensionStrategy: "Mystery Hook -> Primary Inscription -> Myth Debunk -> Tile Evidence -> Honest Historical Verdict",
    };
  }

  if (isScience) {
    // -------------------------------------------------------------
    // Science Explainer Blueprint
    // -------------------------------------------------------------
    const sec1Duration = Math.round(targetDurationSeconds * 0.12);
    const sec2Duration = Math.round(targetDurationSeconds * 0.16);
    const sec3Duration = Math.round(targetDurationSeconds * 0.22);
    const sec4Duration = Math.round(targetDurationSeconds * 0.22);
    const sec5Duration = Math.round(targetDurationSeconds * 0.16);
    const sec6Duration = targetDurationSeconds - (sec1Duration + sec2Duration + sec3Duration + sec4Duration + sec5Duration);

    sections.push({
      sectionId: "sec_1_hook",
      title: "The Everyday Counter-Intuitive Question",
      narrativeFunction: "Opening Curiosity",
      targetDurationSeconds: sec1Duration,
      verifiedClaimIds: claimIds.slice(0, 1),
      coreNarrativeGoal: `Open with the direct curiosity question about ${topicBrief.mainSubject}.`,
      pacingNote: "Immediate curiosity spark, no generic textbook greeting.",
    });

    sections.push({
      sectionId: "sec_2_misconception",
      title: "The Common Intuitive Error",
      narrativeFunction: "Misconception Correction",
      targetDurationSeconds: sec2Duration,
      verifiedClaimIds: claimIds.slice(0, 2),
      coreNarrativeGoal: "Point out why our everyday intuition is completely wrong about how this works.",
      pacingNote: "Engaging challenge to the viewer's prior belief.",
    });

    sections.push({
      sectionId: "sec_3_mechanism",
      title: "The Hidden Biological / Physical Mechanism",
      narrativeFunction: "Core Mechanism Explanation",
      targetDurationSeconds: sec3Duration,
      verifiedClaimIds: claimIds.slice(0, 3),
      coreNarrativeGoal: "Explain the cellular, thermal, or optical mechanism in clear, visual terms.",
      pacingNote: "Step-by-step visual logic without unnecessary jargon.",
    });

    sections.push({
      sectionId: "sec_4_discovery",
      title: "The Surprising Scientific Detail",
      narrativeFunction: "Surprising Detail",
      targetDurationSeconds: sec4Duration,
      verifiedClaimIds: claimIds.slice(1, 4),
      coreNarrativeGoal: topicBrief.interestingDiscovery,
      pacingNote: "The 'aha!' moment of revelation that elevates the video.",
    });

    sections.push({
      sectionId: "sec_5_payoff",
      title: "The Complete Scientific Answer",
      narrativeFunction: "Main Answer Revelation",
      targetDurationSeconds: sec5Duration,
      verifiedClaimIds: claimIds.slice(2, 4),
      coreNarrativeGoal: topicBrief.mainLearningOutcome,
      pacingNote: "Decisive resolution of the original question.",
    });

    sections.push({
      sectionId: "sec_6_takeaway",
      title: "The Real-World Synthesis",
      narrativeFunction: "Resolution & Payoff",
      targetDurationSeconds: sec6Duration,
      verifiedClaimIds: [],
      coreNarrativeGoal: topicBrief.suitableEnding,
      pacingNote: "Memorable takeaway that sticks in the viewer's mind.",
    });

    return {
      format,
      storyArcName: "Scientific Discovery Blueprint",
      sections,
      totalPlannedDuration: targetDurationSeconds,
      narrativeTensionStrategy: "Curiosity Question -> Intuition Challenge -> Cellular/Physical Mechanism -> Surprising Discovery -> Clear Answer",
    };
  }

  // -------------------------------------------------------------
  // Default / YouTube Shorts Fast-Paced Blueprint (6 Beats)
  // -------------------------------------------------------------
  const sec1 = Math.round(targetDurationSeconds * 0.12);
  const sec2 = Math.round(targetDurationSeconds * 0.18);
  const sec3 = Math.round(targetDurationSeconds * 0.22);
  const sec4 = Math.round(targetDurationSeconds * 0.22);
  const sec5 = Math.round(targetDurationSeconds * 0.16);
  const sec6 = targetDurationSeconds - (sec1 + sec2 + sec3 + sec4 + sec5);

  sections.push({
    sectionId: "sec_1_curiosity",
    title: "Instant Curiosity Hook",
    narrativeFunction: "Opening Curiosity",
    targetDurationSeconds: sec1,
    verifiedClaimIds: claimIds.slice(0, 1),
    coreNarrativeGoal: `Specific visual question about ${topicBrief.mainSubject}.`,
    pacingNote: "Hook within 1-2 seconds with specific subject visual.",
  });

  sections.push({
    sectionId: "sec_2_subject",
    title: "Subject Introduction & Common Assumption",
    narrativeFunction: "Subject Introduction",
    targetDurationSeconds: sec2,
    verifiedClaimIds: claimIds.slice(0, 2),
    coreNarrativeGoal: "Introduce the practical subject and the common misconception.",
    pacingNote: "Fast transition from question to practical reality.",
  });

  sections.push({
    sectionId: "sec_3_explanation",
    title: "The Primary Real-World Factor",
    narrativeFunction: "Core Mechanism Explanation",
    targetDurationSeconds: sec3,
    verifiedClaimIds: claimIds.slice(0, 3),
    coreNarrativeGoal: "Deliver the first major verified reason with physical proof.",
    pacingNote: "Clear cause-and-effect demonstration.",
  });

  sections.push({
    sectionId: "sec_4_secondary",
    title: "The Hidden Economic / Safety Dimension",
    narrativeFunction: "Surprising Detail",
    targetDurationSeconds: sec4,
    verifiedClaimIds: claimIds.slice(1, 4),
    coreNarrativeGoal: topicBrief.interestingDiscovery,
    pacingNote: "Second powerful layer of explanation.",
  });

  sections.push({
    sectionId: "sec_5_answer",
    title: "The Decisive Resolution",
    narrativeFunction: "Main Answer Revelation",
    targetDurationSeconds: sec5,
    verifiedClaimIds: claimIds.slice(2, 4),
    coreNarrativeGoal: topicBrief.mainLearningOutcome,
    pacingNote: "Satisfying conclusion answering the opening hook.",
  });

  sections.push({
    sectionId: "sec_6_loop",
    title: "Payoff & Natural Ending",
    narrativeFunction: "Resolution & Payoff",
    targetDurationSeconds: sec6,
    verifiedClaimIds: [],
    coreNarrativeGoal: topicBrief.suitableEnding,
    pacingNote: "Clean seamless finish that rewards the viewer.",
  });

  return {
    format,
    storyArcName: "High-Retention Explainer Blueprint",
    sections,
    totalPlannedDuration: targetDurationSeconds,
    narrativeTensionStrategy: "Specific Question -> Assumption Challenge -> Physical Mechanism -> Surprising Layer -> Satisfying Payoff",
  };
}
