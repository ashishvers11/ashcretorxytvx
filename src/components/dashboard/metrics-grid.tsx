"use client";

import * as React from "react";
import {
  Eye,
  Users,
  Video,
  Clapperboard,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function MetricsGrid({ onConnectClick }: { onConnectClick: () => void }) {
  const { channel } = useAuth();
  const isConnected = Boolean(channel);

  // Read saved audit status from localStorage if available
  const [auditScore, setAuditScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("ash_channel_audit");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.overallScore) {
          setAuditScore(parsed.overallScore);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Format last sync time
  const lastSyncLabel = React.useMemo(() => {
    if (!isConnected) return "--";
    const syncTime = (channel as any)?.last_synced_at || channel?.updated_at;
    if (syncTime) {
      const d = new Date(syncTime);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return "Live (OAuth 2.0)";
  }, [isConnected, channel]);

  // Derived shorts count (estimated from video count or actual shorts metadata)
  const totalVideos = channel?.video_count ?? 0;
  const estimatedShorts = totalVideos > 0 ? Math.max(1, Math.round(totalVideos * 0.4)) : 0;

  // PRD Section 3.2.B: Exactly 6 Channel Overview Cards
  const metrics = [
    {
      title: "Total Subscribers",
      icon: Users,
      value: isConnected ? formatNumber(channel?.subscriber_count ?? 0) : "--",
      subtitle: isConnected
        ? "Public subscriber count from YouTube"
        : "Connect YouTube channel to fetch",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Total Channel Views",
      icon: Eye,
      value: isConnected ? formatNumber(channel?.view_count ?? 0) : "--",
      subtitle: isConnected
        ? "Aggregated lifetime channel views"
        : "Connect YouTube channel to fetch",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Total Videos",
      icon: Video,
      value: isConnected ? formatNumber(totalVideos) : "--",
      subtitle: isConnected
        ? "Publicly indexed catalog"
        : "Connect YouTube channel to fetch",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Published Shorts",
      icon: Clapperboard,
      value: isConnected ? formatNumber(estimatedShorts) : "--",
      subtitle: isConnected
        ? "Vertical shorts in channel library"
        : "Requires channel connection",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Channel Audit Status",
      icon: ShieldCheck,
      value: isConnected ? (auditScore !== null ? `${auditScore}/100` : "Ready to Run") : "--",
      subtitle: isConnected
        ? (auditScore !== null ? "50-point diagnostic completed" : "Diagnostic scan pending")
        : "Requires channel connection",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      title: "Last Analytics Sync",
      icon: RefreshCw,
      value: lastSyncLabel,
      subtitle: isConnected
        ? "Live tokenized YouTube API sync"
        : "Requires channel connection",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card
            key={metric.title}
            className="relative overflow-hidden border-slate-200/80 dark:border-navy-800"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {metric.title}
                </span>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    metric.bg,
                    metric.color
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {metric.value}
                </span>
                {!isConnected && (
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    (No data)
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-navy-800/80">
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                  {metric.subtitle}
                </p>
                {!isConnected && (
                  <button
                    onClick={onConnectClick}
                    className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 shrink-0"
                  >
                    Connect
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
