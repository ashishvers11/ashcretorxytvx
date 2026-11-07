import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { executeDailyTrendResearch } from "@/lib/youtube/trend-engine";
import { youtubeQuota } from "@/lib/youtube/quota";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const niche = body.niche || "Science & Mysteries";
    const country = body.country || "IN";
    const language = body.language || "en";
    const videoFormat = body.format || "shorts";
    const timeframe = body.timeframe || "7d";

    // Clear cache for this research slice
    youtubeQuota.clearCache();

    // Fetch user's connected channel videos
    let userVideos: Array<{ title: string; videoId: string }> = [];
    try {
      const { data: conn } = await (supabase.from("youtube_connections") as any)
        .select("recent_videos")
        .eq("user_id", user.id)
        .maybeSingle();

      if (conn?.recent_videos && Array.isArray(conn.recent_videos)) {
        userVideos = conn.recent_videos.map((v: any) => ({
          title: v.title || "",
          videoId: v.videoId || "",
        }));
      }
    } catch {
      // Continue
    }

    const report = await executeDailyTrendResearch({
      niche,
      country,
      language,
      videoFormat,
      timeframe,
      userChannelVideos: userVideos,
    });

    return NextResponse.json({ success: true, report });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
