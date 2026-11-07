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
          tier: "Free" | "Pro" | "Enterprise";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          tier?: "Free" | "Pro" | "Enterprise";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          tier?: "Free" | "Pro" | "Enterprise";
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
          subscriber_count: number;
          view_count: number;
          video_count: number;
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
          subscriber_count?: number;
          view_count?: number;
          video_count?: number;
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
          subscriber_count?: number;
          view_count?: number;
          video_count?: number;
          encrypted_refresh_token?: string | null;
          token_iv?: string | null;
          token_auth_tag?: string | null;
          scopes?: string[] | null;
          connected_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      channels: {
        Row: {
          id: string;
          user_id: string;
          channel_id: string;
          title: string;
          custom_url: string | null;
          thumbnail_url: string | null;
          subscriber_count: number;
          view_count: number;
          video_count: number;
          niche: string | null;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          channel_id: string;
          title: string;
          custom_url?: string | null;
          thumbnail_url?: string | null;
          subscriber_count?: number;
          view_count?: number;
          video_count?: number;
          niche?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          channel_id?: string;
          title?: string;
          custom_url?: string | null;
          thumbnail_url?: string | null;
          subscriber_count?: number;
          view_count?: number;
          video_count?: number;
          niche?: string | null;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
