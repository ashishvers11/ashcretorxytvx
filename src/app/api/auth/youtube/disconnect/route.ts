import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { decryptToken } from "@/lib/security/encryption";
import { revokeGoogleToken } from "@/lib/youtube";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/youtube/disconnect
 * Disconnects the user's YouTube channel, revokes Google OAuth tokens if present,
 * and clears database records and session cookies.
 */
export async function POST(request: NextRequest) {
  try {
    try {
      const supabase = createServerSupabaseClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && user) {
        // Fetch existing connection record to retrieve encrypted refresh token
        const { data: connection } = await (supabase.from("youtube_connections") as any)
          .select("encrypted_refresh_token, token_iv, token_auth_tag")
          .eq("user_id", user.id)
          .maybeSingle();

        // Attempt token revocation with Google if token exists
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

        // Delete connection from Supabase
        await (supabase.from("youtube_connections") as any)
          .delete()
          .eq("user_id", user.id);
      }
    } catch {
      // Supabase connection or table error
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
