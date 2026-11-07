"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FolderClock, ArrowRight, Sparkles, FileText, Video, Search, Image as ImageIcon, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  module: string;
  action: string;
  title: string;
  link: string | null;
  created_at: string;
}

export function RecentActivityCard() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch("/api/studio/activity");
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch {
      // Fall back to empty list gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getModuleIcon = (mod: string) => {
    if (mod.includes("Script")) return <FileText className="h-3.5 w-3.5 text-brand-400" />;
    if (mod.includes("Video")) return <Video className="h-3.5 w-3.5 text-indigo-400" />;
    if (mod.includes("SEO")) return <Search className="h-3.5 w-3.5 text-amber-400" />;
    if (mod.includes("Thumbnail")) return <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />;
    return <Sparkles className="h-3.5 w-3.5 text-slate-400" />;
  };

  return (
    <Card className="border-slate-800 bg-surface-900/90 shadow-xl">
      <CardHeader className="border-b border-slate-800/80 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderClock className="h-5 w-5 text-brand-400" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">
              Historical log of your generated scripts, channel audits, and video productions.
            </CardDescription>
          </div>

          <div className="text-[11px] text-slate-500">
            Real-time activity tracking
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {getModuleIcon(act.module)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{act.title}</span>
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5">
                        {act.module}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400">{act.action}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(act.created_at).toLocaleDateString()}
                  </span>
                  {act.link && (
                    <Link href={act.link}>
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                        Open
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Polished, Helpful Empty State - Zero Fake Entries */
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 sm:p-10 text-center flex flex-col items-center justify-center">
            <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
              <FolderClock className="h-7 w-7 text-slate-500" />
            </div>

            <h4 className="text-sm font-semibold text-slate-200 mb-1.5">
              No Activity Recorded Yet
            </h4>

            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
              You haven&apos;t generated any scripts, conducted audits, or choreographed video scenes yet.
              Once you start producing content, your saved drafts and exports will appear here automatically.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/trend-script">
                <Button variant="primary" size="sm" className="gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Write First Script</span>
                </Button>
              </Link>

              <Link href="/channel-audit">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                  <span>Run First Audit</span>
                </Button>
              </Link>
            </div>

            {/* Quick Explanation of Tracked Events */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 w-full max-w-lg grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <FileText className="h-3.5 w-3.5 text-brand-400" />
                <span>Script drafts &amp; hooks</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Video className="h-3.5 w-3.5 text-indigo-400" />
                <span>Scene prompt exports</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Search className="h-3.5 w-3.5 text-amber-400" />
                <span>SEO tag packages</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
