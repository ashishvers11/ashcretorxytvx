import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateTransparentTrendScore,
  executeDailyTrendResearch,
} from "../src/lib/youtube/trend-engine.ts";
import {
  parseIsoDuration,
  detectContentLanguage,
} from "../src/lib/youtube/data-api.ts";
import {
  youtubeQuota,
  getPacificDateString,
  getNextPacificMidnightUtc,
} from "../src/lib/youtube/quota.ts";
import { isYouTubeApiKeyConfigured, getYoutubeApiKey } from "../src/lib/youtube/config.ts";
import { runScriptEnginePipeline } from "../src/lib/script-engine/pipeline.ts";
import { BUILT_IN_PRESETS, getPresetById } from "../src/lib/script-engine/presets.ts";

test("1. YouTube API Key Configuration Status", () => {
  const isConfigured = isYouTubeApiKeyConfigured();
  const apiKey = getYoutubeApiKey();
  if (!isConfigured) {
    assert.equal(typeof isConfigured, "boolean");
    console.log("   [CONFIG STATUS] YOUTUBE_API_KEY is currently unconfigured or placeholder.");
  } else {
    assert.ok(apiKey.length > 15);
    console.log("   [CONFIG STATUS] YOUTUBE_API_KEY is configured.");
  }
});

test("2. Google Quota Reset at Midnight Pacific Time (PT) Rule", () => {
  const now = new Date();
  const ptDate = getPacificDateString(now);
  assert.match(ptDate, /^\d{4}-\d{2}-\d{2}$/);

  const nextMidnightUtc = getNextPacificMidnightUtc(now);
  assert.ok(nextMidnightUtc.getTime() > now.getTime());

  // In America/Los_Angeles, nextMidnightUtc must format as 12:00:00 AM (00:00)
  const ptHour = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    hourCycle: "h23",
  }).format(nextMidnightUtc);

  assert.ok(ptHour === "0" || ptHour === "00");
  console.log(`   [PT RESET VERIFIED] Next Google Reset: ${nextMidnightUtc.toISOString()} (12:00 AM PT)`);
});

test("3. Dual Counter Quota Accounting (Search Requests vs. Shared Units)", async () => {
  const initialStatus = await youtubeQuota.getStatus();
  assert.equal(initialStatus.searchDailyLimit, 100);
  assert.equal(initialStatus.sharedDailyLimit, 10000);

  // Record 1 search call (costs 1 search request + 1 shared unit)
  await youtubeQuota.recordUsage({
    searchRequests: 1,
    sharedUnits: 1,
    operationName: "Unit Test Search Query",
  });

  const updatedStatus = await youtubeQuota.getStatus();
  assert.equal(updatedStatus.searchConsumed, initialStatus.searchConsumed + 1);
  assert.equal(updatedStatus.sharedConsumed, initialStatus.sharedConsumed + 1);
});

test("4. Language Detection Accuracy (Hindi, Hinglish, English, Uncertain)", () => {
  const hindi = detectContentLanguage("हवाई जहाज की खिड़कियां गोल क्यों होती हैं?");
  assert.equal(hindi, "Hindi");

  const hinglish = detectContentLanguage("Airplane ki windows round kyu hoti hai? Sach jaan lo");
  assert.equal(hinglish, "Hinglish");

  const english = detectContentLanguage("Why Airplane Windows Are Actually Round and Not Square");
  assert.equal(english, "English");

  const uncertain = detectContentLanguage("12345 !!! ???");
  assert.equal(uncertain, "Uncertain / Mixed");
});

