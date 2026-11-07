// ==============================================================================
// ASH CREATOR STUDIO — YouTube Connection Disconnect Route
// POST /api/auth/youtube/disconnect
// ==============================================================================

import { NextResponse } from "next/server";
import { disconnectYouTubeConnection } from "@/lib/youtube/token-manager";
import { getAuthenticatedUserId } from "@/lib/supabase/server";

export async function POST() {
  const userId = await getAuthenticatedUserId();

  try {
    await disconnectYouTubeConnection(userId);
    return NextResponse.json({
      success: true,
      message: "YouTube channel successfully disconnected and token revoked.",
    });
  } catch (error: any) {
    console.error("Disconnect channel failed:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to disconnect channel." },
      { status: 500 }
    );
  }
}
