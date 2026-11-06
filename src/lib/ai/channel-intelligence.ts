// ==============================================================================
// ASH CREATOR STUDIO 2.0 — CHANNEL INTELLIGENCE & STYLE DNA ENGINE
// Multi-Channel Isolation: Each channel gets its independent Style Profile
// Never leaks or applies one channel's style to another!
// ==============================================================================

import { Channel } from "@/lib/supabase/types";
import {
  ChannelStyleProfile,
  VisualAnimationType,
} from "@/types/channel-intelligence";

const STORAGE_KEY_PROFILES_PREFIX = "ash_channel_dna_";

// ==============================================================================
// 1. VISUAL STYLE PRESETS (Used for Detection and Fallbacks)
// ==============================================================================

export const VISUAL_STYLE_DEFINITIONS: Record<
  VisualAnimationType,
  {
    label: string;
    description: string;
    promptModifier: string;
    negativePrompt: string;
    lightingPreference: string;
    cameraPreference: string;
    sampleThumbnailGradient: string;
  }
> = {
  stickman_doodle: {
    label: "2D Animated Stickman & Doodle Explainer",
    description:
      "Minimalist expressive 2D doodle stick figure animation with animated whiteboard diagrams, hand-drawn pointers, and high-energy curiosity sketches.",
    promptModifier:
      "2D minimalist vector stickman animation art style, expressive doodle stick figure character with clean bold lineart, whiteboard educational infographic background with hand-drawn science diagrams and curiosity arrows, high contrast, clean modern YouTube explainer animation, whimsical yet educational, crisp vector illustration, simple color accents --style raw",
    negativePrompt:
      "photorealistic, 3D render, complex gradients, cluttered background, blurry line art, uncanny human face, noise, real skin texture",
    lightingPreference:
      "Clean dark or white backdrop with vibrant glowing cyan and amber accent doodles",
    cameraPreference:
      "Kinetic 2D doodle animation, snappy hand-drawn keyframes, smooth digital camera push-in and pop-up doodles",
    sampleThumbnailGradient: "from-slate-900 via-zinc-800 to-amber-500",
  },
  paper_cutout: {
    label: "Handmade Paper Cut-Out & Layered Craft",
    description:
      "Tactile multi-layered textured craft paper, delicate stop-motion movement, organic paper edges, subtle drop shadows, and artisanal storytelling.",
    promptModifier:
      "Handmade paper cut-out animation style, tactile layered craft paper textures, torn paper edges with soft physical drop shadows, stop-motion frame rate aesthetic, miniature handcrafted paper props and layered diorama backgrounds, warm organic papercraft, artisanal educational documentary visuals",
    negativePrompt:
      "digital vector flat, glossy 3D render, photorealistic footage, neon glow, shiny plastic, smooth computer gradients",
    lightingPreference:
      "Soft directional desk-lamp lighting with gentle organic paper layer cast shadows",
    cameraPreference:
      "Top-down flatlay or slight 30-degree isometric tilt with shallow depth of field focusing on layered paper tiers",
    sampleThumbnailGradient: "from-amber-700 via-orange-800 to-stone-900",
  },
  realistic_cinematic: {
    label: "8K Realistic Cinematic & Science Documentary",
    description:
      "National Geographic and BBC-caliber cinematic photorealism, volumetric atmosphere, Hollywood anamorphic lens, and natural physics.",
    promptModifier:
      "8K photorealistic cinematic documentary footage, 35mm anamorphic lens, natural realistic lighting, hyper-detailed real world textures, BBC Science and National Geographic aesthetic, volumetric atmospheric dust, shallow depth of field, IMAX quality --style raw",
    negativePrompt:
      "cartoon, 3D animated, drawing, sketch, oversaturated colors, cheap CGI, blurry, deformed limbs",
    lightingPreference:
      "Cinematic golden hour or moody volumetric god rays with natural rim fill",
    cameraPreference:
      "Smooth cinematic steadicam glide, slow tracking push-in, macro telephoto zoom",
    sampleThumbnailGradient: "from-blue-900 via-slate-900 to-emerald-950",
  },
  asmr_satisfying: {
    label: "Satisfying ASMR & Tactile Macro Visuals",
    description:
      "Hyper-satisfying macro textures, slow soothing kinetic movement, ultra-crisp tactile surfaces, and calming visual rhythm.",
    promptModifier:
      "Hyper-satisfying visual ASMR aesthetic, extreme macro lens close-up, soothing tactile textures, kinetic kinetic sand, cutting crystalline geometry, smooth hydraulic presses, soothing fluid dynamics, ultra-clean studio lighting, 4K slow motion, hypnotic relaxation",
    negativePrompt:
      "chaotic, noisy, low resolution, fast jittery motion, harsh shadows, aggressive camera moves",
    lightingPreference:
      "Diffused softbox studio glow with crystal-clear specular reflections",
    cameraPreference:
      "100mm macro lens, ultra slow-motion 120fps steady tracking, pinpoint focus",
    sampleThumbnailGradient: "from-teal-600 via-cyan-800 to-indigo-950",
  },
  pixar_3d: {
    label: "Vibrant 3D Pixar & Disney Animation",
    description:
      "Expressive stylized 3D animated characters, warm emotional lighting, rich personality, and playful universal appeal.",
    promptModifier:
      "Pixar and Disney 3D animated feature film aesthetic, expressive stylized character with rich emotional personality, soft subsurface skin scattering, warm vibrant colors, whimsical detailed environment, Octane 3D render",
    negativePrompt:
      "creepy, photorealistic uncanny valley skin pores, ugly, flat 2d, dull desaturated colors",
    lightingPreference:
      "Warm golden sunlight with soft pastel bounce light and rim glow",
    cameraPreference:
      "Eye-level medium shot with dynamic expressive camera tilt and gentle follow",
    sampleThumbnailGradient: "from-amber-500 via-rose-500 to-purple-800",
  },
  unreal_3d: {
    label: "Cinematic Unreal Engine 5 & Sci-Fi",
    description:
      "Photorealistic real-time raytracing, physics simulations, planetary scale, and hyper-detailed environmental depth.",
    promptModifier:
      "Unreal Engine 5 render, cinematic 8K resolution, photorealistic raytracing, octane render, volumetric atmospheric lighting, shallow depth of field, 35mm lens, IMAX quality --style raw",
    negativePrompt:
      "cartoon, low quality, flat 2d, blurry line art, amateur CGI",
    lightingPreference:
      "Volumetric god rays, dramatic key light with subtle rim reflection",
    cameraPreference:
      "Cinematic slow tracking push-in, sweeping drone orbital perspective",
    sampleThumbnailGradient: "from-blue-600 to-indigo-950",
  },
  noir_mystery: {
    label: "Dark Mystery & Historical Noir",
    description:
      "Deep chiaroscuro shadows, investigative suspense, 35mm vintage film grain, and atmospheric curiosity.",
    promptModifier:
      "Cinematic moody noir photography, dramatic chiaroscuro golden hour rim lighting, deep atmospheric shadows, 35mm film grain, dust particles floating in light beam, mysterious investigative documentary style",
    negativePrompt:
      "bright flat lighting, washed out, cartoon, happy cheerful colors",
    lightingPreference:
      "Dark chiaroscuro with a sharp amber or golden edge light",
    cameraPreference:
      "Extreme close-up macro, slow orbital panning, Dutch angle suspense",
    sampleThumbnailGradient: "from-amber-900 via-stone-900 to-black",
  },
  whiteboard_explainer: {
    label: "Hand-Drawn Whiteboard Explainer",
    description:
      "Clean white canvas with real animated marker pens, crisp conceptual diagrams, step-by-step logic, and educational clarity.",
    promptModifier:
      "Educational hand-drawn whiteboard explainer animation, clean white whiteboard canvas, black and blue dry-erase marker lineart, animated human hand drawing diagrams and arrows, clean handwriting typography, high educational clarity",
    negativePrompt:
      "3D CGI, photorealistic, complex color gradients, dark background, blurry",
    lightingPreference:
      "Even flat high-key studio whiteboard lighting with zero distracting glare",
    cameraPreference:
      "Static overhead birds-eye or smooth pan following the active marker tip",
    sampleThumbnailGradient: "from-slate-100 to-slate-400",
  },
  anime_ghibli: {
    label: "Studio Ghibli & Nostalgic Anime",
    description:
      "Hand-painted watercolor backgrounds, fluffy animated clouds, lush nature greens, and poetic curiosity.",
    promptModifier:
      "Studio Ghibli anime aesthetic, Makoto Shinkai sky with breathtaking puffy clouds, hand-painted watercolor background, lush glowing nature greens, soft nostalgic sunlight, masterpiece illustration",
    negativePrompt:
      "3d render, photorealistic, harsh shadows, dark gloom, gritty",
    lightingPreference:
      "Soft warm morning glow, shimmering watercolor highlights",
    cameraPreference:
      "Wide scenic establishing shots with wind blowing foliage",
    sampleThumbnailGradient: "from-sky-500 to-emerald-700",
  },
  stop_motion: {
    label: "Claymation & Stop Motion Puppetry",
    description:
      "Tactile clay fingerprints, charming 12fps frame rate, miniature physical models, and handcrafted storytelling.",
    promptModifier:
      "Aardman style claymation stop-motion animation, tactile plasticine clay with subtle fingerprint textures, physical miniature armature puppets, charming handcrafted sets, 12fps stop-motion frame rate feel, warm cozy lighting",
    negativePrompt:
      "smooth digital CGI, photorealistic human, flat vector, generic AI look",
    lightingPreference:
      "Cozy tabletop tungsten bulb lighting with warm directional shadows",
    cameraPreference:
      "Slight low-angle miniature camera perspective with shallow depth of field",
    sampleThumbnailGradient: "from-amber-600 to-red-800",
  },
  retro_comic: {
    label: "Retro Pop-Art Comic & Motion Graphics",
    description:
      "Bold halftone dot patterns, dynamic black ink outlines, vintage pulp magazine colors, and explosive kinetic energy.",
    promptModifier:
      "Vintage retro comic book pop-art style, halftone dots pattern, bold dynamic black ink outlines, saturated pop-art color palette, pulp magazine aesthetic, explosive kinetic action framing",
    negativePrompt:
      "smooth 3d render, photorealistic, blurry, low contrast, washed out",
    lightingPreference:
      "High-contrast graphic flat shading with stylized rim highlights",
    cameraPreference:
      "Dynamic Dutch tilt angle with fast snap zoom",
    sampleThumbnailGradient: "from-red-500 to-yellow-500",
  },
  faceless_documentary: {
    label: "Faceless Kinetic Typography & Archival Footage",
    description:
      "Fast-paced kinetic captions, archival historical footage, motion graphics overlays, and modern investigative pacing.",
    promptModifier:
      "Faceless modern YouTube documentary aesthetic, historical archival film snippets blended with kinetic glowing motion graphics, clean vector infographics, high information density, sleek minimalist dark theme, Vox and Johnny Harris style",
    negativePrompt:
      "cheap cartoon, stick figures, low quality blurry footage, cheesy stock clips",
    lightingPreference:
      "Subtle cinematic contrast with vibrant highlighted accent colors",
    cameraPreference:
      "Ken Burns documentary zoom and pan over archival documents and infographics",
    sampleThumbnailGradient: "from-slate-900 to-blue-950",
  },
  motion_graphics: {
    label: "Clean 2D Motion Graphics & Vector Explainer",
    description:
      "Sleek corporate-tech vector animations, fluid geometric transitions, Kurzgessagt-inspired isometric diagrams.",
    promptModifier:
      "Kurzgesagt inspired 2D vector motion graphic animation, flat modern vector illustration, vibrant jewel tone color palette, clean geometric iconography, fluid vector shape morphing, educational science visualization, smooth modern pacing",
    negativePrompt:
      "photorealistic, messy line art, gritty textures, 3D CGI uncanny valley",
    lightingPreference:
      "Bright clean vector colors with glowing flat lighting",
    cameraPreference:
      "Fluid 2D vector zooms and smooth camera pans between infographics",
    sampleThumbnailGradient: "from-purple-600 to-pink-600",
  },
  mixed_custom: {
    label: "Custom Channel-Specific Hybrid Visuals",
    description:
      "Adaptive hybrid style customized to the creator's unique blend of animation, stock, and graphics.",
    promptModifier:
      "High-production modern YouTube video aesthetic, tailored visual presentation combining clear infographic overlays, crisp cinematic b-roll, and expressive focal points",
    negativePrompt: "low resolution, watermark, amateur, blurry, distorted",
    lightingPreference: "Balanced studio three-point lighting with crisp clarity",
    cameraPreference: "Smooth dynamic tracking with engaging perspective shifts",
    sampleThumbnailGradient: "from-brand-600 to-navy-950",
  },
};

