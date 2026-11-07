import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyzeChannelAuditWithAI } from "@/lib/ai/provider";

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
      // Local or guest mode
    }

    const body = await request.json().catch(() => ({}));
    let channelStats = body.channelStats;
    let recentVideos = body.recentVideos || [];
    const dateRange = body.dateRange || "30d";

    // If channelStats or recentVideos empty, try to get from cookie
    if (!channelStats || recentVideos.length === 0) {
      const cookieVal = request.cookies.get("ash_connected_channel")?.value;
      if (cookieVal) {
        try {
          const parsed = JSON.parse(cookieVal);
          if (parsed) {
            if (!channelStats) {
              channelStats = {
                title: parsed.title,
                subscriberCount: parsed.subscriberCount,
                viewCount: parsed.viewCount,
                videoCount: parsed.videoCount,
              };
            }
            if (recentVideos.length === 0 && Array.isArray(parsed.recentVideos)) {
              recentVideos = parsed.recentVideos;
            }
          }
        } catch {
          // ignore corrupted cookie
        }
      }
    }

    if (!channelStats) {
      channelStats = {
        title: "Creator Studio Channel",
        subscriberCount: 0,
        viewCount: 0,
        videoCount: 0,
      };
    }

    const audit = await analyzeChannelAuditWithAI({
      channelStats,
      recentVideos,
      dateRange,
    });

    const channelId = body.channelId || "connected_channel";
    const channelTitle = channelStats.title || "My Channel";

    // If user is authenticated and Supabase is accessible, save audit record to database
    let savedAudit = null;
    if (user && supabase) {
      try {
        const { data, error: dbError } = await (supabase
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
          .maybeSingle();

        if (!dbError && data) {
          savedAudit = data;
          // Log recent activity
          await (supabase.from("recent_activities") as any).insert({
            user_id: user.id,
            module: "Channel Audit",
            action: "Conducted Audit",
            title: `${channelTitle} (${audit.overallGrade})`,
            link: "/channel-audit",
          });
        }
      } catch (dbErr) {
        console.warn("Could not persist channel audit to Supabase:", dbErr);
      }
    }

    return NextResponse.json({ audit: savedAudit || audit });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
