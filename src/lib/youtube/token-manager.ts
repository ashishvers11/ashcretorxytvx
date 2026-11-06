// ==============================================================================
// ASH CREATOR STUDIO — YouTube OAuth Token Manager & Security Layer
// Secure server-side token storage, expiration detection & auto-refresh
// ==============================================================================

import { createServerClient } from "@/lib/supabase/server";
import { refreshAccessToken, revokeToken } from "./oauth";
import { Database } from "@/lib/supabase/types";

export interface StoredYouTubeConnection {
  id: string;
  user_id: string;
  channel_id: string | null;
  google_account_id: string | null;
  google_email: string | null;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string;
  scope: string;
  token_type: string;
  is_active: boolean;
  last_sync_at: string | null;
  last_sync_status: "idle" | "syncing" | "completed" | "error";
  last_sync_error: string | null;
}

// In-memory token cache for local demo mode when Supabase is not connected
const localTokenStore = new Map<string, StoredYouTubeConnection>();

/**
 * Saves or updates YouTube OAuth connection tokens securely in the database
 */
export async function saveYouTubeConnection(
  userId: string,
  channelId: string | null,
  data: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    scope: string;
    googleAccountId?: string;
    googleEmail?: string;
  }
): Promise<StoredYouTubeConnection> {
  const expiresAt = new Date(Date.now() + data.expiresIn * 1000).toISOString();

  const record: StoredYouTubeConnection = {
    id: `yt-conn-${userId}`,
    user_id: userId,
    channel_id: channelId,
    google_account_id: data.googleAccountId || null,
    google_email: data.googleEmail || null,
    access_token: data.accessToken,
    refresh_token: data.refreshToken || null,
    token_expires_at: expiresAt,
    scope: data.scope,
    token_type: "Bearer",
    is_active: true,
    last_sync_at: new Date().toISOString(),
    last_sync_status: "idle",
    last_sync_error: null,
  };

  // 1. Try to save into Supabase
  try {
    const supabase = createServerClient();
    const { data: dbData, error } = await (supabase
      .from("youtube_connections" as any)
      .upsert(
        {
          user_id: userId,
          channel_id: channelId,
          google_account_id: data.googleAccountId || null,
          google_email: data.googleEmail || null,
          access_token: data.accessToken,
          ...(data.refreshToken ? { refresh_token: data.refreshToken } : {}),
          token_expires_at: expiresAt,
          scope: data.scope,
          token_type: "Bearer",
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,channel_id" }
      )
      .select()
      .single() as any);

    if (!error && dbData) {
      localTokenStore.set(userId, dbData);
      return dbData;
    }
  } catch (err) {
    console.warn("Supabase not available, using in-memory secure token store:", err);
  }

  // Fallback to memory store
  localTokenStore.set(userId, record);
  return record;
}

/**
 * Gets a guaranteed valid Access Token.
 * If token is expired or within 5 minutes of expiring, automatically uses refresh_token!
 */
export async function getValidAccessToken(
  userId: string,
  channelId?: string
): Promise<{ accessToken: string | null; error?: string; isAuthorized: boolean }> {
  let connection: StoredYouTubeConnection | null = null;

  // 1. Check Supabase
  try {
    const supabase = createServerClient();
    let query = supabase
      .from("youtube_connections" as any)
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (channelId) {
      query = query.eq("channel_id", channelId);
    }

    const { data, error } = await (query.single() as any);
    if (!error && data) {
      connection = data;
    }
  } catch (err) {
    // Supabase query error
  }

  // 2. Check local token store fallback
  if (!connection) {
    connection = localTokenStore.get(userId) || null;
  }

  if (!connection) {
    return {
      accessToken: null,
      error: "No authorized YouTube connection found for this account.",
      isAuthorized: false,
    };
  }

  // Check expiration (with 5-minute safety threshold)
  const expiresAt = new Date(connection.token_expires_at).getTime();
  const now = Date.now();
  const fiveMinutesMs = 5 * 60 * 1000;

  if (now + fiveMinutesMs < expiresAt) {
    // Token is still valid!
    return {
      accessToken: connection.access_token,
      isAuthorized: true,
    };
  }

  // Token is expired or expiring soon, refresh it
  if (!connection.refresh_token) {
    return {
      accessToken: null,
      error: "Access token expired and no refresh token is available. Please reconnect your YouTube channel.",
      isAuthorized: false,
    };
  }

  try {
    const newTokens = await refreshAccessToken(connection.refresh_token);
    const newExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000).toISOString();

    // Update token in DB
    connection.access_token = newTokens.access_token;
    connection.token_expires_at = newExpiresAt;

    try {
      const supabase = createServerClient();
      await (supabase
        .from("youtube_connections" as any)
        .update({
          access_token: newTokens.access_token,
          token_expires_at: newExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", connection.id) as any);
    } catch (e) {}

    localTokenStore.set(userId, connection);

    return {
      accessToken: newTokens.access_token,
      isAuthorized: true,
    };
  } catch (refreshErr: any) {
    console.error("Token refresh failed:", refreshErr);
    return {
      accessToken: null,
      error: "Session expired with Google. Please reconnect your YouTube channel.",
      isAuthorized: false,
    };
  }
}

/**
 * Disconnects and revokes YouTube OAuth connection
 */
export async function disconnectYouTubeConnection(userId: string, channelId?: string): Promise<boolean> {
  let connection = localTokenStore.get(userId) || null;

  try {
    const supabase = createServerClient();
    const query = supabase.from("youtube_connections" as any).select("*").eq("user_id", userId);
    const { data } = await (query.single() as any);
    if (data) connection = data;
  } catch (e) {}

  if (connection?.access_token) {
    await revokeToken(connection.access_token);
  }

  // Remove or deactivate in DB
  try {
    const supabase = createServerClient();
    await (supabase
      .from("youtube_connections" as any)
      .update({
        is_active: false,
        access_token: "revoked",
        refresh_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId) as any);

    if (channelId) {
      await (supabase
        .from("channels" as any)
        .update({
          is_oauth_authorized: false,
          is_connected: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", channelId) as any);
    }
  } catch (e) {}

  localTokenStore.delete(userId);
  return true;
}

/**
 * Gets sanitized public status of YouTube connection (safe for frontend)
 */
export function getSanitizedConnectionStatus(connection: StoredYouTubeConnection | null) {
  if (!connection || !connection.is_active) {
    return {
      isConnected: false,
      isAuthorized: false,
      googleEmail: null,
      lastSyncAt: null,
      syncStatus: "idle",
    };
  }

  const isExpired = new Date(connection.token_expires_at).getTime() <= Date.now();

  return {
    isConnected: true,
    isAuthorized: true,
    isExpired,
    googleEmail: connection.google_email,
    scope: connection.scope,
    lastSyncAt: connection.last_sync_at,
    syncStatus: connection.last_sync_status,
  };
}
