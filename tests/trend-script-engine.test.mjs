import test from "node:test";
import assert from "node:assert/strict";

// Import modules to test
import {
  calculateTransparentTrendScore,
  executeDailyTrendResearch,
} from "../src/lib/youtube/trend-engine.ts";
import { parseIsoDuration } from "../src/lib/youtube/data-api.ts";
import { youtubeQuota } from "../src/lib/youtube/quota.ts";
import { isYouTubeApiKeyConfigured, getYoutubeApiKey } from "../src/lib/youtube/config.ts";
import { runScriptEnginePipeline } from "../src/lib/script-engine/pipeline.ts";
import { BUILT_IN_PRESETS, getPresetById } from "../src/lib/script-engine/presets.ts";

test("1. YouTube API Key Configuration Status", () => {
  const isConfigured = isYouTubeApiKeyConfigured();
  const apiKey = getYoutubeApiKey();
  // We transparently report whether key is configured or not
  if (!isConfigured) {
    assert.equal(typeof isConfigured, "boolean");
    console.log("   [CONFIG STATUS] YOUTUBE_API_KEY is currently unconfigured or placeholder.");
  } else {
    assert.ok(apiKey.length > 15);
    console.log("   [CONFIG STATUS] YOUTUBE_API_KEY is configured.");
  }
});

test("2. ISO 8601 Duration Parsing (Video statistics)", () => {
  assert.equal(parseIsoDuration("PT58S"), 58);
  assert.equal(parseIsoDuration("PT1M30S"), 90);
  assert.equal(parseIsoDuration("PT1H2M10S"), 3730);
  assert.equal(parseIsoDuration(""), 0);
});

test("3. Video Statistics & Historical Views-per-Day Calculation", () => {
  const sampleVideos = [
    {
      id: "v1",
      title: "Science Discovery Video 1",
      description: "Sample",
      channelId: "c1",
      channelTitle: "Science Channel A",
      publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      thumbnailUrl: "https://i.ytimg.com/vi/v1/hqdefault.jpg",
      viewCount: 60000,
      likeCount: 4200,
      commentCount: 300,
      durationSeconds: 58,
      isoDuration: "PT58S",
      categoryId: "28",
      tags: ["science", "discovery"],
      videoUrl: "https://www.youtube.com/watch?v=v1",
      ageInDays: 3,
      viewsPerDay: 20000,
      engagementRate: 7.5,
    },
    {
      id: "v2",
      title: "Science Discovery Video 2",
      description: "Sample",
      channelId: "c2",
      channelTitle: "Science Channel B",
      publishedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      thumbnailUrl: "https://i.ytimg.com/vi/v2/hqdefault.jpg",
      viewCount: 40000,
      likeCount: 2800,
      commentCount: 200,
      durationSeconds: 55,
      isoDuration: "PT55S",
      categoryId: "28",
      tags: ["physics", "curiosity"],
      videoUrl: "https://www.youtube.com/watch?v=v2",
      ageInDays: 4,
      viewsPerDay: 10000,
      engagementRate: 7.5,
    },
    {
      id: "v3",
      title: "Science Discovery Video 3",
      description: "Sample",
      channelId: "c3",
      channelTitle: "Science Channel C",
      publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      thumbnailUrl: "https://i.ytimg.com/vi/v3/hqdefault.jpg",
      viewCount: 90000,
      likeCount: 6000,
      commentCount: 500,
      durationSeconds: 59,
      isoDuration: "PT59S",
      categoryId: "28",
      tags: ["truth", "nature"],
      videoUrl: "https://www.youtube.com/watch?v=v3",
      ageInDays: 2,
      viewsPerDay: 45000,
      engagementRate: 7.2,
    },
  ];

  const scoring = calculateTransparentTrendScore(sampleVideos);
  assert.notEqual(scoring.score, "INSUFFICIENT DATA");
  assert.ok(typeof scoring.score === "number" && scoring.score >= 50);
  assert.equal(scoring.confidence, "MODERATE");
  assert.ok(scoring.avgViewsPerDay > 15000);
});

test("4. Transparent Scoring: INSUFFICIENT DATA Rule", () => {
  // If fewer than 2 videos, must return INSUFFICIENT DATA
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
      viewsPerDay: 1000000,
      engagementRate: 5.2,
    },
  ];

  const scoring = calculateTransparentTrendScore(singleSample);
  assert.equal(scoring.score, "INSUFFICIENT DATA");
  assert.equal(scoring.confidence, "INSUFFICIENT DATA");
  assert.equal(scoring.classification, "Insufficient Data");
  assert.ok(scoring.explanation.includes("Fewer than 2"));
});

