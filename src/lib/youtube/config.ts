/**
 * Google & YouTube OAuth 2.0 Configuration.
 * Minimum required read-only scopes — zero upload or delete permissions.
 */

export const YOUTUBE_REQUIRED_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
];

export function getGoogleOAuthEnv() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/youtube/callback";

  return { clientId, clientSecret, redirectUri };
}

/**
 * Checks whether valid Google OAuth credentials are provided.
 */
export function isGoogleOAuthConfigured(): boolean {
  const { clientId, clientSecret } = getGoogleOAuthEnv();
  return Boolean(
    clientId &&
    clientSecret &&
    !clientId.includes("placeholder") &&
    !clientSecret.includes("placeholder")
  );
}

export const GOOGLE_OAUTH_UNCONFIGURED_MESSAGE =
  "Google OAuth credentials are not configured. Please supply GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local to enable live channel connection.";
