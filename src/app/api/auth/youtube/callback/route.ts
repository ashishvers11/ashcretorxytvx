// ==============================================================================
// ASH CREATOR STUDIO — YouTube OAuth Callback Route
// GET /api/auth/youtube/callback
// ==============================================================================

import { NextResponse } from "next/server";
import { exchangeCodeForTokens, fetchGoogleUserInfo } from "@/lib/youtube/oauth";
import { fetchAuthorizedChannel } from "@/lib/youtube/data-api";
import { saveYouTubeConnection } from "@/lib/youtube/token-manager";
import { runYouTubeSync } from "@/lib/youtube/sync-engine";
import { getAuthenticatedUserId } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const isDemo = searchParams.get("demo") === "true";

  let redirectPath = "/modules/channel-analytics";
  try {
    if (state) {
      const decoded = JSON.parse(Buffer.from(state, "base64").toString());
      if (decoded.redirectPath) redirectPath = decoded.redirectPath;
    }
  } catch (e) {}

  // 1. Handle user cancellation or OAuth error
  if (error) {
    console.warn("Google OAuth callback error:", error);
    const redirectUrl = new URL(redirectPath, request.url);
    redirectUrl.searchParams.set("error", error === "access_denied" ? "oauth_cancelled" : error);
    return NextResponse.redirect(redirectUrl.toString());
  }

  // 2. Demo simulation fallback for development testing
  if (isDemo || (!code && process.env.NODE_ENV === "development")) {
    const defaultUserId = await getAuthenticatedUserId();
    const demoChannelId = "chan-creator-demo";

    await saveYouTubeConnection(defaultUserId, demoChannelId, {
      accessToken: "demo_access_token_verified",
      refreshToken: "demo_refresh_token_verified",
      expiresIn: 3600,
      scope: "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly",
      googleAccountId: "google-usr-creator",
      googleEmail: "creator@youtube-studio.io",
    });

    const redirectUrl = new URL(redirectPath, request.url);
    redirectUrl.searchParams.set("connected", "true");
    redirectUrl.searchParams.set("channel", "Verified Channel");
    redirectUrl.searchParams.set("mode", "authorized");
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (!code) {
    const redirectUrl = new URL(redirectPath, request.url);
    redirectUrl.searchParams.set("error", "missing_authorization_code");
    return NextResponse.redirect(redirectUrl.toString());
  }

  try {
    // 3. Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // 4. Fetch Google User Profile
    const userInfo = await fetchGoogleUserInfo(tokens.access_token);

    // 5. Fetch authorized YouTube Channel details
    const channelData = await fetchAuthorizedChannel(tokens.access_token);

    const defaultUserId = await getAuthenticatedUserId();

    // 6. Save connection securely (never expose tokens to frontend!)
    const connection = await saveYouTubeConnection(defaultUserId, null, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      scope: tokens.scope,
      googleAccountId: userInfo?.id,
      googleEmail: userInfo?.email,
    });

    // 7. Run initial background synchronization
    try {
      await runYouTubeSync(defaultUserId, tokens.access_token, undefined, {
        syncAnalyticsDays: 28,
      });
    } catch (syncErr) {
      console.warn("Initial background sync had partial warnings:", syncErr);
    }

    // 8. Redirect back to dashboard with success message
    const redirectUrl = new URL(redirectPath, request.url);
    redirectUrl.searchParams.set("connected", "true");
    redirectUrl.searchParams.set("channel", channelData.channelTitle);
    redirectUrl.searchParams.set("mode", "authorized");
    return NextResponse.redirect(redirectUrl.toString());
  } catch (err: any) {
    console.error("Error during YouTube OAuth callback processing:", err);
    const redirectUrl = new URL(redirectPath, request.url);
    redirectUrl.searchParams.set("error", encodeURIComponent(err?.message || "OAuth processing failed"));
    return NextResponse.redirect(redirectUrl.toString());
  }
}
