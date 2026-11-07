import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isGoogleOAuthConfigured, buildGoogleAuthUrl } from "@/lib/youtube";

/**
 * GET /api/auth/youtube
 * Initiates the Google OAuth 2.0 Authorization Code Flow with PKCE for YouTube read-only access.
 * Protected: Requires authenticated ASH Creator Studio Supabase session.
 */
export async function GET(request: NextRequest) {
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

  // 4. Generate RFC 7636 PKCE code verifier and code challenge (S256)
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");

  // 5. Build authorization URL with state and code_challenge
  const authUrl = buildGoogleAuthUrl(state, codeChallenge);

  // 6. Store state and code_verifier in secure HttpOnly cookies
  const response = NextResponse.redirect(authUrl);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600, // 10 minutes
  };

  response.cookies.set("yt_oauth_state", state, cookieOptions);
  response.cookies.set("yt_oauth_code_verifier", codeVerifier, cookieOptions);

  return response;
}
