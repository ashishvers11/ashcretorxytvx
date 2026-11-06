import {
  LayoutDashboard,
  FileSearch,
  BarChart3,
  Video,
  Flame,
  Lightbulb,
  Users2,
  PenTool,
  Search,
  Image as ImageIcon,
  Palette,
  Film,
  Calendar,
  UserCircle,
  Settings,
  LucideIcon,
  Sparkles,
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

export const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        isComingSoon: false,
        description: "Primary mission control for your YouTube growth and channels",
      },
      {
        name: "Channel Audit",
        href: "/modules/channel-audit",
        icon: FileSearch,
        isComingSoon: false,
        badge: "Audit AI",
        description: "50-point automated SEO, packaging and metadata health audit",
      },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      {
        name: "Channel Analytics",
        href: "/modules/channel-analytics",
        icon: BarChart3,
        isComingSoon: false,
        badge: "Live API",
        description: "Official 7d, 28d & 90d YouTube Analytics API with watch time and retention",
      },
      {
        name: "Video Analyzer",
        href: "/modules/video-analyzer",
        icon: Video,
        isComingSoon: false,
        badge: "AI",
        description: "Per-video diagnostic engine detecting drop-offs and CTR anomalies",
      },
    ],
  },
  {
    title: "RESEARCH",
    items: [
      {
        name: "Trend Research",
        href: "/modules/trend-research",
        icon: Flame,
        isComingSoon: false,
        badge: "Live YT",
        description: "Real-time YouTube search trend breakout radar with visual style recommendations",
      },
      {
        name: "Video Ideas",
        href: "/modules/video-ideas",
        icon: Lightbulb,
        isComingSoon: false,
        badge: "Curiosity",
        description: "AI brainstorm engine trained on high-retention Education & Science formats",
      },
      {
        name: "Competitor Research",
        href: "/modules/competitor-research",
        icon: Users2,
        isComingSoon: false,
        badge: "Outliers",
        description: "Track top Education & Science creators and reverse-engineer 10x hits",
      },
    ],
  },
  {
    title: "AI VIDEO STUDIO",
    items: [
      {
        name: "AI Video & Script Studio",
        href: "/modules/script-writer",
        icon: Film,
        isComingSoon: false,
        badge: "AI Prompts",
        description: "Generate full scripts + scene-by-scene AI video prompts with character consistency & styles",
      },
      {
        name: "AI Style Lab",
        href: "/modules/style-lab",
        icon: Palette,
        isComingSoon: false,
        badge: "6 Trending",
        description: "Browse 6 market-trending visual styles and create/save custom video style prompts",
      },
      {
        name: "SEO Studio",
        href: "/modules/seo-studio",
        icon: Search,
        isComingSoon: false,
        badge: "Rank 1",
        description: "High-ranking Hindi & English title formulas, timestamps, and tag optimization",
      },
      {
        name: "Thumbnail Studio",
        href: "/modules/thumbnail-studio",
        icon: ImageIcon,
        isComingSoon: false,
        badge: "Simulator",
        description: "Visual contrast preview and mobile feed simulator for high CTR",
      },
      {
        name: "Content Calendar",
        href: "/modules/content-calendar",
        icon: Calendar,
        isComingSoon: false,
        badge: "Schedule",
        description: "Visual publishing cadence planner for Shorts and Long-form videos",
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        name: "Profile",
        href: "/profile",
        icon: UserCircle,
        isComingSoon: false,
        description: "Manage your creator identity, Education niche specialization, and localization",
      },
      {
        name: "Account Settings",
        href: "/settings",
        icon: Settings,
        isComingSoon: false,
        description: "Google OAuth credentials, theme preferences, and connected channel management",
      },
    ],
  },
];
