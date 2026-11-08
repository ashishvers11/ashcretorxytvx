"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Film,
  Video,
  Sliders,
  Layers,
  Music,
  Volume2,
  CheckSquare,
  Sparkles,
  Copy,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  Camera,
  UserCheck,
  Zap,
  Lock,
  Eye,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useYouTubeChannel } from "@/hooks/use-youtube-channel";
import { sanitizeTopicForAIPrompt, buildSafeMotionPrompt, buildCinematicScenePrompts } from "@/lib/ai/prompt-safety";

// Helper to extract a concise, natural spoken topic for teleprompter and prompts
function cleanTopicForSpoken(topic: string): string {
  let s = topic.trim();
  s = s.replace(/^(The Untold Truth Behind:\s*|Shocking:\s*|Why\s+|What If\s+|The Real Truth About\s+)/i, "");
  if (s.includes(":")) {
    const parts = s.split(":");
    const lastPart = parts[parts.length - 1].trim();
    const firstPart = parts[0].trim();
    s = lastPart.length > 8 && lastPart.length < 40 ? lastPart : firstPart;
  }
  s = s.replace(/\s*[\(\[][^\)\]]*[\)\]]/g, "").trim();
  s = s.replace(/[?!.]+$/, "").trim();
  return s || topic;
}

// 9 Production Video Styles (8 Viral Creator Styles + 1 Connected Channel Signature)
interface VideoStyleOption {
  id: string;
  name: string;
  creatorTag: string;
  badge: string;
  description: string;
  camera: string;
  lighting: string;
  aiTools: string;
  aspect: "9:16" | "16:9";
  colorHex: string;
  previewSvg: React.ReactNode;
}

