import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchLiveYouTubeChannel } from "@/lib/youtube/channel-sync";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let user: any = null;
    let supabase: any = null;

    try {
      supabase = createServerSupabaseClient();
      const authRes = await supabase.auth.getUser();
      user = authRes.data?.user || null;
    } catch {
      // Local or unauthenticated session
    }

    const body = await request.json().catch(() => ({}));
    let rawInput = (body.channelUrl || "").trim();

    if (!rawInput) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid YouTube channel URL or @handle." },
        { status: 400 }
      );
    }

    // Strictly strip query parameters (e.g. mobile share ?si=...) and fragment hashes
    const cleanInput = rawInput.split("?")[0].split("#")[0].trim().replace(/\/+$/, "");

    // Fetch verified live YouTube channel data using canonical engine
    const channelData = await fetchLiveYouTubeChannel(cleanInput);

    if (!channelData || !channelData.channelId) {
      return NextResponse.json(
        { success: false, error: "Could not resolve valid YouTube channel. Please check the handle or link." },
        { status: 400 }
      );
    }

    // Save directly into Supabase database if authenticated
    if (user && supabase) {
      try {
        await (supabase.from("youtube_connections") as any).upsert(
          {
            user_id: user.id,
            channel_id: channelData.channelId,
            title: channelData.title,
            description: channelData.description,
            custom_url: channelData.customUrl,
            thumbnail_url: channelData.thumbnailUrl,
            subscriber_count: channelData.subscriberCount,
            view_count: channelData.viewCount,
            video_count: channelData.videoCount,
            uploads_playlist_id: channelData.uploadsPlaylistId,
            recent_videos: channelData.recentVideos,
            analytics_summary: channelData.analytics,
            scopes: ["https://www.googleapis.com/auth/youtube.readonly"],
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id, channel_id" }
        );
      } catch (dbErr) {
        console.warn("Could not upsert into youtube_connections table, using cookie cache:", dbErr);
      }
    }

    // Prepare compact videos for cookie size safety
    const compactVideos = channelData.recentVideos.slice(0, 10).map((v) => ({
      videoId: v.videoId,
      title: v.title,
      publishedAt: v.publishedAt,
      thumbnailUrl: v.thumbnailUrl,
      videoUrl: v.videoUrl,
      views: v.views,
      likes: v.likes,
    }));

    const cookiePayload = {
      id: channelData.channelId,
      channelId: channelData.channelId,
      title: channelData.title,
      customUrl: channelData.customUrl,
      thumbnailUrl: channelData.thumbnailUrl,
      subscriberCount: channelData.subscriberCount,
      viewCount: channelData.viewCount,
      videoCount: channelData.videoCount,
      niche: channelData.niche,
      analytics: channelData.analytics,
      recentVideos: compactVideos,
      connectedAt: channelData.connectedAt,
    };

    const response = NextResponse.json({
      success: true,
      message: `Channel "${channelData.title}" connected successfully with live data!`,
      channel: {
        id: channelData.channelId,
        ...channelData,
      },
    });

    response.cookies.set("ash_connected_channel", JSON.stringify(cookiePayload), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 30 * 24 * 3600, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
