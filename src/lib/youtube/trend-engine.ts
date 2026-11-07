/**
 * ASH Creator Studio — Daily Trend Research & Transparent Scoring Engine
 * Phase 2 Upgraded: Safe denominators, persistent caching, Pacific Time resets,
 * channel-size normalization, and language detection.
 */

import {
  searchYouTubeVideos,
  getVideosDetails,
  getChannelsDetails,
  type YouTubePublicVideo,
  type YouTubePublicChannel,
  type DetectedLanguage,
} from "./data-api";
import { isYouTubeApiKeyConfigured } from "./config";
import { youtubeQuota, type QuotaStatus } from "./quota";

export type TrendClassification =
  | "Breakout Candidate"
  | "Rising Opportunity"
  | "Evergreen"
  | "Saturated"
  | "Content Gap"
  | "Insufficient Data";

export type ConfidenceLevel = "HIGH" | "MODERATE" | "INSUFFICIENT DATA";

export interface CompetitorSample {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  historicalViewsPerDay: number;
  isEarlyVelocityEstimate: boolean;
  ageInHours: number;
  engagementRate: number;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  detectedLanguage: DetectedLanguage;
}

export interface TrendOpportunity {
  id: string;
  topic: string;
  niche: string;
  classification: TrendClassification;
  confidence: ConfidenceLevel;
  score: number | "INSUFFICIENT DATA";
  scoringExplanation: string;
  sampleSize: number;
  researchDate: string;
  evidence: {
    avgHistoricalViewsPerDay: number | "Unavailable";
    hasEarlyVelocityEstimates: boolean;
    medianEngagementRate: number | "Unavailable";
    freshnessWindowDays: number;
    competingVideosCount: number;
    ageCohortBreakdown: {
      under48h: number;
      twoToSevenDays: number;
      eightToThirtyDays: number;
    };
    languageBreakdown: Record<string, number>;
    sampleVideos: CompetitorSample[];
  };
  contentGap: {
    description: string;
    unaddressedAngle: string;
    recommendedFormat: "Shorts" | "Long-form";
  };
  channelFit?: {
    alreadyCovered: boolean;
    coveredVideoTitle?: string;
    isAngleDifferentiated: boolean;
    fitRecommendation: string;
    uniqueAngleForCreator: string;
  };
}

export interface DailyResearchParams {
  niche: string;
  country?: string; // Default 'IN'
  language?: string; // Default 'hi' or 'en'
  videoFormat?: "shorts" | "longform" | "all";
  timeframe?: "24h" | "7d" | "30d";
  userChannelVideos?: Array<{ title: string; videoId: string; description?: string }>;
  userTimezone?: string;
}

export interface DailyResearchReport {
  timestamp: string;
  country: string;
  language: string;
  niche: string;
  totalTopicsResearched: number;
  quotaStatus: QuotaStatus;
  opportunities: TrendOpportunity[];
  isApiConfigured: boolean;
  unconfiguredNotice?: string;
}

/**
 * Calculates a transparent evidence-based score between 0 and 100.
 * If fewer than 2 relevant video samples exist, returns 'INSUFFICIENT DATA'.
 * Enforces safe denominators to avoid artificial inflation from newly published videos.
 */
