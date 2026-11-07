export interface YouTubeChannelDetails {
  channelId: string;
  title: string;
  description: string;
  customUrl: string | null;
  thumbnailUrl: string | null;
  subscriberCount: number;
  hiddenSubscriberCount: boolean;
  viewCount: number;
  videoCount: number;
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
    const errorMsg = data.error?.message || "Failed to fetch YouTube channel details";
    throw new Error(errorMsg);
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("No YouTube channel found associated with this Google account.");
  }

  const channel = data.items[0];
  const snippet = channel.snippet || {};
  const stats = channel.statistics || {};

  const thumbnails = snippet.thumbnails || {};
  const avatarUrl =
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    null;

  const isHiddenSubscribers = Boolean(stats.hiddenSubscriberCount);
  const subscriberCount = isHiddenSubscribers ? 0 : Number(stats.subscriberCount || 0);
  const viewCount = Number(stats.viewCount || 0);
  const videoCount = Number(stats.videoCount || 0);

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
  };
}
