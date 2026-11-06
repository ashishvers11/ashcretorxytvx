-- ==============================================================================
-- ASH CREATOR STUDIO — Supabase Database Architecture
-- Schema Migration: 20261106000000_init_schema.sql
-- Description: Core 15 tables with Row Level Security (RLS), Triggers, & Indexes
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABLE 1: profiles
-- User creator profile extending Supabase auth.users
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    creator_type TEXT DEFAULT 'Solo Creator', -- Solo Creator, Agency / Team, Brand Creator, Hobbyist, Educator
    channel_niche TEXT DEFAULT 'Tech & Coding', -- Tech & Coding, Gaming, Finance & Business, Education & Science, Lifestyle, Entertainment, Health & Fitness
    preferred_language TEXT DEFAULT 'English',
    time_zone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- ==============================================================================
-- TABLE 2: user_settings
-- User preferences, theme, notification controls & AI budget limits
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
    email_notifications BOOLEAN DEFAULT true,
    weekly_digest BOOLEAN DEFAULT true,
    marketing_updates BOOLEAN DEFAULT false,
    ai_budget_limit NUMERIC(10,2) DEFAULT 25.00,
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" 
    ON public.user_settings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
    ON public.user_settings FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" 
    ON public.user_settings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- TABLE 3: channels
-- Connected YouTube channels for creators
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    youtube_channel_id TEXT NOT NULL,
    channel_title TEXT NOT NULL,
    custom_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    subscriber_count BIGINT DEFAULT 0,
    video_count INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    is_primary BOOLEAN DEFAULT true,
    is_connected BOOLEAN DEFAULT true,
    connected_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_channel_per_user UNIQUE (user_id, youtube_channel_id)
);

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own channels" 
    ON public.channels FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_channels_user_id ON public.channels(user_id);

-- ==============================================================================
-- TABLE 4: videos
-- Videos synced from connected YouTube channels
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    youtube_video_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    published_at TIMESTAMPTZ,
    duration_seconds INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    comment_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_video_per_channel UNIQUE (channel_id, youtube_video_id)
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own videos" 
    ON public.videos FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON public.videos(channel_id);

-- ==============================================================================
-- TABLE 5: analytics_snapshots
-- Historical analytics performance snapshots
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    views BIGINT DEFAULT 0,
    watch_time_hours NUMERIC(12,2) DEFAULT 0.00,
    subscribers_gained INT DEFAULT 0,
    estimated_revenue NUMERIC(10,2) DEFAULT 0.00,
    impressions_ctr NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_channel_snapshot_date UNIQUE (channel_id, snapshot_date)
);

ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own analytics" 
    ON public.analytics_snapshots FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_user_id ON public.analytics_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_channel_id ON public.analytics_snapshots(channel_id);

-- ==============================================================================
-- TABLE 6: competitors
-- Tracked competitor YouTube channels
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
    competitor_youtube_id TEXT NOT NULL,
    competitor_title TEXT NOT NULL,
    competitor_handle TEXT DEFAULT '',
    subscriber_count BIGINT DEFAULT 0,
    thumbnail_url TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own competitors" 
    ON public.competitors FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_competitors_user_id ON public.competitors(user_id);

-- ==============================================================================
-- TABLE 7: video_ideas
-- Brainstormed and AI-generated video concepts
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.video_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    target_audience TEXT DEFAULT '',
    estimated_potential TEXT DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Viral'
    status TEXT DEFAULT 'backlog', -- 'backlog', 'in_progress', 'scripted', 'filmed', 'published'
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.video_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own video ideas" 
    ON public.video_ideas FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_video_ideas_user_id ON public.video_ideas(user_id);

