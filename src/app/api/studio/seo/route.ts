import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateSEOWithAI } from "@/lib/ai/provider";

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
    const scriptContent = body.scriptContent || "";

    const seoResult = await generateSEOWithAI({
      topic,
      scriptContent,
      videoFormat,
    });

    // Save to database
    const { data: savedProject, error: dbError } = await (supabase
      .from("seo_projects") as any)
      .insert({
        user_id: user.id,
        title: seoResult.title,
        topic,
        video_format: videoFormat,
        generated_titles: seoResult.generated_titles,
        description: seoResult.description,
        tags: seoResult.tags,
        hashtags: seoResult.hashtags,
        search_intent: seoResult.search_intent,
        quality_analysis: seoResult.quality_analysis,
      })
      .select()
      .single();

    if (dbError) {
      console.warn("Could not persist SEO project to Supabase:", dbError.message);
    } else {
      // Log recent activity
      await (supabase.from("recent_activities") as any).insert({
        user_id: user.id,
        module: "SEO Studio",
        action: "Optimized Metadata",
        title: seoResult.title,
        link: "/seo-studio",
      });
    }

    return NextResponse.json({ seo: savedProject || seoResult });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
