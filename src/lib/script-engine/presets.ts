import { ScriptPreset } from "./types";

export const BUILT_IN_PRESETS: ScriptPreset[] = [
  {
    id: "preset-zackd-facts",
    name: "⚡ Zack D. / FactTechz (3D Viral Facts)",
    niche: "Science & Shocking Mysteries",
    format: "shorts",
    aspectRatio: "9:16",
    language: "Hinglish",
    screenTextLanguage: "English",
    visualStyle: "Photorealistic 3D Simulation, Anatomical Cross-Sections & Volumetric Lighting",
    tone: "Dramatic, High-Curiosity, Rapid Payoff & Addictive Pacing",
    pacingWpm: 140,
    description: "Zack D. Films & FactTechz style 3D simulated animations explaining bizarre human body, physics, and natural phenomena with ultra-high retention.",
  },
  {
    id: "preset-mystery-doc",
    name: "🔬 Deep Mystery & Science Documentary",
    niche: "Science & Real-World Mysteries",
    format: "shorts",
    aspectRatio: "9:16",
    language: "Hindi",
    screenTextLanguage: "Hindi",
    visualStyle: "Cinematic Dark Cosmos, Archival Footage Scans & Glowing HUD Diagrams",
    tone: "Immersive, Investigative, Evidence-Backed & Gripping",
    pacingWpm: 128,
    description: "Deep investigative tone with verified scientific evidence, historical discoveries, and dark atmospheric cinematography.",
  },
  {
    id: "preset-high-energy",
    name: "💥 High-Energy Contrarian Pattern Interrupt",
    niche: "Everyday Curiosities & Myth Busting",
    format: "shorts",
    aspectRatio: "9:16",
    language: "Hinglish",
    screenTextLanguage: "English",
    visualStyle: "Ultra-Saturated 4K, Fast Split-Screens, Macro Zooms & Kinetic Typography",
    tone: "High Energy, Provocative, Fast-Paced & Scroll-Stopping",
    pacingWpm: 145,
    description: "Aggressive first-second hook that shatters popular misconceptions, delivering rapid-fire facts in under 30 seconds with a seamless retention loop.",
  },
];

export function getPresetById(id: string): ScriptPreset {
  const found = BUILT_IN_PRESETS.find((p) => p.id === id);
  return found || BUILT_IN_PRESETS[0];
}
