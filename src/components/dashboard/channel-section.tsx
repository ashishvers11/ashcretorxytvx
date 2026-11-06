"use client";

import * as React from "react";
import {
  Youtube,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Unlink,
  BarChart,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ChannelSectionProps {
  onConnectClick: () => void;
}

export function ChannelSection({ onConnectClick }: ChannelSectionProps) {
  const { channel, disconnectChannel } = useAuth();
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  const handleDisconnect = async () => {
    if (confirm("Are you sure you want to disconnect this YouTube channel from ASH Creator Studio?")) {
      setIsDisconnecting(true);
      await disconnectChannel();
      setIsDisconnecting(false);
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-navy-800">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <span>Connected Channel</span>
            {channel ? (
              <Badge variant="success" className="text-[10px]">
                Active Link
              </Badge>
            ) : (
              <Badge variant="warning" className="text-[10px]">
                Not Connected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {channel
              ? "Your primary YouTube account synced with ASH growth modules"
              : "Link your YouTube channel to activate metric tracking and automated audits"}
          </CardDescription>
        </div>

        {channel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            isLoading={isDisconnecting}
            className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <Unlink className="h-3.5 w-3.5 mr-1" />
            Disconnect
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {channel ? (
          /* Connected State */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 dark:border-navy-800/80 bg-slate-50/70 dark:bg-navy-950/60 p-4">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-md ring-2 ring-red-500/20">
                {channel.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={channel.thumbnail_url}
                    alt={channel.channel_title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-red-600 text-white">
                    <Youtube className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {channel.channel_title}
                  </h4>
                  <span className="rounded bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                    Primary
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {channel.custom_url ? `@${channel.custom_url}` : "Custom handle not set"} • ID:{" "}
                  <code className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    {channel.youtube_channel_id}
                  </code>
                </p>
                <p className="text-[11px] text-slate-400">
                  Connected on {formatDate(channel.connected_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <Link href="/modules/channel-analytics">
                <Button size="sm" className="gap-1.5 text-xs bg-brand-500 hover:bg-brand-600">
                  <BarChart className="h-3.5 w-3.5" />
                  <span>Analytics Dashboard</span>
                </Button>
              </Link>
              <a
                href={`https://youtube.com/channel/${channel.youtube_channel_id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
              >
                <span>View on YouTube</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-navy-700/80 bg-slate-50/50 dark:bg-navy-950/40 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-4">
              <Youtube className="h-7 w-7" />
            </div>

            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              No YouTube Channel Connected
            </h4>
            <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Connect your YouTube channel to fetch your real video catalog, generate deep audit scores, and unlock personalized AI video recommendations.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-left">
              <div className="rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Shield className="h-3.5 w-3.5 text-brand-500" />
                  <span>Read-Only</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Zero upload permissions required. Safe and isolated.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <BarChart className="h-3.5 w-3.5 text-brand-500" />
                  <span>Real Metrics</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Zero fake data. Authentic YouTube Data API metrics.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-900 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Zap className="h-3.5 w-3.5 text-brand-500" />
                  <span>AI Workflows</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Automated title tests and video idea generation.
                </p>
              </div>
            </div>

            <Button onClick={onConnectClick} className="mt-6 gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Connect Channel Now</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
