"use client";

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
  Sparkles,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Channel Audit",
    href: "/channel-audit",
    icon: BarChart3,
    badge: "Audit AI",
  },
  {
    name: "Trend Research + Script",
    href: "/trend-script",
    icon: Flame,
    badge: "V2 Engine",
  },
  {
    name: "Video Production",
    href: "/video-production",
    icon: Video,
    badge: "Scenes",
  },
  {
    name: "SEO Studio",
    href: "/seo-studio",
    icon: Search,
    badge: null,
  },
  {
    name: "Thumbnail Studio",
    href: "/thumbnail-studio",
    icon: ImageIcon,
    badge: null,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-surface-950 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-white block">
            ASH STUDIO
          </span>
          <span className="text-[10px] uppercase font-semibold text-brand-400 tracking-wider block">
            Creator Intelligence
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Core Workflows
        </div>
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-brand-500/10 text-brand-400 border border-brand-500/25 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-brand-400" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-surface-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">
              {user ? "Session Active" : "System Active"}
            </span>
          </div>
          {user ? (
            <button
              onClick={signOut}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
