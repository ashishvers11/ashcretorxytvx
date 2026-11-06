# ASH CREATOR STUDIO: BROKEN & PARTIALLY FUNCTIONAL FEATURES AUDIT (TASK 001)

**Audit Date:** 2026-11-07  
**Rule:** Every issue documented below is supported by direct code citations. No root cause is claimed without code evidence. No fixes are implemented during this audit phase.

---

## Issue 1: Hardcoded User ID Across All YouTube API Endpoints

### 1. Exact Location in Codebase
- `src/app/api/youtube/analytics/route.ts` (Line 15):
  ```typescript
  const userId = "demo-creator-uuid";
  ```
- `src/app/api/youtube/sync/route.ts` (Line 11):
  ```typescript
  const userId = "demo-creator-uuid";
  ```
- `src/app/api/auth/youtube/status/route.ts` (Line 12):
  ```typescript
  const userId = "demo-creator-uuid";
  ```
- `src/app/api/auth/youtube/disconnect/route.ts` (Line 10):
  ```typescript
  const userId = "demo-creator-uuid";
  ```
- `src/app/api/auth/youtube/callback/route.ts` (Lines 37, 72):
  ```typescript
  const defaultUserId = "demo-creator-uuid";
  ```

### 2. Root Cause (Code Evidence)
The API routes were scaffolded with a static fallback string `"demo-creator-uuid"` instead of reading the authenticated user's session from `createServerClient().auth.getUser()` or the request authorization cookie.

### 3. User Impact
In a multi-user deployment (when Supabase Auth is enabled), any user calling these endpoints will overwrite or read the YouTube OAuth credentials and sync reports of `"demo-creator-uuid"`. User isolation is broken at the API layer.

### 4. Recommended Fix
Extract the authenticated user session in each API route via `@/lib/supabase/server`:
```typescript
const supabase = createServerClient();
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
const userId = user.id;
```

### 5. Dependencies
`@/lib/supabase/server`, active session cookies.

### 6. Tests Required
- Integration test for unauthenticated request returning 401.
- Integration test verifying User A cannot read or modify User B's YouTube tokens.

---

## Issue 2: In-Memory Token Store Non-Persistence in Serverless Deployments

### 1. Exact Location in Codebase
- `src/lib/youtube/token-manager.ts` (Lines 27–28, 89, 97):
  ```typescript
  // In-memory token cache for local demo mode when Supabase is not connected
  const localTokenStore = new Map<string, StoredYouTubeConnection>();
  ```

### 2. Root Cause (Code Evidence)
When Supabase is not connected (`isConfigured === false`), `saveYouTubeConnection` falls back to `localTokenStore.set(userId, record)`. In a serverless environment (such as Netlify Functions or Edge Middleware), Node.js process memory is ephemeral and is not shared across lambda instances or invocations.

### 3. User Impact
If a user authorizes YouTube in demo mode on Netlify, the OAuth callback writes to an in-memory `Map` in one serverless function container. When the browser later requests `/api/auth/youtube/status` or `/api/youtube/analytics`, that request hits a separate container where `localTokenStore` is empty, causing the UI to report the channel as disconnected.

### 4. Recommended Fix
Store encrypted token records in persistent Supabase table `public.youtube_connections`, or for offline/local development, persist to an encrypted filesystem key-value store or local cookie rather than module-scoped memory.

### 5. Dependencies
`public.youtube_connections` table migration (`supabase/migrations/20261106000001_phase2_youtube_integration.sql`).

### 6. Tests Required
- Test asserting tokens persist across simulated process restart.

---

## Issue 3: YouTube Analytics API Generates Hardcoded Mock Data for One Channel Only

### 1. Exact Location in Codebase
- `src/app/api/youtube/analytics/route.ts` (Lines 30–31, 73–128):
  ```typescript
  // High-fidelity verified data report for ASHISH FN (@ashishfn)
  const report: ChannelAnalyticsReport = generateChannelReport(days, startDate, endDate, tokenResult.isAuthorized);
  ```
  ```typescript
  const topVideos = [
    {
      videoId: "clove_fact_01",
      title: "लौंग असल में फूल है या फल? (The Science Behind Cloves)",
      ...
    },
    {
      videoId: "earth_fact_02",
      title: "अगर धरती 5 सेकंड के लिए घूमना बंद कर दे तो क्या होगा?",
      ...
    },
    ...
  ];
  ```

### 2. Root Cause (Code Evidence)
When no live Google OAuth access token is active, `generateChannelReport` generates hardcoded top videos for `@ashishfn` regardless of which channel is selected in the UI (`CURIOKID VERS`, paper cut-out, etc.). The route does not accept or read a `channelId` query parameter.

### 3. User Impact
When viewing `/modules/channel-analytics` while managing any connected channel other than `ASHISH FN`, the user sees analytics graphs and top video titles for an unrelated channel.

### 4. Recommended Fix
Pass `channelId` as a query parameter to `/api/youtube/analytics?channelId=...&days=...`. In fallback mode, query the connected channel's metadata from `public.channels` and `public.videos` (or localStorage) to generate channel-isolated metrics.

### 5. Dependencies
`src/app/(dashboard)/modules/channel-analytics/page.tsx`, `src/app/api/youtube/analytics/route.ts`.

### 6. Tests Required
- Test asserting `/api/youtube/analytics?channelId=chan-curiokid` returns Curiokid videos, not Clove/Earth videos.

---

## Issue 4: Ephemeral State in Planning, Competitors, and Calendar Modules

### 1. Exact Location in Codebase
- `src/app/(dashboard)/modules/competitor-research/page.tsx` (Lines 22–56):
  ```typescript
  const [competitors, setCompetitors] = React.useState([...]);
  ```
