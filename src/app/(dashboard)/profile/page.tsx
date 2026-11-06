"use client";

import * as React from "react";
import {
  User,
  Mail,
  Sparkles,
  Globe,
  Clock,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertCircle,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CREATOR_TYPES, CHANNEL_NICHES, LANGUAGES, TIMEZONES } from "@/lib/constants/creator-data";

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();

  const [fullName, setFullName] = React.useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = React.useState(profile?.avatar_url || "");
  const [creatorType, setCreatorType] = React.useState(profile?.creator_type || "Solo Creator");
  const [channelNiche, setChannelNiche] = React.useState(profile?.channel_niche || "Tech & Coding");
  const [language, setLanguage] = React.useState(profile?.preferred_language || "English");
  const [timeZone, setTimeZone] = React.useState(profile?.time_zone || "UTC");

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Sync state if profile loads asynchronously
  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url || "");
      setCreatorType(profile.creator_type || "Solo Creator");
      setChannelNiche(profile.channel_niche || "Tech & Coding");
      setLanguage(profile.preferred_language || "English");
      setTimeZone(profile.time_zone || "UTC");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    const res = await updateProfile({
      full_name: fullName.trim(),
      avatar_url: avatarUrl.trim(),
      creator_type: creatorType,
      channel_niche: channelNiche,
      preferred_language: language,
      time_zone: timeZone,
    });

    setIsSaving(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Creator Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your creator identity. These parameters tune our AI algorithms to your exact audience niche and posting timezone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Card Live Preview */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-slate-200/80 dark:border-navy-800 text-center p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={fullName || "Creator"}
                    className="h-20 w-20 rounded-2xl object-cover ring-4 ring-brand-500/20"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
                    }}
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-navy-900 text-white font-extrabold text-2xl shadow-md">
                    {fullName ? fullName.charAt(0).toUpperCase() : "C"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white text-[10px] ring-2 ring-white dark:ring-navy-900">
                  <Sparkles className="h-3 w-3" />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {fullName || "Your Creator Name"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile?.email || "creator@ashstudio.io"}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                <Badge variant="brand">{creatorType}</Badge>
                <Badge variant="outline">{channelNiche}</Badge>
              </div>

              <div className="mt-6 w-full border-t border-slate-100 dark:border-navy-800 pt-4 space-y-2 text-left text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    Language
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {language}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Timezone
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                    {timeZone}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div className="rounded-xl border border-brand-200/60 dark:border-brand-900/40 bg-brand-50/40 dark:bg-brand-950/20 p-4">
            <h4 className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI Personalization
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Selecting your niche and creator type calibrates the viral hook generator, video title formulations, and competitor analysis presets.
            </p>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200/80 dark:border-navy-800">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Profile Details</CardTitle>
              <CardDescription>
                Update your personal information and channel classification
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                {saveSuccess && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Your creator profile has been successfully saved!</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    required
                  />

                  <Input
                    label="Email Address"
                    value={profile?.email || ""}
                    disabled
                    helperText="Managed through Supabase Auth credentials"
                  />
                </div>

                <Input
                  label="Profile Image URL"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  helperText="Provide a direct image URL or leave blank for initials"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Creator Type"
                    value={creatorType}
                    onChange={(e) => setCreatorType(e.target.value)}
                    helperText="Helps determine production scale & workflows"
                  >
                    {CREATOR_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Channel Niche"
                    value={channelNiche}
                    onChange={(e) => setChannelNiche(e.target.value)}
                    helperText="Calibrates keyword suggestions and CTR benchmarks"
                  >
                    {CHANNEL_NICHES.map((niche) => (
                      <option key={niche} value={niche}>
                        {niche}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Preferred Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    helperText="Primary language for video scripts and titles"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.name}>
                        {l.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Time Zone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    helperText="Used for upload schedules and analytics snapshots"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-navy-800">
                  <Button type="submit" isLoading={isSaving} className="gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