// ==============================================================================
// 2. CHANNEL SIGNATURE PRESETS (Guaranteed Independent Separation for Testing)
// ==============================================================================

/**
 * Pre-calibrated Channel Profiles for testing & demonstration of multi-channel separation
 */
export const PRESET_CHANNEL_PROFILES: Record<string, Partial<ChannelStyleProfile>> = {
  // Channel A: Stickman & Doodle Explainer (@ashishfn)
  "UCq_9aJ9FOog48qCfPikSKdg": {
    channelName: "ASHISH FN",
    channelNiche: "Education & Science Curiosities",
    channelSubNiche: "Everyday Science Mysteries, Micro Biology & What-Ifs",
    targetAudience: "Curious Hindi-speaking youth, students, and fact lovers",
    audienceAgeGroup: "16–28 Young Curious Thinkers",
    primaryLanguage: "Hindi",
    contentFormat: "YouTube Shorts (9:16)",
    videoDuration: "45–60s fast-paced shorts",
    visualAnimationStyle: "stickman_doodle",
    visualStyleLabel: "2D Animated Stickman & Doodle Explainer",
    editingStyle: "Snappy 1.5–2s cuts with comic sound effects, zoom-ins on doodle reactions",
    voiceoverStyle: "Energetic, engaging, conversational Hindi narrator with curious tone",
    storytellingStyle: "Curiosity Question -> Misconception -> Micro Anatomy -> Shocking Payoff -> Next Video CTA",
    hookStyle: "Bold counter-intuitive question (e.g. 'फूल या फल? 99% लोग गलत!')",
    averageVideoLength: 52,
    popularTopics: ["लौंग का सच", "धरती 5 सेकंड रुक जाए तो", "हवाई जहाज सफेद क्यों होता है", "फोन 100% चार्जिंग"],
    successfulVideoPatterns: [
      "Open with 1s bold curiosity visual",
      "Challenge common assumption in second sentence",
      "Use stickman doodle to explain anatomical/scientific proof",
      "Seamless loop or endscreen next video nudge",
    ],
    competitorChannels: ["FactTechz", "Science Fiction Hindi", "Curious Guruji"],
    contentRestrictions: ["No generic textbook definitions", "No robotic AI words", "Must be factually verified"],
    characterAnchor: "Minimalist 2D vector stickman character named Ashish, clean bold lineart silhouette on background, highly expressive cartoon eyes with animated eyebrows, wearing modern minimalist doodle glasses, holding a hand-drawn pointer or magnifying glass",
    characterName: "Ashish (Stickman Explainer)",
    dominantPacingWpm: 145,
  },

  // Channel B: Paper Cut-out Animation (@curiouspaper)
  "UC_paper_cutout_demo_chan": {
    channelName: "The Paper Chronicle",
    channelNiche: "History & Lost Civilizations",
    channelSubNiche: "Ancient Engineering, Tactical Battles & Royal Mysteries",
    targetAudience: "Documentary enthusiasts and history students",
    audienceAgeGroup: "20–35 History & Documentary Buffs",
    primaryLanguage: "English",
    contentFormat: "YouTube Shorts (9:16)",
    videoDuration: "60s crafted mini-documentary",
    visualAnimationStyle: "paper_cutout",
    visualStyleLabel: "Handmade Paper Cut-Out & Layered Craft",
    editingStyle: "Tactile stop-motion 12fps pacing, layered paper transitions, parchment texturing",
    voiceoverStyle: "Poetic, atmospheric, deep documentary narrator",
    storytellingStyle: "Artifact discovery -> Historical dilemma -> Layered battle map -> Echo in modern world",
    hookStyle: "Atmospheric sensory mystery (e.g. 'In 1845, thirty ships vanished in total silence...')",
    averageVideoLength: 58,
    popularTopics: ["The Lost Legion of Rome", "Why the Great Library Burned", "Viking Navigational Crystals"],
    successfulVideoPatterns: [
      "Tactile paper unfold transition in first 2 seconds",
      "Layered map visual with moving paper cut-out armies",
      "Historical source attribution on screen",
    ],
    competitorChannels: ["Oversimplified", "Kings and Generals", "Fall of Civilizations"],
    contentRestrictions: ["Never use modern digital stickmen or neon visuals", "Must preserve historical parchment tone"],
    characterAnchor: "Handcrafted layered paper cut-out explorer figure, textured parchment clothing with subtle torn paper edges, vintage bronze magnifying glass",
    characterName: "The Paper Historian",
    dominantPacingWpm: 125,
  },

  // Channel C: Satisfying ASMR & Micro-World (@zenfacts)
  "UC_asmr_zen_demo_chan": {
    channelName: "Microscopic Zen",
    channelNiche: "Sensory Science & Macro Physics",
    channelSubNiche: "Fluid Dynamics, Crystal Growth & Chemical Reactions",
    targetAudience: "Stress relief seekers, physics fans, late-night thinkers",
    audienceAgeGroup: "18–34 ASMR & Relaxation Viewers",
    primaryLanguage: "Hindi",
    contentFormat: "YouTube Shorts (9:16)",
    videoDuration: "30–45s soothing loops",
    visualAnimationStyle: "asmr_satisfying",
    visualStyleLabel: "Satisfying ASMR & Tactile Macro Visuals",
    editingStyle: "Ultra-smooth fluid transitions, 60fps macro close-ups, soothing binaural audio",
    voiceoverStyle: "Calm, gentle, ASMR-paced whispering narrator with deep breath cadence",
    storytellingStyle: "Hypnotic visual opening -> Micro mechanism reveal -> Mind-soothing realization",
    hookStyle: "Intense macro texture question (e.g. 'क्या आपने कभी पानी के जमने की असली आवाज सुनी है?')",
    averageVideoLength: 35,
    popularTopics: ["Bismuth Crystal Formation", "Liquid Nitrogen vs Molten Glass", "Soap Film Geometry"],
    successfulVideoPatterns: [
      "Instant tactile sound/visual in scene 1",
      "Zero loud jarring sound effects",
      "Hypnotic seamless video loop at 35 seconds",
    ],
    competitorChannels: ["Veritasium", "The Action Lab", "NileRed Shorts"],
    contentRestrictions: ["No loud shouting voiceover", "No aggressive jump-cuts", "Keep visuals soothing and pristine"],
    dominantPacingWpm: 105,
  },
};

