import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateScriptWithAI } from "@/lib/ai/provider";

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
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const topic = body.topic?.trim();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const videoFormat = body.videoFormat === "longform" ? "longform" : "shorts";
    const targetDuration = Number(body.targetDuration) || (videoFormat === "shorts" ? 60 : 300);
    const audience = body.audience || "General Audience";
    const language = body.language || "English";

    // Generate script using AI provider or rule-based fallback engine
    const script = await generateScriptWithAI({
      topic,
      videoFormat,
      targetDuration,
      audience,
      language,
    });

    // Save to database
    const { data: savedScript, error: dbError } = await (supabase
      .from("creator_scripts") as any)
      .insert({
        user_id: user.id,
        title: script.title,
        topic: script.topic,
        video_format: script.videoFormat,
        target_duration: script.targetDuration,
        target_audience: audience,
        language,
        hook: script.hook,
        body_story: script.body_story,
        payoff: script.payoff,
        cta: script.cta,
        full_voiceover: script.full_voiceover,
        estimated_word_count: script.estimated_word_count,
        on_screen_text: script.on_screen_text,
        scenes: script.scenes,
        fact_sources: script.fact_sources,
        status: "ready",
      })
      .select()
      .single();

    if (dbError) {
      console.warn("Could not persist script to Supabase (check migration):", dbError.message);
    } else {
      // Log recent activity
      await (supabase.from("recent_activities") as any).insert({
        user_id: user.id,
        module: "Trend Research + Script Writing",
        action: "Created Script",
        title: script.title,
        link: "/trend-script",
      });
    }

    return NextResponse.json({ script: savedScript || script });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
