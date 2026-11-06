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
// 2. CHANNEL SIGNATURE PRESETS & TEMPLATES (Pure Generic Presets for Demonstration)
// ==============================================================================

/**
 * Generic sample presets for testing multi-channel separation (no personal channel hardcoding)
 */
export const PRESET_CHANNEL_PROFILES: Record<string, Partial<ChannelStyleProfile>> = {
  // Demo Channel 1: Historical Paper Cut-out
  "demo-paper-history": {
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
    characterName: "Paper Historian",
    dominantPacingWpm: 125,
  },

  // Demo Channel 2: Satisfying ASMR
  "demo-asmr-physics": {
    channelName: "Microscopic Zen",
    channelNiche: "Sensory Science & Macro Physics",
    channelSubNiche: "Fluid Dynamics, Crystal Growth & Chemical Reactions",
    targetAudience: "Stress relief seekers, physics fans, late-night thinkers",
    audienceAgeGroup: "18–34 ASMR & Relaxation Viewers",
    primaryLanguage: "English",
    contentFormat: "YouTube Shorts (9:16)",
    videoDuration: "30–45s soothing loops",
    visualAnimationStyle: "asmr_satisfying",
    visualStyleLabel: "Satisfying ASMR & Tactile Macro Visuals",
    editingStyle: "Ultra-smooth fluid transitions, 60fps macro close-ups, soothing binaural audio",
    voiceoverStyle: "Calm, gentle, ASMR-paced whispering narrator with deep breath cadence",
    storytellingStyle: "Hypnotic visual opening -> Micro mechanism reveal -> Mind-soothing realization",
    hookStyle: "Intense macro texture question",
    averageVideoLength: 35,
    popularTopics: ["Bismuth Crystal Formation", "Liquid Nitrogen vs Molten Glass", "Soap Film Geometry"],
    successfulVideoPatterns: [
      "Instant tactile sound/visual in scene 1",
      "Zero loud jarring sound effects",
      "Hypnotic seamless video loop at 35 seconds",
    ],
    competitorChannels: ["Veritasium", "The Action Lab", "NileRed Shorts"],
    contentRestrictions: ["No loud shouting voiceover", "No aggressive jump-cuts", "Keep visuals soothing and pristine"],
    characterAnchor: "Macro-scale hypnotic tactile focal visuals with pristine crystal clear lighting",
    characterName: "Macro Zen Guide",
    dominantPacingWpm: 105,
  },
};

/**
 * Generates an adaptive, style-accurate character anchor for any connected channel.
 * Never hardcodes personal creator names or static channel handles.
 */
