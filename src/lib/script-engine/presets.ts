import { ScriptPreset } from "./types";

export const BUILT_IN_PRESETS: ScriptPreset[] = [
  {
    id: "preset-stickman-science",
    name: "🪄 3D Sticky Man (Ashish FN Signature)",
    niche: "Science & Shocking Mysteries",
    format: "shorts",
    aspectRatio: "9:16",
    language: "Hinglish",
    screenTextLanguage: "English",
    visualStyle: "Minimalist 3D White Stickman, Zack D. Films & Alan Becker Animation, Dark Slate Background",
    tone: "Engaging, Fast-Paced Curiosity, Spoken Teleprompter Hook, High Retention",
    pacingWpm: 140,
    description: "Ashish FN signature 3D sticky man style explaining shocking science and biology curiosities with ultra-high retention.",
  },
  {
    id: "preset-zackd-facts",
    name: "🔬 Zack D. / FactTechz (3D Viral Facts)",
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
    id: "preset-cute-naughty-animation",
    name: "😂 Cute Pets & Slapstick Cartoon (Under 20s)",
    niche: "Animation & Funny Comedy",
    format: "shorts",
    aspectRatio: "9:16",
    language: "Hinglish",
    screenTextLanguage: "English",
    visualStyle: "Tom & Jerry Slapstick & Chubby 3D Pet Mischief, Zero Spoken Dialogue, Funny Sound Effects",
    tone: "Playful, Mischievous, Pure Visual Comedy, High Dopamine Slapstick",
    pacingWpm: 0,
    description: "Hilarious under 20s 3D cartoon shorts featuring Tom & Jerry slapstick and cute doggy/kitten mischief with zero spoken voiceover.",
  },
  {
    id: "preset-asmr-satisfying",
    name: "✨ Visual ASMR & Crushing (Oddly Satisfying)",
    niche: "Visual ASMR & Tactile Satisfaction",
    format: "shorts",
    aspectRatio: "9:16",
    language: "Hinglish",
    screenTextLanguage: "English",
    visualStyle: "10-Ton Hydraulic Press Crushing, Heated Blade Soap Slicing, Kinetic Sand Crunch",
    tone: "Pure Visual Sensory Satisfaction, 1000fps Macro Audio, Zero Dialogue",
    pacingWpm: 0,
    description: "Oddly satisfying visual ASMR shorts featuring heavy hydraulic crushing, heated blade soap slicing, and crunchy kinetic sand with zero spoken monologue.",
  },
  {
    id: "preset-high-energy",
    name: "⚡ MrBeast High-Energy Science Fast-Cut",
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
