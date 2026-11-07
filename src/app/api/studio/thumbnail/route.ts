import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateThumbnailConceptsWithAI } from "@/lib/ai/provider";

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

    const title = body.title?.trim() || topic;
    const videoFormat = body.videoFormat === "longform" ? "longform" : "shorts";

    const thumbnailResult = await generateThumbnailConceptsWithAI({
      topic,
      title,
      videoFormat,
    });

    // Save to database
    const { data: savedProject, error: dbError } = await (supabase
      .from("thumbnail_projects") as any)
      .insert({
        user_id: user.id,
        title,
        topic,
        video_format: videoFormat,
        aspect_ratio: videoFormat === "shorts" ? "9:16" : "16:9",
        concepts: thumbnailResult.concepts,
        color_guidance: thumbnailResult.color_guidance,
        composition_guidance: thumbnailResult.composition_guidance,
      })
      .select()
      .single();

    if (dbError) {
      console.warn("Could not persist thumbnail project to Supabase:", dbError.message);
    } else {
      // Log recent activity
      await (supabase.from("recent_activities") as any).insert({
        user_id: user.id,
        module: "Thumbnail Studio",
        action: "Designed Thumbnails",
        title,
        link: "/thumbnail-studio",
      });
    }

    return NextResponse.json({ thumbnail: savedProject || thumbnailResult });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
