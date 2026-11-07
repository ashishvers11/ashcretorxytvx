"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Youtube,
  Bell,
  User,
  Menu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { channel, connected } = useYouTubeChannel();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "AI Studio Engine Online",
      description: "Gemini 1.5 Flash & Algorithmic fallback ready for all 8 modules.",
      time: "Now",
      read: false,
    },
    {
      id: "2",
      title: "YouTube OAuth Integration",
      description: connected
        ? `Synced with channel: ${channel?.title}`
        : "Connect your channel to sync live subscriber velocity and watch time.",
      time: "Today",
      read: false,
    },
  ]);

  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Dashboard Mission Control";
    if (path.startsWith("/channel-audit")) return "Channel Audit & Diagnostics";
    if (path.startsWith("/trend-script")) return "Trend Research + Script Writing";
    if (path.startsWith("/video-production")) return "Video Production Workspace";
    if (path.startsWith("/seo-studio")) return "SEO Studio & Metadata Architect";
    if (path.startsWith("/thumbnail-studio")) return "Thumbnail Studio & Click Intelligence";
    if (path.startsWith("/profile")) return "Creator Profile & Preferences";
    if (path.startsWith("/auth")) return "Creator Authentication";
    return "Creator Studio";
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-surface-950/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle + Current Page Title */}
      <div className="flex items-center gap-3 truncate">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2 truncate">
          <span className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {getPageTitle(pathname)}
          </span>
        </div>
      </div>

      {/* Right: Real YouTube Status + Functional Notifications + Account Access */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Real YouTube Connection Status Pill */}
        <Link href={connected ? "/profile" : "/dashboard#channel-setup"}>
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer text-xs">
            <Youtube className={`h-3.5 w-3.5 ${connected ? "text-red-500" : "text-slate-400"}`} />
            {connected && channel ? (
              <span className="text-slate-300 hidden md:inline">
                YouTube: <span className="text-emerald-400 font-medium">{channel.title}</span>
              </span>
            ) : (
              <span className="text-slate-400 hidden md:inline">
                YouTube: <span className="text-amber-400 font-medium">Not Connected</span>
              </span>
            )}
            <Badge
              variant={connected ? "success" : "warning"}
              className="text-[9px] py-0 px-1.5 md:hidden"
            >
              {connected ? "Connected" : "Setup"}
            </Badge>
          </div>
        </Link>

        {/* Functional Notification Control */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="h-9 w-9 p-0 rounded-full text-slate-400 hover:text-white relative"
            title="Notifications"
            aria-label="Toggle notifications"
          >
            <Bell className="h-4 w-4" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-400 ring-2 ring-surface-950" />
            )}
          </Button>

          {/* Notifications Dropdown Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-surface-900 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Studio Notifications
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {notifications.filter((n) => !n.read).length} Unread
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-brand-400 hover:text-brand-300 font-medium"
                  >
                    Mark read
                  </button>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{item.title}</span>
                      <span className="text-[10px] text-slate-500">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account / Profile Quick Access */}
        {authLoading ? (
          <div className="h-8 w-24 rounded-full bg-slate-900 animate-pulse border border-slate-800" />
        ) : user ? (
          <Link href="/profile">
            <div className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer max-w-[160px] sm:max-w-[200px]">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                {user.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="text-xs font-medium text-slate-200 truncate hidden sm:inline">
                {user.email ? user.email.split("@")[0] : "Profile"}
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/auth/login">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
              <User className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
