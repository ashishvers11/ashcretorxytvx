# ASH Creator Studio (Phase 1)

**ASH Creator Studio** is an AI-powered YouTube Creator Growth SaaS platform designed for high-growth creators (~50 beta creators across multiple channels).

---

## 🚀 Phase 1 Foundation Highlights

- **Framework & Tooling:** Next.js (App Router), React, TypeScript, Tailwind CSS.
- **Design System:** Premium navy blue (`#0B1728`), white, and subtle blue (`#38BDF8`) theme with full dark/light mode toggle.
- **Responsive Architecture:** Desktop, tablet, and mobile support with a collapsible sidebar and mobile drawer.
- **Authentication & Security:** Supabase Auth (Sign Up, Sign In, Password Reset, Password Update, Auth Callback) with protected route middleware and local development demo fallback.
- **Creator Profile:** Personalized creator persona, avatar configuration, YouTube niche taxonomy, preferred language, and timezone management.
- **Main Dashboard:**
  - Personalized welcome greeting with quick channel health status.
  - Connected YouTube channel management with authentic empty states and modal linker.
  - 3 Core Metrics cards (Total Views, Subscribers, Published Videos) displaying genuine `--` or `0` counts until channel data is connected (no fake/invented analytics).
  - Getting Started Checklist with dynamic progress completion tracking.
  - Quick action workflow launchpad.
  - Real-time recent activity timeline.
- **Sidebar Navigation:** Complete modular categorization (Overview, Analytics, Research, Content Studio, Growth, AI Assistant, Settings) with distinct "Coming Soon" badges and blueprint preview pages for future modules.
- **Database Engine (Supabase 15 Tables):** Complete SQL migration script (`supabase/migrations/20261106000000_init_schema.sql`) with Row Level Security (RLS) on every table, indexes, and automated profile provisioning triggers.

---

## 🗄️ Database Architecture (15 Tables)

All tables are secured with Row Level Security (RLS) so creators only ever access their own records:

1. `profiles` — Creator identity, niche, language, timezone.
2. `user_settings` — UI theme, notification preferences, AI spending limits.
3. `channels` — Linked YouTube channels and channel metadata.
4. `videos` — Synced YouTube video catalog.
5. `analytics_snapshots` — Historical views, watch time, subscribers, and CTR.
6. `competitors` — Tracked competitor channels and benchmark metrics.
7. `video_ideas` — Brainstormed and AI-generated video concepts.
8. `scripts` — Video script drafting, psychological hooks, and retention beats.
9. `seo_packages` — Optimized titles, descriptions, and tag recommendations.
10. `thumbnails` — Thumbnail variations and A/B test packaging.
11. `content_calendar` — Planned upload cadence and scheduling.
12. `audit_reports` — Automated 50-point channel diagnostics and audit scores.
13. `experiments` — Title, thumbnail, and hook A/B experiments.
14. `ai_conversations` — Creator chat sessions with Creator AI Assistant.
15. `ai_usage` — Token consumption tracking and cost accounting per creator.

---

## 🛠️ Quick Start

### 1. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Connect Your Cloud Supabase Project (Optional)
The platform includes a local Creator Demo Mode so you can explore the dashboard immediately without setup. To connect a live Supabase backend:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard and run the migration script:
   ```
   supabase/migrations/20261106000000_init_schema.sql
   ```
3. Copy your project URL and Anon Public Key from **Project Settings > API**.
4. Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
5. Restart your dev server. The app will automatically connect to live Supabase Auth and PostgreSQL.

---

## 🧭 Navigation & Roadmap (Phase 2 & 3 Preview)

| Section | Module | Status |
| :--- | :--- | :--- |
| **Overview** | Dashboard | ✅ Phase 1 Live |
| | Channel Audit | ⏳ Coming Soon (Phase 2) |
| **Analytics** | Channel Analytics | ⏳ Coming Soon (Phase 2) |
| | Video Analyzer | ⏳ Coming Soon (Phase 2) |
| **Research** | Trend Research | ⏳ Coming Soon (Phase 2) |
| | Video Ideas | ⏳ Coming Soon (Phase 2) |
| | Competitor Research | ⏳ Coming Soon (Phase 2) |
| **Content Studio** | Script Writer | ⏳ Coming Soon (Phase 3) |
| | SEO Studio | ⏳ Coming Soon (Phase 3) |
| | Thumbnail Studio | ⏳ Coming Soon (Phase 3) |
| | Video Planner | ⏳ Coming Soon (Phase 3) |
| **Growth** | Growth Coach | ⏳ Coming Soon (Phase 3) |
| | Experiment Lab | ⏳ Coming Soon (Phase 3) |
| | Content Calendar | ⏳ Coming Soon (Phase 3) |
| **AI Assistant** | Creator AI Assistant | ⏳ Coming Soon (Phase 3) |
| **Settings** | Profile Management | ✅ Phase 1 Live |
| | Account & Security | ✅ Phase 1 Live |
