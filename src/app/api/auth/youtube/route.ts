// ==============================================================================
// ASH CREATOR STUDIO — YouTube OAuth Initiation Route
// GET /api/auth/youtube
// ==============================================================================

import { NextResponse } from "next/server";
import { buildGoogleOAuthUrl, isGoogleOAuthConfigured } from "@/lib/youtube/oauth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get("redirect") || "/modules/channel-analytics";
  const state = Buffer.from(JSON.stringify({ redirectPath, timestamp: Date.now() })).toString("base64");

  // Check if Google Client ID is configured
  if (!isGoogleOAuthConfigured()) {
    // If not yet configured, return developer guidance with simulated demo connection option
    return NextResponse.json({
      configured: false,
      message: "Google OAuth 2.0 Client credentials not yet configured in .env.local",
      instructions: [
        "1. Open Google Cloud Console: https://console.cloud.google.com/apis/credentials",
        "2. Create an OAuth 2.0 Client ID (Web application)",
        "3. Add Authorized Redirect URI: http://localhost:3000/api/auth/youtube/callback",
        "4. Enable 'YouTube Data API v3' and 'YouTube Analytics API' in Enabled APIs",
        "5. Paste GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET into your .env.local file",
      ],
      demoConnectUrl: `/api/auth/youtube/callback?demo=true&state=${state}`,
    });
  }

  // Redirect to official Google OAuth 2.0 Authorization Screen
  const googleAuthUrl = buildGoogleOAuthUrl(state);
  return NextResponse.redirect(googleAuthUrl);
}
