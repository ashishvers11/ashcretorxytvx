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
      };
    };
  };
}
