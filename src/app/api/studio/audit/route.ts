import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyzeChannelAuditWithAI } from "@/lib/ai/provider";

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

    const body = await request.json();
    const channelStats = body.channelStats || {
      title: "Creator Studio Channel",
      subscriberCount: 0,
      viewCount: 0,
      videoCount: 0,
    };
    const recentVideos = body.recentVideos || [];
    const dateRange = body.dateRange || "30d";

    const audit = await analyzeChannelAuditWithAI({
      channelStats,
      recentVideos,
      dateRange,
    });

    const channelId = body.channelId || "connected_channel";
    const channelTitle = channelStats.title || "My Channel";

    // Save audit record to database
    const { data: savedAudit, error: dbError } = await (supabase
      .from("channel_audits") as any)
      .insert({
        user_id: user.id,
        channel_id: channelId,
        channel_title: channelTitle,
        audit_score: audit.auditScore,
        overall_grade: audit.overallGrade,
        performance_summary: audit.performance_summary,
        top_videos: audit.top_videos,
        underperforming_videos: audit.underperforming_videos,
        content_gaps: audit.content_gaps,
        recommendations: audit.recommendations,
        date_range: dateRange,
      })
      .select()
      .single();

    if (dbError) {
      console.warn("Could not persist channel audit to Supabase:", dbError.message);
    } else {
      // Log recent activity
      await (supabase.from("recent_activities") as any).insert({
        user_id: user.id,
        module: "Channel Audit",
        action: "Conducted Audit",
        title: `${channelTitle} (${audit.overallGrade})`,
        link: "/channel-audit",
      });
    }

    return NextResponse.json({ audit: savedAudit || audit });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
