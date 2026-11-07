import { NextResponse, type NextRequest } from "next/server";
import { executeDailyTrendResearch } from "@/lib/youtube/trend-engine";
import { isYouTubeApiKeyConfigured } from "@/lib/youtube/config";
import { getPacificDateString, getNextPacificMidnightUtc } from "@/lib/youtube/quota";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/daily-trends
 * Daily Scheduled Automated Research Trigger
 * Secured by CRON_SECRET header or query token to prevent unauthorized execution.
 * Enforces duplicate execution prevention per Pacific Date.
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const currentPtDay = getPacificDateString();
  const nextPtMidnight = getNextPacificMidnightUtc();

  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const urlSecret = request.nextUrl.searchParams.get("secret");

    // 1. CRON_SECRET Security Validation
    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && urlSecret !== cronSecret) {
      return NextResponse.json(
        {
          error: "Unauthorized: Invalid or missing CRON_SECRET token.",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // 2. YouTube API Configuration Check
    if (!isYouTubeApiKeyConfigured()) {
      return NextResponse.json(
        {
          success: false,
          status: "BLOCKED",
          reason: "YOUTUBE_API_KEY is not configured in .env.local. Automated daily research cycle skipped.",
          currentPtDay,
          nextQuotaResetUtc: nextPtMidnight.toISOString(),
        },
        { status: 503 }
      );
    }

    // 3. Duplicate Execution Prevention
    // Check if daily research has already been executed today (PT day boundary)
    const lockCacheKey = `cron_execution_lock:${currentPtDay}`;
    try {
      const supabase = createServerSupabaseClient();
      const { data: existingLock } = await (supabase.from("youtube_research_cache") as any)
        .select("cache_key, created_at")
        .eq("cache_key", lockCacheKey)
        .maybeSingle();

      if (existingLock) {
        return NextResponse.json({
          success: true,
          status: "ALREADY_EXECUTED_TODAY",
          message: `Daily trend intelligence cycle has already completed for ${currentPtDay} (Pacific Time). Duplicate run prevented.`,
          executedAt: existingLock.created_at,
          nextResetUtc: nextPtMidnight.toISOString(),
        });
      }
    } catch {
      // Continue if DB check fails
    }

    // 4. Default India (IN) Discovery Niches (Hindi & English)
    const defaultNiches = [
      "Science",
      "Interesting Facts",
      "Technology",
      "History",
      "Space",
    ];

    const results = [];
    for (const niche of defaultNiches) {
      try {
        const report = await executeDailyTrendResearch({
          niche,
          country: "IN",
          language: "en",
          videoFormat: "shorts",
          timeframe: "24h",
          userTimezone: "Asia/Kolkata",
        });

        results.push({
          niche,
          opportunitiesDiscovered: report.opportunities.length,
          avgViewsPerDay:
            report.opportunities.length > 0
              ? report.opportunities[0].evidence.avgHistoricalViewsPerDay
              : "N/A",
        });
      } catch (nicheErr: unknown) {
        const msg = nicheErr instanceof Error ? nicheErr.message : "Niche search error";
        console.error(`[Cron Daily Trends] Failed research for "${niche}":`, msg);
        results.push({ niche, error: msg });
      }
    }

    // 5. Record Execution Lock to prevent duplicate runs
    try {
      const supabase = createServerSupabaseClient();
      await (supabase.from("youtube_research_cache") as any).upsert({
        cache_key: lockCacheKey,
        data: { completedAt: new Date().toISOString(), results },
        expires_at: nextPtMidnight.toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch {
      // Non-fatal
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      executionTimestampUtc: new Date().toISOString(),
      pacificTimeDay: currentPtDay,
      nextDailyResetUtc: nextPtMidnight.toISOString(),
      executionDurationMs: durationMs,
      regionDefault: "India (IN)",
      languageDefaults: ["Hindi", "English"],
      results,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal cron execution failure";
    console.error("[Cron Daily Trends Failure]:", errorMsg);
    return NextResponse.json(
      {
        success: false,
        status: "FAIL",
        error: errorMsg,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
