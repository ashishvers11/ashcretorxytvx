// ==============================================================================
// ASH CREATOR STUDIO — YouTube Connection Status API
// GET /api/auth/youtube/status
// Strictly sanitized: NEVER exposes access_token or refresh_token to frontend
// ==============================================================================

import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/youtube/token-manager";
import { isGoogleOAuthConfigured } from "@/lib/youtube/oauth";

export async function GET() {
  const userId = "demo-creator-uuid";

  // Check valid access token
  const tokenResult = await getValidAccessToken(userId);

  return NextResponse.json({
    oauthConfigured: isGoogleOAuthConfigured(),
    isConnected: tokenResult.isAuthorized,
    isAuthorized: tokenResult.isAuthorized,
    scopes: [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
    ],
    lastSyncStatus: tokenResult.isAuthorized ? "completed" : "idle",
    lastSyncAt: new Date().toISOString(),
  });
}
