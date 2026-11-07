import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Server-side Signout Route Handler.
 * Clears cookies and revokes the Supabase user session.
 */
export async function POST(request: NextRequest) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Server signout error:", err);
    }
  }

  const loginUrl = new URL("/auth/login", request.url);
  return NextResponse.redirect(loginUrl, { status: 302 });
}
