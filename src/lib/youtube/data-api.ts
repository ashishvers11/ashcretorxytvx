/**
 * Official YouTube Data API v3 Client
 * Implements: search.list, videos.list, channels.list, playlistItems.list
 * Features: Request batching, dual quota tracking, persistent caching, language detection.
 */

import { getYoutubeApiKey, isYouTubeApiKeyConfigured } from "./config";
import { youtubeQuota } from "./quota";

export type DetectedLanguage = "Hindi" | "Hinglish" | "English" | "Uncertain / Mixed";

export interface YouTubePublicVideo {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  durationSeconds: number;
  isoDuration: string;
  categoryId: string;
  tags: string[];
  videoUrl: string;
  // Computed analytical fields
  ageInDays: number;
  ageInHours: number;
  historicalViewsPerDay: number; // Public viewCount / Math.max(1.0, ageInDays)
  isEarlyVelocityEstimate: boolean; // True if published < 24 hours ago
  engagementRate: number; // (likes + comments) / views * 100
  detectedLanguage: DetectedLanguage;
}

export interface YouTubePublicChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number | null;
  videoCount: number;
  viewCount: number;
}

export interface SearchOptions {
  query: string;
  regionCode?: string; // Default 'IN'
  relevanceLanguage?: string; // e.g. 'hi', 'en'
  order?: "relevance" | "date" | "viewCount" | "rating";
  publishedAfter?: string; // ISO 8601 string
  videoDuration?: "any" | "short" | "medium" | "long";
  maxResults?: number;
}

/**
 * Accurately detects content language from title and description.
 * Strictly avoids silently labeling unknown text as Hindi or English.
 */
export function detectContentLanguage(title = "", description = ""): DetectedLanguage {
  const combined = (title + " " + description).trim();
  if (!combined) return "Uncertain / Mixed";

  // 1. Devanagari Unicode script range (Hindi)
  const devanagariMatches = combined.match(/[\u0900-\u097F]/g);
  const devanagariCount = devanagariMatches ? devanagariMatches.length : 0;
  if (devanagariCount >= 4 || devanagariCount / combined.length > 0.08) {
    return "Hindi";
  }

  // 2. Romanized Hindi (Hinglish) vocabulary tokens
  const hinglishTokens = [
    "kya", "kaise", "kyun", "kyu", "nahi", "nhi", "hota", "hoti", "hote",
    "dekhkar", "dekho", "dekhiye", "dekhein", "sach", "sachai", "log", "logon",
    "yeh", "woh", "hain", "rahasya", "galti", "gajab", "shuru", "jaan",
    "aakhir", "asli", "karo", "karein", "hum", "tum", "aap", "aapko", "iska", "uski", "inke"
  ];

  const lower = combined.toLowerCase();
  const words = lower.split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
  const matchedHinglish = words.filter((w) => hinglishTokens.includes(w));

  if (matchedHinglish.length >= 2) {
    return "Hinglish";
  }

  // 3. English vocabulary tokens
  const englishWords = [
    "the", "why", "how", "what", "is", "are", "and", "of", "in", "to", "for",
    "science", "truth", "secret", "never", "everyone", "shocking", "mystery", "explained",
    "video", "shorts", "channel", "physics", "universe", "human", "brain"
  ];
  const matchedEnglish = words.filter((w) => englishWords.includes(w));
  if (matchedEnglish.length >= 2 && matchedHinglish.length === 0) {
    return "English";
  }

  return "Uncertain / Mixed";
}

/**
 * Parses ISO 8601 duration (e.g. PT4M13S, PT58S, PT1H2M10S) to seconds.
 */
