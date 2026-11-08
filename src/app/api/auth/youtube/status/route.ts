import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchLiveYouTubeChannel } from "@/lib/youtube/channel-sync";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/youtube/status
 * Retrieves connected YouTube channel information for the user.
 * Seamlessly checks Supabase DB and persistent session cookies.
 * Auto-refreshes stale metrics (e.g. 0 recent videos or outdated counts).
 */
export async function GET(request: NextRequest) {
  try {
    let connectionData: any = null;
    let user: any = null;
    let supabase: any = null;
    const forceRefresh = request.nextUrl.searchParams.get("refresh") === "true";

    try {
      supabase = createServerSupabaseClient();
      const authRes = await supabase.auth.getUser();
      user = authRes.data?.user || null;

      if (user) {
        const { data: connection, error: dbError } = await (supabase
          .from("youtube_connections") as any)
          .select(
            "id, channel_id, title, description, custom_url, thumbnail_url, subscriber_count, view_count, video_count, uploads_playlist_id, recent_videos, analytics_summary, connected_at, updated_at"
          )
          .eq("user_id", user.id)
          .maybeSingle();

        if (!dbError && connection) {
          connectionData = {
            id: connection.id || connection.channel_id,
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
      }
    } catch {
      // Supabase connection or table missing, continue to cookie fallback
    }

    // Fallback: check session cookie if DB record is not yet returned
    if (!connectionData) {
      const cookieVal = request.cookies.get("ash_connected_channel")?.value;
      if (cookieVal) {
        try {
          const parsed = JSON.parse(cookieVal);
          if (parsed && (parsed.channelId || parsed.id)) {
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

    // AUTO RE-SYNC: If refresh requested or if cached data has outdated metrics
    const hasOutdatedData =
      forceRefresh ||
      !connectionData.recentVideos ||
      connectionData.recentVideos.length === 0 ||
      connectionData.viewCount === 495 ||
      connectionData.videoCount === 12;

    if (hasOutdatedData) {
      const queryHandle = connectionData.customUrl || connectionData.channelId || connectionData.title;
      if (queryHandle) {
        const liveFresh = await fetchLiveYouTubeChannel(queryHandle);
        if (liveFresh) {
          connectionData = {
            ...liveFresh,
            id: connectionData.id || liveFresh.channelId,
          };

          // Update Supabase if authenticated
          if (user && supabase) {
            try {
              await (supabase.from("youtube_connections") as any).upsert(
                {
                  user_id: user.id,
                  channel_id: liveFresh.channelId,
                  title: liveFresh.title,
                  description: liveFresh.description,
                  custom_url: liveFresh.customUrl,
                  thumbnail_url: liveFresh.thumbnailUrl,
                  subscriber_count: liveFresh.subscriberCount,
                  view_count: liveFresh.viewCount,
                  video_count: liveFresh.videoCount,
                  uploads_playlist_id: liveFresh.uploadsPlaylistId,
                  recent_videos: liveFresh.recentVideos,
                  analytics_summary: liveFresh.analytics,
                  scopes: ["https://www.googleapis.com/auth/youtube.readonly"],
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id, channel_id" }
              );
            } catch (dbErr) {
              console.warn("Could not update youtube_connections:", dbErr);
            }
          }

          // Return fresh response with updated cookie
          const response = NextResponse.json({
            connected: true,
            channel: connectionData,
          });

          response.cookies.set("ash_connected_channel", JSON.stringify(connectionData), {
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: false,
            sameSite: "lax",
          });

          return response;
        }
      }
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
