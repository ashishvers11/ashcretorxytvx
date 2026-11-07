/**
 * Official YouTube Data API v3 Client
 * Implements: search.list, videos.list, channels.list, playlistItems.list
 * Features: Request batching, quota tracking, ISO-8601 duration parsing, error handling.
 */

import { getYoutubeApiKey, isYouTubeApiKeyConfigured } from "./config";
import { youtubeQuota } from "./quota";

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
  viewsPerDay: number; // Public viewCount / ageInDays (Historical average)
  engagementRate: number; // (likes + comments) / views * 100
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
 * Quota cost: 100 units.
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

  if (!youtubeQuota.canAfford(100)) {
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
  youtubeQuota.recordUsage(100, `search.list [q: ${query}]`);

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
 * Up to 50 IDs per call. Quota cost: 1 unit.
 */
export async function getVideosDetails(videoIds: string[]): Promise<YouTubePublicVideo[]> {
  if (videoIds.length === 0) return [];
  if (!isYouTubeApiKeyConfigured()) {
    throw new Error("YOUTUBE_API_KEY is not configured in .env.local");
  }

  const apiKey = getYoutubeApiKey();
  const results: YouTubePublicVideo[] = [];
  const chunkSize = 50; // Official YouTube batch size limit

  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    if (!youtubeQuota.canAfford(1)) break;

    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const data = await response.json();
    youtubeQuota.recordUsage(1, `videos.list [batch: ${chunk.length} items]`);

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
        const ageInDays = Math.max(0.05, (now - pubTime) / (1000 * 3600 * 24));

        const viewCount = parseInt(stats.viewCount || "0", 10);
        const likeCount = parseInt(stats.likeCount || "0", 10);
        const commentCount = parseInt(stats.commentCount || "0", 10);

        const viewsPerDay = Math.round(viewCount / ageInDays);
        const engagementRate = viewCount > 0 ? ((likeCount + commentCount) / viewCount) * 100 : 0;

        const thumbs = snippet.thumbnails || {};
        const thumbUrl =
          thumbs.maxres?.url ||
          thumbs.high?.url ||
          thumbs.medium?.url ||
          thumbs.default?.url ||
          `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;

        const durationSeconds = parseIsoDuration(content.duration || "");

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
          ageInDays: parseFloat(ageInDays.toFixed(1)),
          viewsPerDay,
          engagementRate: parseFloat(engagementRate.toFixed(2)),
        });
      }
    }
  }

  return results;
}

/**
 * 3. channels.list
 * Batched lookup for public channel subscriber counts and upload playlists.
 * Up to 50 IDs per call. Quota cost: 1 unit.
 */
export async function getChannelsDetails(channelIds: string[]): Promise<Map<string, YouTubePublicChannel>> {
  const map = new Map<string, YouTubePublicChannel>();
  if (channelIds.length === 0) return map;
  if (!isYouTubeApiKeyConfigured()) return map;

  const apiKey = getYoutubeApiKey();
  const uniqueIds = Array.from(new Set(channelIds)).slice(0, 50);

  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("id", uniqueIds.join(","));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const data = await response.json();
  youtubeQuota.recordUsage(1, `channels.list [${uniqueIds.length} channels]`);

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
 * Retrieves latest uploads for a specific channel's upload playlist.
 * Quota cost: 1 unit.
 */
export async function getPlaylistItems(uploadsPlaylistId: string, maxResults = 10): Promise<string[]> {
  if (!isYouTubeApiKeyConfigured()) return [];
  const apiKey = getYoutubeApiKey();

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
  youtubeQuota.recordUsage(1, `playlistItems.list [${uploadsPlaylistId}]`);

  if (!response.ok || !data.items) return [];

  return data.items
    .map((item: any) => item.contentDetails?.videoId)
    .filter(Boolean) as string[];
}
