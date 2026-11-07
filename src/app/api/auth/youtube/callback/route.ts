import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { exchangeAuthCode, fetchMyYouTubeChannel } from "@/lib/youtube";
import { encryptToken } from "@/lib/security/encryption";

/**
 * GET /api/auth/youtube/callback
 * Google OAuth 2.0 callback endpoint.
 * Validates CSRF state, exchanges authorization code for tokens, retrieves channel info,
 * encrypts refresh token with AES-256-GCM, and persists to Supabase.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const errorParam = requestUrl.searchParams.get("error");

  // Create response to allow clearing state cookie
  const createRedirect = (path: string) => {
    const res = NextResponse.redirect(new URL(path, request.url));
    res.cookies.delete("yt_oauth_state");
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
    // 5. Server-side token exchange
    const tokens = await exchangeAuthCode(code);

    // 6. Fetch authenticated creator's YouTube channel details
    const channel = await fetchMyYouTubeChannel(tokens.accessToken);

    // 7. Encrypt refresh token using AES-256-GCM (server-only key)
    let encryptedData = null;
    if (tokens.refreshToken) {
      encryptedData = encryptToken(tokens.refreshToken);
    }

    // 8. Persist channel connection to Supabase with user_id relationship
    const { error: dbError } = await (supabase.from("youtube_connections") as any).upsert(
      {
        user_id: user.id,
        channel_id: channel.channelId,
        title: channel.title,
        description: channel.description,
        custom_url: channel.customUrl,
        thumbnail_url: channel.thumbnailUrl,
        subscriber_count: channel.subscriberCount,
        view_count: channel.viewCount,
        video_count: channel.videoCount,
        encrypted_refresh_token: encryptedData?.encrypted || null,
        token_iv: encryptedData?.iv || null,
        token_auth_tag: encryptedData?.authTag || null,
        scopes: tokens.scope ? tokens.scope.split(" ") : [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id, channel_id" }
    );

    if (dbError) {
      console.error("Database error saving YouTube connection:", dbError);
      return createRedirect("/dashboard?error=database_save_failed");
    }

    return createRedirect("/dashboard?status=youtube_connected");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to complete YouTube connection";
    console.error("OAuth callback error:", errorMsg);
    return createRedirect(`/dashboard?error=${encodeURIComponent(errorMsg)}`);
  }
}
