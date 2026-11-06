import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brand" | "outline" | "success" | "warning" | "destructive" | "comingSoon";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-slate-100 dark:bg-navy-800 text-slate-800 dark:text-slate-200 border-transparent",
    brand:
      "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20",
    outline:
      "border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-300 bg-transparent",
    success:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    destructive:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    comingSoon:
      "bg-navy-800/10 dark:bg-navy-700/50 text-navy-600 dark:text-brand-300 border border-navy-300 dark:border-navy-600 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
