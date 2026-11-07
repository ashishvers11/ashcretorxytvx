import { ScriptPreset } from "./types";

export const BUILT_IN_PRESETS: ScriptPreset[] = [
  {
    id: "preset-fact-slice",
    name: "FACT SLICE",
    niche: "Satisfying ASMR + Interesting Facts",
    format: "shorts",
    aspectRatio: "9:16",
    language: "Hindi",
    screenTextLanguage: "English",
    visualStyle: "Satisfying Macro Cinematography & High-Contrast 4K Textures",
    tone: "Curious, Relaxed, Captivating & Visually Satisfying",
    pacingWpm: 125,
    description: "Original scientific & everyday curiosities paired with satisfying visual aesthetics, high-retention fast payoff, and seamless loops.",
  },
  {
    id: "preset-curiokid-vers",
    name: "CURIOKID_VERS",
    niche: "Science and History",
    format: "shorts",
    aspectRatio: "9:16",
    language: "Hinglish",
    screenTextLanguage: "English",
    visualStyle: "Paper Cut-out Stop Motion & Vintage Documentary Animation",
    tone: "Energetic, Educational, Story-Driven & Clear",
    pacingWpm: 135,
    description: "Character-led historical & scientific mysteries explained using playful cut-out animation cues, evidence-backed fact points, and humorous takeaways.",
  },
  {
    id: "preset-tech-breakdown",
    name: "TECH BREAKDOWN",
    niche: "Technology & AI",
    format: "shorts",
    aspectRatio: "9:16",
    language: "English",
    screenTextLanguage: "English",
    visualStyle: "Dark Futuristic Cyberpunk with Neon Highlights & UI Hud Overlays",
    tone: "Analytical, Insightful & Future-Focused",
    pacingWpm: 140,
    description: "Deep-dive mechanical breakdowns of AI models, computing hardware, and robotics without generic corporate hype.",
  },
];

export function getPresetById(id: string): ScriptPreset {
  const found = BUILT_IN_PRESETS.find((p) => p.id === id);
  return found || BUILT_IN_PRESETS[0];
}