test("5. Quota Tracking & Daily Limit Warnings", () => {
  const initialStatus = youtubeQuota.getStatus();
  assert.equal(initialStatus.dailyLimit, 10000);
  assert.ok(initialStatus.remainingUnits >= 0);

  // Record simulated usage
  youtubeQuota.recordUsage(100, "Unit Test Search Query");
  const updatedStatus = youtubeQuota.getStatus();
  assert.equal(updatedStatus.consumedUnits, initialStatus.consumedUnits + 100);
});

test("6. Research Query Caching & Expiration", () => {
  const cacheKey = "test:query:cache";
  youtubeQuota.setCache(cacheKey, { payload: "fresh-research" }, 500); // 500ms TTL

  assert.deepEqual(youtubeQuota.getCache(cacheKey), { payload: "fresh-research" });
  youtubeQuota.clearCache();
  assert.equal(youtubeQuota.getCache(cacheKey), null);
});

test("7. Creator Presets (Part 7)", () => {
  assert.ok(BUILT_IN_PRESETS.length >= 3);
  const factSlice = getPresetById("preset-fact-slice");
  assert.equal(factSlice.name, "FACT SLICE");
  assert.equal(factSlice.format, "shorts");
  assert.equal(factSlice.aspectRatio, "9:16");

  const curiokid = getPresetById("preset-curiokid-vers");
  assert.equal(curiokid.name, "CURIOKID_VERS");
  assert.equal(curiokid.language, "Hinglish");
});

test("8. 8-Stage Script Engine Pipeline: Complete End-to-End Generation", async () => {
  const script = await runScriptEnginePipeline({
    topic: "Why Airplane Windows Are Round",
    niche: "Science & Engineering",
    presetId: "preset-fact-slice",
    format: "shorts",
    targetDurationSeconds: 60,
    language: "Hinglish",
  });

  // Stage 1: Research Brief
  assert.ok(script.researchBrief.centralFact.length > 20);
  assert.ok(script.researchBrief.commonMisconceptions.length >= 2);

  // Stage 2: Original Angles
  assert.ok(script.angles.length >= 3);
  assert.ok(script.selectedAngleId.length > 0);

  // Stage 3: Hook Development (3 Distinct Frameworks)
  assert.equal(script.hooks.length, 3);
  const styles = script.hooks.map((h) => h.style);
  assert.ok(styles.includes("Curiosity Gap"));
  assert.ok(styles.includes("Pattern Interrupt"));
  assert.ok(styles.includes("Bold Contrarian"));
  assert.ok(script.hooks.some((h) => h.isRecommended));

  // Stage 4 & 5: Story Construction & Voiceover Duration
  assert.ok(script.fullVoiceover.length > 100);
  assert.ok(script.wordCount >= 70 && script.wordCount <= 180);
  assert.ok(script.estimatedDurationSeconds >= 35 && script.estimatedDurationSeconds <= 75);

  // Stage 6: Scene-by-Scene Visual Planning
  assert.ok(script.scenes.length >= 5);
  const scene1 = script.scenes[0];
  assert.equal(scene1.sceneNumber, 1);
  assert.ok(scene1.imagePrompt.includes("--v 6.0") || scene1.imagePrompt.includes("9:16"));
  assert.ok(scene1.soundEffect.length > 0);
  assert.ok(scene1.transition.length > 0);

  // Stage 7: Fact Verification
  assert.ok(script.factChecks.length >= 2);
  assert.ok(script.factChecks.every((f) => f.verified === true));
  assert.ok(script.factChecks.every((f) => f.sourceTitle.length > 5));

  // Stage 8: Script Quality Gate
  assert.ok(script.qualityGate.overallScore >= 80);
  assert.equal(script.qualityGate.verdict, "Ready for Production");
  assert.ok(script.qualityGate.metrics.hookStrength.score >= 85);
  assert.ok(script.qualityGate.metrics.factualReliability.score >= 90);
});

test("9. Script Engine Hindi & English Voiceover Cadence", async () => {
  const hindiScript = await runScriptEnginePipeline({
    topic: "Chandrayaan-3 Moon Landing",
    language: "Hindi",
  });
  assert.equal(hindiScript.language, "Hindi");
  assert.ok(hindiScript.fullVoiceover.includes("Pehli nazar mein") || hindiScript.fullVoiceover.includes("hai"));

  const englishScript = await runScriptEnginePipeline({
    topic: "Black Hole Event Horizon",
    language: "English",
  });
  assert.equal(englishScript.language, "English");
  assert.ok(englishScript.fullVoiceover.includes("At first glance"));
});

test("10. Daily Research Fallback & Unconfigured Reporting", async () => {
  const report = await executeDailyTrendResearch({
    niche: "Interesting Facts",
    country: "IN",
    language: "en",
  });

  assert.equal(report.country, "IN");
  assert.ok(report.timestamp.length > 0);
  assert.ok(report.quotaStatus.dailyLimit === 10000);
  if (!report.isApiConfigured) {
    assert.ok(report.unconfiguredNotice?.includes("YOUTUBE_API_KEY"));
  }
});
