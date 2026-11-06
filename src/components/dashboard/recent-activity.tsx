"use client";

import * as React from "react";
import { Activity, Clock, CheckCircle2, Youtube } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function RecentActivity() {
  const { channel } = useAuth();

  return (
    <Card className="border-slate-200/80 dark:border-navy-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-500" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Chronological log of channel syncs, audit runs, and optimizations
            </CardDescription>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Real-Time
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {channel ? (
          <div className="space-y-4">
            <div className="relative pl-6 pb-2 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 dark:before:bg-navy-800 last:before:hidden">
              <span className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-4 ring-white dark:ring-navy-900">
                <CheckCircle2 className="h-3 w-3" />
              </span>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Channel successfully linked to ASH Studio
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Channel "{channel.channel_title}" is ready for audit analysis.
                </p>
                <p className="text-[10px] text-slate-400 pt-1">
                  {formatDate(channel.connected_at)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-slate-200 dark:border-navy-800 p-4 text-center">
              <p className="text-xs text-slate-400">
                Awaiting upcoming video syncs and audit executions.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-400 mb-3">
              <Clock className="h-6 w-6" />
            </div>
            <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
              No Activity Recorded
            </h5>
            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Once you link your YouTube channel, daily rank changes, thumbnail A/B test results, and metadata audit reports will appear here automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
