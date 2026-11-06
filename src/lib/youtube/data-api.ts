// ==============================================================================
// ASH CREATOR STUDIO — Official YouTube Data API v3 Client
// Endpoints: channels.list, playlistItems.list, videos.list
// ==============================================================================

export interface YouTubeChannelData {
  youtubeChannelId: string;
  channelTitle: string;
  customUrl: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  uploadsPlaylistId: string;
}

export interface YouTubeVideoData {
  youtubeVideoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  durationSeconds: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface VideoSyncResult {
  videos: YouTubeVideoData[];
  nextPageToken?: string;
  totalResults: number;
}

/**
 * Converts ISO 8601 duration string (e.g. "PT5M30S", "PT1H2M10S", "PT45S") to total seconds
 */
export function parseISO8601Duration(duration: string): number {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formats duration in seconds to "MM:SS" or "HH:MM:SS"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

/**
 * Calls official YouTube Data API to fetch the authenticated user's YouTube Channel
 * Endpoint: GET https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true
 */
export async function fetchAuthorizedChannel(accessToken: string): Promise<YouTubeChannelData> {
  const url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.error?.message || "YouTube Data API error fetching authorized channel.";
    throw new Error(`YouTube API Error: ${errorMsg}`);
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("No YouTube channel found associated with this Google account.");
  }

  const item = data.items[0];
  const snippet = item.snippet || {};
  const stats = item.statistics || {};
  const content = item.contentDetails || {};

  return {
    youtubeChannelId: item.id,
    channelTitle: snippet.title || "My YouTube Channel",
    customUrl: snippet.customUrl ? snippet.customUrl.replace(/^@/, "") : "",
    description: snippet.description || "",
    thumbnailUrl:
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url ||
      "",
    publishedAt: snippet.publishedAt || new Date().toISOString(),
    subscriberCount: parseInt(stats.subscriberCount || "0", 10),
    viewCount: parseInt(stats.viewCount || "0", 10),
    videoCount: parseInt(stats.videoCount || "0", 10),
    uploadsPlaylistId: content.relatedPlaylists?.uploads || "",
  };
}

/**
 * Fetches videos from a channel's Uploads playlist with pagination and stats
 * Endpoints: playlistItems.list & videos.list
 */
export async function fetchChannelVideos(
  accessToken: string,
  uploadsPlaylistId: string,
  options: {
    maxResults?: number;
    pageToken?: string;
  } = {}
): Promise<VideoSyncResult> {
  const { maxResults = 50, pageToken = "" } = options;

  if (!uploadsPlaylistId) {
    return { videos: [], totalResults: 0 };
  }

  // 1. Fetch items in uploads playlist
  const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  playlistUrl.searchParams.set("part", "snippet,contentDetails");
  playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
  playlistUrl.searchParams.set("maxResults", Math.min(maxResults, 50).toString());
  if (pageToken) {
    playlistUrl.searchParams.set("pageToken", pageToken);
  }

  const playlistRes = await fetch(playlistUrl.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const playlistData = await playlistRes.json();

  if (!playlistRes.ok) {
    const errorMsg = playlistData.error?.message || "Error fetching channel uploads playlist.";
    throw new Error(`YouTube PlaylistItems API Error: ${errorMsg}`);
  }

  const items = playlistData.items || [];
  if (items.length === 0) {
    return { videos: [], totalResults: 0 };
  }

  // Extract video IDs
  const videoIds: string[] = items
    .map((it: any) => it.contentDetails?.videoId || it.snippet?.resourceId?.videoId)
    .filter(Boolean);

  if (videoIds.length === 0) {
    return { videos: [], totalResults: 0 };
  }

  // 2. Fetch full video statistics and duration via videos.list
  const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  videosUrl.searchParams.set("part", "snippet,contentDetails,statistics");
  videosUrl.searchParams.set("id", videoIds.join(","));

  const videosRes = await fetch(videosUrl.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const videosData = await videosRes.json();

  if (!videosRes.ok) {
    const errorMsg = videosData.error?.message || "Error fetching video statistics.";
    throw new Error(`YouTube Videos API Error: ${errorMsg}`);
  }

  const rawVideos = videosData.items || [];
  const parsedVideos: YouTubeVideoData[] = rawVideos.map((v: any) => {
    const snippet = v.snippet || {};
    const content = v.contentDetails || {};
    const stats = v.statistics || {};

    return {
      youtubeVideoId: v.id,
      title: snippet.title || "Untitled Video",
      description: snippet.description || "",
      thumbnailUrl:
        snippet.thumbnails?.maxres?.url ||
        snippet.thumbnails?.standard?.url ||
        snippet.thumbnails?.high?.url ||
        snippet.thumbnails?.medium?.url ||
        "",
      publishedAt: snippet.publishedAt || new Date().toISOString(),
      durationSeconds: parseISO8601Duration(content.duration || ""),
      viewCount: parseInt(stats.viewCount || "0", 10),
      likeCount: parseInt(stats.likeCount || "0", 10),
      commentCount: parseInt(stats.commentCount || "0", 10),
    };
  });

  return {
    videos: parsedVideos,
    nextPageToken: playlistData.nextPageToken,
    totalResults: playlistData.pageInfo?.totalResults || parsedVideos.length,
  };
}
