import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or retrieves the singleton browser Supabase client.
 * Uses environment variables without hardcoded credentials.
 */
export function createClient() {
  if (clientInstance) return clientInstance;

  const { url, anonKey } = getSupabaseEnv();

  // If unconfigured, provide a fallback safe URL so createBrowserClient doesn't throw during initial render
  const safeUrl = isSupabaseConfigured() ? url : "https://placeholder-project.supabase.co";
  const safeKey = isSupabaseConfigured() ? anonKey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key";

  clientInstance = createBrowserClient<Database>(safeUrl, safeKey);
  return clientInstance;
}
