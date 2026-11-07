"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Flame,
  Video,
  Search,
  Image as ImageIcon,
  User,
  KeyRound,
  Sparkles,
  LogOut,
  Shield,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

export const ALL_CORE_MODULES = [
  {
    category: "CREATOR WORKFLOWS",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: "Overview",
        badgeVariant: "default",
      },
      {
        name: "Channel Audit",
        href: "/channel-audit",
        icon: BarChart3,
        badge: "Diagnostics",
        badgeVariant: "secondary",
      },
      {
        name: "Trend Radar",
        href: "/trend-radar",
        icon: Flame,
        badge: "Viral Topics",
        badgeVariant: "warning",
      },
      {
        name: "Script Studio",
        href: "/trend-script",
        icon: Sparkles,
        badge: "AI Writer",
        badgeVariant: "default",
      },
      {
        name: "Video Production",
        href: "/video-production",
        icon: Video,
        badge: "Director",
        badgeVariant: "secondary",
      },
      {
        name: "SEO Studio",
        href: "/seo-studio",
        icon: Search,
        badge: "Metadata",
        badgeVariant: "secondary",
      },
      {
        name: "Thumbnail Studio",
        href: "/thumbnail-studio",
        icon: ImageIcon,
        badge: "Visual AI",
        badgeVariant: "secondary",
      },
    ],
  },
  {
    category: "CREATOR & ACCESS",
    items: [
      {
        name: "Creator Profile",
        href: "/profile",
        icon: User,
        badge: "Account",
        badgeVariant: "secondary",
      },
      {
        name: "Authentication",
        href: "/auth/login",
        icon: KeyRound,
        badge: "Security",
        badgeVariant: "outline",
      },
    ],
  },
];

interface SidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

export function Sidebar({ onCloseMobile, className }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut, isConfigured } = useAuth();

  return (
    <aside
      className={cn(
        "w-64 bg-surface-950 border-r border-slate-800/80 flex flex-col h-full select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 shrink-0">
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-brand-500 rounded-lg p-1 group"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white block">
              ASH CREATOR STUDIO
            </span>
            <span className="text-[9px] uppercase font-bold text-brand-400 tracking-wider block">
              8 Core Modules • SaaS
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation List - Independent Vertical Scrollbar, Never Cuts Off Bottom */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
        {ALL_CORE_MODULES.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {section.category}
            </div>
            {section.items.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group focus:outline-none focus:ring-1 focus:ring-brand-500",
                    isActive
                      ? "bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm shadow-brand-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[9px] font-semibold px-1.5 py-0.5 rounded-md",
                          isActive
                            ? "bg-brand-500/20 text-brand-300"
                            : "bg-slate-900 text-slate-500 group-hover:text-slate-400 border border-slate-800"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="h-3 w-3 text-brand-400 shrink-0" />}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User / Session Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-surface-900/60 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 truncate pr-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                user ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              )}
            />
            <span className="text-[11px] text-slate-300 truncate font-mono">
              {user?.email ? user.email.split("@")[0] : "Guest Mode"}
            </span>
          </div>

          {user ? (
            <button
              onClick={signOut}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-rose-500/10 shrink-0"
              title="Sign out of Supabase"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              href="/auth/login"
              onClick={onCloseMobile}
              className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold px-2 py-1 rounded hover:bg-brand-500/10 transition-colors shrink-0"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
