"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, profile, channel, signOut, isConfigured } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push("/login");
  };

  // Derive current title
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Mission Control";
    if (pathname === "/profile") return "Creator Profile";
    if (pathname === "/settings") return "Account & Security";
    if (pathname === "/modules/script-writer") return "AI Video Studio";
    if (pathname === "/modules/style-lab") return "AI Style Lab";
    if (pathname.startsWith("/modules/")) {
      const slug = pathname.replace("/modules/", "").replace(/-/g, " ");
      return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/90 dark:border-navy-800/90 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md shadow-sm px-3 sm:px-6">
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 active:scale-95 transition-all lg:hidden shadow-xs"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white truncate capitalize">
              {getPageTitle()}
            </h1>
            {channel && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                @{channel.custom_url || "ashishfn"}
              </span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>ASH Creator Studio</span>
            <span>•</span>
            <span className="text-brand-500 font-medium">Phase 1 Beta</span>
            {profile?.channel_niche && (
              <>
                <span>•</span>
                <span className="rounded bg-slate-100 dark:bg-navy-900 px-1.5 py-0.5 text-slate-600 dark:text-slate-300">
                  {profile.channel_niche}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions & User Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Launch AI Video Studio Button */}
        {pathname !== "/modules/script-writer" && (
          <Link
            href="/modules/script-writer"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand-500/25 hover:from-brand-500 hover:to-indigo-500 active:scale-95 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span className="hidden xs:inline sm:inline">Create AI Video</span>
            <span className="xs:hidden sm:hidden">AI Video</span>
          </Link>
        )}

        {/* Supabase connection indicator badge */}
        <div
          className={cn(
            "hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
            isConfigured
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
          )}
          title={
            isConfigured
              ? "Live Supabase Database Connected"
              : "Running in local Creator Demo Mode. Set .env.local keys to connect live Supabase."
          }
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isConfigured ? "bg-emerald-500" : "bg-sky-500"
            )}
          />
          {isConfigured ? "Supabase Live" : "Demo Mode"}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-navy-700 bg-white dark:bg-navy-900 p-1 sm:p-1.5 sm:pr-2.5 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-bold text-xs shadow-xs">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {profile?.full_name || "Ashish"}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight truncate max-w-[100px]">
                {channel ? channel.channel_title : profile?.creator_type || "Creator"}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 p-1.5 shadow-xl transition-all z-50 animate-in fade-in-0 zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-navy-800/80">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {profile?.full_name || "Creator"}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {profile?.email || user?.email || "creator@ashstudio.io"}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Creator Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Account Settings
                </Link>
              </div>

              <div className="border-t border-slate-100 dark:border-navy-800/80 pt-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
