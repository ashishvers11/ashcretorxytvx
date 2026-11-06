# ASH CREATOR STUDIO: API INTEGRATION AUDIT (TASK 001)

**Audit Date:** 2026-11-07  
**Scope:** External APIs, Auth Handlers, Sync Engines, Quota Costs & Third-Party Endpoints  

---

## 1. External API Integration Matrix

| Integration | Endpoint / Library | Implementation File | Status | Authentication | Quota & Cost Impact |
|---|---|---|---|---|---|
| **Google OAuth 2.0** | `https://accounts.google.com/o/oauth2/v2/auth`<br>`https://oauth2.googleapis.com/token` | `src/lib/youtube/oauth.ts` | **NOT_VERIFIABLE** (Unconfigured env) | Client ID + Client Secret | Free. Refresh token exchange every 3600s. |
| **YouTube Data API v3 (Channels)** | `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true` | `src/lib/youtube/data-api.ts` | **NOT_VERIFIABLE** (Requires live token) | Bearer OAuth Access Token | 1 quota unit per request. |
| **YouTube Data API v3 (Playlists & Videos)** | `https://www.googleapis.com/youtube/v3/playlistItems`<br>`https://www.googleapis.com/youtube/v3/videos` | `src/lib/youtube/data-api.ts` | **NOT_VERIFIABLE** (Requires live token) | Bearer OAuth Access Token | 1 unit per playlist page; 1 unit per 50 video IDs. |
| **YouTube Analytics API v2** | `https://youtubeanalytics.googleapis.com/v2/reports` | `src/lib/youtube/analytics-api.ts` | **NOT_VERIFIABLE** (Requires live token) | Bearer OAuth Access Token | Dedicated analytics quota (separate from Data API). |
| **YouTube Public HTML Resolver** | `https://www.youtube.com/@handle`<br>`https://www.youtube.com/@handle/about` | `src/app/api/youtube/resolve/route.ts` | **WORKING** | None (Public HTTP scrape with User-Agent) | 0 Google API quota units consumed. |
| **YouTube Autocomplete Suggest API** | `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=...` | `src/app/api/youtube/trends/route.ts` | **WORKING** | None (Public HTTP query proxy) | 0 Google API quota units consumed. |
| **Supabase SSR Cloud Database** | `@supabase/ssr` + `@supabase/supabase-js` | `src/lib/supabase/client.ts`<br>`src/lib/supabase/server.ts` | **PARTIALLY_WORKING** | Anon Key + Service Role Key | Free tier / Pro tier bandwidth. Fallback active. |
| **Institutional Fact Database** | In-Memory Curated Fact Matcher | `src/lib/ai/fact-verification-engine.ts` | **PARTIALLY_WORKING** | None (Local Regex/Lookup) | 0 API cost. Instant execution. |
| **External AI LLMs (Gemini / OpenAI / Claude)** | Not installed | N/A | **NOT_IMPLEMENTED** | N/A | $0.00 (Currently uses local TypeScript engine). |

---

## 2. YouTube Data API & Quota Architecture

### 2.1 Quota Optimization Assessment
- Default YouTube Data API v3 quota is **10,000 units per project per day**.
- `search.list` consumes **100 units per call**, which rapidly exhausts daily quotas.
- **Architectural Strength in ASH Creator Studio:**
  1. The project **does not use `search.list`** for channel discovery. Instead, `src/app/api/youtube/resolve/route.ts` scrapes the public channel microformat and about page (0 units).
  2. For video catalog synchronization (`src/lib/youtube/sync-engine.ts`), the engine fetches the channel's `uploads` playlist via `playlistItems.list` (1 unit per 50 items) and batch-fetches video statistics via `videos.list?id=id1,id2,...` (1 unit per 50 items).
  3. Total quota to sync a 50-video channel: **~3 quota units** (vs 100+ units if using search).

### 2.2 Token Refresh Lifecycle (`src/lib/youtube/token-manager.ts`)
- OAuth access tokens expire after **3600 seconds (1 hour)**.
- `getValidAccessToken(userId)` implements an automated freshness check:
  ```typescript
  const now = new Date();
  const expiresAt = new Date(connection.token_expires_at);
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  if (expiresAt <= fiveMinutesFromNow && connection.refresh_token) {
    // Proactively refresh 5 minutes before actual expiry
    const newTokens = await refreshAccessToken(connection.refresh_token);
    ...
  }
  ```
- **Audit Finding:** Proactive token refreshing is correctly designed with a 5-minute safety buffer.

---

## 3. Integration Vulnerabilities & Edge Cases

1. **YouTube Public Page Scraping Fragility**:
   - `src/app/api/youtube/resolve/route.ts` relies on regex patterns matching YouTube's server-rendered HTML (`og:title`, `"externalId"`, `"viewCountText"`).
   - If YouTube modifies internal JSON keys in their obfuscated microformat payload, regex extraction can fail.
   - **Mitigation Needed:** When `YOUTUBE_API_KEY` is present in `.env.local`, fall back to official `channels.list?forHandle=@handle` (1 unit).

2. **Server-Side Supabase Cookie Headers**:
   - In Next.js 14 Server Actions / Route Handlers, cookie mutation rules require setting cookies on the `NextResponse` object.
   - `src/lib/supabase/server.ts` uses `@supabase/ssr` with `cookies()` from `next/headers`. In read contexts this works seamlessly; in Server Components write operations throw Next.js cookie modification errors if not handled inside Route Handlers.
