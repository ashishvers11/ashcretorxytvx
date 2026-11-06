-- ==============================================================================
-- ASH CREATOR STUDIO — Supabase Database Architecture
-- Schema Migration: 20261106000001_phase2_youtube_integration.sql
-- Description: YouTube Connections table, OAuth Token Management & Analytics Snapshots
-- ==============================================================================

-- 1. TABLE: youtube_connections
-- Secure server-side storage for Google OAuth 2.0 access & refresh tokens
CREATE TABLE IF NOT EXISTS public.youtube_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
    google_account_id TEXT, -- Google user id (sub)
    google_email TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ NOT NULL,
    scope TEXT NOT NULL,
    token_type TEXT DEFAULT 'Bearer',
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMPTZ,
    last_sync_status TEXT DEFAULT 'idle', -- 'idle', 'syncing', 'completed', 'error'
    last_sync_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_channel_connection UNIQUE (user_id, channel_id)
);

ALTER TABLE public.youtube_connections ENABLE ROW LEVEL SECURITY;

-- Security: Only the owner user can access their connections
CREATE POLICY "Users can manage own youtube connections" 
    ON public.youtube_connections FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_youtube_connections_user_id ON public.youtube_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_youtube_connections_channel_id ON public.youtube_connections(channel_id);

-- Trigger for updated_at
CREATE TRIGGER update_youtube_connections_updated_at
    BEFORE UPDATE ON public.youtube_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. ALTER TABLE: analytics_snapshots (Ensure all Phase 2 Analytics API metrics are supported)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_snapshots' AND column_name = 'estimated_minutes_watched') THEN
        ALTER TABLE public.analytics_snapshots ADD COLUMN estimated_minutes_watched NUMERIC(12,2) DEFAULT 0.00;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_snapshots' AND column_name = 'average_view_duration_seconds') THEN
        ALTER TABLE public.analytics_snapshots ADD COLUMN average_view_duration_seconds INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_snapshots' AND column_name = 'subscribers_lost') THEN
        ALTER TABLE public.analytics_snapshots ADD COLUMN subscribers_lost INT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_snapshots' AND column_name = 'likes') THEN
        ALTER TABLE public.analytics_snapshots ADD COLUMN likes BIGINT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_snapshots' AND column_name = 'comments') THEN
        ALTER TABLE public.analytics_snapshots ADD COLUMN comments BIGINT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_snapshots' AND column_name = 'shares') THEN
        ALTER TABLE public.analytics_snapshots ADD COLUMN shares BIGINT DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_snapshots' AND column_name = 'is_authorized') THEN
        ALTER TABLE public.analytics_snapshots ADD COLUMN is_authorized BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 3. ALTER TABLE: channels (Store uploads playlist ID and published date)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'channels' AND column_name = 'uploads_playlist_id') THEN
        ALTER TABLE public.channels ADD COLUMN uploads_playlist_id TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'channels' AND column_name = 'published_at') THEN
        ALTER TABLE public.channels ADD COLUMN published_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'channels' AND column_name = 'is_oauth_authorized') THEN
        ALTER TABLE public.channels ADD COLUMN is_oauth_authorized BOOLEAN DEFAULT false;
    END IF;
END $$;
