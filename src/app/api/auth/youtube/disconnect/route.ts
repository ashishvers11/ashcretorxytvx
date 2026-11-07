import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { decryptToken } from "@/lib/security/encryption";
import { revokeGoogleToken } from "@/lib/youtube";

/**
 * POST /api/auth/youtube/disconnect
 * Disconnects the user's YouTube channel, revokes Google OAuth tokens, and clears database records.
 * User's ASH Creator Studio Supabase session remains active.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 1. Fetch existing connection record to retrieve encrypted refresh token
    const { data: connection } = await (supabase.from("youtube_connections") as any)
      .select("encrypted_refresh_token, token_iv, token_auth_tag")
      .eq("user_id", user.id)
      .maybeSingle();

    // 2. Attempt token revocation with Google if token exists
    if (connection?.encrypted_refresh_token && connection.token_iv && connection.token_auth_tag) {
      try {
        const plainRefreshToken = decryptToken({
          encrypted: connection.encrypted_refresh_token,
          iv: connection.token_iv,
          authTag: connection.token_auth_tag,
        });

        await revokeGoogleToken(plainRefreshToken);
      } catch (decryptErr) {
        console.warn("Could not decrypt token for revocation:", decryptErr);
      }
    }

    // 3. Delete connection from Supabase
    try {
      await supabase
        .from("youtube_connections")
        .delete()
        .eq("user_id", user.id);
    } catch (delErr) {
      console.warn("Could not delete from youtube_connections:", delErr);
    }

    const response = NextResponse.json({
      success: true,
      message: "YouTube channel successfully disconnected.",
    });

    response.cookies.delete("ash_connected_channel");

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