const VIDEO_STYLES: VideoStyleOption[] = [
  {
    id: "style-stickman",
    name: "3D Sticky Man Animation (Channel Signature)",
    creatorTag: "🪄 3D Sticky Man",
    badge: "User Channel Style • Viral #1",
    description: "Minimalist 3D white stick figure (sticky man) with big expressive cartoon eyes, smooth rounded 3D stick limbs, Zack D. Films & Alan Becker animation style, zero realistic humans.",
    camera: "Dynamic 60fps tracking camera following the 3D stickman, comic snap-zooms and kinetic infographic pops",
    lighting: "Vibrant clean studio lighting with soft cartoon drop-shadows on modern dark slate background",
    aiTools: "Midjourney 3D Stylized + Runway Gen-3 / Kling 1.5",
    aspect: "9:16",
    colorHex: "#38bdf8",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#090d16" />
        <circle cx="100" cy="60" r="45" fill="url(#stickmanGlow)" opacity="0.35" />
        <circle cx="100" cy="38" r="14" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
        <ellipse cx="96" cy="37" rx="2.5" ry="4" fill="#0f172a" />
        <ellipse cx="104" cy="37" rx="2.5" ry="4" fill="#0f172a" />
        <ellipse cx="97" cy="35" rx="1" ry="1.5" fill="#ffffff" />
        <ellipse cx="105" cy="35" rx="1" ry="1.5" fill="#ffffff" />
        <line x1="100" y1="52" x2="100" y2="80" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <path d="M100 60 L78 70 L65 58" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M100 60 L122 68 L138 56" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M100 80 L84 104" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M100 80 L116 104" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
        <text x="100" y="115" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">3D STICKY MAN</text>
        <defs>
          <radialGradient id="stickmanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#090d16" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "style-curiokid-cartoon",
    name: "CURIOKID 3D Cartoon Explorer",
    creatorTag: "👦 CURIOKID VERS",
    badge: "Channel Avatar",
    description: "Pixar/Disney 3D animated cartoon boy explorer with adventurer hat, huge curious eyes, vibrant stylized cartoon world, zero realistic humans.",
    camera: "Cinematic 60fps crane orbit and push-in tracking the cartoon character",
    lighting: "Warm fairytale golden rim lighting, soft subsurface scattering, vibrant saturated palette",
    aiTools: "Midjourney v6 3D Pixar + Kling 1.5",
    aspect: "9:16",
    colorHex: "#f59e0b",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#0c1222" />
        <circle cx="100" cy="60" r="45" fill="url(#curioGlow)" opacity="0.3" />
        <path d="M72 36 Q100 18 128 36 L138 42 L62 42 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="100" cy="54" r="16" fill="#fed7aa" />
        <circle cx="95" cy="52" r="3.5" fill="#0284c7" />
        <circle cx="105" cy="52" r="3.5" fill="#0284c7" />
        <path d="M96 61 Q100 65 104 61" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M85 70 L115 70 L110 92 L90 92 Z" fill="#0284c7" />
        <text x="100" y="112" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">CURIOKID CARTOON</text>
        <defs>
          <radialGradient id="curioGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0c1222" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "style-ashishfn",
    name: "ASHISH FN Signature (Connected Channel)",
    creatorTag: "🎯 Channel Signature",
    badge: "Active Synced",
    description: "High-contrast 3D character cutout, vibrant yellow/cyan grading, sticker callouts, and punchy Indian fact formatting.",
    camera: "Dynamic fast push-in, 60fps snap zoom with motion blur",
    lighting: "Vibrant dual-rim lighting (neon cyan and warm gold), deep dark vignette",
    aiTools: "FLUX.1 Pro + Kling 1.5 Pro / Runway Gen-3",
    aspect: "9:16",
    colorHex: "#06b6d4",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#090d16" />
        <circle cx="100" cy="60" r="45" fill="url(#cyanGlow)" opacity="0.4" />
        <rect x="75" y="30" width="50" height="60" rx="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
        <circle cx="100" cy="50" r="14" fill="#38bdf8" />
        <path d="M85 80 Q100 70 115 80" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
        <text x="100" y="105" textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold">ASHISH FN 3D</text>
        <defs>
          <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#090d16" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "style-zackd",
    name: "Zack D. Films 3D Simulation",
    creatorTag: "🎬 Zack D. Films",
    badge: "Viral #1",
    description: "Photorealistic 3D medical & physical anatomical simulations, cross-section reveal, clinical studio lighting, and clay humanoid models.",
    camera: "Slow 360-degree anatomical orbital pan, micro-cross-section zoom",
    lighting: "Sterile cool-white medical laboratory studio, subsurface scattering",
    aiTools: "Midjourney v6 3D Octane + Runway Gen-3 Alpha",
    aspect: "9:16",
    colorHex: "#3b82f6",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#081020" />
        <rect x="70" y="25" width="60" height="70" rx="12" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
        <line x1="100" y1="25" x2="100" y2="95" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="100" cy="55" r="10" fill="#f87171" opacity="0.8" />
        <text x="100" y="112" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold">3D ANATOMY SCAN</text>
      </svg>
    ),
  },
  {
    id: "style-facttechz",
    name: "FactTechz Hyper-Cinematic Cosmos",
    creatorTag: "🌌 FactTechz",
    badge: "Cinematic",
    description: "Deep space darkness, volumetric glowing cyan/blue HUD lines, particle dust motes, floating celestial bodies, and mysterious depth.",
    camera: "Slow ominous backward dolly pullout, anamorphic blue lens flare",
    lighting: "Chiaroscuro space noir with volumetric cyan laser light sheets",
    aiTools: "Midjourney v6 Photoreal 8K + Runway Gen-3",
    aspect: "9:16",
    colorHex: "#8b5cf6",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#050510" />
        <circle cx="100" cy="60" r="30" fill="url(#purpleCosmos)" />
        <circle cx="100" cy="60" r="38" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="45" cy="30" r="1.5" fill="#ffffff" />
        <circle cx="160" cy="40" r="2" fill="#38bdf8" />
        <circle cx="140" cy="90" r="1.5" fill="#c084fc" />
        <text x="100" y="110" textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="bold">DEEP SPACE COSMOS</text>
        <defs>
          <radialGradient id="purpleCosmos" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#050510" />
          </radialGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "style-dhruv",
    name: "Dhruv Rathee Infographic Explainer",
    creatorTag: "📊 Dhruv Rathee",
    badge: "High-Trust",
    description: "Minimalist high-contrast motion graphics, animated 3D topographic maps, floating highlighted newspaper cutouts, and spotlight diagrams.",
    camera: "Flat isometric pan, dynamic newspaper push-in, kinetic diagram pop",
    lighting: "Clean high-key daylight studio with soft yellow spotlight callouts",
    aiTools: "FLUX Pro + Motion Graphics & Overlay Cards",
    aspect: "9:16",
    colorHex: "#f59e0b",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#0f172a" />
        <rect x="40" y="25" width="120" height="65" rx="4" fill="#ffffff" opacity="0.9" />
        <rect x="50" y="35" width="50" height="8" fill="#0f172a" />
        <rect x="50" y="48" width="100" height="4" fill="#94a3b8" />
        <rect x="50" y="56" width="80" height="4" fill="#f59e0b" />
        <circle cx="130" cy="40" r="12" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="2" />
        <text x="100" y="108" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">EVIDENCE ARCHIVE</text>
      </svg>
    ),
  },
  {
    id: "style-mrbeast",
    name: "MrBeast High-Energy Fast-Cut",
    creatorTag: "⚡ MrBeast",
    badge: "High-Retention",
    description: "Ultra-saturated 4K HDR, exaggerated shocked facial expressions, thick stroke graphics, yellow sparks, explosive contrast.",
    camera: "Whip pans, instant snap crash-zooms, 1000fps slow-motion payoff",
    lighting: "Over-the-top high-saturation stadium lights with golden rim highlight",
    aiTools: "Midjourney v6 Character + Kling 1.5 High-Motion",
    aspect: "9:16",
    colorHex: "#ef4444",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#180404" />
        <path d="M100 20 L120 55 L160 60 L130 85 L140 115 L100 95 L60 115 L70 85 L40 60 L80 55 Z" fill="#ef4444" stroke="#facc15" strokeWidth="2" />
        <text x="100" y="70" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">4K !</text>
      </svg>
    ),
  },
  {
    id: "style-darkmystery",
    name: "Dark Mystery & True Crime Noir",
    creatorTag: "🕵️ True Crime Noir",
    badge: "Suspense",
    description: "Atmospheric chiaroscuro shadows, slow drifting volumetric fog, 35mm grain, red evidence thread connecting case files, moody amber streetlights.",
    camera: "Creeping slow dolly-in, ultra-shallow depth of field (f/1.2)",
    lighting: "Single directional amber desk lamp through venetian blinds",
    aiTools: "Midjourney v6 35mm Noir + Runway Gen-3",
    aspect: "9:16",
    colorHex: "#e11d48",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#090505" />
        <line x1="30" y1="30" x2="100" y2="70" stroke="#e11d48" strokeWidth="2" />
        <line x1="100" y1="70" x2="170" y2="35" stroke="#e11d48" strokeWidth="2" />
        <circle cx="30" cy="30" r="6" fill="#f43f5e" />
        <circle cx="100" cy="70" r="7" fill="#fbbf24" />
        <circle cx="170" cy="35" r="6" fill="#f43f5e" />
        <text x="100" y="105" textAnchor="middle" fill="#fda4af" fontSize="9" fontWeight="bold">UNSOLVED MYSTERY</text>
      </svg>
    ),
  },
  {
    id: "style-asmr",
    name: "Satisfying Macro 3D ASMR",
    creatorTag: "✨ Visual ASMR",
    badge: "Relaxing Viral",
    description: "Ray-traced translucent glass, viscous fluid dynamics, 1000fps ultra-slow-motion textures, iridescent sheen, hypnotizing visual satisfaction.",
    camera: "Microscopic macro focus pull, seamless continuous fluid gliding",
    lighting: "Soft iridescent gradient studio lighting with prism rainbow caustics",
    aiTools: "Cinema4D Octane Look via Midjourney v6 + Kling 1.5",
    aspect: "9:16",
    colorHex: "#10b981",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#03140e" />
        <circle cx="80" cy="60" r="30" fill="#10b981" opacity="0.6" />
        <circle cx="120" cy="60" r="25" fill="#06b6d4" opacity="0.6" />
        <circle cx="100" cy="50" r="18" fill="#a7f3d0" opacity="0.8" />
        <text x="100" y="108" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">1000FPS MACRO FLUID</text>
      </svg>
    ),
  },
  {
    id: "style-cyberpunk",
    name: "Cyberpunk / Anime Manga Action",
    creatorTag: "🎌 Cyber Manga",
    badge: "Fast Viral",
    description: "Cel-shaded modern anime aesthetic, glowing neon magenta/teal rim light, speed lines, holographic HUD overlays, dynamic comic perspective.",
    camera: "High-speed parallax tracking, dynamic anime perspective tilt",
    lighting: "Neon cyan and hot magenta night cityscape illumination",
    aiTools: "Midjourney Niji 6 + Runway Gen-3",
    aspect: "9:16",
    colorHex: "#d946ef",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#0d0415" />
        <line x1="20" y1="100" x2="180" y2="20" stroke="#d946ef" strokeWidth="3" />
        <line x1="40" y1="110" x2="190" y2="35" stroke="#06b6d4" strokeWidth="2" />
        <polygon points="100,30 140,80 80,75" fill="#f43f5e" opacity="0.8" />
        <text x="100" y="110" textAnchor="middle" fill="#f0abfc" fontSize="9" fontWeight="bold">ANIME SPEEDLINES</text>
      </svg>
    ),
  },
  {
    id: "style-papercut",
    name: "Vintage Paper Cut-Out Stop Motion",
    creatorTag: "🎨 Vintage Cutout",
    badge: "Storybook",
    description: "Layered textured craft paper, subtle stop-motion 12fps jitter, charming tactile cardboard dioramas, whimsical retro documentary feel.",
    camera: "Fixed tripod stop-motion framing, subtle cardboard depth shifting",
    lighting: "Warm soft overhead table lamp, natural paper drop-shadows",
    aiTools: "Midjourney v6 Papercraft + Pika Labs",
    aspect: "9:16",
    colorHex: "#eab308",
    previewSvg: (
      <svg viewBox="0 0 200 120" className="w-full h-full rounded-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="120" fill="#1f1807" />
        <rect x="50" y="30" width="100" height="60" rx="2" fill="#ca8a04" opacity="0.4" />
        <rect x="65" y="20" width="70" height="60" rx="2" fill="#facc15" opacity="0.7" />
        <circle cx="100" cy="50" r="16" fill="#fef08a" />
        <text x="100" y="108" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="bold">STOP-MOTION CRAFT</text>
      </svg>
    ),
  },
];

