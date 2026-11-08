import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { runScriptEnginePipeline } from "@/lib/script-engine/pipeline";

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

    const { data: scripts, error: dbError } = await (supabase
      .from("creator_scripts") as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ scripts: scripts || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let user: any = null;
    let supabase: any = null;

    try {
      supabase = createServerSupabaseClient();
      const authRes = await supabase.auth.getUser();
      user = authRes.data?.user || null;
    } catch {
      // Guest or local mode
    }

    const body = await request.json();
    const topic = body.topic?.trim();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const videoFormat = body.videoFormat === "longform" ? "longform" : "shorts";
    const targetDuration = Number(body.targetDuration) || (videoFormat === "shorts" ? 30 : 300);
    const language = body.language || "Hinglish";
    const niche = body.niche || "Curiosity & Science";
    const presetId = body.presetId || "preset-zackd-facts";
    const channelType = body.channelType || undefined;
    const researchSources = Array.isArray(body.researchSources) ? body.researchSources : [];

    // Run the professional 8-stage Script Pipeline
    const script = await runScriptEnginePipeline({
      topic,
      niche,
      presetId,
      channelType,
      format: videoFormat,
      targetDurationSeconds: targetDuration,
      language,
      researchSources,
    });

    // Save to database if user is authenticated
    if (user && supabase) {
      try {
        const { error: dbError } = await (supabase.from("creator_scripts") as any).insert({
          user_id: user.id,
          title: script.title,
          topic: script.topic,
          video_format: script.format,
          target_duration: script.targetDurationSeconds,
          target_audience: niche,
          language: script.language,
          hook: script.narrativeStructure.hook,
          body_story: script.narrativeStructure.mainExplanation,
          payoff: script.narrativeStructure.payoff,
          cta: script.narrativeStructure.cta,
          full_voiceover: script.fullVoiceover,
          estimated_word_count: script.wordCount,
          on_screen_text: script.scenes.map((s) => ({ timecode: s.timeRange, text: s.onScreenText })),
          scenes: script.scenes,
          fact_sources: script.factChecks,
          status: "ready",
        });

        if (!dbError) {
          await (supabase.from("recent_activities") as any).insert({
            user_id: user.id,
            module: "Trend Research + Script Writing",
            action: "Generated 8-Stage Professional Script",
            title: script.title,
          });
        }
      } catch (saveErr) {
        console.warn("Could not save to Supabase creator_scripts (fallback active):", saveErr);
      }
    }

    return NextResponse.json({
      success: true,
      script,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
