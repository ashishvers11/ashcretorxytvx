# ASH CREATOR STUDIO: DEVELOPMENT ROADMAP & MIGRATION PLAN (TASK 001)

**Audit Date:** 2026-11-07  
**Guiding Principle:** Preserve all working features without rewrite; execute the safest, backwards-compatible migration path.  
**Constraint:** Implementation is paused pending user review and approval.

---

## 1. Prioritized Implementation Roadmap

```
  PHASE 1: Security & Multi-Tenant Identity Fixes (Critical)
     │   • Replace hardcoded "demo-creator-uuid" with dynamic Supabase session auth
     │   • Add OAuth CSRF nonce cookie validation & open redirect sanitization
     │
     ▼
  PHASE 2: Data Persistence & Database Connection (High)
     │   • Connect Competitor Research, Calendar & Video Planner to Supabase tables
     │   • Add migration for persistent `channel_style_profiles` table
     │   • Clean up hardcoded `@ashishfn` in SEO Studio & Video Analyzer templates
     │
     ▼
  PHASE 3: Live AI Provider & Web Research Integration (Medium)
     │   • Integrate Google Gemini API / OpenAI for streaming Creator AI Copilot
     │   • Wire live Wikipedia API / Google Search API into Fact Verification Engine
     │
     ▼
  PHASE 4: Live Google OAuth & Analytics Sync (Medium)
     │   • Populate production Google OAuth 2.0 credentials in Netlify env
     │   • Verify YouTube Data & Analytics API sync on live creator accounts
     │
     ▼
  PHASE 5: Automated Test Suite & CI/CD Pipeline (Quality Assurance)
         • Install Vitest & Testing Library
         • Implement unit test suites for 13 styles, 15-scene generator, and API routes
```

---

## 2. Phase-by-Phase Execution Details

### Phase 1: Security & Multi-Tenant Identity Foundation
- **Objective:** Ensure complete user isolation and eliminate security vulnerabilities established in the audit.
- **Tasks:**
  1. Update `src/app/api/youtube/analytics/route.ts`, `src/app/api/youtube/sync/route.ts`, `src/app/api/auth/youtube/status/route.ts`, and `src/app/api/auth/youtube/disconnect/route.ts` to retrieve the active session via `createServerClient().auth.getUser()`. Return HTTP 401 if unauthenticated and in cloud mode.
  2. In `src/app/api/auth/youtube/route.ts`, generate a cryptographically random nonce stored in an HttpOnly cookie (`oauth_state_nonce`) and verify it upon callback in `callback/route.ts`.
  3. Sanitize `redirectPath` in `callback/route.ts` to prevent open-redirect vulnerabilities.
- **Risk Level:** **Low** (Backwards-compatible; preserves demo mode when unconfigured).

---

### Phase 2: Database Persistence for Planning Modules
- **Objective:** Connect existing frontend state-only pages to their Supabase tables so creator work is never lost on refresh.
- **Tasks:**
  1. Wire `src/app/(dashboard)/modules/competitor-research/page.tsx` to `public.competitors`.
  2. Wire `src/app/(dashboard)/modules/content-calendar/page.tsx` to `public.content_calendar`.
  3. Wire `src/app/(dashboard)/modules/video-planner/page.tsx` to `public.video_ideas`.
  4. Create a new migration `20261107000000_channel_style_profiles.sql` to persist Channel Style DNA in the cloud alongside `localStorage`.
  5. Fix `src/app/(dashboard)/modules/seo-studio/page.tsx` and `src/app/(dashboard)/modules/video-analyzer/page.tsx` to dynamically bind to the connected channel rather than static template artifacts.
- **Risk Level:** **Low** (Uses optimistic UI updates with localStorage fallback).

---

### Phase 3: Live AI Provider & Live Research Integrations
- **Objective:** Upgrade simulated copilot and in-memory fact checking to live AI capabilities.
- **Tasks:**
  1. Create a server-side route handler `/api/ai/chat` powered by Google Gemini 1.5 Pro / Flash or OpenAI GPT-4o, streaming real conversational advice calibrated with the active channel's Style DNA.
  2. Wire `src/lib/ai/fact-verification-engine.ts` to query Wikipedia Search API (`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=...`) for real-time verification of unlisted claims.
- **Risk Level:** **Medium** (Requires API key configuration).

---

### Phase 4: Production Google OAuth & Analytics Sync
- **Objective:** Enable real Google YouTube Data & Analytics API synchronization.
- **Tasks:**
  1. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Netlify environment settings.
  2. Test official Google authorization screen and verify automated token refresh.
  3. Test incremental video sync into `public.videos` and `public.analytics_snapshots`.
- **Risk Level:** **Low** (Standard OAuth 2.0 flow already scaffolded in `oauth.ts`).

---

### Phase 5: Automated Testing Harness
- **Objective:** Ensure continuous regression protection across all 13 styles, 15 scene attributes, and API routes.
- **Tasks:**
  1. Install `vitest` and configure `vitest.config.ts`.
  2. Implement unit test suites for `complete-video-intelligence-engine`, `channel-intelligence`, and `trends` API.
- **Risk Level:** **Zero** (Development tooling only).

---

## 3. Next Action

**Awaiting user approval before starting implementation of Phase 1.**
