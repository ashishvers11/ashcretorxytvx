"use client";

import Link from "next/link";
import { Sparkles, Youtube, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-surface-950/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
      {/* Left: Platform badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <Youtube className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-400">YouTube Channel: <span className="text-amber-400 font-medium">Not Connected</span></span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full text-slate-400 hover:text-white">
          <Bell className="h-4 w-4" />
        </Button>
        <Link href="/profile">
          <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium text-slate-200">Creator Account</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
