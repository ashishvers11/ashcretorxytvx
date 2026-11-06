# ASH CREATOR STUDIO: DATABASE AUDIT (TASK 001)

**Audit Date:** 2026-11-07  
**Database Engine:** PostgreSQL 15+ (Supabase)  
**ORM / Client:** `@supabase/ssr` (v0.5.2) + `@supabase/supabase-js` (v2.46.1)  
**Schema Files Audited:**
- `supabase/migrations/20261106000000_init_schema.sql` (472 lines)
- `supabase/migrations/20261106000001_phase2_youtube_integration.sql` (91 lines)

---

## 1. Relational Schema Architecture (Entity Relationship Diagram)

```
 auth.users (Supabase Auth)
      │
      └───► public.profiles (1:1)
                 │
                 ├───► public.user_settings (1:1)
                 │
                 ├───► public.channels (1:N)
                 │         │
                 │         ├───► public.videos (1:N)
                 │         │
                 │         ├───► public.analytics_snapshots (1:N)
                 │         │
                 │         ├───► public.youtube_connections (1:1 per channel)
                 │         │
                 │         ├───► public.competitors (1:N)
                 │         │
                 │         ├───► public.video_ideas (1:N)
                 │         │         │
                 │         │         ├───► public.scripts (1:N)
                 │         │         │
                 │         │         └───► public.thumbnails (1:N)
                 │         │
                 │         ├───► public.seo_packages (1:N)
                 │         │
                 │         ├───► public.content_calendar (1:N)
                 │         │
                 │         └───► public.audit_reports (1:N)
                 │
                 ├───► public.experiments (1:N)
                 │
                 └───► public.growth_milestones (1:N)
```

---

## 2. Table-by-Table Technical Audit

### Table 1: `public.profiles`
- **Primary Key:** `id` (UUID references `auth.users(id)` ON DELETE CASCADE).
- **Columns:** `email`, `full_name`, `avatar_url`, `creator_type`, `channel_niche`, `preferred_language`, `time_zone`, `created_at`, `updated_at`.
- **RLS:** Enabled. Three distinct policies (`SELECT`, `UPDATE`, `INSERT`) enforcing `auth.uid() = id`.
- **Audit Assessment:** **HEALTHY**. Clean 1:1 extension of Supabase Auth.

### Table 2: `public.user_settings`
- **Primary Key:** `id` (UUID gen_random_uuid()).
- **Foreign Key:** `user_id` (UUID references `public.profiles(id)` ON DELETE CASCADE).
- **Columns:** `theme`, `email_notifications`, `weekly_digest`, `marketing_updates`, `ai_budget_limit`, `currency`, timestamps.
- **RLS:** Enabled. Enforces `auth.uid() = user_id`.
- **Audit Assessment:** **HEALTHY**. Default AI budget limit set to $25.00 USD.

### Table 3: `public.channels`
- **Primary Key:** `id` (UUID).
- **Foreign Key:** `user_id` (UUID references `public.profiles(id)` ON DELETE CASCADE).
- **Unique Constraint:** `CONSTRAINT unique_channel_per_user UNIQUE (user_id, youtube_channel_id)`.
- **Columns:** `youtube_channel_id`, `channel_title`, `custom_url`, `description`, `thumbnail_url`, `subscriber_count`, `video_count`, `view_count`, `uploads_playlist_id`, `published_at`, `is_primary`, `is_connected`, `is_oauth_authorized`, timestamps.
- **Indexes:** `idx_channels_user_id`.
- **RLS:** Enabled. `FOR ALL USING (auth.uid() = user_id)`.
- **Audit Assessment:** **HEALTHY**. Supports multi-channel isolation per creator.

### Table 4: `public.videos`
- **Primary Key:** `id` (UUID).
- **Foreign Keys:** `user_id`, `channel_id` (both ON DELETE CASCADE).
- **Unique Constraint:** `CONSTRAINT unique_video_per_channel UNIQUE (channel_id, youtube_video_id)`.
- **Columns:** `youtube_video_id`, `title`, `description`, `thumbnail_url`, `published_at`, `duration_seconds`, `view_count`, `like_count`, `comment_count`, timestamps.
- **Indexes:** `idx_videos_user_id`, `idx_videos_channel_id`.
- **RLS:** Enabled. `FOR ALL USING (auth.uid() = user_id)`.
- **Audit Assessment:** **HEALTHY**.

