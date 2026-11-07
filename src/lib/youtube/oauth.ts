import { getGoogleOAuthEnv, YOUTUBE_REQUIRED_SCOPES } from "./config";

export interface GoogleTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
  tokenType: string;
}

/**
 * Builds the official Google OAuth 2.0 Authorization URL.
 * Requests offline access and explicit consent to ensure a refresh token is returned.
 */
export function buildGoogleAuthUrl(state: string): string {
  const { clientId, redirectUri } = getGoogleOAuthEnv();

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", YOUTUBE_REQUIRED_SCOPES.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);

  return url.toString();
}

/**
 * Exchanges the Google OAuth authorization code for access and refresh tokens.
 * Server-side exchange — client secret is never exposed to browser.
 */
export async function exchangeAuthCode(code: string): Promise<GoogleTokens> {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthEnv();

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Failed to exchange authorization code");
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    scope: data.scope,
    tokenType: data.token_type,
  };
}

/**
 * Refreshes an expired Google access token using the stored refresh token.
 */
export async function refreshGoogleAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  const { clientId, clientSecret } = getGoogleOAuthEnv();

  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Failed to refresh Google access token");
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Revokes Google OAuth token on disconnect.
 */
export async function revokeGoogleToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