interface ChoreographedScene {
  id: string;
  number: number;
  durationSeconds: number; // Hook strictly 3s, other cuts strictly < 10s
  title: string;
  sceneType: "Hook (3s)" | "Assumption Break" | "Core 3D Mechanism" | "Infinite Loop";
  visualDirection: string;
  voiceover: string;
  imagePrompt: string;
  motionPrompt: string;
  sfx: string;
  onScreenText: string;
}

export default function VideoProductionPage() {
  const { channel, connected } = useYouTubeChannel();
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "ASML Microchip Monopoly & Extreme EUV Physics";

  const [topic, setTopic] = useState<string>(initialTopic);
  const [selectedStyleId, setSelectedStyleId] = useState<string>("style-stickman");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9">("9:16");
  const [durationMode, setDurationMode] = useState<"under30" | "standard60">("under30");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // 100% Character Consistency Engine (Cartoonish & 3D Sticky Man)
  const [characterConsistencyLocked, setCharacterConsistencyLocked] = useState<boolean>(true);
  const [characterAnchor, setCharacterAnchor] = useState<string>(
    "3D stylized minimalist white stickman (sticky man) with big expressive cartoon eyes, smooth rounded 3D stick limbs, Zack D. Films / Alan Becker cartoon animation style, high-end 3D render, no realistic humans, no photorealistic people"
  );

  const cleanSpoken = useMemo(() => cleanTopicForSpoken(topic), [topic]);

  // Active Style
  const activeStyle = useMemo(() => {
    return VIDEO_STYLES.find((s) => s.id === selectedStyleId) || VIDEO_STYLES[0];
  }, [selectedStyleId]);

  // Build Fast Viral Scenes: Hook STRICTLY 3s, all other cuts automatically UNDER 10s. ZERO "part 2"!
  const buildUnder30Scenes = (spokenTitle: string): ChoreographedScene[] => {
    const p1 = buildCinematicScenePrompts(spokenTitle, 1, false);
    const p2 = buildCinematicScenePrompts(spokenTitle, 2, false);
    const p3 = buildCinematicScenePrompts(spokenTitle, 3, false);
    const p4 = buildCinematicScenePrompts(spokenTitle, 4, true);

    return [
      {
        id: "sc-1",
        number: 1,
        durationSeconds: 3, // STRICTLY 3 SECONDS
        title: "The Impossible Hook (Pattern Interrupt)",
        sceneType: "Hook (3s)",
        visualDirection: p1.directorCue,
        voiceover: `Wait! Kya aapko pata hai iske peeche ka real visual secret kya hai?`,
        imagePrompt: p1.imagePrompt,
        motionPrompt: p1.motionPrompt,
        sfx: "Sub-bass 808 drop + Vinyl needle scratch stop",
        onScreenText: "WAIT FOR THIS... 😱",
      },
      {
        id: "sc-2",
        number: 2,
        durationSeconds: 7, // UNDER 10s (7 seconds)
        title: "The Hidden Reality (Assumption Break)",
        sceneType: "Assumption Break",
        visualDirection: p2.directorCue,
        voiceover: `Almost 99% log iske underlying mechanics ko completely miss kar dete hain. But high-speed scans ne kuch aur hi reveal kiya!`,
        imagePrompt: p2.imagePrompt,
        motionPrompt: p2.motionPrompt,
        sfx: "Fast whoosh cut + UI glitch beep",
        onScreenText: "THE UNSEEN DETAIL ❌",
      },
      {
        id: "sc-3",
        number: 3,
        durationSeconds: 8, // UNDER 10s (8 seconds)
        title: "The Core 3D Mechanism & Evidence",
        sceneType: "Core 3D Mechanism",
        visualDirection: p3.directorCue,
        voiceover: `Actually, yahan operate kar raha hai ek unbelievable scientific principle jo extreme dynamic stress ko 100% absorb karta hai!`,
        imagePrompt: p3.imagePrompt,
        motionPrompt: p3.motionPrompt,
        sfx: "Rising violin tension + Digital scan hum",
        onScreenText: "WHAT ACTUALLY HAPPENS ⚡",
      },
      {
        id: "sc-4",
        number: 4,
        durationSeconds: 8, // UNDER 10s (8 seconds) — Infinite Retention Loop (NO PART 2)
        title: "Seamless Retention Loop (Infinite Replay)",
        sceneType: "Infinite Loop",
        visualDirection: p4.directorCue,
        voiceover: `Isliye ye itna bada viral secret hai — share karo unke saath jo iske baare mein bilkul nahi jaante!`,
        imagePrompt: p4.imagePrompt,
        motionPrompt: p4.motionPrompt,
        sfx: "Cinematic impact boom resolving cleanly into opening ambient chord",
        onScreenText: "MIND BLOWN 🤯",
      },
    ];
  };

  const buildStandard60Scenes = (spokenTitle: string): ChoreographedScene[] => {
    const p1 = buildCinematicScenePrompts(spokenTitle, 1, false);
    const p2 = buildCinematicScenePrompts(spokenTitle, 2, false);
    const p3 = buildCinematicScenePrompts(spokenTitle, 3, false);
    const p4 = buildCinematicScenePrompts(spokenTitle, 4, false);
    const p5 = buildCinematicScenePrompts(spokenTitle, 5, false);
    const p6 = buildCinematicScenePrompts(spokenTitle, 6, true);

    return [
      {
        id: "sc-1",
        number: 1,
        durationSeconds: 3,
        title: "The Impossible Hook (Pattern Interrupt)",
        sceneType: "Hook (3s)",
        visualDirection: p1.directorCue,
        voiceover: `Wait! Kya aapko pata hai iske peeche ka real visual secret kya hai?`,
        imagePrompt: p1.imagePrompt,
        motionPrompt: p1.motionPrompt,
        sfx: "Sub-bass 808 drop + Vinyl needle scratch stop",
        onScreenText: "WAIT FOR THIS... 😱",
      },
      {
        id: "sc-2",
        number: 2,
        durationSeconds: 8,
        title: "The Common Misconception",
        sceneType: "Assumption Break",
        visualDirection: p2.directorCue,
        voiceover: "Almost 99% log iske underlying mechanics ko completely overlook kar dete hain aur isko ek simple coincidence samajhte hain.",
        imagePrompt: p2.imagePrompt,
        motionPrompt: p2.motionPrompt,
        sfx: "Whoosh transition + Low ambient drone",
        onScreenText: "COMMON MYTH ❌",
      },
      {
        id: "sc-3",
        number: 3,
        durationSeconds: 8,
        title: "The Laboratory Discovery",
        sceneType: "Assumption Break",
        visualDirection: p3.directorCue,
        voiceover: "Lekin recent laboratory scans mein dekha gaya ki yahan ek specific physical law operate karta hai.",
        imagePrompt: p3.imagePrompt,
        motionPrompt: p3.motionPrompt,
        sfx: "Mechanical hum + Electronic beep",
        onScreenText: "THE UNSEEN DETAIL 🔬",
      },
      {
        id: "sc-4",
        number: 4,
        durationSeconds: 9,
        title: "The Core 3D Mechanism",
        sceneType: "Core 3D Mechanism",
        visualDirection: p4.directorCue,
        voiceover: "Actually, yahan operate kar raha hai ek ground-breaking physical law jo dynamic stress ko 100% absorb karta hai!",
        imagePrompt: p4.imagePrompt,
        motionPrompt: p4.motionPrompt,
        sfx: "Digital UI data chirp + Rising cinematic string swell",
        onScreenText: "WHAT ACTUALLY HAPPENS ⚡",
      },
      {
        id: "sc-5",
        number: 5,
        durationSeconds: 9,
        title: "The Real-World Consequence",
        sceneType: "Core 3D Mechanism",
        visualDirection: p5.directorCue,
        voiceover: "Bottom line: Ye koi lucky coincidence nahi hai, balki evidence-based science aur precision ka perfect combination hai.",
        imagePrompt: p5.imagePrompt,
        motionPrompt: p5.motionPrompt,
        sfx: "Deep sub-bass swell + Resolving synth pad",
        onScreenText: "EVIDENCE-BASED SCIENCE 🏆",
      },
      {
        id: "sc-6",
        number: 6,
        durationSeconds: 8,
        title: "Seamless Retention Loop (Infinite Replay)",
        sceneType: "Infinite Loop",
        visualDirection: p6.directorCue,
        voiceover: `Aur yahi mind-blowing reason hai jo isko sabse unique aur viral banata hai!`,
        imagePrompt: p6.imagePrompt,
        motionPrompt: p6.motionPrompt,
        sfx: "Cinematic impact boom + Soft resolving chord",
        onScreenText: "MIND BLOWN 🤯",
      },
    ];
  };

  // Choreographed Scenes with Auto-Split under 10s (Hook 3s)
  const [scenes, setScenes] = useState<ChoreographedScene[]>(() =>
    buildUnder30Scenes(cleanTopicForSpoken(initialTopic))
  );

  // Sync script from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ash_active_script");
      if (stored) {
        const parsed = JSON.parse(stored);
        let rawScenes: any[] = [];
        if (Array.isArray(parsed.scenes)) {
          rawScenes = parsed.scenes;
        } else if (parsed.scenes && Array.isArray(parsed.scenes.scenes)) {
          rawScenes = parsed.scenes.scenes;
        } else if (parsed.scenes && Array.isArray(parsed.scenes.sceneList)) {
          rawScenes = parsed.scenes.sceneList;
        }

        if (rawScenes.length > 0) {
          const mappedScenes: ChoreographedScene[] = rawScenes.map((s: any, idx: number) => {
            const voLine = s.voiceover || s.voiceoverLine || s.spokenLine || s.text || "";
            const wordCount = voLine.split(/\s+/).filter(Boolean).length;
            // Pacing: ~2.3 words per second (natural speaking speed ~130-140 WPM)
            const calculatedDuration = idx === 0 ? 3 : Math.min(9, Math.max(3, Math.round(wordCount / 2.3)));
            const duration = s.durationSeconds || calculatedDuration;

            return {
              id: s.id || `sc-${idx + 1}`,
              number: s.sceneNumber || idx + 1,
              durationSeconds: duration,
              title: s.title || (idx === 0 ? "Scene 1: 3-Second Viral Hook" : idx === rawScenes.length - 1 ? "Final Scene: Payoff & Retention Loop" : `Scene ${idx + 1}: Story Progression`),
              sceneType: idx === 0 ? "Hook (3s)" : idx === rawScenes.length - 1 ? "Infinite Loop" : "Core 3D Mechanism",
              visualDirection: s.visualDirection || s.visualConcept || `Cinematic visual capture for ${cleanSpoken}`,
              voiceover: voLine,
              imagePrompt: s.imagePrompt || `Cinematic 8k photorealistic close-up of ${cleanSpoken}, scene ${idx + 1}, dramatic volumetric studio lighting, Octane render 8K, 9:16 aspect ratio --v 6.1`,
              motionPrompt: s.motionPrompt || "Runway Gen-3: Dynamic 60fps tracking camera push-in, volumetric lighting, smooth cinematic motion",
              sfx: s.sfx || s.soundEffect || (idx === 0 ? "Bass 808 Impact + Vinyl stop" : idx === rawScenes.length - 1 ? "Dramatic tension riser into seamless resolution" : "Ambient cinematic pulse + subtle synth"),
              onScreenText: s.onScreenText?.includes("PART 2") ? "MIND BLOWN 🤯" : s.onScreenText || (voLine.slice(0, 26) + "..."),
            };
          });

          setScenes(mappedScenes);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load stored script", e);
    }

    // Default rebuild
    setScenes(
      durationMode === "under30"
        ? buildUnder30Scenes(cleanSpoken)
        : buildStandard60Scenes(cleanSpoken)
    );
  }, [cleanSpoken, durationMode]);

  // Handle Preset Duration Switch (Automatic Split under 10s)
  const handleApplyDurationMode = (mode: "under30" | "standard60") => {
    setDurationMode(mode);
    if (mode === "under30") {
      setScenes(buildUnder30Scenes(cleanSpoken));
    } else {
      setScenes(buildStandard60Scenes(cleanSpoken));
    }
  };

  // Calculate dynamic timecodes and total runtime
  const { totalRuntimeSeconds, scenesWithTimecodes } = useMemo(() => {
    let currentSeconds = 0;
    const computed = scenes.map((s) => {
      const startSec = currentSeconds;
      const endSec = currentSeconds + s.durationSeconds;
      currentSeconds = endSec;

      const formatTime = (sec: number) => {
        const mins = Math.floor(sec / 60);
        const secs = sec % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      };

      return {
        ...s,
        timecode: `${formatTime(startSec)} - ${formatTime(endSec)}`,
      };
    });

    return {
      totalRuntimeSeconds: currentSeconds,
      scenesWithTimecodes: computed,
    };
  }, [scenes]);

  // Interactive Checklist
  const [checklist, setChecklist] = useState([
    { id: "1", task: "Generate Midjourney 8K Scene Keyframes", completed: true, category: "Visuals" },
    { id: "2", task: "Lock 100% Character Consistency Geometry", completed: true, category: "AI Consistency" },
    { id: "3", task: "Feed Motion Prompts into Runway Gen-3 / Kling 1.5", completed: false, category: "Video Gen" },
    { id: "4", task: "Record voiceover audio synced to scene timers", completed: false, category: "Voiceover" },
    { id: "5", task: "Place sound design (SFX) on scene cuts", completed: false, category: "Audio Design" },
    { id: "6", task: "Export 4K 60fps ProRes/MP4 with high contrast LUT", completed: false, category: "Export" },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };
  const completedCount = checklist.filter((c) => c.completed).length;

  // Copy handler
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Film className="h-6 w-6 text-brand-400" />
            <span>Video Production Studio (Director Suite)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hook strictly <strong>3 seconds</strong> • Saare visual cuts <strong>automatically under 10 seconds</strong> • Seamless infinite loop (No Part 2).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={totalRuntimeSeconds <= 30 ? "success" : "outline"}
            className="gap-1.5 py-1 px-3 text-xs font-semibold"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Total Runtime: {totalRuntimeSeconds}s</span>
            {totalRuntimeSeconds <= 30 && <span className="text-[10px] bg-emerald-500/20 px-1 rounded font-bold">⚡ Fast Viral</span>}
          </Badge>
          <Link href={`/seo-studio?topic=${encodeURIComponent(topic)}`}>
            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold">
              <span>Next: SEO Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 9 Viral Video Styles Selection Grid */}
      <div className="space-y-3">
        <div className="p-3.5 rounded-xl border border-brand-500/30 bg-brand-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
            <span className="text-slate-200">
              <strong>STYLE KAISA BADLEIN?</strong> Neeche diye gaye <strong>9 Styles</strong> me se kisi par bhi click karein — wo turant select ho jayega aur prompts usi style me adapt ho jayenge!
            </span>
          </div>
          <Badge variant="success" className="shrink-0 text-[10px] font-bold">
            Active: {activeStyle.name}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {VIDEO_STYLES.map((style) => {
            const isSelected = selectedStyleId === style.id;
            return (
              <div
                key={style.id}
                onClick={() => setSelectedStyleId(style.id)}
                className={`group cursor-pointer rounded-xl border p-3.5 transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-brand-500 bg-brand-500/15 shadow-xl shadow-brand-500/20 ring-2 ring-brand-500/50"
                    : "border-slate-800 bg-surface-900/90 hover:border-slate-700"
                }`}
              >
                {/* Visual Image Preview Card */}
                <div className="h-28 w-full rounded-lg overflow-hidden border border-slate-800/80 mb-3 bg-slate-950 relative">
                  {style.previewSvg}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-white border border-slate-700/60 backdrop-blur-sm">
                      {style.creatorTag}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                        isSelected
                          ? "bg-brand-500 text-slate-950 border-brand-400 font-extrabold"
                          : "bg-slate-900/90 text-slate-300 border-slate-700"
                      }`}
                    >
                      {style.badge}
                    </span>
                  </div>

                  {/* Active / Select Prompt Banner */}
                  {isSelected ? (
                    <div className="absolute inset-x-0 bottom-0 py-1 bg-brand-500 text-slate-950 text-center text-[10px] font-black uppercase flex items-center justify-center gap-1 shadow-md">
                      <Check className="h-3 w-3 stroke-[3]" />
                      <span>YE STYLE SELECTED HAI</span>
                    </div>
                  ) : (
                    <div className="absolute inset-x-0 bottom-0 py-0.5 bg-slate-950/85 text-slate-400 text-center text-[9px] group-hover:text-white group-hover:bg-brand-500/40 transition-all font-semibold">
                      👆 Click karke ye style chunein
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors flex items-center justify-between">
                    <span>{style.name}</span>
                    {isSelected && <Check className="h-4 w-4 text-brand-400 shrink-0 stroke-[3]" />}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {style.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60">
                    <span className="truncate max-w-[160px]">Tools: {style.aiTools}</span>
                    <span className="font-mono text-brand-400">9:16 Shorts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Controls & 100% Character Consistency Lock Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 100% Character Consistency Lock (7 Cols) */}
        <Card className="lg:col-span-7 border-slate-800 bg-surface-900/90 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                100% Character Consistency Engine
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCharacterConsistencyLocked(!characterConsistencyLocked)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                characterConsistencyLocked
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              <Lock className="h-3 w-3" />
              <span>{characterConsistencyLocked ? "Consistency Locked (Active)" : "Lock Disabled"}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <label className="font-semibold text-slate-300">
                Visual Anchor Seed (Injected into Midjourney & Video Prompts):
              </label>
              <span className="text-[10px] text-emerald-400 font-bold">100% Face Geometry Preserved</span>
            </div>
            <Input
              value={characterAnchor}
              onChange={(e) => setCharacterAnchor(e.target.value)}
              disabled={!characterConsistencyLocked}
              className="bg-slate-950 border-slate-800 text-xs text-slate-200 font-mono disabled:opacity-50"
              placeholder="Describe character face, clothes, hair, glasses to keep identical across all cuts..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span className="text-slate-500 font-semibold">Cartoon &amp; Sticky Man Anchors:</span>
            <button
              type="button"
              onClick={() =>
                setCharacterAnchor(
                  "3D stylized minimalist white stickman (sticky man) with big expressive cartoon eyes, smooth rounded 3D stick limbs, Zack D. Films and Alan Becker animation style, high-end 3D render, zero realistic humans"
                )
              }
              className="px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-[10px] text-cyan-300 font-medium"
            >
              🪄 3D Sticky Man (Zack D. Style)
            </button>
            <button
              type="button"
              onClick={() =>
                setCharacterAnchor(
                  "Pixar-style 3D animated cartoon boy explorer with adventurer hat, big expressive curious eyes, vibrant cartoon outfit, stylized 3D render, zero realistic humans"
                )
              }
              className="px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 text-[10px] text-amber-300 font-medium"
            >
              👦 CURIOKID 3D Cartoon Boy
            </button>
            <button
              type="button"
              onClick={() =>
                setCharacterAnchor(
                  "Cute 3D animated chibi robot mascot with glowing blue LED screen eyes, smooth white rounded ceramic body, playful cartoon proportions, no realistic humans"
                )
              }
              className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] text-slate-300"
            >
              🤖 3D Chibi Robot
            </button>
          </div>
        </Card>

        {/* Right: Automatic Pacing Presets (5 Cols) */}
        <Card className="lg:col-span-5 border-slate-800 bg-surface-900/90 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center">2</span>
              <span>AUTOMATIC PACING (ALL CUTS UNDER 10s)</span>
            </span>
            <span className="text-xs font-bold text-brand-400">{totalRuntimeSeconds}s Total</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleApplyDurationMode("under30")}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                durationMode === "under30"
                  ? "border-emerald-500 bg-emerald-500/15 text-white font-bold ring-2 ring-emerald-500/40 shadow-md"
                  : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  {durationMode === "under30" && <Check className="h-3 w-3 text-emerald-400" />}
                  <span>⚡ Under 30s</span>
                </span>
                <Badge variant="success" className="text-[9px]">26s (4 Cuts)</Badge>
              </div>
              <p className="text-[10px] text-slate-400">Hook 3s + 3 Cuts under 10s. Retention Loop.</p>
            </button>

            <button
              type="button"
              onClick={() => handleApplyDurationMode("standard60")}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                durationMode === "standard60"
                  ? "border-brand-500 bg-brand-500/15 text-white font-bold ring-2 ring-brand-500/40 shadow-md"
                  : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-brand-300 font-bold flex items-center gap-1">
                  {durationMode === "standard60" && <Check className="h-3 w-3 text-brand-400" />}
                  <span>⏱️ 54s Standard</span>
                </span>
                <Badge variant="outline" className="text-[9px]">6 Cuts</Badge>
              </div>
              <p className="text-[10px] text-slate-400">Hook 3s + 5 Cuts under 10s. Complete facts.</p>
            </button>
          </div>

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-slate-400 font-semibold">Video Format:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setAspectRatio("9:16")}
                className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                  aspectRatio === "9:16"
                    ? "border-brand-500 bg-brand-500/20 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400"
                }`}
              >
                9:16 (Shorts / Reels)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio("16:9")}
                className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                  aspectRatio === "16:9"
                    ? "border-brand-500 bg-brand-500/20 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400"
                }`}
              >
                16:9 (Landscape)
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Production Workspace: Checklist & Choreographed Scenes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Production Checklist & Audio Director (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Production Checklist */}
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2 font-semibold text-white text-xs uppercase tracking-wider">
                <CheckSquare className="h-4 w-4 text-emerald-400" />
                <span>Production Checklist</span>
              </div>
              <Badge variant={completedCount === checklist.length ? "success" : "outline"} className="text-[10px]">
                {completedCount}/{checklist.length} Done
              </Badge>
            </div>

            <div className="space-y-1.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    item.completed
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="accent-emerald-500 rounded"
                    />
                    <span className={item.completed ? "line-through text-slate-400" : ""}>{item.task}</span>
                  </div>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-500">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Sound Design & Music Guidance */}
          <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-white text-xs uppercase tracking-wider border-b border-slate-800/80 pb-2.5">
              <Music className="h-4 w-4 text-indigo-400" />
              <span>Sound Design & Music Direction</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-semibold text-indigo-300 block mb-0.5">BGM Recommendation:</span>
                <p className="text-slate-400">
                  {selectedStyleId === "style-zackd"
                    ? "Clinical Suspense Ambient • 120 BPM • Sub-bass pulses"
                    : selectedStyleId === "style-facttechz"
                    ? "Dark Cosmic Synthwave • 110 BPM • Low-pass filtered"
                    : "High-Energy Modern Phonk / Fast Hip-Hop Beat • 135 BPM"}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-semibold text-amber-300 block mb-0.5">Ducking & SFX Rule:</span>
                <p className="text-slate-400">
                  Auto-duck BGM to -18dB under speech. Punch sub-bass 808 drop on 0:00 hook and 0:10 revelation!
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Choreographed Scene Timeline with Automatic Pacing (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-400" />
              <span>Scene Choreography ({scenesWithTimecodes.length} Cuts • All Under 10s)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total Duration: <strong className="text-brand-400">{totalRuntimeSeconds}s</strong> • {aspectRatio}
            </span>
          </div>

          <div className="space-y-4">
            {scenesWithTimecodes.map((scene, idx) => {
              const isLast = idx === scenesWithTimecodes.length - 1;
              const cinematic = buildCinematicScenePrompts(
                topic || cleanSpoken,
                scene.number,
                isLast,
                aspectRatio,
                activeStyle.name,
                characterAnchor,
                characterConsistencyLocked
              );

              // 100% Policy-Safe Cinema Prompts: Zero clickbait, zero emojis, zero NSFW triggers
              const fullImagePrompt = cinematic.imagePrompt;
              const fullMotionPrompt = cinematic.motionPrompt;

              return (
                <Card key={scene.id} className="border-slate-800 bg-surface-900/95 shadow-xl overflow-hidden">
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Scene Header with Automatic Timing Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-7 w-7 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 border border-brand-500/20">
                          {scene.number}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{scene.title}</h4>
                            <Badge variant="outline" className="text-[9px] bg-slate-950">
                              {scene.sceneType}
                            </Badge>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">
                            {scene.timecode} ({scene.durationSeconds}s)
                          </span>
                        </div>
                      </div>

                      {/* Automatic Duration Status Badges (No Manual Selectors) */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {scene.number === 1 ? (
                          <Badge variant="success" className="text-[10px] font-bold flex items-center gap-1 py-1 px-2.5 bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                            <Zap className="h-3 w-3" />
                            <span>⚡ Hook: Strictly 3s</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-mono font-semibold flex items-center gap-1 py-1 px-2.5 bg-slate-950 text-brand-300 border-brand-500/30">
                            <Clock className="h-3 w-3 text-brand-400" />
                            <span>Auto-Cut: {scene.durationSeconds}s (&lt; 10s)</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* 1. PHELA: IMAGE PROMPT */}
                    <div className="space-y-2 rounded-xl bg-slate-950 p-4 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                          <Camera className="h-4 w-4" />
                          <span>1. 🎨 Image Prompt (Midjourney / FLUX 8K)</span>
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(`img-${scene.id}`, fullImagePrompt)}
                          className="h-7 text-xs px-2.5 text-slate-200 gap-1.5 hover:border-amber-500/50 font-semibold"
                        >
                          {copiedPromptId === `img-${scene.id}` ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Copied Image Prompt!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Image Prompt</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed break-words select-all">
                        {fullImagePrompt}
                      </div>
                    </div>

                    {/* 2. VIDIO PROMPT AUR ISSME BACKGROUND MUSIC EK SATH HE */}
                    <div className="space-y-3 rounded-xl bg-slate-950 p-4 border border-slate-800/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide">
                            <Video className="h-4 w-4" />
                            <span>2. 🎥 Video Motion Prompt &amp; Background Music (BGM + SFX)</span>
                          </span>
                          <Badge variant="outline" className="text-[10px] bg-emerald-950/50 border-emerald-500/40 text-emerald-300 font-semibold shrink-0">
                            🛡️ Google Flow &amp; Veo Safe
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleCopy(`vid-${scene.id}`, fullMotionPrompt)}
                            className="h-7 text-xs px-2.5 bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5 font-semibold"
                            title="Copy clean camera motion prompt for Google Flow, Runway, or Kling"
                          >
                            {copiedPromptId === `vid-${scene.id}` ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-white" />
                                <span>Copied Video Prompt!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy Video Prompt (Google Flow Safe)</span>
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(`bgm-${scene.id}`, `🎵 Background Music & SFX Cue:\n${scene.sfx}`)}
                            className="h-7 text-xs px-2 text-slate-300 hover:border-indigo-500/50"
                            title="Copy Background Music and Sound Effects cue"
                          >
                            {copiedPromptId === `bgm-${scene.id}` ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Copied BGM!</span>
                              </>
                            ) : (
                              <>
                                <Music className="h-3.5 w-3.5 text-indigo-400" />
                                <span>Copy BGM</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                            <span>🎥 Camera Movement (Google Flow / Runway Gen-3 / Kling 1.5):</span>
                            <span className="text-[10px] text-emerald-400 font-normal">Policy Safe • Zero NSFW False-Positives</span>
                          </div>
                          <p className="font-mono text-xs text-slate-200 leading-relaxed break-words select-all">
                            {fullMotionPrompt}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs text-indigo-300">
                            <Music className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                            <span><strong className="text-indigo-300">Background Music (BGM) &amp; SFX Cue:</strong> {scene.sfx}</span>
                          </div>
                          {scene.onScreenText && (
                            <Badge variant="outline" className="text-[10px] bg-slate-900 border-indigo-500/30 text-indigo-200 shrink-0">
                              On-Screen: &quot;{scene.onScreenText}&quot;
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 3. ISE NEECHE: VOICEOVER */}
                    <div className="space-y-2 rounded-xl bg-brand-950/20 p-4 border border-brand-500/30">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                          <Volume2 className="h-4 w-4" />
                          <span>3. 🎙️ Voiceover (Spoken Script Line)</span>
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(`vo-${scene.id}`, scene.voiceover)}
                          className="h-7 text-xs px-2.5 text-slate-200 gap-1.5 hover:border-emerald-500/50 font-semibold"
                        >
                          {copiedPromptId === `vo-${scene.id}` ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Copied Voiceover!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Voiceover</span>
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                        <p className="text-sm sm:text-base font-semibold text-white leading-relaxed select-all font-sans">
                          &ldquo;{scene.voiceover}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
                        <span>Word Count: <strong className="text-slate-200">{scene.voiceover.split(/\s+/).filter(Boolean).length} words</strong></span>
                        <span>Scene Duration: <strong className="text-emerald-400">~{scene.durationSeconds}s</strong> (Calculated from script at ~130 WPM)</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
