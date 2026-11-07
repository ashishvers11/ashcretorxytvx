-- ==============================================================================
-- ASH CREATOR STUDIO — MASTER DATABASE MIGRATION SCRIPT (V2)
-- Idempotent, includes table creations, constraints, RLS, grants, and schema reload.
-- Copy and run this ENTIRE script in Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Ensure schema usage
grant usage on schema public to anon, authenticated;

-- ==============================================================================
-- PART 1: User Profiles & Automated Provisioning Trigger
-- ==============================================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  tier text default 'Free' check (tier in ('Free', 'Pro', 'Enterprise')),
  preferences jsonb default '{"language": "en", "timezone": "UTC", "default_video_format": "shorts"}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Safe backfill for existing auth.users who signed up before this trigger was created
insert into public.profiles (id, email, full_name, avatar_url)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;

-- ==============================================================================
-- PART 2: YouTube Channel Connections (AES-256-GCM Secure Storage)
-- ==============================================================================
create table if not exists public.youtube_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  channel_id text not null,
  title text not null,
  description text,
  custom_url text,
  thumbnail_url text,
  subscriber_count bigint,
  view_count bigint,
  video_count integer,
  uploads_playlist_id text,
  recent_videos jsonb default '[]'::jsonb,
  analytics_summary jsonb default '{}'::jsonb,
  encrypted_refresh_token text,
  token_iv text,
  token_auth_tag text,
  scopes text[],
  connected_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint youtube_connections_user_id_channel_id_key unique (user_id, channel_id)
);

alter table public.youtube_connections enable row level security;

drop policy if exists "Users can view own youtube connection" on public.youtube_connections;
create policy "Users can view own youtube connection"
  on public.youtube_connections for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own youtube connection" on public.youtube_connections;
create policy "Users can insert own youtube connection"
  on public.youtube_connections for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own youtube connection" on public.youtube_connections;
create policy "Users can update own youtube connection"
  on public.youtube_connections for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own youtube connection" on public.youtube_connections;
create policy "Users can delete own youtube connection"
  on public.youtube_connections for delete
  using (auth.uid() = user_id);

create index if not exists idx_youtube_connections_user_id on public.youtube_connections(user_id);

-- Secure public view: omits encrypted_refresh_token, token_iv, and token_auth_tag
create or replace view public.youtube_connections_public as
select 
  id,
  user_id,
  channel_id,
  title,
  description,
  custom_url,
  thumbnail_url,
  subscriber_count,
  view_count,
  video_count,
  uploads_playlist_id,
  recent_videos,
  analytics_summary,
  scopes,
  connected_at,
  updated_at
from public.youtube_connections;

-- ==============================================================================
-- PART 3: Channel Audits & Intelligence
-- ==============================================================================
create table if not exists public.channel_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  channel_id text not null,
  channel_title text not null,
  audit_score integer not null default 75,
  overall_grade text not null default 'B+',
  performance_summary jsonb not null default '{}'::jsonb,
  top_videos jsonb not null default '[]'::jsonb,
  underperforming_videos jsonb not null default '[]'::jsonb,
  content_gaps jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  date_range text not null default '30d',
  created_at timestamptz default now() not null
);

alter table public.channel_audits enable row level security;

drop policy if exists "Users can view own channel audits" on public.channel_audits;
create policy "Users can view own channel audits"
  on public.channel_audits for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own channel audits" on public.channel_audits;
create policy "Users can insert own channel audits"
  on public.channel_audits for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own channel audits" on public.channel_audits;
create policy "Users can delete own channel audits"
  on public.channel_audits for delete
  using (auth.uid() = user_id);

create index if not exists idx_channel_audits_user_id on public.channel_audits(user_id);

-- ==============================================================================
-- PART 4: Creator Scripts Studio
-- ==============================================================================
create table if not exists public.creator_scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  topic text not null,
  video_format text not null default 'shorts',
  target_duration integer not null default 60,
  target_audience text not null default 'general',
  language text not null default 'en',
  hook text not null,
  body_story text not null,
  payoff text not null,
  cta text not null,
  full_voiceover text not null,
  estimated_word_count integer not null default 130,
  on_screen_text jsonb not null default '[]'::jsonb,
  scenes jsonb not null default '[]'::jsonb,
  fact_sources jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.creator_scripts enable row level security;

drop policy if exists "Users can view own creator scripts" on public.creator_scripts;
create policy "Users can view own creator scripts"
  on public.creator_scripts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own creator scripts" on public.creator_scripts;
create policy "Users can insert own creator scripts"
  on public.creator_scripts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own creator scripts" on public.creator_scripts;
create policy "Users can update own creator scripts"
  on public.creator_scripts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own creator scripts" on public.creator_scripts;
create policy "Users can delete own creator scripts"
  on public.creator_scripts for delete
  using (auth.uid() = user_id);

create index if not exists idx_creator_scripts_user_id on public.creator_scripts(user_id);

-- ==============================================================================
-- PART 5: Video Production Workspace
-- ==============================================================================
create table if not exists public.production_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  script_id uuid references public.creator_scripts(id) on delete set null,
  title text not null,
  video_format text not null default 'shorts',
  aspect_ratio text not null default '9:16',
  visual_style text not null default 'Cinematic Documentary',
  scenes jsonb not null default '[]'::jsonb,
  checklist jsonb not null default '[]'::jsonb,
  bgm_suggestions jsonb not null default '[]'::jsonb,
  sfx_suggestions jsonb not null default '[]'::jsonb,
  status text not null default 'in_production',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.production_projects enable row level security;

