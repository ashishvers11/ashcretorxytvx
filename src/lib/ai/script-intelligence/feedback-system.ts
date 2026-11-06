// ==============================================================================
// ASH CREATOR STUDIO — SCRIPT INTELLIGENCE ENGINE V2
// PART H: CREATOR FEEDBACK & PREFERENCE LEARNING SYSTEM
// ==============================================================================

import { CreatorScriptFeedback } from "./types";

const STORAGE_KEY_FEEDBACK_PREFIX = "ash_script_feedback_";
const STORAGE_KEY_CHANNEL_PREFS_PREFIX = "ash_channel_prefs_";

export interface ChannelLearnedPreferences {
  channelId: string;
  preferredHookTypes: string[];
  vocabularyAdjustments: string[];
  avoidedPhrases: string[];
  durationAdjustmentSeconds: number;
  totalFeedbackReceived: number;
}

/**
 * Saves creator feedback for a specific script with strict channel isolation.
 */
export function recordCreatorFeedback(feedback: CreatorScriptFeedback): void {
  if (typeof window === "undefined" || !feedback.channelId) return;

  try {
    // 1. Store raw feedback event
    const key = `${STORAGE_KEY_FEEDBACK_PREFIX}${feedback.channelId}`;
    const rawList = localStorage.getItem(key);
    const list: CreatorScriptFeedback[] = rawList ? JSON.parse(rawList) : [];
    list.unshift(feedback);
    // Keep last 50 feedback entries per channel
    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));

    // 2. Update channel-specific learned preferences
    updateChannelPreferences(feedback);
  } catch (err) {
    console.error("Failed to save creator feedback:", err);
  }
}

/**
 * Updates channel-specific preferences based on negative or positive feedback.
 * Does not overwrite other channels.
 */
function updateChannelPreferences(feedback: CreatorScriptFeedback): void {
  const prefKey = `${STORAGE_KEY_CHANNEL_PREFS_PREFIX}${feedback.channelId}`;
  let prefs: ChannelLearnedPreferences = {
    channelId: feedback.channelId,
    preferredHookTypes: [],
    vocabularyAdjustments: [],
    avoidedPhrases: [],
    durationAdjustmentSeconds: 0,
    totalFeedbackReceived: 0,
  };

  try {
    const raw = localStorage.getItem(prefKey);
    if (raw) prefs = JSON.parse(raw);
  } catch {}

  prefs.totalFeedbackReceived += 1;

  feedback.tags.forEach((tag) => {
    switch (tag) {
      case "Too long":
        prefs.durationAdjustmentSeconds -= 5;
        break;
      case "Too short":
        prefs.durationAdjustmentSeconds += 5;
        break;
      case "Weak hook":
        prefs.avoidedPhrases.push("question-only-hooks");
        break;
      case "Too robotic":
        prefs.vocabularyAdjustments.push("increase-conversational-cadence");
        break;
      case "Not enough facts":
        prefs.vocabularyAdjustments.push("prioritize-tier-1-citations");
        break;
    }
  });

  try {
    localStorage.setItem(prefKey, JSON.stringify(prefs));
  } catch {}
}

/**
 * Retrieves learned preferences for a specific channel.
 */
export function getChannelLearnedPreferences(channelId: string): ChannelLearnedPreferences | null {
  if (typeof window === "undefined" || !channelId) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_CHANNEL_PREFS_PREFIX}${channelId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Retrieves past feedback history for a specific channel.
 */
export function getChannelFeedbackHistory(channelId: string): CreatorScriptFeedback[] {
  if (typeof window === "undefined" || !channelId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_FEEDBACK_PREFIX}${channelId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
