import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { executeDailyTrendResearch } from "@/lib/youtube/trend-engine";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const niche = searchParams.get("niche") || "Science & Mysteries";
    const country = searchParams.get("country") || "IN";
    const language = searchParams.get("language") || "en";
    const videoFormat = (searchParams.get("format") as "shorts" | "longform" | "all") || "shorts";
    const timeframe = (searchParams.get("timeframe") as "24h" | "7d" | "30d") || "7d";

    // Fetch user's connected YouTube channel uploads if available
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
      // Ignore if connection table is missing or empty
    }

    // Execute evidence-backed Daily Trend Research
    const report = await executeDailyTrendResearch({
      niche,
      country,
      language,
      videoFormat,
      timeframe,
      userChannelVideos: userVideos,
    });

    return NextResponse.json({ report });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