drop policy if exists "Users can view own production projects" on public.production_projects;
create policy "Users can view own production projects"
  on public.production_projects for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own production projects" on public.production_projects;
create policy "Users can insert own production projects"
  on public.production_projects for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own production projects" on public.production_projects;
create policy "Users can update own production projects"
  on public.production_projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own production projects" on public.production_projects;
create policy "Users can delete own production projects"
  on public.production_projects for delete
  using (auth.uid() = user_id);

create index if not exists idx_production_projects_user_id on public.production_projects(user_id);

-- ==============================================================================
-- PART 6: SEO Studio Projects
-- ==============================================================================
create table if not exists public.seo_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  topic text not null,
  video_format text not null default 'shorts',
  generated_titles jsonb not null default '[]'::jsonb,
  description text not null,
  tags text[] not null default array[]::text[],
  hashtags text[] not null default array[]::text[],
  search_intent text,
  quality_analysis jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.seo_projects enable row level security;

drop policy if exists "Users can view own seo projects" on public.seo_projects;
create policy "Users can view own seo projects"
  on public.seo_projects for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own seo projects" on public.seo_projects;
create policy "Users can insert own seo projects"
  on public.seo_projects for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own seo projects" on public.seo_projects;
create policy "Users can update own seo projects"
  on public.seo_projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own seo projects" on public.seo_projects;
create policy "Users can delete own seo projects"
  on public.seo_projects for delete
  using (auth.uid() = user_id);

create index if not exists idx_seo_projects_user_id on public.seo_projects(user_id);

-- ==============================================================================
-- PART 7: Thumbnail Studio Projects
-- ==============================================================================
create table if not exists public.thumbnail_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  topic text not null,
  video_format text not null default 'shorts',
  aspect_ratio text not null default '9:16',
  concepts jsonb not null default '[]'::jsonb,
  color_guidance jsonb not null default '{}'::jsonb,
  composition_guidance jsonb not null default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.thumbnail_projects enable row level security;

drop policy if exists "Users can view own thumbnail projects" on public.thumbnail_projects;
create policy "Users can view own thumbnail projects"
  on public.thumbnail_projects for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own thumbnail projects" on public.thumbnail_projects;
create policy "Users can insert own thumbnail projects"
  on public.thumbnail_projects for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own thumbnail projects" on public.thumbnail_projects;
create policy "Users can update own thumbnail projects"
  on public.thumbnail_projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own thumbnail projects" on public.thumbnail_projects;
create policy "Users can delete own thumbnail projects"
  on public.thumbnail_projects for delete
  using (auth.uid() = user_id);

create index if not exists idx_thumbnail_projects_user_id on public.thumbnail_projects(user_id);

-- ==============================================================================
-- PART 8: Activity Tracker
-- ==============================================================================
create table if not exists public.recent_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  module text not null,
  action text not null,
  title text not null,
  link text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

alter table public.recent_activities enable row level security;

drop policy if exists "Users can view own activities" on public.recent_activities;
create policy "Users can view own activities"
  on public.recent_activities for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own activities" on public.recent_activities;
create policy "Users can insert own activities"
  on public.recent_activities for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own activities" on public.recent_activities;
create policy "Users can delete own activities"
  on public.recent_activities for delete
  using (auth.uid() = user_id);

create index if not exists idx_recent_activities_user_id on public.recent_activities(user_id);
create index if not exists idx_recent_activities_created_at on public.recent_activities(created_at desc);

-- ==============================================================================
-- PART 9: YouTube API Persistent Quota & Research Cache
-- ==============================================================================
create table if not exists public.youtube_api_quotas (
  day_pt text primary key, -- e.g. '2026-11-07' in America/Los_Angeles
  search_requests_count integer not null default 0,
  shared_units_count integer not null default 0,
  updated_at timestamptz default now() not null
);

alter table public.youtube_api_quotas enable row level security;
drop policy if exists "Authenticated users can read quotas" on public.youtube_api_quotas;
create policy "Authenticated users can read quotas" on public.youtube_api_quotas for select using (true);
drop policy if exists "Authenticated users can upsert quotas" on public.youtube_api_quotas;
create policy "Authenticated users can upsert quotas" on public.youtube_api_quotas for all using (true);

create table if not exists public.youtube_research_cache (
  cache_key text primary key,
  data jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz default now() not null
);

alter table public.youtube_research_cache enable row level security;
drop policy if exists "Authenticated users can read research cache" on public.youtube_research_cache;
create policy "Authenticated users can read research cache" on public.youtube_research_cache for select using (true);
drop policy if exists "Authenticated users can upsert research cache" on public.youtube_research_cache;
create policy "Authenticated users can upsert research cache" on public.youtube_research_cache for all using (true);

-- Atomic quota increment function
create or replace function public.increment_youtube_quota(
  target_day_pt text,
  search_inc integer,
  shared_inc integer
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.youtube_api_quotas (day_pt, search_requests_count, shared_units_count, updated_at)
  values (target_day_pt, greatest(0, search_inc), greatest(0, shared_inc), now())
  on conflict (day_pt) do update set
    search_requests_count = public.youtube_api_quotas.search_requests_count + greatest(0, search_inc),
    shared_units_count = public.youtube_api_quotas.shared_units_count + greatest(0, shared_inc),
    updated_at = now();
end;
$$;

-- ==============================================================================
-- PART 10: Explicit Permissions & Schema Cache Reload
-- ==============================================================================
grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;
grant select on public.profiles to anon;

-- Force PostgREST to reload its schema cache immediately
notify pgrst, 'reload schema';
