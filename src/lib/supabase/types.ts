export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          tier: "Free" | "Pro" | "Enterprise" | null;
          preferences: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          tier?: "Free" | "Pro" | "Enterprise" | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          tier?: "Free" | "Pro" | "Enterprise" | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      youtube_connections: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string;
          title: string;
          description: string | null;
          custom_url: string | null;
          thumbnail_url: string | null;
          subscriber_count: number | null;
          view_count: number | null;
          video_count: number | null;
          uploads_playlist_id: string | null;
          recent_videos: any[] | null;
          analytics_summary: Record<string, any> | null;
          encrypted_refresh_token: string | null;
          token_iv: string | null;
          token_auth_tag: string | null;
          scopes: string[] | null;
          connected_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id: string;
          title: string;
          description?: string | null;
          custom_url?: string | null;
          thumbnail_url?: string | null;
          subscriber_count?: number | null;
          view_count?: number | null;
          video_count?: number | null;
          uploads_playlist_id?: string | null;
          recent_videos?: any[] | null;
          analytics_summary?: Record<string, any> | null;
          encrypted_refresh_token?: string | null;
          token_iv?: string | null;
          token_auth_tag?: string | null;
          scopes?: string[] | null;
          connected_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string;
          title?: string;
          description?: string | null;
          custom_url?: string | null;
          thumbnail_url?: string | null;
          subscriber_count?: number | null;
          view_count?: number | null;
          video_count?: number | null;
          uploads_playlist_id?: string | null;
          recent_videos?: any[] | null;
          analytics_summary?: Record<string, any> | null;
          encrypted_refresh_token?: string | null;
          token_iv?: string | null;
          token_auth_tag?: string | null;
          scopes?: string[] | null;
          connected_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      channel_audits: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string;
          channel_title: string;
          audit_score: number;
          overall_grade: string;
          performance_summary: Json;
          top_videos: Json;
          underperforming_videos: Json;
          content_gaps: Json;
          recommendations: Json;
          date_range: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id: string;
          channel_title: string;
          audit_score?: number;
          overall_grade?: string;
          performance_summary?: Json;
          top_videos?: Json;
          underperforming_videos?: Json;
          content_gaps?: Json;
          recommendations?: Json;
          date_range?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string;
          channel_title?: string;
          audit_score?: number;
          overall_grade?: string;
          performance_summary?: Json;
          top_videos?: Json;
          underperforming_videos?: Json;
          content_gaps?: Json;
          recommendations?: Json;
          date_range?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      creator_scripts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          topic: string;
          video_format: string;
          target_duration: number;
          target_audience: string;
          language: string;
          hook: string;
          body_story: string;
          payoff: string;
          cta: string;
          full_voiceover: string;
          estimated_word_count: number;
          on_screen_text: Json;
          scenes: Json;
          fact_sources: Json;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          topic: string;
          video_format?: string;
          target_duration?: number;
          target_audience?: string;
          language?: string;
          hook: string;
          body_story: string;
          payoff: string;
          cta: string;
          full_voiceover: string;
          estimated_word_count?: number;
          on_screen_text?: Json;
          scenes?: Json;
          fact_sources?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          topic?: string;
          video_format?: string;
          target_duration?: number;
          target_audience?: string;
          language?: string;
          hook?: string;
          body_story?: string;
          payoff?: string;
          cta?: string;
          full_voiceover?: string;
          estimated_word_count?: number;
          on_screen_text?: Json;
          scenes?: Json;
          fact_sources?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      production_projects: {
        Row: {
          id: string;
          user_id: string;
          script_id: string | null;
          title: string;
          video_format: string;
          aspect_ratio: string;
          visual_style: string;
          scenes: Json;
          checklist: Json;
          bgm_suggestions: Json;
          sfx_suggestions: Json;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          script_id?: string | null;
          title: string;
          video_format?: string;
          aspect_ratio?: string;
          visual_style?: string;
          scenes?: Json;
          checklist?: Json;
          bgm_suggestions?: Json;
          sfx_suggestions?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          script_id?: string | null;
          title?: string;
          video_format?: string;
          aspect_ratio?: string;
          visual_style?: string;
          scenes?: Json;
          checklist?: Json;
          bgm_suggestions?: Json;
          sfx_suggestions?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      seo_projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          topic: string;
          video_format: string;
          generated_titles: Json;
          description: string;
          tags: string[];
          hashtags: string[];
          search_intent: string | null;
          quality_analysis: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          topic: string;
          video_format?: string;
          generated_titles?: Json;
          description: string;
          tags?: string[];
          hashtags?: string[];
          search_intent?: string | null;
          quality_analysis?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          topic?: string;
          video_format?: string;
          generated_titles?: Json;
          description?: string;
          tags?: string[];
          hashtags?: string[];
          search_intent?: string | null;
          quality_analysis?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      thumbnail_projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          topic: string;
          video_format: string;
          aspect_ratio: string;
          concepts: Json;
          color_guidance: Json;
          composition_guidance: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          topic: string;
          video_format?: string;
          aspect_ratio?: string;
          concepts?: Json;
          color_guidance?: Json;
          composition_guidance?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          topic?: string;
          video_format?: string;
          aspect_ratio?: string;
          concepts?: Json;
          color_guidance?: Json;
          composition_guidance?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recent_activities: {
        Row: {
          id: string;
          user_id: string;
          module: string;
          action: string;
          title: string;
          link: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module: string;
          action: string;
          title: string;
          link?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module?: string;
          action?: string;
          title?: string;
          link?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