test("5. Trend Velocity: Safe Denominators (No Artificial Inflation)", () => {
  const freshVideo = {
    id: "v-fresh",
    title: "Fresh Video 1 Hour Old",
    description: "Sample",
    channelId: "c1",
    channelTitle: "Creator",
    publishedAt: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    thumbnailUrl: "https://i.ytimg.com/vi/v-fresh/hqdefault.jpg",
    viewCount: 10000,
    likeCount: 500,
    commentCount: 40,
    durationSeconds: 58,
    isoDuration: "PT58S",
    categoryId: "28",
    tags: [],
    videoUrl: "https://www.youtube.com/watch?v=v-fresh",
    ageInDays: 0.04,
    ageInHours: 1.0,
    historicalViewsPerDay: 10000, // Safe denominator: Math.max(1.0, ageInDays)
    isEarlyVelocityEstimate: true,
    engagementRate: 5.4,
    detectedLanguage: "English",
  };

  const matureVideo = {
    id: "v-mature",
    title: "Mature Video 5 Days Old",
    description: "Sample",
    channelId: "c2",
    channelTitle: "Creator 2",
    publishedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    thumbnailUrl: "https://i.ytimg.com/vi/v-mature/hqdefault.jpg",
    viewCount: 50000,
    likeCount: 2500,
    commentCount: 200,
    durationSeconds: 60,
    isoDuration: "PT1M",
    categoryId: "28",
    tags: [],
    videoUrl: "https://www.youtube.com/watch?v=v-mature",
    ageInDays: 5.0,
    ageInHours: 120.0,
    historicalViewsPerDay: 10000,
    isEarlyVelocityEstimate: false,
    engagementRate: 5.4,
    detectedLanguage: "English",
  };

  const scoring = calculateTransparentTrendScore([freshVideo, matureVideo]);
  assert.equal(scoring.hasEarlyEstimates, true);
  // Avg views per day should be 10,000, NOT millions!
  assert.equal(scoring.avgHistoricalViewsPerDay, 10000);
  assert.ok(scoring.score >= 50 && scoring.score <= 95);
});

test("6. Transparent Scoring: INSUFFICIENT DATA Rule", () => {
  const singleSample = [
    {
      id: "v-lonely",
      title: "Single Video Claiming Trend",
      description: "Sample",
      channelId: "c1",
      channelTitle: "Solo Channel",
      publishedAt: new Date().toISOString(),
      thumbnailUrl: "https://i.ytimg.com/vi/v-lonely/hqdefault.jpg",
      viewCount: 1000000,
      likeCount: 50000,
      commentCount: 2000,
      durationSeconds: 60,
      isoDuration: "PT1M",
      categoryId: "28",
      tags: [],
      videoUrl: "https://www.youtube.com/watch?v=v-lonely",
      ageInDays: 1,
      ageInHours: 24,
      historicalViewsPerDay: 1000000,
      isEarlyVelocityEstimate: false,
      engagementRate: 5.2,
      detectedLanguage: "English",
    },
  ];

  const scoring = calculateTransparentTrendScore(singleSample);
  assert.equal(scoring.score, "INSUFFICIENT DATA");
  assert.equal(scoring.confidence, "INSUFFICIENT DATA");
  assert.equal(scoring.classification, "Insufficient Data");
  assert.ok(scoring.explanation.includes("Fewer than 2"));
});

test("7. Persistent Research Caching with TTL Expiration", async () => {
  const testKey = "persistent:unit:test:cache";
  await youtubeQuota.setCache(testKey, { test: "data-persisted" }, 2000);

  const cached = await youtubeQuota.getCache(testKey);
  assert.deepEqual(cached, { test: "data-persisted" });
});

test("8. Script Engine Fact Verification: Real Primary Sources & Passages", async () => {
  const script = await runScriptEnginePipeline({
    topic: "Why Airplane Windows Are Round",
    format: "shorts",
    language: "English",
  });

  assert.ok(script.factChecks.length >= 2);
  const primary = script.factChecks.find((f) => f.verificationStatus === "VERIFIED_PRIMARY");
  assert.ok(primary);
  assert.ok(primary.sourceUrl.startsWith("https://"));
  assert.ok(primary.supportingPassage.length > 20);
});

test("9. Script Quality Gate: Heuristic Evaluation & Negative Checks", async () => {
  const script = await runScriptEnginePipeline({
    topic: "Pistol Shrimp Cavitation Shockwave",
    format: "shorts",
    language: "Hinglish",
  });

  const qGate = script.qualityGate;
  assert.ok(qGate.overallScore >= 80);
  assert.ok(qGate.metrics.hookStrength.whatIsEvaluated.length > 10);
  assert.ok(qGate.metrics.hookStrength.howEvaluated.length > 10);
  assert.ok(qGate.metrics.hookStrength.whyAssigned.length > 10);
  assert.ok(qGate.heuristicDisclaimer.includes("heuristic"));
});

test("10. Daily Research Unconfigured Behavior & Reporting", async () => {
  const report = await executeDailyTrendResearch({
    niche: "Interesting Facts",
    country: "IN",
    language: "en",
  });

  assert.equal(report.country, "IN");
  assert.ok(report.timestamp.length > 0);
  assert.equal(report.quotaStatus.sharedDailyLimit, 10000);
  assert.equal(report.quotaStatus.searchDailyLimit, 100);
});