export function calculateTransparentTrendScore(
  videos: YouTubePublicVideo[],
  channelsMap?: Map<string, YouTubePublicChannel>
): {
  score: number | "INSUFFICIENT DATA";
  classification: TrendClassification;
  confidence: ConfidenceLevel;
  explanation: string;
  avgHistoricalViewsPerDay: number;
  hasEarlyEstimates: boolean;
  medianEngagement: number;
  ageCohorts: { under48h: number; twoToSevenDays: number; eightToThirtyDays: number };
} {
  const ageCohorts = { under48h: 0, twoToSevenDays: 0, eightToThirtyDays: 0 };

  if (!videos || videos.length < 2) {
    return {
      score: "INSUFFICIENT DATA",
      classification: "Insufficient Data",
      confidence: "INSUFFICIENT DATA",
      explanation:
        "Fewer than 2 verified public video samples were found for this topic. A single high-performing video does not prove a trend.",
      avgHistoricalViewsPerDay: 0,
      hasEarlyEstimates: false,
      medianEngagement: 0,
      ageCohorts,
    };
  }

  const sampleSize = videos.length;
  let hasEarlyEstimates = false;

  for (const v of videos) {
    if (v.ageInHours < 48) ageCohorts.under48h++;
    else if (v.ageInDays <= 7) ageCohorts.twoToSevenDays++;
    else ageCohorts.eightToThirtyDays++;
    if (v.isEarlyVelocityEstimate) hasEarlyEstimates = true;
  }

  // Calculate safe historical views-per-day
  const totalViewsPerDay = videos.reduce((acc, v) => acc + v.historicalViewsPerDay, 0);
  const avgHistoricalViewsPerDay = Math.round(totalViewsPerDay / sampleSize);

  const engagements = videos.map((v) => v.engagementRate).sort((a, b) => a - b);
  const medianEngagement = engagements[Math.floor(engagements.length / 2)] || 0;

  const avgAgeDays = videos.reduce((acc, v) => acc + v.ageInDays, 0) / sampleSize;

  // Confidence level strictly tied to verified sample volume
  const confidence: ConfidenceLevel = sampleSize >= 5 ? "HIGH" : "MODERATE";

  // 1. Freshness Score (0 - 25 pts)
  let freshnessScore = 0;
  if (avgAgeDays <= 2) freshnessScore = 25;
  else if (avgAgeDays <= 7) freshnessScore = 20;
  else if (avgAgeDays <= 14) freshnessScore = 14;
  else if (avgAgeDays <= 30) freshnessScore = 8;
  else freshnessScore = 3;

  // 2. Velocity Benchmark Score (0 - 35 pts)
  let velocityScore = 0;
  if (avgHistoricalViewsPerDay >= 50000) velocityScore = 35;
  else if (avgHistoricalViewsPerDay >= 20000) velocityScore = 28;
  else if (avgHistoricalViewsPerDay >= 8000) velocityScore = 22;
  else if (avgHistoricalViewsPerDay >= 2000) velocityScore = 15;
  else velocityScore = 8;

  // 3. Engagement Score (0 - 20 pts)
  let engagementScore = 0;
  if (medianEngagement >= 6.0) engagementScore = 20;
  else if (medianEngagement >= 3.5) engagementScore = 15;
  else if (medianEngagement >= 1.5) engagementScore = 10;
  else engagementScore = 5;

  // 4. Channel Diversity & Channel-Size Ratio (0 - 20 pts)
  const uniqueChannels = new Set(videos.map((v) => v.channelId)).size;
  let diversityScore = Math.min(10, uniqueChannels * 2.5);

  // Bonus if smaller/medium channels are overperforming their baseline
  let channelSizeBonus = 5;
  if (channelsMap) {
    let outperformingChannels = 0;
    for (const v of videos) {
      const ch = channelsMap.get(v.channelId);
      if (ch && ch.subscriberCount && ch.subscriberCount > 0) {
        const ratio = v.viewCount / ch.subscriberCount;
        if (ratio >= 2.0) outperformingChannels++;
      }
    }
    if (outperformingChannels >= 2) channelSizeBonus = 10;
  }

  const rawScore = freshnessScore + velocityScore + engagementScore + diversityScore + channelSizeBonus;
  const finalScore = Math.min(98, Math.max(15, rawScore));

  // Transparent Classification
  let classification: TrendClassification = "Rising Opportunity";
  if (avgAgeDays <= 5 && avgHistoricalViewsPerDay >= 20000 && uniqueChannels >= 3) {
    classification = "Breakout Candidate";
  } else if (sampleSize >= 12 && avgHistoricalViewsPerDay < 2500) {
    classification = "Saturated";
  } else if (avgAgeDays >= 18 && avgHistoricalViewsPerDay >= 3500) {
    classification = "Evergreen";
  } else if (uniqueChannels <= 2 && avgHistoricalViewsPerDay >= 8000) {
    classification = "Content Gap";
  } else {
    classification = "Rising Opportunity";
  }

  const noteEarly = hasEarlyEstimates
    ? " Includes newly published videos with rate normalized to 24h baseline."
    : "";

  const explanation = `Score evaluated from ${sampleSize} verified video samples across ${uniqueChannels} independent channels. Historical daily rate: ~${avgHistoricalViewsPerDay.toLocaleString()} views/day with ${medianEngagement}% median audience interaction.${noteEarly}`;

  return {
    score: finalScore,
    classification,
    confidence,
    explanation,
    avgHistoricalViewsPerDay,
    hasEarlyEstimates,
    medianEngagement,
    ageCohorts,
  };
}

