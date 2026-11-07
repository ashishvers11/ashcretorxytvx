-- ==============================================================================
-- ASH CREATOR STUDIO — Core Modules Database Migration
-- Step 5 & Beyond: Channel Audits, Scripts, Video Production, SEO & Thumbnails
-- ==============================================================================

-- 1. Table: public.channel_audits
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

create policy "Users can view own channel audits"
  on public.channel_audits for select
  using (auth.uid() = user_id);

create policy "Users can insert own channel audits"
  on public.channel_audits for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own channel audits"
  on public.channel_audits for delete
  using (auth.uid() = user_id);

create index if not exists idx_channel_audits_user_id on public.channel_audits(user_id);
create index if not exists idx_channel_audits_created_at on public.channel_audits(created_at desc);

-- 2. Table: public.creator_scripts
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

create policy "Users can view own creator scripts"
  on public.creator_scripts for select
  using (auth.uid() = user_id);

create policy "Users can insert own creator scripts"
  on public.creator_scripts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own creator scripts"
  on public.creator_scripts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own creator scripts"
  on public.creator_scripts for delete
  using (auth.uid() = user_id);

create index if not exists idx_creator_scripts_user_id on public.creator_scripts(user_id);
create index if not exists idx_creator_scripts_created_at on public.creator_scripts(created_at desc);

-- 3. Table: public.production_projects
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

create policy "Users can view own production projects"
  on public.production_projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own production projects"
  on public.production_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own production projects"
  on public.production_projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own production projects"
  on public.production_projects for delete
  using (auth.uid() = user_id);

create index if not exists idx_production_projects_user_id on public.production_projects(user_id);

-- 4. Table: public.seo_projects
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

create policy "Users can view own seo projects"
  on public.seo_projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own seo projects"
  on public.seo_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own seo projects"
  on public.seo_projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own seo projects"
  on public.seo_projects for delete
  using (auth.uid() = user_id);

create index if not exists idx_seo_projects_user_id on public.seo_projects(user_id);

-- 5. Table: public.thumbnail_projects
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

create policy "Users can view own thumbnail projects"
  on public.thumbnail_projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own thumbnail projects"
  on public.thumbnail_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own thumbnail projects"
  on public.thumbnail_projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own thumbnail projects"
  on public.thumbnail_projects for delete
  using (auth.uid() = user_id);

create index if not exists idx_thumbnail_projects_user_id on public.thumbnail_projects(user_id);

-- 6. Table: public.recent_activities
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

create policy "Users can view own activities"
  on public.recent_activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.recent_activities for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own activities"
  on public.recent_activities for delete
  using (auth.uid() = user_id);

create index if not exists idx_recent_activities_user_id on public.recent_activities(user_id);
create index if not exists idx_recent_activities_created_at on public.recent_activities(created_at desc);
