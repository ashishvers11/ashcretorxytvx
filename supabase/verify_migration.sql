-- ==============================================================================
-- ASH CREATOR STUDIO — POST-MIGRATION CLOUD VERIFICATION SCRIPT
-- Run this in Supabase Dashboard -> SQL Editor after executing all_migrations.sql
-- ==============================================================================

-- 1. Verify that all 10 tables exist in public schema
select 
  table_name,
  (select count(*) from information_schema.columns where table_schema = 'public' and table_name = t.table_name) as column_count,
  case 
    when table_name in (
      'profiles', 'youtube_connections', 'channel_audits', 'creator_scripts',
      'production_projects', 'seo_projects', 'thumbnail_projects',
      'recent_activities', 'youtube_api_quotas', 'youtube_research_cache'
    ) then 'VERIFIED'
    else 'EXTRA'
  end as status
from information_schema.tables t
where table_schema = 'public' and table_type = 'BASE TABLE'
order by table_name;

-- 2. Verify that Row Level Security (RLS) is enabled on all tables
select 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
order by tablename;

-- 3. Verify that RLS policies are created
select 
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4. Verify triggers and functions
select 
  routine_name,
  routine_type,
  security_type
from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('handle_new_user', 'increment_youtube_quota');

-- 5. Verify that public.youtube_connections_public view exists and omits token secrets
select 
  table_name,
  view_definition
from information_schema.views
where table_schema = 'public'
  and table_name = 'youtube_connections_public';

-- 6. Verify profile backfill count
select 
  (select count(*) from auth.users) as auth_users_count,
  (select count(*) from public.profiles) as profiles_count,
  case 
    when (select count(*) from auth.users) = (select count(*) from public.profiles) 
    then '100% IN SYNC' 
    else 'PROFILES PENDING BACKFILL' 
  end as profile_sync_status;
