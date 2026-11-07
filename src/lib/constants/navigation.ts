import {
  LayoutDashboard,
  FileSearch,
  Flame,
  Film,
  Search,
  Image as ImageIcon,
  UserCircle,
  BarChart3,
  Video,
  Users2,
  Calendar,
  Sparkles,
  Palette,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  isComingSoon?: boolean;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Strictly aligned with ASH Creator Studio PRD Section 2 & Section 17.2
export const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: "CORE WORKFLOW",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        isComingSoon: false,
        description: "Central workspace: channel overview, trend radar & content workflow",
      },
      {
        name: "Channel Audit",
        href: "/modules/channel-audit",
        icon: FileSearch,
        isComingSoon: false,
        badge: "Audit AI",
        description: "50-point automated SEO, packaging and metadata health audit",
      },
      {
        name: "Trend Research",
        href: "/modules/trend-research",
        icon: Flame,
        isComingSoon: false,
        badge: "Live YT",
        description: "Breakout search trends & topic discovery with direct script handoff",
      },
      {
        name: "Video Production",
        href: "/modules/script-writer",
        icon: Film,
        isComingSoon: false,
        badge: "AI Studio",
        description: "Scriptwriting (Mode A/B), 10-style scene planning & character consistency",
      },
      {
        name: "SEO Studio",
        href: "/modules/seo-studio",
        icon: Search,
        isComingSoon: false,
        badge: "Rank 1",
        description: "High-CTR title formulas, structured descriptions & tag optimization",
      },
      {
        name: "Thumbnail Studio",
        href: "/modules/thumbnail-studio",
        icon: ImageIcon,
        isComingSoon: false,
        badge: "High CTR",
        description: "AI thumbnail concepts, visual prompt generator & mobile feed simulator",
      },
      {
        name: "Profile",
        href: "/profile",
        icon: UserCircle,
        isComingSoon: false,
        description: "Creator persona, channel DNA, and YouTube integration settings",
      },
    ],
  },
  {
    title: "CREATOR LABS & TOOLS",
    items: [
      {
        name: "AI Style Lab",
        href: "/modules/style-lab",
        icon: Palette,
        isComingSoon: false,
        badge: "10 Styles",
        description: "Visual styles library, custom prompt modifiers & style DNA editor",
      },
      {
        name: "Channel Analytics",
        href: "/modules/channel-analytics",
        icon: BarChart3,
        isComingSoon: false,
        badge: "Live API",
        description: "Official 7d, 28d & 90d YouTube Analytics API performance",
      },
      {
        name: "Video Analyzer",
        href: "/modules/video-analyzer",
        icon: Video,
        isComingSoon: false,
        badge: "AI",
        description: "Per-video diagnostic engine detecting drop-offs and retention anomalies",
      },
      {
        name: "Competitor Research",
        href: "/modules/competitor-research",
        icon: Users2,
        isComingSoon: false,
        badge: "Outliers",
        description: "Track top niche creators and reverse-engineer viral outlier videos",
      },
      {
        name: "Content Calendar",
        href: "/modules/content-calendar",
        icon: Calendar,
        isComingSoon: false,
        badge: "Schedule",
        description: "Visual publishing cadence planner for Shorts and Long-form",
      },
      {
        name: "AI Assistant",
        href: "/modules/creator-ai-assistant",
        icon: Sparkles,
        isComingSoon: false,
        badge: "Copilot",
        description: "Conversational YouTube growth strategist and channel copilot",
      },
    ],
  },
];
