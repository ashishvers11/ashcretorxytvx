"use client";

import React from "react";
import Link from "next/link";
import { FolderClock, ArrowRight, Sparkles, FileText, Video, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RecentActivityCard() {
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
        {/* Polished, Helpful Empty State - Zero Fake Entries */}
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
      </CardContent>
    </Card>
  );
}
