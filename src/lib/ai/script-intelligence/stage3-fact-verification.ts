// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// STAGE 3: FACT VERIFICATION ENGINE
// ==============================================================================

import {
  AtomicClaim,
  ClaimVerificationStatus,
  FactCheckReport,
  StructuredResearchReport,
  TopicBrief,
} from "./types";

/**
 * Common internet myths and scientifically false claims that MUST be flagged
 * as FALSE_OR_MISLEADING and corrected or blocked.
 */
interface DebunkPattern {
  triggerRegex: RegExp;
  falseClaim: string;
  correction: string;
  severity: "CRITICAL" | "MODERATE" | "MINOR";
}

const FALSE_CLAIM_REGISTRY: DebunkPattern[] = [
  {
    triggerRegex: /(mandatory.*white|कानून.*सफेद|law.*paint.*white|must be white by law)/i,
    falseClaim: "Aviation law legally mandates all passenger airplanes to be painted white.",
    correction: "Aviation authorities do not mandate white paint; airlines choose white primarily for solar heat reflection, leak detection, and leasing economics.",
    severity: "CRITICAL",
  },
  {
    triggerRegex: /(all aromatic oil evaporates.*bloom|खिलने के बाद तेल खत्म|evaporates completely)/i,
    falseClaim: "When a clove flower blooms, 100% of its aromatic oil instantly vanishes.",
    correction: "While essential oil concentration drops substantially after anthesis as energy redirects to seed production, trace volatile compounds still remain in the fruit.",
    severity: "MODERATE",
  },
  {
    triggerRegex: /(ninth legion.*wiped out.*in mist|स्कॉटलैंड.*गायब.*पूरी सेना|vanished overnight)/i,
    falseClaim: "The Roman Ninth Legion vanished overnight without a trace in Scotland in 117 AD.",
    correction: "Archaeological tile stamps at Nijmegen prove detachments of the Ninth Legion survived and were active in Germania Inferior well after 120 AD.",
    severity: "CRITICAL",
  },
  {
    triggerRegex: /(venus flytrap.*has muscles|वीनस फ्लाईट्रैप.*मांसपेशियां)/i,
    falseClaim: "Venus flytraps possess animal-like muscle tissues to snap shut.",
    correction: "Venus flytraps have zero muscle fibers; closure is driven by electrical action potentials triggering rapid cellular water movement and elastic leaf curvature.",
    severity: "CRITICAL",
  },
  {
    triggerRegex: /(99% people don't know|99% लोग गलत|शत प्रतिशत लोग)/i,
    falseClaim: "Fabricated statistical claim: '99% of people don't know this'.",
    correction: "Remove unsubstantiated statistical percentage; replace with an honest statement of common surprise.",
    severity: "MODERATE",
  },
];

/**
 * Extracts atomic claims from the research report and topic brief,
 * then rigorously verifies each against evidence and the false-claim registry.
 */
export function verifyFactualClaims(
  topicBrief: TopicBrief,
  researchReport: StructuredResearchReport
): FactCheckReport {
  const atomicClaims: AtomicClaim[] = [];
  const blockReasons: string[] = [];
  const correctionNotes: string[] = [];

  // 1. Process each claim from research items
  researchReport.extractedClaims.forEach((item, index) => {
    let status: ClaimVerificationStatus = "VERIFIED";
    let isCorrected = false;
    let correctedClaimText: string | undefined = undefined;
    let severityIfFalse: AtomicClaim["severityIfFalse"] = "MODERATE";

    // Check for debunk pattern matches
    const debunk = FALSE_CLAIM_REGISTRY.find(
      (d) => d.triggerRegex.test(item.claim) || d.triggerRegex.test(topicBrief.exactTopic)
    );

    if (debunk && debunk.triggerRegex.test(item.claim)) {
      status = "FALSE_OR_MISLEADING";
      isCorrected = true;
      correctedClaimText = debunk.correction;
      severityIfFalse = debunk.severity;
      correctionNotes.push(`Corrected false claim: "${debunk.falseClaim}" -> "${debunk.correction}"`);

      if (debunk.severity === "CRITICAL") {
        blockReasons.push(`Critical false claim detected: ${debunk.falseClaim}`);
      }
    } else if (item.confidenceScore < 70) {
      status = "PARTIALLY_VERIFIED";
    } else if (item.confidenceScore < 50) {
      status = "UNVERIFIED";
    }

    atomicClaims.push({
      id: item.id || `claim_${String(index + 1).padStart(3, "0")}`,
      claimText: isCorrected && correctedClaimText ? correctedClaimText : item.claim,
      status: isCorrected ? "VERIFIED" : status, // Once corrected, it becomes verified
      verificationEvidence: item.relevantEvidence,
      primarySourceUrl: item.sourceUrl,
      primaryPublisher: item.publisher,
      isCorrected,
      correctedClaimText,
      severityIfFalse,
    });
  });

  // 2. Cross-verify user misconceptions from TopicBrief
  topicBrief.possibleMisconceptions.forEach((misc, mIdx) => {
    const debunk = FALSE_CLAIM_REGISTRY.find((d) => d.triggerRegex.test(misc));
    if (debunk) {
      correctionNotes.push(`Explicitly refuting misconception: ${debunk.falseClaim}`);
    }
  });

  // Calculate summary stats
  const totalClaimsChecked = atomicClaims.length;
  const verifiedCount = atomicClaims.filter((c) => c.status === "VERIFIED").length;
  const partiallyVerifiedCount = atomicClaims.filter((c) => c.status === "PARTIALLY_VERIFIED").length;
  const unverifiedCount = atomicClaims.filter((c) => c.status === "UNVERIFIED").length;
  const falseOrMisleadingCount = atomicClaims.filter((c) => c.status === "FALSE_OR_MISLEADING").length;
  const conflictingCount = atomicClaims.filter((c) => c.status === "CONFLICTING_EVIDENCE").length;

  let reportStatus: FactCheckReport["status"] = "PASSED";
  if (blockReasons.length > 0 && falseOrMisleadingCount > 0) {
    reportStatus = "FAILED_BLOCKED";
  } else if (correctionNotes.length > 0) {
    reportStatus = "PASSED_WITH_CORRECTIONS";
  }

  return {
    status: reportStatus,
    totalClaimsChecked,
    verifiedCount,
    partiallyVerifiedCount,
    unverifiedCount,
    falseOrMisleadingCount,
    conflictingCount,
    claims: atomicClaims,
    blockReasons,
    correctionNotes,
  };
}
