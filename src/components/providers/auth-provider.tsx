"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Profile, UserSettings, Channel } from "@/lib/supabase/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  settings: UserSettings | null;
  channel: Channel | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; requiresEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<{ error: string | null }>;
  connectChannel: (channelData: {
    youtube_channel_id: string;
    channel_title: string;
    custom_url?: string;
    thumbnail_url?: string;
    subscriber_count?: number;
    video_count?: number;
    view_count?: number;
    description?: string;
  }) => Promise<{ error: string | null }>;
  disconnectChannel: () => Promise<{ error: string | null }>;
  refreshState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = "ash_demo_user";
const LOCAL_STORAGE_KEY_PROFILE = "ash_demo_profile";
const LOCAL_STORAGE_KEY_SETTINGS = "ash_demo_settings";
const LOCAL_STORAGE_KEY_CHANNEL = "ash_demo_channel";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  // Helper to load Supabase data
  const loadUserData = useCallback(async (userId: string, userEmail: string) => {
    if (!isConfigured) return;

    try {
      const supabase = createClient();

      // Fetch Profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (prof) {
        setProfile(prof as Profile);
      } else {
        // Self-heal profile if missing
        const newProf: Profile = {
          id: userId,
          email: userEmail,
          full_name: "ASH Creator",
          avatar_url: "",
          creator_type: "Solo Creator",
          channel_niche: "Tech & Coding",
          preferred_language: "English",
          time_zone: "UTC",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await supabase.from("profiles").upsert(newProf as any);
        setProfile(newProf);
      }

      // Fetch Settings
      const { data: sett } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (sett) {
        setSettings(sett as UserSettings);
      }

      // Fetch Primary Channel
      const { data: chan } = await supabase
        .from("channels")
        .select("*")
        .eq("user_id", userId)
        .eq("is_primary", true)
        .single();

      if (chan) {
        setChannel(chan as Channel);
      } else {
        setChannel(null);
      }
    } catch (err) {
      console.error("Error loading Supabase user data:", err);
    }
  }, [isConfigured]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      if (isConfigured) {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            setUser(session.user);
            await loadUserData(session.user.id, session.user.email || "");
          } else {
            setUser(null);
            setProfile(null);
            setChannel(null);
          }

          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
              if (newSession?.user) {
                setUser(newSession.user);
                await loadUserData(newSession.user.id, newSession.user.email || "");
              } else {
                setUser(null);
                setProfile(null);
                setSettings(null);
                setChannel(null);
              }
            }
          );

          setIsLoading(false);
          return () => {
            authListener.subscription.unsubscribe();
          };
        } catch (e) {
          console.warn("Supabase auth initialization error, falling back:", e);
          setIsLoading(false);
        }
      } else {
        // Fallback Demo Creator Mode (Local storage backed for development before Supabase keys are plugged in)
        try {
          if (typeof window !== "undefined") {
            const defaultUserId = "demo-creator-uuid";
            const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
            const savedProfile = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
            const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
            const savedChannel = localStorage.getItem(LOCAL_STORAGE_KEY_CHANNEL);

            if (savedUser) {
              setUser(JSON.parse(savedUser));
            } else {
              // Default active demo creator for instant testing
              const defaultUser = {
                id: defaultUserId,
                email: "creator@ashstudio.io",
                app_metadata: {},
                user_metadata: { full_name: "Ashish Kumar" },
                aud: "authenticated",
                created_at: new Date().toISOString(),
              } as User;
              setUser(defaultUser);
              localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(defaultUser));
            }

            if (savedProfile) {
              setProfile(JSON.parse(savedProfile));
            } else {
              const defaultProfile: Profile = {
                id: defaultUserId,
                email: "creator@ashstudio.io",
                full_name: "Ashish Kumar",
                avatar_url: "",
                creator_type: "Educator",
                channel_niche: "Education & Science",
                preferred_language: "Hindi",
                time_zone: "Asia/Kolkata (IST)",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              setProfile(defaultProfile);
              localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(defaultProfile));
            }

            if (savedSettings) {
              setSettings(JSON.parse(savedSettings));
            } else {
              const defaultSettings: UserSettings = {
                id: "demo-settings-uuid",
                user_id: defaultUserId,
                theme: "system",
                email_notifications: true,
                weekly_digest: true,
                marketing_updates: false,
                ai_budget_limit: 25.0,
                currency: "USD",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              setSettings(defaultSettings);
              localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(defaultSettings));
            }

            if (savedChannel) {
              try {
                const parsed = JSON.parse(savedChannel);
                // Clear the legacy auto-connected mock channel so creators connect their own channel
                if (parsed?.id === "chan-ashishfn") {
                  localStorage.removeItem(LOCAL_STORAGE_KEY_CHANNEL);
                  setChannel(null);
                } else {
                  setChannel(parsed);
                }
              } catch {
                localStorage.removeItem(LOCAL_STORAGE_KEY_CHANNEL);
                setChannel(null);
              }
            } else {
              setChannel(null);
            }
          }
        } catch (err) {
          console.error("Local storage load error, resetting:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    init();
  }, [isConfigured, loadUserData]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    if (isConfigured) {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await loadUserData(data.user.id, data.user.email || "");
      }
      setIsLoading(false);
      return { error: null };
    } else {
      // Demo authentication simulation
      const mockUser: User = {
        id: "demo-creator-uuid",
        email,
        app_metadata: {},
        user_metadata: { full_name: "Alex Vance" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;

      setUser(mockUser);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(mockUser));
      setIsLoading(false);
      return { error: null };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: string | null; requiresEmailConfirmation?: boolean }> => {
    setIsLoading(true);
    if (isConfigured) {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data.user && !data.session) {
        // Confirmation email required
        setIsLoading(false);
        return { error: null, requiresEmailConfirmation: true };
      }

      if (data.user) {
        setUser(data.user);
        await loadUserData(data.user.id, data.user.email || "");
      }
      setIsLoading(false);
      return { error: null, requiresEmailConfirmation: false };
    } else {
      const mockUser: User = {
        id: "demo-" + Date.now(),
        email,
        app_metadata: {},
        user_metadata: { full_name: fullName },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;

      const newProfile: Profile = {
        id: mockUser.id,
        email,
        full_name: fullName,
        avatar_url: "",
        creator_type: "Solo Creator",
        channel_niche: "Tech & Coding",
        preferred_language: "English",
        time_zone: "UTC",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(mockUser);
      setProfile(newProfile);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
      setIsLoading(false);
      return { error: null };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    if (isConfigured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setChannel(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
      localStorage.removeItem(LOCAL_STORAGE_KEY_PROFILE);
      localStorage.removeItem(LOCAL_STORAGE_KEY_SETTINGS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_CHANNEL);
    }
    setIsLoading(false);
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    if (isConfigured) {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      return { error: error ? error.message : null };
    } else {
      return { error: null };
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: string | null }> => {
    if (!profile) return { error: "No profile loaded" };
    const updated: Profile = {
      ...profile,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isConfigured) {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update(updates as any)
        .eq("id", profile.id);

      if (error) return { error: error.message };
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(updated));
    }

    setProfile(updated);
    return { error: null };
  };

  const updateSettings = async (updates: Partial<UserSettings>): Promise<{ error: string | null }> => {
    if (!settings) return { error: "No settings loaded" };
    const updated: UserSettings = {
      ...settings,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isConfigured) {
      const supabase = createClient();
      const { error } = await supabase
        .from("user_settings")
        .update(updates as any)
        .eq("user_id", settings.user_id);

      if (error) return { error: error.message };
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    }

    setSettings(updated);
    return { error: null };
  };

  const connectChannel = async (channelData: {
    youtube_channel_id: string;
    channel_title: string;
    custom_url?: string;
    thumbnail_url?: string;
    subscriber_count?: number;
    video_count?: number;
    view_count?: number;
    description?: string;
  }): Promise<{ error: string | null }> => {
    if (!user) return { error: "User not authenticated" };

    const newChannel: Channel = {
      id: "chan-" + Date.now(),
      user_id: user.id,
      youtube_channel_id: channelData.youtube_channel_id,
      channel_title: channelData.channel_title,
      custom_url: channelData.custom_url || null,
      description: channelData.description || "Connected YouTube Channel",
      thumbnail_url: channelData.thumbnail_url || "",
      subscriber_count: channelData.subscriber_count ?? 2,
      video_count: channelData.video_count ?? 0,
      view_count: channelData.view_count ?? 0,
      is_primary: true,
      is_connected: true,
      uploads_playlist_id: null,
      published_at: null,
      is_oauth_authorized: false,
      connected_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isConfigured) {
      const supabase = createClient();
      const { error } = await supabase.from("channels").upsert(newChannel as any);
      if (error) return { error: error.message };
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY_CHANNEL, JSON.stringify(newChannel));
    }

    setChannel(newChannel);
    return { error: null };
  };

  const disconnectChannel = async (): Promise<{ error: string | null }> => {
    if (!channel) return { error: "No channel connected" };

    if (isConfigured) {
      const supabase = createClient();
      const { error } = await supabase.from("channels").delete().eq("id", channel.id);
      if (error) return { error: error.message };
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_CHANNEL);
    }

    setChannel(null);
    return { error: null };
  };

  const refreshState = async () => {
    if (user) {
      await loadUserData(user.id, user.email || "");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        settings,
        channel,
        isLoading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        updateSettings,
        connectChannel,
        disconnectChannel,
        refreshState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