### Table 5: `public.analytics_snapshots`
- **Primary Key:** `id` (UUID).
- **Foreign Keys:** `user_id`, `channel_id` (both ON DELETE CASCADE).
- **Unique Constraint:** `CONSTRAINT unique_channel_snapshot_date UNIQUE (channel_id, snapshot_date)`.
- **Columns:** `snapshot_date`, `views`, `watch_time_hours`, `estimated_minutes_watched`, `average_view_duration_seconds`, `subscribers_gained`, `subscribers_lost`, `likes`, `comments`, `shares`, `impressions_ctr`, `is_authorized`, timestamps.
- **Indexes:** `idx_analytics_snapshots_user_id`, `idx_analytics_snapshots_channel_id`.
- **RLS:** Enabled. `FOR ALL USING (auth.uid() = user_id)`.
- **Audit Assessment:** **HEALTHY**. Designed to prevent duplicate daily snapshots per channel.

### Table 6: `public.youtube_connections` (Added in Phase 2 Migration)
- **Primary Key:** `id` (UUID).
- **Foreign Keys:** `user_id` (references `profiles`), `channel_id` (references `channels`).
- **Unique Constraint:** `CONSTRAINT unique_user_channel_connection UNIQUE (user_id, channel_id)`.
- **Columns:** `google_account_id`, `google_email`, `access_token`, `refresh_token`, `token_expires_at`, `scope`, `token_type`, `is_active`, `last_sync_at`, `last_sync_status`, `last_sync_error`, timestamps.
- **RLS:** Enabled. `FOR ALL USING (auth.uid() = user_id)`.
- **Audit Assessment:** **HEALTHY SCHEMA / INTEGRATION GAP**. Schema is secure and supports server-side token management with auto-updated timestamps. Gap: the application runtime does not yet execute migrations automatically against a live production database instance.

### Tables 7–15: Workflow Tables
- `video_ideas`: Supports backlog, in_progress, scripted, filmed, published statuses.
- `scripts`: Stores draft body, hook, intro, call_to_action, target duration, version.
- `seo_packages`: Stores keywords, title_options (JSONB), description_draft, tags array, seo_score.
- `thumbnails`: Stores prompt, image_url, ab_test_active flag, ctr_score.
- `content_calendar`: Stores scheduled_date, scheduled_time, content_type, status.
- `audit_reports`: Stores overall_score, seo_score, strengths (JSONB), weaknesses (JSONB), action_items (JSONB).
- `competitors`: Stores competitor_youtube_id, competitor_title, subscriber_count.
- `experiments`: Stores A/B test variations, traffic split, impression count, click count.
- `growth_milestones`: Stores milestone goals, target metrics, completion timestamps.

---

## 3. Database Vulnerabilities & Schema Gaps

1. **Missing `channel_style_profiles` Table**:
   - **Finding:** The application generates comprehensive Channel Style DNA (13 styles, visual modifiers, hook styles, voiceover styles, negative prompts) via `src/lib/ai/channel-intelligence.ts`.
   - **Current Storage:** Style DNA is stored only in browser `localStorage` (`ash_channel_style_[id]`).
   - **Recommendation:** Add a migration creating `public.channel_style_profiles`:
     ```sql
     CREATE TABLE IF NOT EXISTS public.channel_style_profiles (
         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
         channel_id UUID NOT NULL UNIQUE REFERENCES public.channels(id) ON DELETE CASCADE,
         profile_data JSONB NOT NULL,
         visual_animation_style TEXT NOT NULL,
         channel_niche TEXT NOT NULL,
         updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
     );
     ```

2. **Frontend Disconnection from Existing Tables**:
   - Four existing tables (`public.competitors`, `public.content_calendar`, `public.video_ideas`, `public.audit_reports`) are defined in SQL migrations, but their corresponding dashboard pages currently use local React `useState` arrays rather than Supabase client queries.