- `src/app/(dashboard)/modules/content-calendar/page.tsx` (Lines 19–60):
  ```typescript
  const [scheduledItems, setScheduledItems] = React.useState([...]);
  ```
- `src/app/(dashboard)/modules/video-planner/page.tsx` (Lines 27–63):
  ```typescript
  const [tasks, setTasks] = React.useState<VideoTask[]>([...]);
  ```

### 2. Root Cause (Code Evidence)
These pages manage their entire data structures exclusively in React component memory (`React.useState`). Neither `localStorage` sync nor Supabase table queries (`public.competitors`, `public.content_calendar`, `public.video_ideas`) are implemented.

### 3. User Impact
Any creator who customizes their Kanban video pipeline, adds competitor channels to track, or schedules an upcoming video on the calendar will lose all changes upon refreshing the page or navigating to another tab.

### 4. Recommended Fix
Implement CRUD synchronization hooks connecting these components to their respective Supabase tables (`public.competitors`, `public.content_calendar`, `public.video_ideas`) with an optimistic `localStorage` cache fallback for offline demo mode.

### 5. Dependencies
`public.competitors`, `public.content_calendar`, `public.video_ideas` Supabase tables.

### 6. Tests Required
- Unit tests for create, update, delete, and stage-shift operations.
- Persistence test across page reload.

---

## Issue 5: Hardcoded Channel Identity Leaked in SEO Studio Template

### 1. Exact Location in Codebase
- `src/app/(dashboard)/modules/seo-studio/page.tsx` (Lines 44, 46, 53):
  ```typescript
  44: https://www.youtube.com/@ashishfn
  46: #ScienceFacts #HindiFacts #AshishFN #DailyCuriosity #Education #BiologyTruth
  53: "ashish fn",
  ```

### 2. Root Cause (Code Evidence)
The default state for `descriptionInput` and `tags` contains static string literals referencing `@ashishfn` instead of deriving the subscribe link and branding tags from the currently active channel in `useAuth()`.

### 3. User Impact
When a creator managing `CURIOKID VERS` or another connected channel copies the generated SEO description, it erroneously links their viewers to `https://www.youtube.com/@ashishfn` and tags their video with `#AshishFN`.

### 4. Recommended Fix
Dynamically construct the default description and tags using the active channel profile:
```typescript
const channelHandle = channel?.custom_url ? `@${channel.custom_url}` : channel?.channel_title || "MyChannel";
const subscribeUrl = `https://www.youtube.com/${channelHandle}`;
```

### 5. Dependencies
`useAuth()` hook in `src/app/(dashboard)/modules/seo-studio/page.tsx`.

### 6. Tests Required
- Test verifying SEO package output updates dynamically when active channel changes.

---

## Issue 6: Gaming Artifacts Leftover in Video Analyzer Markers

### 1. Exact Location in Codebase
- `src/app/(dashboard)/modules/video-analyzer/page.tsx` (Lines 46, 53):
  ```typescript
  46: detail: "Long inventory management segment caused 8% drop. Shorten or add background sound design.",
  53: detail: "Viewers rewound to rewatch 1v3 clutch battle. Excellent retention retention trigger.",
  ```

### 2. Root Cause (Code Evidence)
The retention timeline markers in `VideoAnalyzerPage` contain static text copied from a gaming video template ("inventory management", "1v3 clutch battle") rather than analyzing actual transcript segments, scene changes, or audio drops.

### 3. User Impact
Creators analyzing an educational, historical, or science video see nonsensical feedback advising them to fix an "inventory management segment" or celebrate a "1v3 clutch battle".

### 4. Recommended Fix
Wire `VideoAnalyzerPage` into the `RetentionAnalysisReport` generated by `@/lib/ai/complete-video-intelligence-engine`, which dynamically generates second-by-second attention drops based on spoken voiceover pacing and topic beats.

### 5. Dependencies
`src/lib/ai/complete-video-intelligence-engine.ts`.

### 6. Tests Required
- Test asserting generated retention markers reflect the actual topic and script structure.

---

## Issue 7: Creator AI Assistant Lacks Live LLM Integration

### 1. Exact Location in Codebase
- `src/app/(dashboard)/modules/creator-ai-assistant/page.tsx` (Lines 68–77):
  ```typescript
  const lower = text.toLowerCase();
  if (lower.includes("30-day") || lower.includes("growth plan")) {
    aiReply = ...;
  } else if (lower.includes("title") || lower.includes("ideas") || lower.includes("topic")) {
    aiReply = ...;
  } else if (lower.includes("drop") || lower.includes("retention") || lower.includes("30 seconds")) {
    aiReply = ...;
  } else {
    aiReply = ...;
  }
  ```

### 2. Root Cause (Code Evidence)
The copilot interface uses client-side keyword substring checks (`lower.includes(...)`) with static pre-written paragraphs instead of calling a streaming AI completion endpoint (e.g. Next.js Route Handler powered by Gemini or OpenAI).

### 3. User Impact
The creator cannot ask open-ended questions about their specific videos, script drafts, competitor analytics, or unique channel strategy; the assistant repeats the same 4 canned paragraphs.

### 4. Recommended Fix
Implement a server-side route handler `/api/ai/chat` powered by Google Gemini API (`@google/genai`) or OpenAI, passing the active channel's Channel Intelligence Profile as system prompt context.

### 5. Dependencies
AI Provider API key (`GEMINI_API_KEY` or `OPENAI_API_KEY`).

### 6. Tests Required
- Unit test for route handler response streaming and error handling when quota is exceeded.
