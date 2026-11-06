# ASH CREATOR STUDIO: ARCHITECTURE AUDIT (TASK 001)

**Audit Date:** 2026-11-07  
**Platform Version:** ASH Creator Studio 2.0  
**Framework:** Next.js 14.2 (App Router)  
**Language:** TypeScript 5.6 (strict mode)  
**Styling:** Tailwind CSS 3.4 + CSS Variables + Dark/Light Theme System  

---

## 1. System Architecture Overview

```
                                      ┌────────────────────────────────────────┐
                                      │              CLIENT LAYER              │
                                      │   Next.js 14 App Router (React 18)     │
                                      └───────────────────┬────────────────────┘
                                                          │
                             ┌────────────────────────────┴──────────────────────────┐
                             │                                                       │
               ┌─────────────▼──────────────┐                          ┌─────────────▼──────────────┐
               │     Public / Auth Routes   │                          │      Dashboard Shell       │
               │  /login, /signup, /reset   │                          │    /(dashboard)/layout     │
               └─────────────┬──────────────┘                          └─────────────┬──────────────┘
                             │                                                       │
                             │                                          ┌────────────┴────────────┐
                             │                                          │  AuthProvider (Context) │
                             │                                          │  Active Channel Style   │
                             │                                          │  Multi-Channel Storage  │
                             │                                          └────────────┬────────────┘
                             │                                                       │
                             └────────────────────────────┬──────────────────────────┘
                                                          │
                                            ┌─────────────▼─────────────┐
                                            │      Next.js Middleware   │
                                            │     (Session / Route Guard)│
                                            └─────────────┬─────────────┘
                                                          │
                                            ┌─────────────▼─────────────┐
                                            │    API Route Handlers     │
                                            │    /api/auth/youtube/*    │
                                            │    /api/youtube/*         │
                                            └─────────────┬─────────────┘
                                                          │
                                     ┌────────────────────┴───────────────────┐
                                     │                                        │
                       ┌─────────────▼─────────────┐            ┌─────────────▼─────────────┐
                       │    Supabase PostgreSQL    │            │    Official Google APIs   │
                       │    Row-Level Security     │            │    YouTube Data API v3    │
                       │    15 Relational Tables   │            │    YouTube Analytics API  │
                       └───────────────────────────┘            └───────────────────────────┘
```

---

## 2. Frontend Architecture & Component Hierarchy

### 2.1 Route Organization
- `src/app/(auth)/*`: Unauthenticated layouts for `login`, `signup`, `forgot-password`, and `update-password`.
- `src/app/(dashboard)/*`: Authenticated core shell (`layout.tsx`) wrapping:
  - `Header`: Channel switcher dropdown, profile dropdown, responsive mobile drawer toggle, theme toggle.
  - `Sidebar`: Navigation sections (Overview, Analytics, Research, AI Video Studio, Packaging & SEO, Growth Tools, Configuration).
  - Main container: Responsive layout (`p-3 sm:p-6 lg:p-8 pb-24 sm:pb-16`).
- Dedicated Dashboard Modules (15 functional routes):
  - Core Active Modules: `script-writer`, `trend-research`, `video-ideas`, `style-lab`, `channel-analytics`.
  - Secondary Modules: `channel-audit`, `competitor-research`, `content-calendar`, `creator-ai-assistant`, `experiment-lab`, `growth-coach`, `seo-studio`, `thumbnail-studio`, `video-analyzer`, `video-planner`.
  - Dynamic Catch-All: `[slug]/page.tsx` displaying feature roadmap status for uninstantiated slugs.

### 2.2 Client vs Server Component Boundaries
- **Client Components (`"use client"`)**: Used across all dashboard modules because of heavy user interactivity (interactive style selector cards, 10-button clipboard toolbar, audio timeline tabs, video duration sliders, and real-time form inputs).
- **Server Components**: Used in root layout (`src/app/layout.tsx`) for metadata, font injection, and initial HTML hydration.
- **Providers Layer**:
  - `ThemeProvider` (`next-themes`): Manages system, dark, and light themes with `attribute="class"` without hydration mismatch.
  - `AuthProvider` (`src/components/providers/auth-provider.tsx`): Central state container holding `user`, `profile`, `settings`, `channel` (active), `channels` (all connected), and `activeChannelStyle` (Channel Style DNA).

