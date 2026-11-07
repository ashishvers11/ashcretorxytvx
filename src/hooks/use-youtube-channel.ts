"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";

export interface YouTubeVideoItem {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  videoUrl: string;
  views?: number;
  likes?: number;
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
  avgViewsPerVideo?: number | "Unavailable";
  avgLikesPerVideo?: number | "Unavailable";
  engagementRate?: string;
  topVideo?: { title: string; views: number; likes: number; videoId: string } | null;
  underperformingVideo?: { title: string; views: number; likes: number; videoId: string } | null;
  reason?: string;
}

export interface ConnectedYouTubeChannel {
  id: string;
  channelId: string;
  title: string;
  description: string;
  customUrl: string | null;
  thumbnailUrl: string | null;
  subscriberCount: number | null;
  viewCount: number | null;
  videoCount: number | null;
  uploadsPlaylistId: string | null;
  niche?: string;
  recentVideos: YouTubeVideoItem[];
  analytics?: YouTubeAnalyticsData | null;
  connectedAt: string;
  updatedAt: string;
}

export function useYouTubeChannel() {
  const [channel, setChannel] = useState<ConnectedYouTubeChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchChannelStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/youtube/status", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        setChannel(null);
        return;
      }

      const data = await response.json();
      if (data.connected && data.channel) {
        setChannel(data.channel);
      } else {
        setChannel(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error checking channel";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannelStatus();
  }, [fetchChannelStatus]);

  const connectByUrl = async (channelUrl: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/youtube/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const errorMsg = data.error || "Failed to connect YouTube channel.";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      if (data.channel) {
        setChannel(data.channel);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error connecting channel";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const disconnectChannel = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/youtube/disconnect", {
        method: "POST",
      });

      if (res.ok) {
        setChannel(null);
        setError(null);
        return true;
      } else {
        const data = await res.json();
        setError(data.error || "Failed to disconnect channel");
        return false;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error disconnecting";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    channel,
    connected: Boolean(channel),
    loading,
    error,
    refreshChannel: fetchChannelStatus,
    connectByUrl,
    disconnectChannel,
  };
}
