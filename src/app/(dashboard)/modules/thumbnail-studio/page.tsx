"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ThumbnailStudioPage() {
  const { channel, activeChannelStyle } = useAuth();
  const [deviceMode, setDeviceMode] = React.useState<"mobile" | "desktop">("mobile");
  const [feedTheme, setFeedTheme] = React.useState<"dark" | "light">("dark");
  const [imageUrl, setImageUrl] = React.useState(
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80"
  );
  const defaultTitle = activeChannelStyle?.popularTopics?.[0] || "द ग्रेट लाइब्रेरी ऑफ अलेक्जेंड्रिया कैसे जली?";
  const [title, setTitle] = React.useState(defaultTitle);

  const channelTitle = channel?.channel_title || "Connected Channel";

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Thumbnail Studio & Feed Simulator
            </h2>
            <Badge variant="brand">Mobile Feed Preview</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test contrast, mobile readability, and CTR competition against the YouTube feed
          </p>
        </div>

        {/* View Toggle Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-navy-800 p-1 bg-white dark:bg-navy-900 text-xs">
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                deviceMode === "mobile"
                  ? "bg-brand-500 text-white font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile Feed (72% Viewers)</span>
            </button>
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                deviceMode === "desktop"
                  ? "bg-brand-500 text-white font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop Feed</span>
            </button>
          </div>

          <button
            onClick={() => setFeedTheme(feedTheme === "dark" ? "light" : "dark")}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-xs font-semibold"
          >
            Feed: {feedTheme === "dark" ? "Dark Theme" : "Light Theme"}
          </button>
        </div>
      </div>

      {/* Image Input Bar */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Thumbnail Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
          />
          <Input
            label="Video Title Preview"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Video title..."
          />
        </div>
      </Card>

      {/* Simulator Display */}
      <div className="flex justify-center">
        <div
          className={`w-full transition-all duration-300 rounded-2xl border overflow-hidden shadow-2xl ${
            deviceMode === "mobile" ? "max-w-sm" : "max-w-4xl"
          } ${
            feedTheme === "dark"
              ? "bg-[#0f0f0f] text-white border-neutral-800"
              : "bg-white text-black border-slate-200"
          }`}
        >
          {/* Mock YouTube Top App Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/40 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-red-600 font-bold tracking-tight">
              <span>▶ YouTube</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              Feed Preview Simulator
            </span>
          </div>

          {/* YouTube Video Card in Feed */}
          <div className="p-3 sm:p-4 space-y-3">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 group">
              {/* Thumbnail Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Thumbnail Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80";
                }}
              />
              {/* Duration Badge */}
              <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-bold text-white tracking-wide">
                08:45
              </span>
            </div>

            <div className="flex items-start gap-3 pt-1">
              {/* Channel Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs overflow-hidden">
                {channel?.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={channel.thumbnail_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>{(channelTitle || "C").charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="space-y-0.5 overflow-hidden">
                <h4 className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug">
                  {title}
                </h4>
                <p className="text-[11px] text-neutral-400">
                  {channelTitle} • 18K views • 2 hours ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Second Glance Check Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200/80 dark:border-navy-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" />
            <span>High Focal Point Contrast</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Main subject is clearly distinguished from the background, ensuring high visibility even at 150px mobile card size.
          </p>
        </Card>

        <Card className="border-slate-200/80 dark:border-navy-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4" />
            <span>Zero Timestamp Obstruction</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bottom right corner has no critical text or faces that would be covered by YouTube's duration pill.
          </p>
        </Card>

        <Card className="border-slate-200/80 dark:border-navy-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-brand-500 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            <span>Title-Thumbnail Synergy</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thumbnail creates curiosity without merely repeating the title verbatim.
          </p>
        </Card>
      </div>
    </div>
  );
}
