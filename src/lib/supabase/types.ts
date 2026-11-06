export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CreatorType =
  | 'Solo Creator'
  | 'Agency / Team'
  | 'Brand Creator'
  | 'Hobbyist'
  | 'Educator';

export type ChannelNiche =
  | 'Tech & Coding'
  | 'Gaming'
  | 'Finance & Business'
  | 'Education & Science'
  | 'Lifestyle & Vlogs'
  | 'Entertainment'
  | 'Health & Fitness'
  | 'Music & Art'
  | 'News & Politics'
  | 'Other';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          creator_type: CreatorType | string;
          channel_niche: ChannelNiche | string;
          preferred_language: string;
          time_zone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          creator_type?: CreatorType | string;
          channel_niche?: ChannelNiche | string;
          preferred_language?: string;
          time_zone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          creator_type?: CreatorType | string;
          channel_niche?: ChannelNiche | string;
          preferred_language?: string;
          time_zone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark' | 'system';
          email_notifications: boolean;
          weekly_digest: boolean;
          marketing_updates: boolean;
          ai_budget_limit: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: 'light' | 'dark' | 'system';
          email_notifications?: boolean;
          weekly_digest?: boolean;
          marketing_updates?: boolean;
          ai_budget_limit?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: 'light' | 'dark' | 'system';
          email_notifications?: boolean;
          weekly_digest?: boolean;
          marketing_updates?: boolean;
          ai_budget_limit?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      channels: {
        Row: {
          id: string;
          user_id: string;
          youtube_channel_id: string;
          channel_title: string;
          custom_url: string | null;
          description: string | null;
          thumbnail_url: string | null;
          subscriber_count: number;
          video_count: number;
          view_count: number;
          is_primary: boolean;
          is_connected: boolean;
          connected_at: string | null;
          uploads_playlist_id: string | null;
          published_at: string | null;
          is_oauth_authorized: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          youtube_channel_id: string;
          channel_title: string;
          custom_url?: string | null;
          description?: string | null;
          thumbnail_url?: string | null;
          subscriber_count?: number;
          video_count?: number;
          view_count?: number;
          is_primary?: boolean;
          is_connected?: boolean;
          connected_at?: string | null;
          uploads_playlist_id?: string | null;
          published_at?: string | null;
          is_oauth_authorized?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          youtube_channel_id?: string;
          channel_title?: string;
          custom_url?: string | null;
          description?: string | null;
          thumbnail_url?: string | null;
          subscriber_count?: number;
          video_count?: number;
          view_count?: number;
          is_primary?: boolean;
          is_connected?: boolean;
          connected_at?: string | null;
          uploads_playlist_id?: string | null;
          published_at?: string | null;
          is_oauth_authorized?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string;
          youtube_video_id: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          published_at: string | null;
          duration_seconds: number;
          view_count: number;
          like_count: number;
          comment_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id: string;
          youtube_video_id: string;
          title: string;
          description?: string | null;
          thumbnail_url?: string | null;
          published_at?: string | null;
          duration_seconds?: number;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string;
          youtube_video_id?: string;
          title?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          published_at?: string | null;
          duration_seconds?: number;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics_snapshots: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string;
          snapshot_date: string;
          views: number;
          watch_time_hours: number;
          estimated_minutes_watched: number;
          average_view_duration_seconds: number;
          subscribers_gained: number;
          subscribers_lost: number;
          likes: number;
          comments: number;
          shares: number;
          estimated_revenue: number;
          impressions_ctr: number;
          is_authorized: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id: string;
          snapshot_date: string;
          views?: number;
          watch_time_hours?: number;
          estimated_minutes_watched?: number;
          average_view_duration_seconds?: number;
          subscribers_gained?: number;
          subscribers_lost?: number;
          likes?: number;
          comments?: number;
          shares?: number;
          estimated_revenue?: number;
          impressions_ctr?: number;
          is_authorized?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string;
          snapshot_date?: string;
          views?: number;
          watch_time_hours?: number;
          estimated_minutes_watched?: number;
          average_view_duration_seconds?: number;
          subscribers_gained?: number;
          subscribers_lost?: number;
          likes?: number;
          comments?: number;
          shares?: number;
          estimated_revenue?: number;
          impressions_ctr?: number;
          is_authorized?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      youtube_connections: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string | null;
          google_account_id: string | null;
          google_email: string | null;
          access_token: string;
          refresh_token: string | null;
          token_expires_at: string;
          scope: string;
          token_type: string;
          is_active: boolean;
          last_sync_at: string | null;
          last_sync_status: 'idle' | 'syncing' | 'completed' | 'error';
          last_sync_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id?: string | null;
          google_account_id?: string | null;
          google_email?: string | null;
          access_token: string;
          refresh_token?: string | null;
          token_expires_at: string;
          scope: string;
          token_type?: string;
          is_active?: boolean;
          last_sync_at?: string | null;
          last_sync_status?: 'idle' | 'syncing' | 'completed' | 'error';
          last_sync_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string | null;
          google_account_id?: string | null;
          google_email?: string | null;
          access_token?: string;
          refresh_token?: string | null;
          token_expires_at?: string;
          scope?: string;
          token_type?: string;
          is_active?: boolean;
          last_sync_at?: string | null;
          last_sync_status?: 'idle' | 'syncing' | 'completed' | 'error';
          last_sync_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      competitors: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string | null;
          competitor_youtube_id: string;
          competitor_title: string;
          competitor_handle: string | null;
          subscriber_count: number;
          thumbnail_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id?: string | null;
          competitor_youtube_id: string;
          competitor_title: string;
          competitor_handle?: string | null;
          subscriber_count?: number;
          thumbnail_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string | null;
          competitor_youtube_id?: string;
          competitor_title?: string;
          competitor_handle?: string | null;
          subscriber_count?: number;
          thumbnail_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      video_ideas: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string | null;
          title: string;
          description: string | null;
          target_audience: string | null;
          estimated_potential: string;
          status: 'backlog' | 'in_progress' | 'scripted' | 'filmed' | 'published';
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id?: string | null;
          title: string;
          description?: string | null;
          target_audience?: string | null;
          estimated_potential?: string;
          status?: 'backlog' | 'in_progress' | 'scripted' | 'filmed' | 'published';
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string | null;
          title?: string;
          description?: string | null;
          target_audience?: string | null;
          estimated_potential?: string;
          status?: 'backlog' | 'in_progress' | 'scripted' | 'filmed' | 'published';
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      scripts: {
        Row: {
          id: string;
          user_id: string;
          video_idea_id: string | null;
          title: string;
          hook: string | null;
          intro: string | null;
          body: string | null;
          call_to_action: string | null;
          target_duration_mins: number;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_idea_id?: string | null;
          title: string;
          hook?: string | null;
          intro?: string | null;
          body?: string | null;
          call_to_action?: string | null;
          target_duration_mins?: number;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          video_idea_id?: string | null;
          title?: string;
          hook?: string | null;
          intro?: string | null;
          body?: string | null;
          call_to_action?: string | null;
          target_duration_mins?: number;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      seo_packages: {
        Row: {
          id: string;
          user_id: string;
          video_id: string | null;
          video_idea_id: string | null;
          primary_keywords: string[];
          title_options: Json;
          description_draft: string | null;
          tags: string[];
          seo_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id?: string | null;
          video_idea_id?: string | null;
          primary_keywords?: string[];
          title_options?: Json;
          description_draft?: string | null;
          tags?: string[];
          seo_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          video_id?: string | null;
          video_idea_id?: string | null;
          primary_keywords?: string[];
          title_options?: Json;
          description_draft?: string | null;
          tags?: string[];
          seo_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      thumbnails: {
        Row: {
          id: string;
          user_id: string;
          video_idea_id: string | null;
          prompt: string | null;
          image_url: string;
          status: 'draft' | 'testing' | 'selected' | 'archived';
          ab_test_active: boolean;
          ctr_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_idea_id?: string | null;
          prompt?: string | null;
          image_url: string;
          status?: 'draft' | 'testing' | 'selected' | 'archived';
          ab_test_active?: boolean;
          ctr_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          video_idea_id?: string | null;
          prompt?: string | null;
          image_url?: string;
          status?: 'draft' | 'testing' | 'selected' | 'archived';
          ab_test_active?: boolean;
          ctr_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_calendar: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string | null;
          video_idea_id: string | null;
          scheduled_date: string;
          scheduled_time: string | null;
          content_type: 'Long-form' | 'Shorts' | 'Community Post' | 'Livestream';
          status: 'planned' | 'scheduled' | 'published' | 'missed';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id?: string | null;
          video_idea_id?: string | null;
          scheduled_date: string;
          scheduled_time?: string | null;
          content_type?: 'Long-form' | 'Shorts' | 'Community Post' | 'Livestream';
          status?: 'planned' | 'scheduled' | 'published' | 'missed';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string | null;
          video_idea_id?: string | null;
          scheduled_date?: string;
          scheduled_time?: string | null;
          content_type?: 'Long-form' | 'Shorts' | 'Community Post' | 'Livestream';
          status?: 'planned' | 'scheduled' | 'published' | 'missed';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_reports: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string;
          overall_score: number;
          seo_score: number;
          consistency_score: number;
          packaging_score: number;
          strengths: Json;
          weaknesses: Json;
          action_items: Json;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id: string;
          overall_score?: number;
          seo_score?: number;
          consistency_score?: number;
          packaging_score?: number;
          strengths?: Json;
          weaknesses?: Json;
          action_items?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string;
          overall_score?: number;
          seo_score?: number;
          consistency_score?: number;
          packaging_score?: number;
          strengths?: Json;
          weaknesses?: Json;
          action_items?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      experiments: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string;
          video_id: string | null;
          experiment_type: 'thumbnail' | 'title' | 'intro_hook';
          hypothesis: string | null;
          variant_a: Json;
          variant_b: Json;
          winner: string | null;
          status: 'draft' | 'running' | 'concluded';
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id: string;
          video_id?: string | null;
          experiment_type: 'thumbnail' | 'title' | 'intro_hook';
          hypothesis?: string | null;
          variant_a: Json;
          variant_b: Json;
          winner?: string | null;
          status?: 'draft' | 'running' | 'concluded';
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string;
          video_id?: string | null;
          experiment_type?: 'thumbnail' | 'title' | 'intro_hook';
          hypothesis?: string | null;
          variant_a?: Json;
          variant_b?: Json;
          winner?: string | null;
          status?: 'draft' | 'running' | 'concluded';
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          assistant_role: string;
          messages: Json;
          tokens_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          assistant_role?: string;
          messages?: Json;
          tokens_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          assistant_role?: string;
          messages?: Json;
          tokens_used?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_usage: {
        Row: {
          id: string;
          user_id: string;
          feature_name: string;
          tokens_input: number;
          tokens_output: number;
          cost_estimate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          feature_name: string;
          tokens_input?: number;
          tokens_output?: number;
          cost_estimate?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          feature_name?: string;
          tokens_input?: number;
          tokens_output?: number;
          cost_estimate?: number;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type Channel = Database['public']['Tables']['channels']['Row'];
export type Video = Database['public']['Tables']['videos']['Row'];
export type AnalyticsSnapshot = Database['public']['Tables']['analytics_snapshots']['Row'];
export type VideoIdea = Database['public']['Tables']['video_ideas']['Row'];
export type Script = Database['public']['Tables']['scripts']['Row'];
export type SeoPackage = Database['public']['Tables']['seo_packages']['Row'];
export type Thumbnail = Database['public']['Tables']['thumbnails']['Row'];
export type CalendarItem = Database['public']['Tables']['content_calendar']['Row'];
export type AuditReport = Database['public']['Tables']['audit_reports']['Row'];
export type Experiment = Database['public']['Tables']['experiments']['Row'];
export type AIConversation = Database['public']['Tables']['ai_conversations']['Row'];
export type AIUsage = Database['public']['Tables']['ai_usage']['Row'];
export type YouTubeConnection = Database['public']['Tables']['youtube_connections']['Row'];