export function generateDynamicCharacterAnchor(
  channelTitle: string,
  style: VisualAnimationType
): { characterName: string; characterAnchor: string } {
  const cleanTitle = (channelTitle || "Creator").trim();
  const characterName = `${cleanTitle} Host`;

  switch (style) {
    case "pixar_3d":
      return {
        characterName,
        characterAnchor: `Charming and expressive 3D Pixar-style animated protagonist representing ${cleanTitle}, wide sparkling curious eyes, vibrant signature outfit, warm friendly demeanor, cinematic three-point lighting`,
      };
    case "stickman_doodle":
      return {
        characterName,
        characterAnchor: `Clean minimalist 2D vector stickman host representing ${cleanTitle}, bold lineart silhouette on crisp background, highly expressive cartoon eyes, engaging presentation gestures`,
      };
    case "paper_cutout":
      return {
        characterName,
        characterAnchor: `Handcrafted layered paper cut-out narrator figure representing ${cleanTitle}, textured parchment styling with subtle torn paper edges, vintage warm cinematic lighting`,
      };
    case "whiteboard_explainer":
      return {
        characterName,
        characterAnchor: `Educational hand-drawn animated host with crisp clean marker lineart representing ${cleanTitle}, clear conceptual diagramming and pointing gestures`,
      };
    case "asmr_satisfying":
      return {
        characterName: `${cleanTitle} Macro Guide`,
        characterAnchor: `Hypnotic macro-scale textured focal elements representing ${cleanTitle}, pristine satisfying lighting and soothing visual aesthetics`,
      };
    case "noir_mystery":
      return {
        characterName,
        characterAnchor: `Mysterious silhouette investigative narrator representing ${cleanTitle}, dramatic chiaroscuro golden hour shadows, 35mm documentary film grain`,
      };
    case "unreal_3d":
      return {
        characterName,
        characterAnchor: `Hyper-detailed 3D Unreal Engine 5 protagonist representing ${cleanTitle}, volumetric lighting, photorealistic raytraced reflections and cinematic depth`,
      };
    case "motion_graphics":
      return {
        characterName,
        characterAnchor: `Sleek modern 2D vector animated host representing ${cleanTitle}, clean geometric shapes, smooth transitions and vibrant jewel tone aesthetic`,
      };
    case "stop_motion":
      return {
        characterName,
        characterAnchor: `Handcrafted claymation stop-motion figure representing ${cleanTitle}, tactile plasticine clay textures, cozy studio directional lighting`,
      };
    case "retro_comic":
      return {
        characterName,
        characterAnchor: `Dynamic retro pop-art comic character representing ${cleanTitle}, bold halftone dot patterns, black ink outlines, energetic framing`,
      };
    case "anime_ghibli":
      return {
        characterName,
        characterAnchor: `Studio Ghibli inspired anime protagonist representing ${cleanTitle}, soft expressive facial features, hand-painted watercolor tones and warm nostalgic morning glow`,
      };
    case "faceless_documentary":
      return {
        characterName: `${cleanTitle} Narrator`,
        characterAnchor: `Modern faceless documentary visual flow with kinetic infographics, sleek overlays, and high-impact b-roll representing ${cleanTitle}`,
      };
    case "realistic_cinematic":
    default:
      return {
        characterName,
        characterAnchor: `Professional cinematic documentary presentation visuals representing ${cleanTitle}, high-end cinematic 8K lighting and photorealistic depth`,
      };
  }
}

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

  // Check if a pre-calibrated preset exists for this exact ID or handle
  let preset = PRESET_CHANNEL_PROFILES[ytId] || PRESET_CHANNEL_PROFILES[channelId];

  // Aggregate video title text to detect dominant keywords and format
  const allTitles = recentVideos.map((v) => v.title).join(" ").toLowerCase();
  const allDescriptions = recentVideos
    .map((v) => v.description || "")
    .join(" ")
    .toLowerCase();
  const corpus = `${channel.channel_title} ${channel.description || ""} ${allTitles} ${allDescriptions}`.toLowerCase();

  // Detect Visual Animation Style & Dominant Niche purely based on content semantics
  let detectedStyle: VisualAnimationType = "realistic_cinematic";
  const isKidsCorpus =
    corpus.includes("kid") ||
    corpus.includes("child") ||
    corpus.includes("cartoon") ||
    corpus.includes("animation") ||
    corpus.includes("moral story") ||
    corpus.includes("family") ||
    corpus.includes("kinder") ||
    corpus.includes("fairy tale") ||
    corpus.includes("nursery");

  const isPaperCraft =
    corpus.includes("paper") ||
    corpus.includes("cutout") ||
    corpus.includes("craft") ||
    corpus.includes("cut out") ||
    corpus.includes("origami");

  const isAsmr =
    corpus.includes("asmr") ||
    corpus.includes("satisfying") ||
    corpus.includes("relaxing") ||
    corpus.includes("zen") ||
    corpus.includes("kinetic sand");

  const isGaming =
    corpus.includes("game") ||
    corpus.includes("gaming") ||
    corpus.includes("minecraft") ||
    corpus.includes("gta") ||
    corpus.includes("roblox") ||
    corpus.includes("gameplay");

  const isHorror =
    corpus.includes("horror") ||
    corpus.includes("mystery") ||
    corpus.includes("crime") ||
    corpus.includes("dark") ||
    corpus.includes("paranormal") ||
    corpus.includes("bhoot") ||
    corpus.includes("scary");

  if (preset?.visualAnimationStyle) {
    detectedStyle = preset.visualAnimationStyle;
  } else if (isKidsCorpus) {
    detectedStyle = "pixar_3d";
  } else if (isPaperCraft) {
    detectedStyle = "paper_cutout";
  } else if (isAsmr) {
    detectedStyle = "asmr_satisfying";
  } else if (isGaming) {
    detectedStyle = "unreal_3d";
  } else if (isHorror) {
    detectedStyle = "noir_mystery";
  } else if (corpus.includes("stickman") || corpus.includes("doodle") || corpus.includes("sketch")) {
    detectedStyle = "stickman_doodle";
  } else if (corpus.includes("whiteboard") || corpus.includes("drawing") || corpus.includes("hand drawn")) {
    detectedStyle = "whiteboard_explainer";
  } else if (corpus.includes("ghibli") || corpus.includes("anime") || corpus.includes("manga")) {
    detectedStyle = "anime_ghibli";
  } else if (corpus.includes("motion graphics") || corpus.includes("infographic") || corpus.includes("tech") || corpus.includes("coding")) {
    detectedStyle = "motion_graphics";
  } else if (corpus.includes("documentary") || corpus.includes("history") || corpus.includes("investigative")) {
    detectedStyle = "faceless_documentary";
  } else {
    detectedStyle = "realistic_cinematic";
  }

  const styleDef = VISUAL_STYLE_DEFINITIONS[detectedStyle];

  // Infer Dynamic Niche, Sub-Niche, and Channel-Specific Popular Topics
  let inferredNiche = `${channel.channel_title} Content`;
  let inferredSubNiche = "General High-Engagement Video Production";
  let inferredTargetAudience = "Engaged YouTube viewers and curious subscribers";
  let inferredAgeGroup = "18–34 YouTube Viewers";
  let inferredHookStyle = "High-retention curiosity hook opening";
  let inferredStorytelling = "Engaging Hook -> Insight Development -> Core Climax -> Call to Action";
  let inferredPopularTopics = [
    `${channel.channel_title} Viral Episode 1`,
    `${channel.channel_title} Deep Breakdown`,
    `${channel.channel_title} Ultimate Guide`,
  ];
  let inferredCompetitors = ["Top Channels in Niche"];
  let inferredRestrictions = [
    "Never use generic textbook explanations",
    "Never invent fake statistics or unverified claims",
    "No repetitive AI buzzwords (e.g. 'dive in', 'delve', 'unravel')",
  ];

  if (isKidsCorpus) {
    inferredNiche = "Kids & Family Animation Stories";
    inferredSubNiche = "3D Moral Adventures, Animal Friends & Fun Curiosities";
    inferredTargetAudience = "Young kids, parents, and curious family viewers";
    inferredAgeGroup = "Kids 4–12 & Family";
    inferredHookStyle = "Friendly animated character opening with a magical question or exciting problem";
    inferredStorytelling = "Exciting Adventure Hook -> Cute Character Problem -> Magical Discovery -> Warm Moral Lesson";
    inferredPopularTopics = [
      "शेर और नटखट खरगोश की जादुई कहानी (3D Moral Story)",
      "डायनासोर असल में कैसे गायब हुए? (Kids 3D Adventure)",
      "चींटी अपने वजन से 50 गुना ज्यादा वजन कैसे उठाती है?",
      "आसमान का रंग हमेशा नीला क्यों दिखता है? (Little Scientist)",
      "चाँद दिन में भी आसमान में क्यों दिखाई देता है?",
      "इंद्रधनुष के 7 रंगों का जादुई रहस्य (Rainbow Quest)",
    ];
    inferredCompetitors = ["Cocomelon", "Infobells Hindi", "ChuChu TV", "Koo Koo TV"];
    inferredRestrictions = [
      "No scary themes or violence",
      "No dense textbook scientific formulas",
      "Keep language warm, fun, and kid-appropriate",
    ];
  } else if (isPaperCraft) {
    inferredNiche = "Tactile Paper Craft & Historical Mysteries";
    inferredSubNiche = "Lost Civilizations, Ancient Engineering & Parchment Chronicles";
    inferredTargetAudience = "Documentary lovers, history enthusiasts & craft viewers";
    inferredAgeGroup = "18–35 Curious Learners";
    inferredHookStyle = "Tactile paper unfold revealing an ancient forgotten relic";
    inferredStorytelling = "Ancient Parchment Reveal -> Tactical Conflict -> Archaeological Clue -> Echo in Modern World";
    inferredPopularTopics = [
      "द ग्रेट लाइब्रेरी ऑफ अलेक्जेंड्रिया कैसे जली? (Paper Cut-Out History)",
      "रोम की 9वीं सेना रहस्यमयी तरीके से कहाँ गायब हो गई?",
      "वाइकिंग्स बादलों में सूर्य की दिशा कैसे पहचानते थे?",
      "सिंधु घाटी सभ्यता के लोग अचानक कहाँ चले गए?",
      "ताजमहल के नीचे बंद 22 कमरों का ऐतिहासिक सच",
      "पिरामिड बनाने वाले कारीगरों की डायरी से निकला रहस्य",
    ];
    inferredCompetitors = ["Fall of Civilizations", "Oversimplified", "Kings and Generals"];
    inferredRestrictions = [
      "Never use modern digital neon colors",
      "Maintain textured papercraft aesthetic",
      "Factually accurate historical dates",
    ];
  } else if (isAsmr) {
    inferredNiche = "Sensory ASMR & Hypnotic Material Transformations";
    inferredSubNiche = "Macro Crystal Growth, Sand Slicing & Sound Loops";
    inferredTargetAudience = "Relaxation seekers, satisfying physics lovers";
    inferredAgeGroup = "Broad 16–40 Sensory Audience";
    inferredHookStyle = "Intense close-up sound and hypnotic texture transformation in scene 1";
    inferredStorytelling = "Hypnotic Visual Opening -> Micro Mechanism Reveal -> Mind-Soothing Realization";
    inferredPopularTopics = [
      "पिघले हुए बिस्मथ से रेनबो क्रिस्टल कैसे बनते हैं? (Satisfying Macro)",
      "हाइड्रोलिक प्रेस बनाम 1000 परतों वाला दामस्कस स्टील",
      "काइनेटिक सैंड को गर्म चाकू से काटने पर क्या होता है?",
      "प्रिंस रूपर्ट ड्रॉप के सिर पर गोली मारने का सुपर स्लो मोशन",
      "ग्लास के अंदर लिक्विड नाइट्रोजन डालने पर जादुई फ्रीज",
    ];
    inferredCompetitors = ["The Action Lab", "NileRed Shorts", "Oddly Satisfying"];
    inferredRestrictions = [
      "No loud jarring sound effects",
      "No aggressive shouting voiceovers",
      "Audio must be smooth and binaural",
    ];
  } else if (isGaming) {
    inferredNiche = "Gaming Lore, Secrets & Speedrun Physics";
    inferredSubNiche = "Hidden Easter Eggs, Unsolved Mysteries & Glitches";
    inferredTargetAudience = "Gamers, virtual world explorers & youth";
    inferredAgeGroup = "13–25 Active Gamers";
    inferredHookStyle = "High-stakes gaming mystery or impossible glitch hook";
    inferredStorytelling = "Impossible In-Game Feat -> Developer Secret -> Physics Engine Exploit -> Epic Payoff";
    inferredPopularTopics = [
      "GTA 5 के माउंट चिलियाड का अनसुलझा एलियन रहस्य",
      "Minecraft के हेरोब्राइन की असली कहानी क्या है?",
      "Red Dead Redemption 2 के 5 सबसे डरावने सीक्रेट्स",
      "वीडियो गेम्स में आईने (Mirrors) बनाना इतना मुश्किल क्यों होता है?",
      "Speedrunners गेम की दीवारों के आर-पार कैसे चले जाते हैं?",
    ];
    inferredCompetitors = ["Total Gaming", "Mythpat", "Game Theorists", "IGN"];
    inferredRestrictions = [
      "Accurate game engine details",
      "Dynamic kinetic capture pacing",
    ];
  } else if (isHorror) {
    inferredNiche = "Dark Psychological Mysteries & Unsolved Cases";
    inferredSubNiche = "Unexplained Phenomena, Urban Legends & Forensic Crime";
    inferredTargetAudience = "Crime, paranormal & suspense mystery lovers";
    inferredAgeGroup = "18–35 Thriller Fans";
    inferredHookStyle = "Chilling real-life quote or haunting archival photo hook";
    inferredStorytelling = "Ominous Setting -> The Vanishing Incident -> Forensic Clues -> Unresolved Theory";
    inferredPopularTopics = [
      "डायटलोव पास पर 9 पर्वतारोहियों की रहस्यमयी मौत का सच",
      "बर्मूडा ट्रायंगल के नीचे असल में क्या छुपा है?",
      "भानगढ़ किले में सूरज ढलने के बाद क्या होता है?",
      "मैरी सेलेस्टे जहाज से सभी लोग कहाँ गायब हो गए?",
      "दुनिया का सबसे डरावना साउंड: द ब्लोप (The Bloop)",
    ];
    inferredCompetitors = ["Khooni Monday", "FactVerse Horror", "Dark Web Files"];
    inferredRestrictions = [
      "Treat sensitive real victims with respect",
      "Preserve atmospheric dread",
    ];
  } else if (detectedStyle === "stickman_doodle") {
    inferredNiche = "Everyday Curiosities & Quick Facts";
    inferredSubNiche = "Rapid Science Breakdowns & Daily What-Ifs";
    inferredTargetAudience = "Curious youth, students, and fact lovers";
    inferredAgeGroup = "16–28 Young Curious Thinkers";
    inferredHookStyle = "Bold counter-intuitive question that challenges popular assumptions";
    inferredStorytelling = "Curiosity Question -> Misconception -> Visual Proof -> Shocking Payoff";
    inferredPopularTopics = [
      "लौंग असल में फूल है या फल? (Botanical Truth)",
      "अगर धरती 5 सेकंड के लिए घूमना बंद कर दे तो क्या होगा?",
      "हवाई जहाज का रंग हमेशा सफेद ही क्यों होता है?",
      "मोबाइल की बैटरी को 80% पर ही क्यों रोक देना चाहिए?",
    ];
    inferredCompetitors = ["Curious Guruji", "FactTechz"];
    inferredRestrictions = ["Keep lineart clean and minimal", "Factually accurate breakdowns"];
  }

  // If the channel has actual uploaded video titles, prioritize them!
  if (recentVideos.length > 0) {
    const extractedTitles = recentVideos.slice(0, 4).map((v) => v.title.replace(/#\w+/g, "").trim()).filter(Boolean);
    if (extractedTitles.length > 0) {
      inferredPopularTopics = [...extractedTitles, ...inferredPopularTopics.slice(extractedTitles.length)];
    }
  }

  // Detect Language dynamically from corpus
  const isHindiDominant =
    /[\u0900-\u097F]/.test(corpus) ||
    corpus.includes("hindi") ||
    corpus.includes("kya") ||
    corpus.includes("kaise") ||
    corpus.includes("sach") ||
    corpus.includes("kyon") ||
    corpus.includes("kahani");

  const primaryLanguage = preset?.primaryLanguage || (isHindiDominant ? "Hindi" : "English");

  // Detect Format (Shorts vs Longform)
  const isShortsDominant =
    corpus.includes("shorts") ||
    corpus.includes("#shorts") ||
    (recentVideos.length > 0 &&
      recentVideos.some((v) => v.title.includes("#shorts") || (v.duration && v.duration.includes("PT") && !v.duration.includes("M"))));

  const contentFormat =
    preset?.contentFormat || (isShortsDominant ? "YouTube Shorts (9:16)" : "Hybrid");

  const dynamicChar = generateDynamicCharacterAnchor(channel.channel_title, detectedStyle);

  const profile: ChannelStyleProfile = {
    profileId: `dna-${channel.youtube_channel_id || channel.id}-${Date.now()}`,
    channelId,
    channelName: channel.channel_title,
    youtubeChannelId: channel.youtube_channel_id,
    channelDescription:
      channel.description ||
      preset?.channelDescription ||
      `Official YouTube Channel ${channel.channel_title} synced with ASH Creator Studio 2.0 Content Intelligence`,
    channelNiche: preset?.channelNiche || inferredNiche,
    channelSubNiche: preset?.channelSubNiche || inferredSubNiche,
    targetAudience: preset?.targetAudience || inferredTargetAudience,
    audienceAgeGroup: preset?.audienceAgeGroup || inferredAgeGroup,
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
    storytellingStyle: preset?.storytellingStyle || inferredStorytelling,
    hookStyle: preset?.hookStyle || inferredHookStyle,
    averageVideoLength: preset?.averageVideoLength || 52,
    popularTopics: preset?.popularTopics || inferredPopularTopics,
    successfulVideoPatterns:
      preset?.successfulVideoPatterns || [
        "Hook within 1-2 seconds with curiosity gap",
        "Natural conversational narration (zero robotic phrases)",
        "Visual-audio synchronization on every scene",
        "Seamless next-video binge recommendation",
      ],
    competitorChannels: preset?.competitorChannels || inferredCompetitors,
    contentRestrictions: preset?.contentRestrictions || inferredRestrictions,
    visualPromptModifier: styleDef.promptModifier,
    negativePrompt: styleDef.negativePrompt,
    lightingPreference: styleDef.lightingPreference,
    cameraPreference: styleDef.cameraPreference,
    characterAnchor: preset?.characterAnchor || dynamicChar.characterAnchor,
    characterName: preset?.characterName || dynamicChar.characterName,
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
