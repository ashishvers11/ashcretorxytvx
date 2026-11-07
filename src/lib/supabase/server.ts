import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./types";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";

/**
 * Creates a server-side Supabase client for Server Components, Route Handlers, and Server Actions.
 * Secure cookie-based session handling without hardcoded credentials.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseEnv();

  const safeUrl = isSupabaseConfigured() ? url : "https://placeholder-project.supabase.co";
  const safeKey = isSupabaseConfigured() ? anonKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key";

  return createServerClient<Database>(safeUrl, safeKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Handled for Server Components (read-only cookie store)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Handled for Server Components
        }
      },
    },
  });
}