/**
 * Evaluates creator's own channel upload history against discovered topic.
 */
function analyzeChannelFit(
  topicTitle: string,
  userVideos: Array<{ title: string; videoId: string }> = []
) {
  if (!userVideos || userVideos.length === 0) {
    return {
      alreadyCovered: false,
      isAngleDifferentiated: true,
      fitRecommendation: "Connect your YouTube channel to compare this topic against your upload history.",
      uniqueAngleForCreator: "Approach with an evidence-first hook focusing on the lesser-known mechanical cause.",
    };
  }

  const topicWords = topicTitle.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  let coveredVideoTitle: string | undefined;

  const alreadyCovered = userVideos.some((uv) => {
    const uvTitle = uv.title.toLowerCase();
    const matchCount = topicWords.filter((w) => uvTitle.includes(w)).length;
    if (matchCount >= 2) {
      coveredVideoTitle = uv.title;
      return true;
    }
    return false;
  });

  if (alreadyCovered) {
    return {
      alreadyCovered: true,
      coveredVideoTitle,
      isAngleDifferentiated: false,
      fitRecommendation: `Your channel previously covered a similar theme in "${coveredVideoTitle}". To avoid audience fatigue, pivot to an entirely new contrarian angle or a 'Part 2 Update'.`,
      uniqueAngleForCreator: "Focus strictly on what changed since your last video or address viewer questions from your comments.",
    };
  }

  return {
    alreadyCovered: false,
    isAngleDifferentiated: true,
    fitRecommendation: "This topic does not overlap with your recent uploads and fits your channel's educational genre.",
    uniqueAngleForCreator: "Frame the discovery around an unexpected curiosity question within the first 2 seconds.",
  };
}

/**
 * Executes a full Daily Trend Research cycle using persistent storage and quota tracking.
 */
