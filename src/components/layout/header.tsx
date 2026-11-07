// ==============================================================================
// ASH CREATOR STUDIO 2.0 — DASHBOARD HEADER WITH CHANNEL SWITCHER
// Multi-Channel Intelligence: Switch channels instantly with visual style indicator
// ==============================================================================

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
  Youtube,
  PlusCircle,
  Dna,
  Layers,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "./theme-toggle";
import { ConnectChannelModal } from "@/components/dashboard/connect-channel-modal";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const {
    user,
    profile,
    channel,
    channels,
    activeChannelStyle,
    setActiveChannel,
    signOut,
    isConfigured,
  } = useAuth();

  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [channelDropdownOpen, setChannelDropdownOpen] = React.useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false);

  const userDropdownRef = React.useRef<HTMLDivElement>(null);
  const channelDropdownRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close dropdowns on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        channelDropdownRef.current &&
        !channelDropdownRef.current.contains(event.target as Node)
      ) {
        setChannelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
    router.push("/login");
  };

  // Derive current title
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Mission Control";
    if (pathname === "/profile") return "Creator Profile";
    if (pathname === "/settings") return "Account & Security";
    if (pathname === "/modules/script-writer") return "Video Production";
    if (pathname === "/modules/trend-research") return "Trend Research";
    if (pathname === "/modules/channel-audit") return "Channel Audit";
    if (pathname === "/modules/seo-studio") return "SEO Studio";
    if (pathname === "/modules/thumbnail-studio") return "Thumbnail Studio";
    if (pathname === "/modules/style-lab") return "AI Style Lab";
    if (pathname.startsWith("/modules/")) {
      const slug = pathname.replace("/modules/", "").replace(/-/g, " ");
      return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
    return "Dashboard";
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/90 dark:border-navy-800/90 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md shadow-sm px-3 sm:px-6">
        {/* Left: Mobile Menu & Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 active:scale-95 transition-all lg:hidden shadow-xs"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-base md:text-lg font-bold text-slate-900 dark:text-white truncate capitalize">
                {getPageTitle()}
              </h1>

              {/* Active Channel Pill */}
              {channel && (
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>@{channel.custom_url || "channel"}</span>
                </span>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>ASH Creator Studio</span>
              <span>•</span>
              <span className="text-brand-500 font-semibold">2.0 Content Intelligence</span>
              {activeChannelStyle && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                    <Dna className="h-3 w-3 text-brand-500" />
                    <span>{activeChannelStyle.visualStyleLabel}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center / Right: Channel Switcher & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Multi-Channel Switcher Dropdown */}
          <div className="relative" ref={channelDropdownRef}>
            {channel ? (
              <button
                type="button"
                onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200/90 dark:border-navy-700 bg-slate-50/80 dark:bg-navy-900/80 p-1 sm:px-3 sm:py-1.5 hover:bg-slate-100 dark:hover:bg-navy-800 transition-all text-left shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-red-600 text-white font-bold text-xs">
                  {channel.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={channel.thumbnail_url}
                      alt={channel.channel_title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Youtube className="h-4 w-4" />
                  )}
                </div>

                <div className="hidden md:block max-w-[130px] lg:max-w-[160px] truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                    {channel.channel_title}
                  </div>
                  <div className="text-[10px] text-brand-600 dark:text-brand-400 font-medium truncate leading-tight">
                    {activeChannelStyle?.visualStyleLabel || "Channel DNA"}
                  </div>
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 transition-all"
              >
                <Youtube className="h-4 w-4 text-red-500" />
                <span className="hidden xs:inline">Connect Channel</span>
                <span className="xs:hidden">Connect</span>
              </button>
            )}

            {/* Channel Switching Menu */}
            {channelDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-2.5 py-2 border-b border-slate-100 dark:border-navy-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-brand-500" />
                    <span>Connected Channels ({channels.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Independent DNA</span>
                </div>

                <div className="py-1 max-h-64 overflow-y-auto space-y-1">
                  {channels.map((chan) => {
                    const isSelected = channel?.id === chan.id;
                    return (
                      <button
                        key={chan.id}
                        type="button"
                        onClick={() => {
                          setActiveChannel(chan.id);
                          setChannelDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-2.5 p-2 rounded-xl text-left transition-all",
                          isSelected
                            ? "bg-brand-500/10 border border-brand-500/30 text-brand-700 dark:text-brand-300"
                            : "hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-200"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-red-600 text-white font-bold text-xs">
                            {chan.thumbnail_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={chan.thumbnail_url}
                                alt={chan.channel_title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Youtube className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0 truncate">
                            <p className="text-xs font-bold truncate leading-tight">
                              {chan.channel_title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                              @{chan.custom_url || chan.youtube_channel_id.slice(0, 10)}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white text-[10px]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1.5 border-t border-slate-100 dark:border-navy-800">
                  <button
                    type="button"
                    onClick={() => {
                      setChannelDropdownOpen(false);
                      setIsConnectModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-navy-700 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Connect Another Channel</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Launch AI Video Studio Button (Hidden on small mobile to avoid crowding) */}
          {pathname !== "/modules/script-writer" && (
            <Link
              href="/modules/script-writer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand-500/25 hover:from-brand-500 hover:to-indigo-500 active:scale-95 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>Create AI Video</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-navy-700 bg-white dark:bg-navy-900 p-1 sm:p-1.5 sm:pr-2.5 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-bold text-xs shadow-xs">
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
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-navy-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {profile?.full_name || "ASH Creator"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email || "creator@ashstudio.io"}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>Creator Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800 rounded-lg transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span>Settings & API</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-navy-800">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Connect Channel Modal accessible globally from Header */}
      <ConnectChannelModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </>
  );
}
