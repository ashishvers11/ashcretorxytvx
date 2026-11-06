"use client";

import * as React from "react";
import { Eye, Users, Video, AlertCircle, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function MetricsGrid({ onConnectClick }: { onConnectClick: () => void }) {
  const { channel } = useAuth();
  const isConnected = Boolean(channel);

  const metrics = [
    {
      title: "Total Views",
      icon: Eye,
      value: isConnected ? formatNumber(channel?.view_count ?? 0) : "--",
      subtitle: isConnected
        ? "Aggregated channel lifetime views"
        : "Connect YouTube channel to fetch views",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Subscribers",
      icon: Users,
      value: isConnected ? formatNumber(channel?.subscriber_count ?? 0) : "--",
      subtitle: isConnected
        ? "Public subscriber count"
        : "Connect YouTube channel to track subscribers",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Published Videos",
      icon: Video,
      value: isConnected ? formatNumber(channel?.video_count ?? 0) : "--",
      subtitle: isConnected
        ? "Publicly indexed videos"
        : "Connect YouTube channel to index library",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {metric.value}
                </span>
                {!isConnected && (
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    (No data)
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-navy-800/80">
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
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