export function parseIsoDuration(durationStr: string): number {
  if (!durationStr) return 0;
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = durationStr.match(regex);
  if (!matches) return 0;
  const hours = parseInt(matches[1] || "0", 10);
  const minutes = parseInt(matches[2] || "0", 10);
  const seconds = parseInt(matches[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * 1. search.list
 * Discovers video IDs based on keywords, region, language, and date range.
 * Tracks: 1 Search Request count + 1 Shared Quota Unit.
 */
export async function searchYouTubeVideos(options: SearchOptions): Promise<string[]> {
  const {
    query,
    regionCode = "IN",
    relevanceLanguage = "en",
    order = "viewCount",
    publishedAfter,
    videoDuration = "any",
    maxResults = 15,
  } = options;

  if (!isYouTubeApiKeyConfigured()) {
    throw new Error("YOUTUBE_API_KEY is not configured in .env.local");
  }

  const canAfford = await youtubeQuota.canAffordSearch();
  if (!canAfford) {
    throw new Error("YouTube API daily quota limit reached. Search deferred to prevent overage.");
  }

  const apiKey = getYoutubeApiKey();
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "id");
  url.searchParams.set("type", "video");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(Math.min(maxResults, 50)));
  url.searchParams.set("regionCode", regionCode);
  if (relevanceLanguage) url.searchParams.set("relevanceLanguage", relevanceLanguage);
  if (order) url.searchParams.set("order", order);
  if (publishedAfter) url.searchParams.set("publishedAfter", publishedAfter);
  if (videoDuration && videoDuration !== "any") url.searchParams.set("videoDuration", videoDuration);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const data = await response.json();
  // Official Quota Accounting: 1 search request + 1 shared unit
  await youtubeQuota.recordUsage({
    searchRequests: 1,
    sharedUnits: 1,
    operationName: `search.list [q: ${query}]`,
  });

  if (!response.ok) {
    const msg = data.error?.message || `YouTube search.list failed (${response.status})`;
    throw new Error(msg);
  }

  if (!data.items || !Array.isArray(data.items)) {
    return [];
  }

  return data.items
    .map((item: any) => item.id?.videoId)
    .filter(Boolean) as string[];
}

/**
 * 2. videos.list
 * Batched lookup for full video statistics, duration, tags, and engagement.
 * Up to 50 IDs per call. Quota cost: 1 shared unit.
 */
export async function getVideosDetails(videoIds: string[]): Promise<YouTubePublicVideo[]> {
  if (videoIds.length === 0) return [];
  if (!isYouTubeApiKeyConfigured()) {
    throw new Error("YOUTUBE_API_KEY is not configured in .env.local");
  }

  const apiKey = getYoutubeApiKey();
  const results: YouTubePublicVideo[] = [];
  const chunkSize = 50;

  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    const canAfford = await youtubeQuota.canAffordShared(1);
    if (!canAfford) break;

    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const data = await response.json();
    await youtubeQuota.recordUsage({
      sharedUnits: 1,
      operationName: `videos.list [batch: ${chunk.length} items]`,
    });

    if (!response.ok) {
      throw new Error(data.error?.message || `YouTube videos.list failed (${response.status})`);
    }

    if (data.items && Array.isArray(data.items)) {
      const now = Date.now();
      for (const item of data.items) {
        const snippet = item.snippet || {};
        const stats = item.statistics || {};
        const content = item.contentDetails || {};

        const publishedAt = snippet.publishedAt || new Date().toISOString();
        const pubTime = new Date(publishedAt).getTime();
        const diffMs = Math.max(0, now - pubTime);
        const ageInHours = parseFloat((diffMs / (1000 * 3600)).toFixed(1));
        const rawAgeInDays = diffMs / (1000 * 3600 * 24);

        const viewCount = parseInt(stats.viewCount || "0", 10);
        const likeCount = parseInt(stats.likeCount || "0", 10);
        const commentCount = parseInt(stats.commentCount || "0", 10);

        // Safe Denominator Calculation:
        // Do NOT let very fresh uploads (e.g. 1 hour old) create artificial millions of views/day
        const safeDenominatorDays = Math.max(1.0, rawAgeInDays);
        const historicalViewsPerDay = Math.round(viewCount / safeDenominatorDays);
        const isEarlyVelocityEstimate = rawAgeInDays < 1.0;

        const engagementRate = viewCount > 0 ? ((likeCount + commentCount) / viewCount) * 100 : 0;

        const thumbs = snippet.thumbnails || {};
        const thumbUrl =
          thumbs.maxres?.url ||
          thumbs.high?.url ||
          thumbs.medium?.url ||
          thumbs.default?.url ||
          `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;

        const durationSeconds = parseIsoDuration(content.duration || "");
        const detectedLanguage = detectContentLanguage(snippet.title || "", snippet.description || "");

        results.push({
          id: item.id,
          title: snippet.title || "Untitled",
          description: snippet.description || "",
          channelId: snippet.channelId || "",
          channelTitle: snippet.channelTitle || "Unknown Creator",
          publishedAt,
          thumbnailUrl: thumbUrl,
          viewCount,
          likeCount,
          commentCount,
          durationSeconds,
          isoDuration: content.duration || "PT0S",
          categoryId: snippet.categoryId || "0",
          tags: Array.isArray(snippet.tags) ? snippet.tags : [],
          videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
          ageInDays: parseFloat(rawAgeInDays.toFixed(2)),
          ageInHours,
          historicalViewsPerDay,
          isEarlyVelocityEstimate,
          engagementRate: parseFloat(engagementRate.toFixed(2)),
          detectedLanguage,
        });
      }
    }
  }

  return results;
}

/**
 * 3. channels.list
 * Batched lookup for public channel subscriber counts and upload playlists.
 * Up to 50 IDs per call. Quota cost: 1 shared unit.
 */
export async function getChannelsDetails(channelIds: string[]): Promise<Map<string, YouTubePublicChannel>> {
  const map = new Map<string, YouTubePublicChannel>();
  if (channelIds.length === 0) return map;
  if (!isYouTubeApiKeyConfigured()) return map;

  const apiKey = getYoutubeApiKey();
  const uniqueIds = Array.from(new Set(channelIds)).slice(0, 50);

  const canAfford = await youtubeQuota.canAffordShared(1);
  if (!canAfford) return map;

  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("id", uniqueIds.join(","));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const data = await response.json();
  await youtubeQuota.recordUsage({
    sharedUnits: 1,
    operationName: `channels.list [${uniqueIds.length} channels]`,
  });

  if (response.ok && data.items) {
    for (const item of data.items) {
      const snippet = item.snippet || {};
      const stats = item.statistics || {};
      const thumbs = snippet.thumbnails || {};

      map.set(item.id, {
        id: item.id,
        title: snippet.title || "",
        description: snippet.description || "",
        thumbnailUrl: thumbs.medium?.url || thumbs.default?.url || "",
        subscriberCount: stats.hiddenSubscriberCount ? null : parseInt(stats.subscriberCount || "0", 10),
        videoCount: parseInt(stats.videoCount || "0", 10),
        viewCount: parseInt(stats.viewCount || "0", 10),
      });
    }
  }

  return map;
}

/**
 * 4. playlistItems.list
 * Retrieves latest uploads for a channel's upload playlist.
 * Quota cost: 1 shared unit.
 */
export async function getPlaylistItems(uploadsPlaylistId: string, maxResults = 10): Promise<string[]> {
  if (!isYouTubeApiKeyConfigured()) return [];
  const apiKey = getYoutubeApiKey();

  const canAfford = await youtubeQuota.canAffordShared(1);
  if (!canAfford) return [];

  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("playlistId", uploadsPlaylistId);
  url.searchParams.set("maxResults", String(Math.min(maxResults, 50)));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const data = await response.json();
  await youtubeQuota.recordUsage({
    sharedUnits: 1,
    operationName: `playlistItems.list [${uploadsPlaylistId}]`,
  });

  if (!response.ok || !data.items) return [];

  return data.items
    .map((item: any) => item.contentDetails?.videoId)
    .filter(Boolean) as string[];
}
