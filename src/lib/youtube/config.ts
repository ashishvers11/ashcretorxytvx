/**
 * Google & YouTube API Configuration.
 * Read-Only scopes for OAuth + YouTube Data API v3 key support.
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

export function isGoogleOAuthConfigured(): boolean {
  const { clientId, clientSecret } = getGoogleOAuthEnv();
  return Boolean(
    clientId &&
    clientSecret &&
    !clientId.includes("placeholder") &&
    !clientSecret.includes("placeholder")
  );
}

export function getYoutubeApiKey(): string {
  return (process.env.YOUTUBE_API_KEY || "").trim();
}

export function isYouTubeApiKeyConfigured(): boolean {
  const key = getYoutubeApiKey();
  return Boolean(
    key &&
    key.length > 15 &&
    !key.includes("placeholder") &&
    !key.includes("your_")
  );
}

export const YOUTUBE_API_UNCONFIGURED_MESSAGE =
  "YouTube Data API v3 key is not configured. Add YOUTUBE_API_KEY to your .env.local file to enable live video and trend discovery from Google servers.";

export const GOOGLE_OAUTH_UNCONFIGURED_MESSAGE =
  "Google OAuth credentials are not configured. Please supply GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local to enable live channel connection.";
