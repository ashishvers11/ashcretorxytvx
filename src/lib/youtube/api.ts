/**
 * YouTube Data API v3 & YouTube Analytics API Integration.
 * Real data only — never uses mock or hardcoded statistics.
 */

export interface YouTubeVideoItem {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  videoUrl: string;
}

export interface YouTubeAnalyticsData {
  isAvailable: boolean;
  estimatedMinutesWatched?: number | "Unavailable";
  averageViewDuration?: number | "Unavailable";
  subscribersGained?: number | "Unavailable";
  subscribersLost?: number | "Unavailable";
  views?: number | "Unavailable";
  likes?: number | "Unavailable";
  comments?: number | "Unavailable";
  reason?: string;
}

export interface YouTubeChannelDetails {
  channelId: string;
  title: string;
  description: string;
  customUrl: string | null;
  thumbnailUrl: string | null;
  subscriberCount: number | null;
  hiddenSubscriberCount: boolean;
  viewCount: number | null;
  videoCount: number | null;
  uploadsPlaylistId: string | null;
  recentVideos: YouTubeVideoItem[];
  analytics?: YouTubeAnalyticsData;
}

/**
 * Fetches the authenticated creator's YouTube channel via YouTube Data API v3.
 * Uses the mine=true parameter with authorized bearer token.
 */
export async function fetchMyYouTubeChannel(accessToken: string): Promise<YouTubeChannelDetails> {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,contentDetails,statistics");
  url.searchParams.set("mine", "true");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.error?.message || "Failed to fetch YouTube channel details from Google";
    throw new Error(errorMsg);
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("No YouTube channel found associated with this Google account.");
  }

  const channel = data.items[0];
  const snippet = channel.snippet || {};
  const stats = channel.statistics || {};
  const contentDetails = channel.contentDetails || {};

  const thumbnails = snippet.thumbnails || {};
  const avatarUrl =
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    null;

  const isHiddenSubscribers = Boolean(stats.hiddenSubscriberCount);
  const subscriberCount =
    isHiddenSubscribers || stats.subscriberCount === undefined || stats.subscriberCount === null
      ? null
      : Number(stats.subscriberCount);

  const viewCount =
    stats.viewCount !== undefined && stats.viewCount !== null ? Number(stats.viewCount) : null;
  const videoCount =
    stats.videoCount !== undefined && stats.videoCount !== null ? Number(stats.videoCount) : null;

  const uploadsPlaylistId = contentDetails.relatedPlaylists?.uploads || null;

  // Fetch recent uploaded videos if uploads playlist exists
  let recentVideos: YouTubeVideoItem[] = [];
  if (uploadsPlaylistId) {
    try {
      recentVideos = await fetchRecentChannelVideos(accessToken, uploadsPlaylistId, 5);
    } catch (err) {
      console.warn("Could not fetch recent uploaded videos:", err);
    }
  }

  // Fetch YouTube analytics if authorized
  let analytics: YouTubeAnalyticsData = { isAvailable: false, reason: "Not requested yet" };
  try {
    analytics = await fetchYouTubeAnalytics(accessToken);
  } catch (err) {
    console.warn("Could not fetch YouTube Analytics:", err);
    analytics = {
      isAvailable: false,
      reason: err instanceof Error ? err.message : "YouTube Analytics API unavailable or not enabled",
    };
  }

  return {
    channelId: channel.id,
    title: snippet.title || "Untitled Channel",
    description: snippet.description || "",
    customUrl: snippet.customUrl || null,
    thumbnailUrl: avatarUrl,
    subscriberCount,
    hiddenSubscriberCount: isHiddenSubscribers,
    viewCount,
    videoCount,
    uploadsPlaylistId,
    recentVideos,
    analytics,
  };
}

/**
 * Fetches recent uploaded videos from the channel's uploads playlist using YouTube Data API v3.
 */
export async function fetchRecentChannelVideos(
  accessToken: string,
  uploadsPlaylistId: string,
  maxResults = 5
): Promise<YouTubeVideoItem[]> {
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("playlistId", uploadsPlaylistId);
  url.searchParams.set("maxResults", String(Math.min(maxResults, 20)));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  if (!data.items || !Array.isArray(data.items)) {
    return [];
  }

  return data.items
    .map((item: any) => {
      const snippet = item.snippet || {};
      const videoId = snippet.resourceId?.videoId;
      if (!videoId) return null;

      const thumbnails = snippet.thumbnails || {};
      const thumbUrl =
        thumbnails.medium?.url ||
        thumbnails.high?.url ||
        thumbnails.default?.url ||
        null;

      return {
        videoId,
        title: snippet.title || "Untitled Video",
        description: snippet.description || "",
        publishedAt: snippet.publishedAt || new Date().toISOString(),
        thumbnailUrl: thumbUrl,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    })
    .filter(Boolean) as YouTubeVideoItem[];
}

/**
 * Fetches channel analytics from the official YouTube Analytics API.
 * Uses the authorized read-only scope https://www.googleapis.com/auth/yt-analytics.readonly.
 */
export async function fetchYouTubeAnalytics(accessToken: string): Promise<YouTubeAnalyticsData> {
  const now = new Date();
  const endDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDate = past.toISOString().split("T")[0];

  const url = new URL("https://youtubeanalytics.googleapis.com/v2/reports");
  url.searchParams.set("ids", "channel==MINE");
  url.searchParams.set("startDate", startDate);
  url.searchParams.set("endDate", endDate);
  url.searchParams.set(
    "metrics",
    "views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments"
  );

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      isAvailable: false,
      reason: data.error?.message || "YouTube Analytics API returned an error or is not enabled.",
    };
  }

  const columnHeaders = data.columnHeaders || [];
  const rows = data.rows || [];

  if (rows.length === 0 || !rows[0]) {
    return {
      isAvailable: true,
      views: 0,
      estimatedMinutesWatched: 0,
      averageViewDuration: 0,
      subscribersGained: 0,
      subscribersLost: 0,
      likes: 0,
      comments: 0,
    };
  }

  const firstRow = rows[0];
  const metricsMap: Record<string, number> = {};
  columnHeaders.forEach((col: any, idx: number) => {
    metricsMap[col.name] = Number(firstRow[idx] || 0);
  });

  return {
    isAvailable: true,
    views: metricsMap["views"] !== undefined ? metricsMap["views"] : "Unavailable",
    estimatedMinutesWatched:
      metricsMap["estimatedMinutesWatched"] !== undefined
        ? metricsMap["estimatedMinutesWatched"]
        : "Unavailable",
    averageViewDuration:
      metricsMap["averageViewDuration"] !== undefined
        ? metricsMap["averageViewDuration"]
        : "Unavailable",
    subscribersGained:
      metricsMap["subscribersGained"] !== undefined ? metricsMap["subscribersGained"] : "Unavailable",
    subscribersLost:
      metricsMap["subscribersLost"] !== undefined ? metricsMap["subscribersLost"] : "Unavailable",
    likes: metricsMap["likes"] !== undefined ? metricsMap["likes"] : "Unavailable",
    comments: metricsMap["comments"] !== undefined ? metricsMap["comments"] : "Unavailable",
  };
}
