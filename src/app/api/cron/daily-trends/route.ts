import { NextResponse, type NextRequest } from "next/server";
import { executeDailyTrendResearch } from "@/lib/youtube/trend-engine";
import { isYouTubeApiKeyConfigured } from "@/lib/youtube/config";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/daily-trends
 * Daily Scheduled Automated Research Trigger
 * Secured by CRON_SECRET header or query token to prevent unauthorized execution.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const urlSecret = request.nextUrl.searchParams.get("secret");

    // Optional secret check if CRON_SECRET is defined in .env
    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && urlSecret !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
    }

    if (!isYouTubeApiKeyConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "YOUTUBE_API_KEY is not configured. Daily research cron job skipped.",
        },
        { status: 503 }
      );
    }

    const defaultNiches = [
      "Science",
      "Interesting Facts",
      "Technology",
      "History",
      "Space",
    ];

    const results = [];
    for (const niche of defaultNiches) {
      const report = await executeDailyTrendResearch({
        niche,
        country: "IN",
        language: "en",
        videoFormat: "shorts",
        timeframe: "24h",
      });
      results.push({
        niche,
        discovered: report.opportunities.length,
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cronExecution: "Completed automated daily trend refresh for India (IN)",
      results,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
