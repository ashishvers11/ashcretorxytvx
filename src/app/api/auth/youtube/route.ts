import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isGoogleOAuthConfigured, buildGoogleAuthUrl } from "@/lib/youtube";

/**
 * GET /api/auth/youtube
 * Initiates the Google OAuth 2.0 Authorization Code Flow for YouTube read-only access.
 * Protected: Requires authenticated ASH Creator Studio Supabase session.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  // 1. Authenticate user session
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirectedFrom", "/dashboard");
      loginUrl.searchParams.set("error", "auth_required");
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirectedFrom", "/dashboard");
    return NextResponse.redirect(loginUrl);
  }

  // 2. Validate Google OAuth configuration
  if (!isGoogleOAuthConfigured()) {
    const dashboardUrl = new URL("/dashboard", request.url);
    dashboardUrl.searchParams.set("error", "google_oauth_unconfigured");
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. Generate secure random CSRF state
  const state = crypto.randomBytes(32).toString("hex");

  // 4. Build authorization URL
  const authUrl = buildGoogleAuthUrl(state);

  // 5. Store state in secure HttpOnly cookie
  const response = NextResponse.redirect(authUrl);
  response.cookies.set("yt_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  return response;
}
