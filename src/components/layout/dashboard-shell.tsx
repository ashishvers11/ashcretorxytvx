"use client";

import * as React from "react";
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
  Menu,
  X,
  Youtube,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";

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

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { channel } = useYouTubeChannel();

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col lg:flex-row">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop fixed, Mobile off-canvas) */}
      <aside
        className={cn(
          "w-64 border-r border-slate-800/80 bg-surface-950 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3">
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
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
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
                {user ? "Session Active" : "System Ready"}
              </span>
            </div>
            {user ? (
              <button
                onClick={signOut}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                title="Sign out of Supabase"
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

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Responsive Header */}
        <header className="h-16 border-b border-slate-800/80 bg-surface-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 focus:outline-none"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <Youtube className={`h-3.5 w-3.5 ${channel ? "text-red-500" : "text-slate-400"}`} />
              {channel ? (
                <>
                  <span className="hidden sm:inline text-slate-300">
                    YouTube: <span className="text-emerald-400 font-medium">{channel.title}</span>
                  </span>
                  <span className="sm:hidden text-emerald-400 font-medium truncate max-w-[100px]">
                    {channel.title}
                  </span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline text-slate-400">
                    YouTube Channel: <span className="text-amber-400 font-medium">Not Connected</span>
                  </span>
                  <span className="sm:hidden text-amber-400 font-medium">Not Connected</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full text-slate-400 hover:text-white">
              <Bell className="h-4 w-4" />
            </Button>
            {loading ? (
              <div className="h-8 w-28 rounded-full bg-slate-900 animate-pulse border border-slate-800" />
            ) : user ? (
              <Link href="/profile">
                <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer max-w-[200px]">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-200 truncate hidden sm:inline">
                    {user.email}
                  </span>
                </div>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
