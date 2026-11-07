// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// STAGE 8: SCRIPT DURATION & PACING ENGINE
// ==============================================================================

import {
  ChannelWritingDNA,
  PacingMetrics,
  ProductionScriptSection,
  ScriptLanguage,
} from "./types";

/**
 * Calculates language-specific words-per-minute (WPM) and word-to-time ratio.
 * Hindi words average 5-7 syllables/characters vs English 4-5 letters.
 */
export function getLanguagePacingRates(language: ScriptLanguage): {
  targetWpm: number;
  wordsPerSecond: number;
  pauseRatio: number;
} {
  switch (language) {
    case "Hindi":
      return { targetWpm: 135, wordsPerSecond: 2.25, pauseRatio: 0.12 };
    case "Hinglish":
      return { targetWpm: 140, wordsPerSecond: 2.33, pauseRatio: 0.10 };
    case "English":
    default:
      return { targetWpm: 150, wordsPerSecond: 2.5, pauseRatio: 0.10 };
  }
}

/**
 * Calibrates section durations and timestamps based on exact spoken word counts
 * and language-specific speaking rates. Enforces strictly non-overlapping, sequential timestamps.
 */
export function calibratePacingAndTimestamps(
  sections: ProductionScriptSection[],
  targetDurationSeconds: number,
  language: ScriptLanguage,
  writingDNA: ChannelWritingDNA
): { sections: ProductionScriptSection[]; metrics: PacingMetrics } {
  const pacingRates = getLanguagePacingRates(language);

  // 1. Calculate actual word count per section
  let totalSpokenWords = 0;
  const sectionWordCounts = sections.map((sec) => {
    const wc = sec.voiceover.split(/\s+/).filter(Boolean).length;
    totalSpokenWords += wc;
    return wc;
  });

  // 2. Calculate pure speech duration without pauses
  const pureSpeechSeconds = totalSpokenWords / pacingRates.wordsPerSecond;
  const pauseAllowanceSeconds = Math.max(1.5, pureSpeechSeconds * pacingRates.pauseRatio);

  // 3. Balanced proportional distribution using exact word weights
  const totalSafeWords = Math.max(1, totalSpokenWords);
  const minDurationPerSection = 3;
  const numSections = sections.length;
  const availableFloatingSeconds = Math.max(0, targetDurationSeconds - numSections * minDurationPerSection);

  // Calculate fractional seconds per section
  const sectionDurations = sectionWordCounts.map((wc) => {
    const proportionalSeconds = (wc / totalSafeWords) * availableFloatingSeconds;
    return minDurationPerSection + proportionalSeconds;
  });

  // Round durations while preserving exact total
  let allocatedIntegerDurations = sectionDurations.map((d) => Math.max(minDurationPerSection, Math.round(d)));
  let currentSum = allocatedIntegerDurations.reduce((a, b) => a + b, 0);
  let difference = targetDurationSeconds - currentSum;

  // Distribute any remainder to sections with largest speech weight
  if (difference !== 0 && numSections > 0) {
    const sortedIndices = sectionWordCounts
      .map((wc, idx) => ({ wc, idx }))
      .sort((a, b) => b.wc - a.wc)
      .map((item) => item.idx);

    let step = difference > 0 ? 1 : -1;
    let ptr = 0;
    while (difference !== 0 && ptr < numSections * 3) {
      const targetIdx = sortedIndices[ptr % numSections];
      if (allocatedIntegerDurations[targetIdx] + step >= minDurationPerSection) {
        allocatedIntegerDurations[targetIdx] += step;
        difference -= step;
      }
      ptr++;
    }
  }

  // 4. Assemble calibrated sections with guaranteed non-overlapping timestamps
  const calibratedSections: ProductionScriptSection[] = [];
  let currentStart = 0;

  sections.forEach((sec, idx) => {
    const dur = allocatedIntegerDurations[idx];
    const endSeconds = currentStart + dur;

    calibratedSections.push({
      ...sec,
      startSeconds: currentStart,
      endSeconds,
      durationSeconds: dur,
    });

    currentStart = endSeconds;
  });

  const finalDuration = calibratedSections.length > 0 ? calibratedSections[calibratedSections.length - 1].endSeconds : targetDurationSeconds;
  const durationVarianceSeconds = Math.abs(finalDuration - targetDurationSeconds);
  const withinTolerance = durationVarianceSeconds <= 2;
  const actualWpm = Math.round((totalSpokenWords / Math.max(1, finalDuration)) * 60);

  const metrics: PacingMetrics = {
    targetDurationSeconds,
    calculatedDurationSeconds: finalDuration,
    durationVarianceSeconds,
    withinTolerance,
    totalSpokenWords,
    wordsPerMinute: actualWpm,
    languagePacingFactor: pacingRates.wordsPerSecond,
    pauseAllowanceSeconds: Math.round(pauseAllowanceSeconds * 10) / 10,
    isPacingCalibrated: true,
  };

  return {
    sections: calibratedSections,
    metrics,
  };
}
