-- ==============================================================================
-- ASH CREATOR STUDIO — Supabase Auth & User Profiles Migration
-- Step 3: Secure User Profile Architecture with Row Level Security (RLS)
-- ==============================================================================

-- 1. Create public.profiles table referencing auth.users
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  tier text default 'Free' check (tier in ('Free', 'Pro', 'Enterprise')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. RLS Policy: Users can only read their own profile data
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- 4. RLS Policy: Users can only update their own profile data
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 5. Trigger to automatically provision profile when an auth.user is created
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
  );
  return new;
end;
$$;

-- Drop trigger if exists to prevent duplicates
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
