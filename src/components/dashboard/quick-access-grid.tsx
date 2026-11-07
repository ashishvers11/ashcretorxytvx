"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  Flame,
  Video,
  Search,
  Image as ImageIcon,
  User,
  KeyRound,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CORE_MODULES = [
  {
    title: "1. Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: "Control Center",
    badgeVariant: "default" as const,
    description: "Main mission control, platform onboarding, and creator workflow guidance.",
    iconColor: "text-brand-400 bg-brand-500/10 border-brand-500/20",
    buttonLabel: "Current View",
    isCurrent: true,
  },
  {
    title: "2. Channel Audit",
    href: "/channel-audit",
    icon: BarChart3,
    badge: "Audit AI",
    badgeVariant: "secondary" as const,
    description: "Analyze subscriber metrics, view velocity, and audience benchmarks via YouTube integration.",
    iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    buttonLabel: "Open Channel Audit",
    isCurrent: false,
  },
  {
    title: "3. Trend Radar",
    href: "/trend-radar",
    icon: Flame,
    badge: "Viral Topics",
    badgeVariant: "warning" as const,
    description: "Discover verified niche breakout topics with high view velocity and low competition gaps.",
    iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    buttonLabel: "Open Trend Radar",
    isCurrent: false,
  },
  {
    title: "4. Script Studio",
    href: "/trend-script",
    icon: Sparkles,
    badge: "8-Stage AI",
    badgeVariant: "default" as const,
    description: "Generate structured, retention-engineered viral scripts with 3 hooks and scene-by-scene timing.",
    iconColor: "text-brand-400 bg-brand-500/10 border-brand-500/20",
    buttonLabel: "Open Script Studio",
    isCurrent: false,
  },
  {
    title: "5. Video Production",
    href: "/video-production",
    icon: Video,
    badge: "Scene Director",
    badgeVariant: "secondary" as const,
    description: "Choreograph scenes and generate cinematic prompts for Runway, Kling, and Midjourney.",
    iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    buttonLabel: "Open Scene Director",
    isCurrent: false,
  },
  {
    title: "6. SEO Studio",
    href: "/seo-studio",
    icon: Search,
    badge: "Optimization",
    badgeVariant: "secondary" as const,
    description: "Generate high-CTR title variations, keyword-rich descriptions, and algorithmic tags.",
    iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    buttonLabel: "Open SEO Studio",
    isCurrent: false,
  },
  {
    title: "7. Thumbnail Studio",
    href: "/thumbnail-studio",
    icon: ImageIcon,
    badge: "Visual AI",
    badgeVariant: "secondary" as const,
    description: "Plan click-worthy visual compositions, focal hierarchy, and high-impact text overlays.",
    iconColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    buttonLabel: "Open Thumbnail Studio",
    isCurrent: false,
  },
  {
    title: "7. Creator Profile",
    href: "/profile",
    icon: User,
    badge: "Preferences",
    badgeVariant: "secondary" as const,
    description: "Manage creator account settings, channel preferences, and system notifications.",
    iconColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    buttonLabel: "Open Profile",
    isCurrent: false,
  },
  {
    title: "8. Authentication",
    href: "/auth/login",
    icon: KeyRound,
    badge: "Supabase Auth",
    badgeVariant: "secondary" as const,
    description: "Manage authentication sessions, sign in with email, and secure account credentials.",
    iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    buttonLabel: "Access Auth Portal",
    isCurrent: false,
  },
];

export function QuickAccessGrid() {
  return (
    <div id="quick-access" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Core Studio Modules</span>
            <span className="text-xs font-normal text-slate-400">
              (8 Production Routes)
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Direct navigation to all active modules across the creator content pipeline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CORE_MODULES.map((module) => {
          const Icon = module.icon;

          return (
            <Card
              key={module.href + module.title}
              className="flex flex-col justify-between hover:border-slate-700/90 transition-all duration-200 group bg-surface-900/80"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 ${module.iconColor}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge variant={module.badgeVariant} className="text-[10px]">
                    {module.badge}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold text-slate-100 group-hover:text-brand-300 transition-colors">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <Link
                  href={module.href}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors group/link mt-2"
                >
                  <span>{module.buttonLabel}</span>
                  <ArrowRight className="h-3 w-3 transform transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
