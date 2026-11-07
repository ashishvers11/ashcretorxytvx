-- ==============================================================================
-- ASH CREATOR STUDIO — YouTube Channel Connections Migration
-- Step 4: Secure YouTube OAuth 2.0 Connection with AES-256-GCM Token Storage & RLS
-- ==============================================================================

-- 1. Create public.youtube_connections table
create table if not exists public.youtube_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  channel_id text not null,
  title text not null,
  description text,
  custom_url text,
  thumbnail_url text,
  subscriber_count bigint default 0,
  view_count bigint default 0,
  video_count integer default 0,
  encrypted_refresh_token text,
  token_iv text,
  token_auth_tag text,
  scopes text[],
  connected_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint youtube_connections_user_id_channel_id_key unique (user_id, channel_id)
);

-- 2. Enable Row Level Security (RLS)
alter table public.youtube_connections enable row level security;

-- 3. RLS Policy: Users can only view their own connection records
create policy "Users can view own youtube connection"
  on public.youtube_connections
  for select
  using (auth.uid() = user_id);

-- 4. RLS Policy: Users can insert their own connection records
create policy "Users can insert own youtube connection"
  on public.youtube_connections
  for insert
  with check (auth.uid() = user_id);

-- 5. RLS Policy: Users can update their own connection records
create policy "Users can update own youtube connection"
  on public.youtube_connections
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. RLS Policy: Users can delete (disconnect) their own connection
create policy "Users can delete own youtube connection"
  on public.youtube_connections
  for delete
  using (auth.uid() = user_id);