-- ==============================================================================
-- TABLE 8: scripts
-- Full scripts drafted for planned videos
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_idea_id UUID REFERENCES public.video_ideas(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    hook TEXT DEFAULT '',
    intro TEXT DEFAULT '',
    body TEXT DEFAULT '',
    call_to_action TEXT DEFAULT '',
    target_duration_mins INT DEFAULT 10,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scripts" 
    ON public.scripts FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON public.scripts(user_id);

-- ==============================================================================
-- TABLE 9: seo_packages
-- Optimized titles, descriptions, and tag bundles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.seo_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
    video_idea_id UUID REFERENCES public.video_ideas(id) ON DELETE SET NULL,
    primary_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    title_options JSONB DEFAULT '[]'::JSONB,
    description_draft TEXT DEFAULT '',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    seo_score INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.seo_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own seo packages" 
    ON public.seo_packages FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_seo_packages_user_id ON public.seo_packages(user_id);

-- ==============================================================================
-- TABLE 10: thumbnails
-- Generated and uploaded thumbnail variations
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.thumbnails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_idea_id UUID REFERENCES public.video_ideas(id) ON DELETE SET NULL,
    prompt TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    status TEXT DEFAULT 'draft', -- 'draft', 'testing', 'selected', 'archived'
    ab_test_active BOOLEAN DEFAULT false,
    ctr_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.thumbnails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own thumbnails" 
    ON public.thumbnails FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_thumbnails_user_id ON public.thumbnails(user_id);

-- ==============================================================================
-- TABLE 11: content_calendar
-- Publishing schedule for creators
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.content_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
    video_idea_id UUID REFERENCES public.video_ideas(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME DEFAULT '18:00:00',
    content_type TEXT DEFAULT 'Long-form', -- 'Long-form', 'Shorts', 'Community Post', 'Livestream'
    status TEXT DEFAULT 'scheduled', -- 'planned', 'scheduled', 'published', 'missed'
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own calendar" 
    ON public.content_calendar FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON public.content_calendar(user_id);

-- ==============================================================================
-- TABLE 12: audit_reports
-- AI-driven channel diagnostics and audit scores
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
    overall_score INT DEFAULT 0,
    seo_score INT DEFAULT 0,
    consistency_score INT DEFAULT 0,
    packaging_score INT DEFAULT 0,
    strengths JSONB DEFAULT '[]'::JSONB,
    weaknesses JSONB DEFAULT '[]'::JSONB,
    action_items JSONB DEFAULT '[]'::JSONB,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own audit reports" 
    ON public.audit_reports FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_audit_reports_user_id ON public.audit_reports(user_id);

-- ==============================================================================
-- TABLE 13: experiments
-- Title, thumbnail, and hook A/B experiments
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
    experiment_type TEXT NOT NULL, -- 'thumbnail', 'title', 'intro_hook'
    hypothesis TEXT DEFAULT '',
    variant_a JSONB NOT NULL,
    variant_b JSONB NOT NULL,
    winner TEXT DEFAULT NULL, -- 'variant_a', 'variant_b', 'inconclusive'
    status TEXT DEFAULT 'running', -- 'draft', 'running', 'concluded'
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own experiments" 
    ON public.experiments FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_experiments_user_id ON public.experiments(user_id);

-- ==============================================================================
-- TABLE 14: ai_conversations
-- Creator chat sessions with Creator AI Assistant
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    assistant_role TEXT DEFAULT 'growth_strategist',
    messages JSONB DEFAULT '[]'::JSONB,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ai conversations" 
    ON public.ai_conversations FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);

-- ==============================================================================
-- TABLE 15: ai_usage
-- Token consumption and cost accounting per creator
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL, -- 'script_writer', 'seo_studio', 'idea_generator', 'assistant'
    tokens_input INT DEFAULT 0,
    tokens_output INT DEFAULT 0,
    cost_estimate NUMERIC(8,4) DEFAULT 0.0000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai usage" 
    ON public.ai_usage FOR ALL 
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON public.ai_usage(user_id);

-- ==============================================================================
-- TRIGGERS: Automatic Profile & User Settings Provisioning on Auth Signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Automatic updated_at triggers
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND column_name = 'updated_at'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_update_timestamp ON public.%I;', tbl);
        EXECUTE format('CREATE TRIGGER trg_update_timestamp BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', tbl);
    END LOOP;
END;
$$;