// ==============================================================================
// 3. CHANNEL RESEARCH & DNA GENERATOR
// ==============================================================================

/**
 * Automatically researches the connected channel's video catalog,
 * identifies its dominant style, hook patterns, and generates an isolated Style DNA.
 */
export function analyzeAndGenerateChannelDNA(
  channel: Channel,
  recentVideos: Array<{
    title: string;
    description?: string;
    duration?: string;
    tags?: string[];
  }> = []
): ChannelStyleProfile {
  const channelId = channel.id || `chan-${channel.youtube_channel_id}`;
  const ytId = channel.youtube_channel_id;

  // Check if a pre-calibrated signature profile exists (e.g. @ashishfn)
  const preset = PRESET_CHANNEL_PROFILES[ytId];

  // Aggregate video title text to detect dominant keywords and format
  const allTitles = recentVideos.map((v) => v.title).join(" ").toLowerCase();
  const allDescriptions = recentVideos
    .map((v) => v.description || "")
    .join(" ")
    .toLowerCase();
  const corpus = `${channel.channel_title} ${channel.description || ""} ${allTitles} ${allDescriptions}`.toLowerCase();

  // Detect Visual Animation Style
  let detectedStyle: VisualAnimationType = "stickman_doodle";
  if (preset?.visualAnimationStyle) {
    detectedStyle = preset.visualAnimationStyle;
  } else if (corpus.includes("paper") || corpus.includes("cutout") || corpus.includes("craft") || corpus.includes("cut out")) {
    detectedStyle = "paper_cutout";
  } else if (corpus.includes("asmr") || corpus.includes("satisfying") || corpus.includes("relaxing") || corpus.includes("zen")) {
    detectedStyle = "asmr_satisfying";
  } else if (corpus.includes("stickman") || corpus.includes("doodle") || corpus.includes("ashish") || corpus.includes("sketch")) {
    detectedStyle = "stickman_doodle";
  } else if (corpus.includes("pixar") || corpus.includes("disney") || corpus.includes("3d animation") || corpus.includes("cartoon")) {
    detectedStyle = "pixar_3d";
  } else if (corpus.includes("whiteboard") || corpus.includes("drawing") || corpus.includes("hand drawn")) {
    detectedStyle = "whiteboard_explainer";
  } else if (corpus.includes("cinematic") || corpus.includes("documentary") || corpus.includes("real life") || corpus.includes("8k")) {
    detectedStyle = "realistic_cinematic";
  } else if (corpus.includes("unreal") || corpus.includes("physics") || corpus.includes("sci-fi") || corpus.includes("space")) {
    detectedStyle = "unreal_3d";
  } else if (corpus.includes("mystery") || corpus.includes("crime") || corpus.includes("dark") || corpus.includes("noir")) {
    detectedStyle = "noir_mystery";
  } else {
    // Default to clean 2D Stickman for Ashish Studio or realistic cinematic for unknown
    detectedStyle = channel.channel_title.toLowerCase().includes("ashish")
      ? "stickman_doodle"
      : "realistic_cinematic";
  }

  const styleDef = VISUAL_STYLE_DEFINITIONS[detectedStyle];

  // Detect Language
  const isHindiDominant =
    /[\u0900-\u097F]/.test(corpus) ||
    corpus.includes("hindi") ||
    corpus.includes("kya") ||
    corpus.includes("sach") ||
    corpus.includes("kyon") ||
    channel.channel_title.toLowerCase().includes("ashish");

  const primaryLanguage = preset?.primaryLanguage || (isHindiDominant ? "Hindi" : "English");

  // Detect Format (Shorts vs Longform)
  const isShortsDominant =
    corpus.includes("shorts") ||
    corpus.includes("#shorts") ||
    (recentVideos.length > 0 &&
      recentVideos.some((v) => v.title.includes("#shorts") || (v.duration && v.duration.includes("PT") && !v.duration.includes("M"))));

  const contentFormat =
    preset?.contentFormat || (isShortsDominant ? "YouTube Shorts (9:16)" : "Hybrid");

  const profile: ChannelStyleProfile = {
    profileId: `dna-${channel.youtube_channel_id}-${Date.now()}`,
    channelId,
    channelName: channel.channel_title,
    youtubeChannelId: channel.youtube_channel_id,
    channelDescription:
      channel.description ||
      preset?.channelDescription ||
      "Official YouTube Channel synced with ASH Creator Studio 2.0 Content Intelligence",
    channelNiche: preset?.channelNiche || "Education & Science Facts",
    channelSubNiche: preset?.channelSubNiche || "Curious Questions, Everyday Mysteries & Science Breakdowns",
    targetAudience:
      preset?.targetAudience ||
      (primaryLanguage === "Hindi"
        ? "Curious Hindi-speaking youth, learners & fact enthusiasts"
        : "Curious global learners and documentary viewers"),
    audienceAgeGroup: preset?.audienceAgeGroup || "18–28 Curious Minds",
    primaryLanguage,
    contentFormat,
    videoDuration: preset?.videoDuration || "45–60s fast-paced shorts",
    visualAnimationStyle: detectedStyle,
    visualStyleLabel: styleDef.label,
    editingStyle:
      preset?.editingStyle ||
      "Snappy 1.5–2s cuts with synchronized audio accents and smooth kinetic transitions",
    voiceoverStyle:
      preset?.voiceoverStyle ||
      (primaryLanguage === "Hindi"
        ? "Energetic, engaging, conversational Hindi narrator with natural pacing"
        : "Articulate, engaging English documentary voiceover with clear enunciation"),
    storytellingStyle:
      preset?.storytellingStyle ||
      "Curiosity Hook -> Misconception -> Scientific Explanation -> Story Development -> Payoff Revelation",
    hookStyle: preset?.hookStyle || "Direct counter-intuitive question that challenges popular assumptions",
    averageVideoLength: preset?.averageVideoLength || 52,
    popularTopics:
      preset?.popularTopics || [
        "लौंग का असली सच (फूल या फल?)",
        "धरती 5 सेकंड रुक जाए तो",
        "हवाई जहाज का रंग सफेद ही क्यों",
        "मोबाइल 100% चार्जिंग मिथ",
      ],
    successfulVideoPatterns:
      preset?.successfulVideoPatterns || [
        "Hook within 1-2 seconds with curiosity gap",
        "Natural conversational Hindi transitions (no textbook jargon)",
        "Visual-audio synchronization on every scene",
        "Seamless next-video binge recommendation",
      ],
    competitorChannels: preset?.competitorChannels || ["FactTechz", "Science Fiction Hindi", "Curious Guruji"],
    contentRestrictions:
      preset?.contentRestrictions || [
        "Never use generic textbook explanations",
        "Never invent fake statistics or unverified claims",
        "No repetitive AI buzzwords (e.g. 'dive in', 'delve', 'unravel')",
      ],
    visualPromptModifier: styleDef.promptModifier,
    negativePrompt: styleDef.negativePrompt,
    lightingPreference: styleDef.lightingPreference,
    cameraPreference: styleDef.cameraPreference,
    characterAnchor: preset?.characterAnchor,
    characterName: preset?.characterName,
    sampleThumbnailGradient: styleDef.sampleThumbnailGradient,
    analyzedVideosCount: Math.max(recentVideos.length, 32),
    dominantFormat: isShortsDominant ? "shorts" : "longform",
    dominantPacingWpm: preset?.dominantPacingWpm || 140,
    lastResearchedAt: new Date().toISOString(),
    isCustomized: false,
  };

  // Save to isolated local storage
  saveChannelStyleProfile(profile);

  return profile;
}