### 2.3 State Management Evaluation
- **Dual-Mode Persistence Architecture**:
  - **Cloud Mode (`isConfigured === true`)**: Reads and writes to Supabase PostgreSQL with RLS.
  - **Local/Demo Mode (`isConfigured === false`)**: Gracefully falls back to browser `localStorage` keys:
    - `ash_profile`: Creator profile attributes.
    - `ash_settings`: Preferences, theme, and AI limits.
    - `ash_channels_list`: Array of all connected YouTube channels.
    - `ash_active_channel_id`: ID of currently active channel.
    - `ash_channel_style_[channelId]`: Isolated Style DNA profile per channel.
- **State Integrity Finding**: Local storage dual-mode is resilient and ensures the application is 100% operational in offline or demo modes without crashing. However, page-level states in `competitor-research`, `content-calendar`, and `video-planner` remain in memory only and need connection to this storage layer.

---

## 3. Backend & API Route Handlers

### 3.1 Implemented Endpoints
1. `GET /api/auth/youtube`: Initiates OAuth 2.0 flow or returns setup guidance if unconfigured.
2. `GET /api/auth/youtube/callback`: Exchanges authorization code for tokens, scrapes channel details, and stores connection.
3. `POST /api/auth/youtube/disconnect`: Revokes tokens and updates connection state.
4. `GET /api/auth/youtube/status`: Sanitized status endpoint (never exposes tokens to browser).
5. `GET /api/youtube/analytics`: Returns daily metrics and top videos for 7, 28, or 90 days.
6. `POST /api/youtube/resolve`: Resolves public YouTube channel metadata by scraping YouTube public web pages without consuming API quota.
7. `POST /api/youtube/sync`: Incremental synchronization engine for videos and analytics snapshots.
8. `GET /api/youtube/trends`: Dynamic multi-genre trends and YouTube autocomplete search proxy.

### 3.2 Architectural Bottlenecks & Code-Established Deficiencies
1. **Serverless Ephemeral Memory Leak Risk**: `localTokenStore` in `src/lib/youtube/token-manager.ts` uses an in-memory `Map`. On serverless platforms (Netlify), state does not persist across invocations.
2. **Missing Request-Context Authentication**: API route handlers hardcode `userId = "demo-creator-uuid"`. The server does not extract the user session from the cookie in `src/app/api/youtube/analytics/route.ts` and `src/app/api/youtube/sync/route.ts`.
3. **No Direct External LLM Handler**: All AI text generation is currently computed in TypeScript runtime algorithmic engines (`complete-video-intelligence-engine.ts`, `human-script-engine.ts`) rather than offloaded to a streaming edge worker.

---

## 4. Multi-Channel Data Isolation Architecture

### 4.1 Isolation Principle
Each YouTube channel connected to the system is assigned an independent **Channel Intelligence Profile (Style DNA)** containing:
- Unique Channel ID (`channelId` / `youtubeChannelId`).
- Independent Visual Animation Style (`visualAnimationStyle`).
- Independent Niche & Sub-Niche (`channelNiche`, `channelSubNiche`).
- Independent Target Audience & Age Group.
- Independent Popular Topics & Successful Video Patterns.
- Independent Content Restrictions.

### 4.2 Storage Isolation
- In Cloud Mode: Scoped by `user_id` and `channel_id` foreign keys in Supabase with RLS policies (`auth.uid() = user_id`).
- In Local Mode: Isolated per channel key `ash_channel_style_${channel.id}`.
- In Request Payloads: `complete-video-intelligence-engine.ts` accepts `channelName`, `channelNiche`, and `selectedStyleId` to guarantee that Channel A settings are never applied to Channel B.

---

## 5. Architectural Quality Rating

| Category | Rating (1–5) | Strengths | Weaknesses |
|---|---|---|---|
| **Frontend Modularity** | ⭐⭐⭐⭐⭐ (5/5) | Clean component separation, strict TypeScript types, responsive design across mobile/desktop. | None observed. |
| **Styling & Design System** | ⭐⭐⭐⭐⭐ (5/5) | Comprehensive Tailwind tokens, dark mode compatibility, accessible color contrasts. | None observed. |
| **API Sanitation & Security** | ⭐⭐⭐⭐☆ (4/5) | Tokens are never transmitted to frontend clients; sanitize helper exists. | Serverless memory store and hardcoded user id in API routes need addressing. |
| **Database Normalization** | ⭐⭐⭐⭐⭐ (5/5) | 15 well-structured tables, complete RLS policies, indexing on foreign keys. | Migration runner not automated in CI/CD pipeline. |
| **External AI Integration** | ⭐⭐☆☆☆ (2/5) | Comprehensive TypeScript heuristic generation rules. | No streaming external LLM provider integration yet. |
| **Automated Testing** | ⭐☆☆☆☆ (1/5) | Strict TypeScript compiler verification (`next build`). | No test runner configured in repository. |
