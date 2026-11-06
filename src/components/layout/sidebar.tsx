"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Youtube,
  Radio,
  ExternalLink,
} from "lucide-react";
import { NAVIGATION_SECTIONS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const { channel } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-200/80 dark:border-navy-800 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md transition-all duration-300 ease-in-out lg:static shadow-sm lg:shadow-none",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-navy-800/80">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-navy-900 text-white font-bold text-lg shadow-md shadow-brand-500/20">
              <Sparkles className="h-5 w-5 text-brand-300" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base leading-none">
                  ASH <span className="text-brand-500">STUDIO</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase mt-1">
                  Creator Growth OS
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-navy-700 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAVIGATION_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {(!isCollapsed || isMobileOpen) && (
                <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.title}
                </h4>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      title={isCollapsed && !isMobileOpen ? item.name : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        isActive
                          ? "bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400 font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900 hover:text-slate-900 dark:hover:text-white",
                        isCollapsed && !isMobileOpen && "justify-center px-0"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-brand-500" />
                      )}
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors",
                          isActive
                            ? "text-brand-500 dark:text-brand-400"
                            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                        )}
                      />

                      {(!isCollapsed || isMobileOpen) && (
                        <div className="flex flex-1 items-center justify-between overflow-hidden">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant={item.isComingSoon ? "comingSoon" : "brand"}
                              className="ml-2 shrink-0 text-[10px] py-0 px-1.5 font-semibold"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Channel Status Widget */}
        <div className="border-t border-slate-200/80 dark:border-navy-800/80 p-3">
          {(!isCollapsed || isMobileOpen) ? (
            <div className="rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-900/60 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Channel Status
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium">
                  {channel ? (
                    <span className="flex items-center text-emerald-500 gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center text-slate-400 gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Offline
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <Youtube className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {channel ? channel.channel_title : "No Channel Linked"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {channel ? `@${channel.custom_url || "channel"}` : "Connect in dashboard"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border",
                  channel
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-slate-200 dark:border-navy-800 text-slate-400"
                )}
                title={channel ? `Connected: ${channel.channel_title}` : "No Channel Connected"}
              >
                <Youtube className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