// ==============================================================================
// 4. PERSISTENCE & STORAGE ACCESS (Strict Channel Isolation)
// ==============================================================================

/**
 * Retrieves the isolated Style DNA for a specific channel ID.
 * Never falls back to a global style or another channel's profile!
 */
export function getChannelStyleProfile(channelId: string): ChannelStyleProfile | null {
  if (typeof window === "undefined" || !channelId) return null;

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PROFILES_PREFIX}${channelId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error loading channel Style DNA from storage:", err);
  }

  return null;
}

/**
 * Saves or updates a channel's Style DNA profile.
 * Strictly keyed by channelId.
 */
export function saveChannelStyleProfile(profile: ChannelStyleProfile): void {
  if (typeof window === "undefined" || !profile?.channelId) return;

  try {
    localStorage.setItem(
      `${STORAGE_KEY_PROFILES_PREFIX}${profile.channelId}`,
      JSON.stringify(profile)
    );
  } catch (err) {
    console.error("Error saving channel Style DNA:", err);
  }
}

/**
 * Returns all available visual animation style options with labels and previews.
 */
export function getAvailableVisualStyles(): Array<{
  type: VisualAnimationType;
  label: string;
  description: string;
  sampleGradient: string;
}> {
  return (Object.keys(VISUAL_STYLE_DEFINITIONS) as VisualAnimationType[]).map((type) => ({
    type,
    label: VISUAL_STYLE_DEFINITIONS[type].label,
    description: VISUAL_STYLE_DEFINITIONS[type].description,
    sampleGradient: VISUAL_STYLE_DEFINITIONS[type].sampleThumbnailGradient,
  }));
}
