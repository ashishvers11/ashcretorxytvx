import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/youtube/status
 * Retrieves connected YouTube channel information for the authenticated user.
 * Tokens and encryption secrets are strictly excluded from the payload.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { connected: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let connectionData = null;

    try {
      const { data: connection, error: dbError } = await (supabase
        .from("youtube_connections") as any)
        .select(
          "id, channel_id, title, description, custom_url, thumbnail_url, subscriber_count, view_count, video_count, uploads_playlist_id, recent_videos, analytics_summary, connected_at, updated_at"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (!dbError && connection) {
        connectionData = {
          id: connection.id,
          channelId: connection.channel_id,
          title: connection.title,
          description: connection.description,
          customUrl: connection.custom_url,
          thumbnailUrl: connection.thumbnail_url,
          subscriberCount: connection.subscriber_count,
          viewCount: connection.view_count,
          videoCount: connection.video_count,
          uploadsPlaylistId: connection.uploads_playlist_id || null,
          recentVideos: Array.isArray(connection.recent_videos) ? connection.recent_videos : [],
          analytics: connection.analytics_summary || null,
          connectedAt: connection.connected_at,
          updatedAt: connection.updated_at,
        };
      }
    } catch {
      // Continue to cookie fallback
    }

    // Fallback: check session cookie if DB record is not yet returned
    if (!connectionData) {
      const cookieVal = request.cookies.get("ash_connected_channel")?.value;
      if (cookieVal) {
        try {
          const parsed = JSON.parse(cookieVal);
          if (parsed && parsed.channelId) {
            connectionData = parsed;
          }
        } catch {
          // ignore corrupted cookie
        }
      }
    }

    if (!connectionData) {
      return NextResponse.json({ connected: false, channel: null });
    }

    return NextResponse.json({
      connected: true,
      channel: connectionData,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ connected: false, error: errorMsg }, { status: 500 });
  }
}
