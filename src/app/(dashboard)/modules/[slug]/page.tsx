"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Clock,
  Layers,
  Cpu,
  CheckCircle2,
  Lock,
  BellRing,
} from "lucide-react";
import { NAVIGATION_SECTIONS } from "@/lib/constants/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ModuleComingSoonPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [notified, setNotified] = React.useState(false);

  // Look up module info from navigation sections
  let foundItem: any = null;
  let sectionTitle = "";

  for (const sec of NAVIGATION_SECTIONS) {
    const item = sec.items.find((i) => i.href === `/modules/${slug}`);
    if (item) {
      foundItem = item;
      sectionTitle = sec.title;
      break;
    }
  }

  const moduleName =
    foundItem?.name ||
    slug
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") ||
    "Growth Module";

  const description =
    foundItem?.description ||
    "Advanced algorithmic intelligence module for professional YouTube channel acceleration.";

  const Icon = foundItem?.icon || Sparkles;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>

      {/* Main Module Card */}
      <Card className="overflow-hidden border-slate-200/80 dark:border-navy-800">
        <div className="h-2 bg-gradient-to-r from-brand-500 via-sky-400 to-indigo-600" />
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500 ring-8 ring-brand-500/5">
                <Icon className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="brand">{sectionTitle || "STUDIO MODULE"}</Badge>
                  <Badge variant="comingSoon">Coming Soon</Badge>
                  <Badge variant="outline">Phase 2 Roadmap</Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-1">
                  {moduleName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <Button
              variant={notified ? "subtle" : "primary"}
              onClick={() => setNotified(true)}
              className="gap-2 shrink-0 self-start"
            >
              <BellRing className="h-4 w-4" />
              <span>{notified ? "On Beta Priority List" : "Get Early Access"}</span>
            </Button>
          </div>

          {/* Module Architecture Blueprint */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-navy-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-500" />
                <span>Architectural Blueprint & Planned Capabilities</span>
              </h3>
              <span className="text-xs text-brand-500 font-mono">
                Supabase Schema Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200/80 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-500" />
                  Algorithm & Engine Specs
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Backed by dedicated database tables already created in Phase 1 migration (Row Level Security protected).
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/80 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-brand-500" />
                  YouTube Data API Integration
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Integrates real-time video snapshots, keyword search volumes, and retention curve analysis without invented metrics.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-slate-200 dark:border-navy-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-navy-900/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Scheduled for Implementation in Phase 2
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Phase 1 focuses on core authentication, database architecture, profile management, and YouTube connection foundation.
                  </p>
                </div>
              </div>

              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="shrink-0 text-xs">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
