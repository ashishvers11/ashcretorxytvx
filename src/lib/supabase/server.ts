import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createBaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "./types";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";

/**
 * Creates a server-side Supabase client for Server Components, Route Handlers, and Server Actions.
 * Handles both HTTP request scopes (with cookies) and background/CLI/cron environments.
 */
export function createServerSupabaseClient(): SupabaseClient<Database> {
  const { url, anonKey } = getSupabaseEnv();

  const safeUrl = isSupabaseConfigured() ? url : "https://placeholder-project.supabase.co";
  const safeKey = isSupabaseConfigured() ? anonKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key";

  let cookieStore: ReturnType<typeof cookies> | null = null;
  try {
    cookieStore = cookies();
  } catch {
    // Called outside of active Next.js request scope (e.g. tests, CLI, background workers)
  }

  if (!cookieStore) {
    // Provide a dummy transport in Node/CLI environments where Realtime websockets are unused
    const dummyTransport = typeof WebSocket !== "undefined" ? WebSocket : class NoopWebSocket {};
    return createBaseClient<Database>(safeUrl, safeKey, {
      auth: { persistSession: false },
      realtime: { transport: dummyTransport as any },
    }) as unknown as SupabaseClient<Database>;
  }

  return createServerClient<Database>(safeUrl, safeKey, {
    cookies: {
      get(name: string) {
        return cookieStore?.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore?.set({ name, value, ...options });
        } catch {
          // Handled for Server Components (read-only cookie store)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore?.set({ name, value: "", ...options });
        } catch {
          // Handled for Server Components
        }
      },
    },
  }) as unknown as SupabaseClient<Database>;
}
