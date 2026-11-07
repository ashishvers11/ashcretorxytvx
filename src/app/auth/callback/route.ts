import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Supabase Auth Callback Route Handler.
 * Exchanges the auth authorization code for an active session.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/auth/login?error=unconfigured", request.url)
    );
  }

  if (code) {
    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Ensure redirect target is a valid relative path to prevent open redirect vulnerabilities
        const safeNext = next.startsWith("/") ? next : "/dashboard";
        return NextResponse.redirect(new URL(safeNext, request.url));
      }
    } catch {
      // In case of exchange error, fall through to error redirect
    }
  }

  // Return the user to login with an error indication
  return NextResponse.redirect(
    new URL("/auth/login?error=auth_callback_failed", request.url)
  );
}
