/**
 * Supabase Environment Configuration & Validator.
 * Ensures credentials are never hardcoded and validates configuration state.
 */

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  return { url, anonKey };
}

/**
 * Checks whether valid Supabase environment variables are configured.
 * Returns false if missing, empty, or using known placeholder strings.
 */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) return false;

  // Check for placeholder defaults
  if (
    url.includes("placeholder-project") ||
    url.includes("example.supabase.co") ||
    anonKey.includes("placeholder-key") ||
    anonKey.includes("placeholder-anon-key")
  ) {
    return false;
  }

  // Must be a valid HTTPS URL
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export const SUPABASE_UNCONFIGURED_MESSAGE =
  "Supabase credentials not configured. Please add valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.";