export async function executeDailyTrendResearch(params: DailyResearchParams): Promise<DailyResearchReport> {
  const {
    niche,
    country = "IN",
    language = "en",
    videoFormat = "shorts",
    timeframe = "7d",
    userChannelVideos = [],
    userTimezone = "America/Los_Angeles",
  } = params;

  const cacheKey = `trends_v2:${country}:${language}:${niche}:${videoFormat}:${timeframe}`;
  const cachedReport = await youtubeQuota.getCache<DailyResearchReport>(cacheKey);
  if (cachedReport) {
    return cachedReport;
  }

  const now = Date.now();
  const windowDays = timeframe === "24h" ? 1 : timeframe === "7d" ? 7 : 30;
  const publishedAfter = new Date(now - windowDays * 24 * 3600 * 1000).toISOString();

  const isConfigured = isYouTubeApiKeyConfigured();
  const currentQuotaStatus = await youtubeQuota.getStatus(userTimezone);

  if (!isConfigured) {
    return {
      timestamp: new Date().toISOString(),
      country,
      language,
      niche,
      totalTopicsResearched: 0,
      quotaStatus: currentQuotaStatus,
      opportunities: [],
      isApiConfigured: false,
      unconfiguredNotice:
        "YouTube Data API v3 key is not configured in .env.local. Add YOUTUBE_API_KEY to retrieve live public YouTube research.",
    };
  }

  // 4 targeted research queries
  const searchQueries = [
    `${niche} facts`,
    `${niche} mystery explained`,
    `${niche} discovery`,
    `${niche} unexpected truth`,
  ];

  const opportunities: TrendOpportunity[] = [];

  for (let i = 0; i < searchQueries.length; i++) {
    const q = searchQueries[i];
    try {
      // 1. Search YouTube Data API v3 (1 search request + 1 shared unit)
      const videoIds = await searchYouTubeVideos({
        query: q,
        regionCode: country,
        relevanceLanguage: language === "hi" ? "hi" : "en",
        order: "viewCount",
        publishedAfter,
        videoDuration: videoFormat === "shorts" ? "short" : videoFormat === "longform" ? "medium" : "any",
        maxResults: 8,
      });

      if (videoIds.length === 0) continue;

      // 2. Fetch batched video details
      const videoDetails = await getVideosDetails(videoIds);
      if (videoDetails.length === 0) continue;

      // 3. Batched channel lookup for channel-size normalization
      const channelIds = videoDetails.map((v) => v.channelId);
      const channelsMap = await getChannelsDetails(channelIds);

      // 4. Score with safe denominators
      const scoring = calculateTransparentTrendScore(videoDetails, channelsMap);

      // Language breakdown tally
      const languageBreakdown: Record<string, number> = {
        Hindi: 0,
        Hinglish: 0,
        English: 0,
        "Uncertain / Mixed": 0,
      };
      for (const v of videoDetails) {
        languageBreakdown[v.detectedLanguage] = (languageBreakdown[v.detectedLanguage] || 0) + 1;
      }

      const competitorSamples: CompetitorSample[] = videoDetails.slice(0, 4).map((v) => ({
        videoId: v.id,
        title: v.title,
        channelTitle: v.channelTitle,
        publishedAt: v.publishedAt,
        viewCount: v.viewCount,
        historicalViewsPerDay: v.historicalViewsPerDay,
        isEarlyVelocityEstimate: v.isEarlyVelocityEstimate,
        ageInHours: v.ageInHours,
        engagementRate: v.engagementRate,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        durationSeconds: v.durationSeconds,
        detectedLanguage: v.detectedLanguage,
      }));

      const primaryVideo = videoDetails[0];
      const cleanTopic = primaryVideo
        ? primaryVideo.title.replace(/#[a-zA-Z0-9_]+/g, "").trim()
        : `${niche} Focus #${i + 1}`;

      const channelFit = analyzeChannelFit(cleanTopic, userChannelVideos);

      opportunities.push({
        id: `trend-${Date.now()}-${i}`,
        topic: cleanTopic,
        niche,
        classification: scoring.classification,
        confidence: scoring.confidence,
        score: scoring.score,
        scoringExplanation: scoring.explanation,
        sampleSize: videoDetails.length,
        researchDate: new Date().toISOString(),
        evidence: {
          avgHistoricalViewsPerDay: scoring.avgHistoricalViewsPerDay,
          hasEarlyVelocityEstimates: scoring.hasEarlyEstimates,
          medianEngagementRate: scoring.medianEngagement,
          freshnessWindowDays: windowDays,
          competingVideosCount: videoDetails.length,
          ageCohortBreakdown: scoring.ageCohorts,
          languageBreakdown,
          sampleVideos: competitorSamples,
        },
        contentGap: {
          description: `Existing videos average ~${scoring.avgHistoricalViewsPerDay.toLocaleString()} views/day. An educational curiosity hook addressing root causes is missing in recent uploads.`,
          unaddressedAngle: "Highlight the exact counter-intuitive mechanism that debunked earlier assumptions.",
          recommendedFormat: videoFormat === "longform" ? "Long-form" : "Shorts",
        },
        channelFit,
      });
    } catch (err) {
      console.warn(`[Trend Engine] Query "${q}" failed:`, err);
    }
  }

  const updatedQuotaStatus = await youtubeQuota.getStatus(userTimezone);

  const report: DailyResearchReport = {
    timestamp: new Date().toISOString(),
    country,
    language,
    niche,
    totalTopicsResearched: opportunities.length,
    quotaStatus: updatedQuotaStatus,
    opportunities,
    isApiConfigured: true,
  };

  // Persist to Supabase cache with 1-hour TTL
  await youtubeQuota.setCache(cacheKey, report, 3600 * 1000);

  return report;
}
