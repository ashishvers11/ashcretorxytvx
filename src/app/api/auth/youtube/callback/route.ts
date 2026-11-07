import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { exchangeAuthCode, fetchMyYouTubeChannel } from "@/lib/youtube";
import { encryptToken } from "@/lib/security/encryption";

/**
 * GET /api/auth/youtube/callback
 * Google OAuth 2.0 callback endpoint with PKCE verification.
 * Validates CSRF state, exchanges authorization code with code_verifier for tokens,
 * retrieves real channel info, recent uploads and analytics, encrypts refresh token,
 * and persists to Supabase youtube_connections table.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const errorParam = requestUrl.searchParams.get("error");

  // Helper to create redirect response while clearing security cookies
  const createRedirect = (path: string) => {
    const res = NextResponse.redirect(new URL(path, request.url));
    res.cookies.delete("yt_oauth_state");
    res.cookies.delete("yt_oauth_code_verifier");
    return res;
  };

  // 1. Handle user cancellation or Google authorization error
  if (errorParam) {
    if (errorParam === "access_denied") {
      return createRedirect("/dashboard?error=oauth_cancelled");
    }
    return createRedirect(`/dashboard?error=${encodeURIComponent(errorParam)}`);
  }

  // 2. Validate CSRF state token
  const storedState = request.cookies.get("yt_oauth_state")?.value;
  if (!state || !storedState || state !== storedState) {
    return createRedirect("/dashboard?error=invalid_csrf_state");
  }

  // 3. Ensure authorization code is present
  if (!code) {
    return createRedirect("/dashboard?error=missing_code");
  }

  // 4. Authenticate Supabase user
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return createRedirect("/auth/login?error=auth_required");
  }

  try {
    // 5. Server-side token exchange with PKCE code_verifier
    const codeVerifier = request.cookies.get("yt_oauth_code_verifier")?.value;
    const tokens = await exchangeAuthCode(code, codeVerifier);

    // 6. Fetch authenticated creator's real YouTube channel details, uploads, and analytics
    const channel = await fetchMyYouTubeChannel(tokens.accessToken);

    // 7. Encrypt refresh token using AES-256-GCM (server-only key)
    let encryptedData = null;
    if (tokens.refreshToken) {
      encryptedData = encryptToken(tokens.refreshToken);
    }

    // 8. Persist channel connection to Supabase with user_id relationship
    const payload: Record<string, any> = {
      user_id: user.id,
      channel_id: channel.channelId,
      title: channel.title,
      description: channel.description,
      custom_url: channel.customUrl,
      thumbnail_url: channel.thumbnailUrl,
      subscriber_count: channel.subscriberCount,
      view_count: channel.viewCount,
      video_count: channel.videoCount,
      scopes: tokens.scope ? tokens.scope.split(" ") : [],
      updated_at: new Date().toISOString(),
    };

    if (encryptedData) {
      payload.encrypted_refresh_token = encryptedData.encrypted;
      payload.token_iv = encryptedData.iv;
      payload.token_auth_tag = encryptedData.authTag;
    }

    // Include recent videos and analytics summary if schema supports them
    if (channel.recentVideos && channel.recentVideos.length > 0) {
      payload.recent_videos = channel.recentVideos;
    }
    if (channel.analytics) {
      payload.analytics_summary = channel.analytics;
    }

    // Attempt upsert with extended payload; fall back to base payload if columns not yet migrated
    let dbError: any = null;
    const upsertRes = await (supabase.from("youtube_connections") as any).upsert(payload, {
      onConflict: "user_id, channel_id",
    });

    if (upsertRes.error) {
      // If error is missing columns (recent_videos or analytics_summary), retry with base fields
      const errMessage = upsertRes.error.message || "";
      if (errMessage.includes("column") || errMessage.includes("schema")) {
        delete payload.recent_videos;
        delete payload.analytics_summary;
        const fallbackRes = await (supabase.from("youtube_connections") as any).upsert(payload, {
          onConflict: "user_id, channel_id",
        });
        dbError = fallbackRes.error;
      } else {
        dbError = upsertRes.error;
      }
    }

    if (dbError) {
      console.error("Database error saving YouTube connection:", dbError);
      return createRedirect(
        `/dashboard?error=${encodeURIComponent(
          "Database error: Please make sure the youtube_connections table migration has been run in Supabase SQL editor."
        )}`
      );
    }

    return createRedirect("/dashboard?status=youtube_connected");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to complete YouTube connection";
    console.error("OAuth callback error:", errorMsg);
    return createRedirect(`/dashboard?error=${encodeURIComponent(errorMsg)}`);
  }
}
