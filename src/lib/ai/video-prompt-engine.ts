// ==============================================================================
// ASH CREATOR STUDIO — AI Video Prompt & Visual Style Engine
// Generates Scene-by-Scene Video Prompts for Midjourney, Runway, Kling & Luma
// Supports Shorts vs Longform, Custom Duration, 6 Market Styles & Character Consistency
// ==============================================================================

export interface AIVideoStyle {
  id: string;
  name: string;
  badge: string;
  description: string;
  bestFor: string;
  promptModifier: string;
  negativePrompt: string;
  lightingPreference: string;
  cameraPreference: string;
  previewGradient: string;
  previewImage?: string;
  isCustom?: boolean;
}

export interface ConsistentCharacter {
  id: string;
  name: string;
  description: string;
  anchorPrompt: string;
  avatarSeed: string;
}

export interface ScenePromptItem {
  sceneNumber: number;
  timeRange: string;
  stageName: "Hook" | "Misconception" | "Microscope / Beat 1" | "Secret / Beat 2" | "Science Truth / Beat 3" | "Climax" | "End Binge CTA";
  cameraDirection: string;
  aiVideoPrompt: string;
  midjourneyPrompt: string;
  runwayMotionPrompt: string;
  dialogVoiceover: string;
  onScreenText: string;
  sfxCue: string;
}

export interface GeneratedVideoPackage {
  title: string;
  format: "shorts" | "longform";
  durationSeconds: number;
  aspectRatio: "9:16" | "16:9";
  selectedStyle: AIVideoStyle;
  recommendedStyle: AIVideoStyle;
  characterEnabled: boolean;
  character?: ConsistentCharacter;
  totalScenes: number;
  scenes: ScenePromptItem[];
  fullVoiceoverScript: string;
  totalWords: number;
  estimatedSpeakingMinutes: number;
}

// 7 Market AI Video Styles (Including Connected Channel Signature: 2D Stickman)
export const TRENDING_AI_STYLES: AIVideoStyle[] = [
  {
    id: "stickman_doodle",
    name: "2D Animated Stickman & Doodle Explainer",
    badge: "Channel Signature 🎯",
    description: "Minimalist expressive doodle stick figure animations, animated whiteboard sketches, and viral curiosity storytelling",
    bestFor: "Daily Curiosities, Science Mysteries, Fact Breakdown, Viral Shorts (ASHISH FN Style)",
    promptModifier: "2D minimalist vector stickman animation art style, expressive doodle stick figure character with clean bold lineart, whiteboard educational infographic background with hand-drawn science diagrams and curiosity arrows, high contrast, clean modern YouTube explainer animation, whimsical yet educational, crisp vector illustration, simple color accents --style raw",
    negativePrompt: "photorealistic, 3D render, complex gradients, cluttered background, blurry line art, uncanny human face, noise",
    lightingPreference: "Clean dark or white backdrop with vibrant glowing cyan and amber accent doodles",
    cameraPreference: "Kinetic 2D doodle animation, snappy hand-drawn keyframes, smooth digital camera push-in and pop-up doodles",
    previewGradient: "from-slate-900 via-zinc-800 to-amber-500",
    previewImage: "/styles/stickman.svg",
  },
  {
    id: "unreal_3d",
    name: "Cinematic 3D Hyper-Realistic (UE5)",
    badge: "Trending #1",
    description: "Photorealistic 8K lighting, raytracing, and Hollywood depth of field like National Geographic",
    bestFor: "Space, Earth Physics, Scale Comparisons, Science What-Ifs",
    promptModifier: "Unreal Engine 5 render, cinematic 8k resolution, photorealistic raytracing, octane render, volumetric atmospheric lighting, shallow depth of field, 35mm anamorphic lens, IMAX quality --style raw",
    negativePrompt: "cartoon, low quality, oversaturated, blurry, 2d, watermark, text, deformed",
    lightingPreference: "Volumetric god rays, dramatic key light with subtle rim reflection",
    cameraPreference: "35mm anamorphic lens, cinematic slow tracking push-in",
    previewGradient: "from-blue-600 to-indigo-900",
    previewImage: "/styles/unreal_3d.svg",
  },
  {
    id: "noir_mystery",
    name: "Dark Mystery & Historical Noir",
    badge: "Viral Mystery",
    description: "Deep chiaroscuro shadows, 35mm film grain, and intense investigative suspense (FactTechz style)",
    bestFor: "Unsolved Curiosities, Ancient Secrets, Human Biology Mysteries",
    promptModifier: "Cinematic moody noir photography, dramatic chiaroscuro golden hour rim lighting, deep atmospheric shadows, 35mm film grain, dust particles floating in light beam, mysterious investigative documentary style",
    negativePrompt: "bright flat lighting, washed out, cartoon, happy cheerful colors",
    lightingPreference: "Dark chiaroscuro with a sharp amber or golden edge light",
    cameraPreference: "Extreme close-up macro, slow orbital panning",
    previewGradient: "from-amber-600 via-rose-900 to-slate-950",
    previewImage: "/styles/noir_mystery.svg",
  },
  {
    id: "micro_world",
    name: "Isometric Scientific Micro-World (3D Hologram)",
    badge: "Science Explainer",
    description: "Glowing neon cellular cutaway models and electron microscope level botanical details",
    bestFor: "Cloves / Plants Anatomy, Chemical Reactions, Battery Cells",
    promptModifier: "Futuristic 3D isometric cutaway scientific model, glowing neon cellular structures, electron microscope aesthetic, clean studio lighting, holographic cyan and amber accents, macro lens, ultra-detailed translucent textures",
    negativePrompt: "messy composition, flat 2d, low resolution, amateur sketch",
    lightingPreference: "Bioluminescent inner glow with clean cyan studio fill",
    cameraPreference: "Isometric 45-degree angle or super macro zoom into internal cells",
    previewGradient: "from-emerald-500 to-teal-950",
    previewImage: "/styles/micro_world.svg",
  },
  {
    id: "pixar_3d",
    name: "Vibrant 3D Pixar Animation",
    badge: "High Appeal",
    description: "Warm, friendly, expressive animated characters with rich personality and Pixar lighting",
    bestFor: "Everyday Relatable Curiosities, Biomechanics, Viral Family Shorts",
    promptModifier: "Pixar and Disney 3D animated feature film aesthetic, expressive character with rich emotional personality, soft subsurface scattering, warm vibrant colors, whimsical detailed environment, Octane 3D render",
    negativePrompt: "creepy, realistic uncanny valley skin pores, ugly, photorealism, dull colors",
    lightingPreference: "Warm golden sunlight with soft pastel bounce light",
    cameraPreference: "Eye-level medium shot with expressive dynamic camera tilt",
    previewGradient: "from-amber-500 to-orange-600",
    previewImage: "/styles/pixar_3d.svg",
  },
  {
    id: "anime_ghibli",
    name: "Studio Ghibli / Anime Nature Aesthetic",
    badge: "Aesthetic Chill",
    description: "Hand-painted watercolor backgrounds, fluffy nostalgic skies, and poetic natural greens",
    bestFor: "Nature Curiosities, Sky & Stars, Deep Mind-Bending Questions",
    promptModifier: "Studio Ghibli anime aesthetic, Makoto Shinkai sky with breathtaking puffy clouds, hand-painted watercolor background, lush glowing nature greens, soft nostalgic sunlight, masterpiece illustration",
    negativePrompt: "3d render, photorealistic, harsh shadows, dark gloom, gritty",
    lightingPreference: "Soft warm morning glow, shimmering watercolor highlights",
    cameraPreference: "Wide scenic establishing shots with wind blowing foliage",
    previewGradient: "from-sky-500 to-emerald-700",
    previewImage: "/styles/anime_ghibli.svg",
  },
  {
    id: "retro_comic",
    name: "Retro Comic Book & 2.5D Motion Graphic",
    badge: "Fast Paced",
    description: "Bold black ink outlines, dynamic halftone dots, and high-energy pop art contrast",
    bestFor: "High-Paced 30s Shorts, Mythbusting, Shocking Fact Countdowns",
    promptModifier: "Vintage retro comic book pop-art style, halftone dots pattern, bold dynamic black ink outlines, saturated pop-art color palette, pulp magazine aesthetic, explosive kinetic action framing",
    negativePrompt: "smooth 3d render, photorealistic, blurry, low contrast",
    lightingPreference: "High-contrast graphic flat shading with stylized rim highlights",
    cameraPreference: "Dynamic Dutch tilt angle with fast snap zoom",
    previewGradient: "from-red-500 to-yellow-500",
    previewImage: "/styles/retro_comic.svg",
  },
];

// Pre-built Consistent Character Anchors
export const DEFAULT_CHARACTERS: ConsistentCharacter[] = [
  {
    id: "ashish_stickman",
    name: "Ashish (2D Expressive Stickman Explainer)",
    description: "Minimalist clean doodle stick figure with expressive eyes, glasses, pointer, and curiosity gestures",
    anchorPrompt: "Consistent Protagonist: Minimalist 2D vector stickman character named Ashish, clean bold lineart silhouette on background, highly expressive cartoon eyes with animated eyebrows, wearing modern minimalist doodle glasses, holding a hand-drawn pointer or magnifying glass, hyper-expressive comedic and analytical body language",
    avatarSeed: "StickmanAshish",
  },
  {
    id: "ashish_investigator",
    name: "Ashish (Science Investigator)",
    description: "24yo Indian male science investigator, black technical hoodie, short neat hair, inquisitive look",
    anchorPrompt: "Consistent Protagonist: 24-year-old South Asian male science investigator named Ashish, short neat black hair, expressive dark brown eyes, subtle stubble, wearing a modern charcoal-black technical hoodie with rolled-up sleeves, thoughtful and inquisitive expression",
    avatarSeed: "AshishFN",
  },
  {
    id: "curious_explorer",
    name: "The Curious Explorer",
    description: "32yo explorer with round spectacles, field jacket, and antique brass scientific instruments",
    anchorPrompt: "Consistent Protagonist: 32-year-old curious explorer with round wireframe glasses, slightly tousled brown hair, wearing an olive-drab field jacket over a beige henley, holding a brass magnifying glass",
    avatarSeed: "Explorer",
  },
  {
    id: "young_scientist",
    name: "Modern Lab Educator",
    description: "26yo energetic presenter in a minimalist navy turtleneck and crisp modern white lab coat",
    anchorPrompt: "Consistent Protagonist: 26-year-old young modern scientist with energetic focused expression, wearing a crisp modern white lab coat over a dark navy turtleneck",
    avatarSeed: "Scientist",
  },
];

/**
 * Recommends the best visual style based on topic keywords
 */
export function recommendStyleForTopic(topic: string): AIVideoStyle {
  const lower = topic.toLowerCase();
  if (lower.includes("stickman") || lower.includes("doodle") || lower.includes("animation") || lower.includes("ashish") || lower.includes("fun") || lower.includes("रोचक")) {
    return TRENDING_AI_STYLES[0]; // 2D Animated Stickman & Doodle Explainer
  }
  if (lower.includes("लौंग") || lower.includes("clove") || lower.includes("plant") || lower.includes("पौधे") || lower.includes("cell") || lower.includes("फूल")) {
    return TRENDING_AI_STYLES[3]; // Isometric Scientific Micro-World
  }
  if (lower.includes("धरती") || lower.includes("earth") || lower.includes("space") || lower.includes("सूरज") || lower.includes("हवाई") || lower.includes("airplane")) {
    return TRENDING_AI_STYLES[1]; // Cinematic UE5 Hyper-Realistic
  }
  if (lower.includes("रहस्य") || lower.includes("mystery") || lower.includes("दर्द") || lower.includes("सच") || lower.includes("झटका") || lower.includes("नींद")) {
    return TRENDING_AI_STYLES[2]; // Dark Mystery Noir
  }
  if (lower.includes("चींटी") || lower.includes("बैटरी") || lower.includes("battery") || lower.includes("तारे")) {
    return TRENDING_AI_STYLES[6]; // Retro Comic Book
  }
  return TRENDING_AI_STYLES[0]; // Default to Channel Signature: 2D Stickman & Doodle Explainer
}

/**
 * Generates scene-by-scene AI Video Prompts and full synchronized Voiceover
 */
export function generateScenePackage(params: {
  title: string;
  format: "shorts" | "longform";
  durationSeconds: number; // e.g. 15, 30, 60 for shorts; 180 (3m), 300 (5m), 480 (8m) for longform
  style: AIVideoStyle;
  characterEnabled: boolean;
  character?: ConsistentCharacter;
  language?: "hindi" | "hinglish" | "english";
}): GeneratedVideoPackage {
  const { title, format, durationSeconds, style, characterEnabled, character, language = "hindi" } = params;

  const isShorts = format === "shorts";
  const aspectRatio = isShorts ? "9:16" : "16:9";
  const arFlag = `--ar ${aspectRatio}`;

  const charAnchor = characterEnabled && character ? `${character.anchorPrompt}, ` : "";
  const recStyle = recommendStyleForTopic(title);

  // Determine scene count based on duration
  let sceneCount = 6;
  if (durationSeconds <= 20) sceneCount = 3;
  else if (durationSeconds <= 35) sceneCount = 5;
  else if (durationSeconds <= 65) sceneCount = 8;
  else if (durationSeconds <= 180) sceneCount = 12;
  else if (durationSeconds <= 300) sceneCount = 16;
  else sceneCount = 20;

  const secondsPerScene = Math.max(3, Math.round(durationSeconds / sceneCount));

  // Determine topic-specific narrative beats
  const lower = title.toLowerCase();
  const isCloveTopic = lower.includes("लौंग") || lower.includes("clove");
  const isEarthTopic = lower.includes("धरती") || lower.includes("earth") || lower.includes("घूमना");
  const isAirplaneTopic = lower.includes("हवाई") || lower.includes("airplane") || lower.includes("सफेद");
  const isBatteryTopic = lower.includes("बैटरी") || lower.includes("battery") || lower.includes("80%");
  const isPlantTopic = lower.includes("पौधे") || lower.includes("plant") || lower.includes("दर्द");

  const scenes: ScenePromptItem[] = [];

  for (let i = 0; i < sceneCount; i++) {
    const startSec = i * secondsPerScene;
    const endSec = Math.min(durationSeconds, (i + 1) * secondsPerScene);
    const timeRange = `${formatTime(startSec)} - ${formatTime(endSec)}`;

    let stageName: ScenePromptItem["stageName"] = "Hook";
    let sceneSubject = "";
    let cameraDirection = "";
    let dialogVoiceover = "";
    let onScreenText = "";
    let sfxCue = "";

    if (i === 0) {
      // SCENE 1: THE OPENING HOOK (0:00 - 0:05)
      stageName = "Hook";
      sfxCue = "Dramatic sub-bass boom + glass shimmer";
      cameraDirection = "Rapid dynamic push-in zoom with 35mm lens directly onto subject";

      if (isCloveTopic) {
        sceneSubject = `${charAnchor}holding a dried brown clove between fingers up toward camera lens with an intense curious expression, standing in an atmospheric dimly lit botanical study`;
        dialogVoiceover = "आप जो लौंग चाय या खाने में रोज इस्तेमाल करते हैं, क्या वो कोई फल है या पेड़ का सूखा हुआ फूल? 99% लोग इसका जवाब गलत देते हैं!";
        onScreenText = "फूल या फल? 99% लोग गलत!";
      } else if (isEarthTopic) {
        sceneSubject = `${charAnchor}looking at a glowing holographic Earth globe rotating at high speed, suddenly the rotation freezes dead, shock on face`;
        dialogVoiceover = "सोचिए अगर धरती अचानक सिर्फ 5 सेकंड के लिए घूमना बंद कर दे... तो क्या होगा? फिजिक्स का जवाब आपकी रूह कंपा देगा!";
        onScreenText = "धरती 5 सेकंड के लिए रुक जाए तो?";
      } else if (isAirplaneTopic) {
        sceneSubject = `${charAnchor}standing on an expansive airport runway apron next to a massive pristine white passenger jetliner gleaming under intense desert sun`;
        dialogVoiceover = "हवाई जहाज का रंग हमेशा सफेद ही क्यों होता है? क्या कभी आपने कोई काला या डार्क नीला यात्री विमान देखा है?";
        onScreenText = "सफेद ही क्यों? (The Secret)";
      } else if (isBatteryTopic) {
        sceneSubject = `${charAnchor}staring at a modern smartphone screen glowing brightly displaying 100% battery icon with warning red sparks`;
        dialogVoiceover = "क्या आप भी अपने मोबाइल को 100% तक चार्ज करते हैं? अगर हां, तो आप अनजाने में अपने फोन की बैटरी को बर्बाद कर रहे हैं!";
        onScreenText = "100% चार्जिंग की बड़ी भूल!";
      } else {
        sceneSubject = `${charAnchor}facing camera with extreme curiosity holding magnifying glass investigating scientific anomaly`;
        dialogVoiceover = `क्या आपने कभी सोचा है कि ${title} के पीछे का असली वैज्ञानिक सच क्या है? आज 60 सेकंड में जानेंगे पूरा सच!`;
        onScreenText = "असली वैज्ञानिक सच जानिए!";
      }
    } else if (i === 1) {
      // SCENE 2: THE MISCONCEPTION CHALLENGE
      stageName = "Misconception";
      sfxCue = "Vinyl record scratch / question mark sound";
      cameraDirection = "Low-angle tracking shot panning across common everyday items";

      if (isCloveTopic) {
        sceneSubject = `Close-up shot of an ordinary kitchen spice jar filled with cloves, contrasted with wild fruits and seeds on wooden rustic table, ${charAnchor}gesturing in disbelief`;
        dialogVoiceover = "ज्यादातर लोग सोचते हैं कि लौंग किसी पेड़ का फल या सूखा हुआ बीज है। लेकिन वनस्पति विज्ञान में सच्चाई कुछ और ही है!";
        onScreenText = "ना फल है, ना बीज!";
      } else if (isEarthTopic) {
        sceneSubject = `Cinematic wide shot of Earth rotating at 1,670 km/h, atmosphere layer glowing neon blue against pitch-black starfield space`;
        dialogVoiceover = "हमारी पृथ्वी अपनी धुरी पर 1,670 किलोमीटर प्रति घंटे की रफ्तार से घूम रही है। हम इसे महसूस इसलिए नहीं करते क्योंकि हम सब साथ घूम रहे हैं!";
        onScreenText = "1,670 KM/H की रफ्तार!";
      } else if (isAirplaneTopic) {
        sceneSubject = `Split-screen comparison showing a dark black jet burning under intense heat vs a pristine white jet reflecting dazzling bright sunlight`;
        dialogVoiceover = "अगर किसी प्लेन को काले रंग से रंग दिया जाए, तो 35,000 फीट की ऊंचाई पर सीधी धूप से उसका तापमान 80 डिग्री सेल्सियस तक पहुंच जाएगा!";
        onScreenText = "काला प्लेन = 80°C भट्टी!";
      } else {
        sceneSubject = `Visual diagram illustrating the popular myth vs the hidden experimental scientific truth, ${charAnchor}pointing at data points`;
        dialogVoiceover = "इंटरनेट और आम जिंदगी में इस बारे में ज्यादातर बातें पूरी तरह गलत समझी जाती हैं। आइए देखते हैं असली तथ्य!";
        onScreenText = "आम धारणा vs विज्ञान";
      }
    } else if (i === 2) {
      // SCENE 3: BEAT 1 - THE ANATOMY / DEEP DISCOVERY
      stageName = "Microscope / Beat 1";
      sfxCue = "High-tech zoom whoosh + electrical frequency hum";
      cameraDirection = "Extreme macro electron-microscope style zoom revealing hidden cellular textures";

      if (isCloveTopic) {
        sceneSubject = `Ultra-detailed microscopic cutaway of a single clove: showing the 4 folded flower petals at the head, the 4 sharp sepals below, and the calyx tube stem, glowing anatomical labels`;
        dialogVoiceover = "अगर आप लौंग को ध्यान से देखें, तो इसके ऊपर की गोल टोपी असल में 4 मुड़े हुए फूल के दलपत्र (Petals) हैं, और नीचे 4 नुकीले बाह्यदल (Sepals)!";
        onScreenText = "लौंग = बंद फूल की कली!";
      } else if (isEarthTopic) {
        sceneSubject = `Super slow-motion physics simulation: as the Earth crust halts, atmosphere, skyscrapers and cars violently fling eastwards at supersonic bullet speeds`;
        dialogVoiceover = "न्यूटन का पहला नियम: जैसे ही धरती रुकेगी, उसका वायुमंडल और सब कुछ 1670 किमी/घंटा की सुपरसोनिक गति से पूरब की तरफ उड़ जाएगा!";
        onScreenText = "न्यूटन का पहला नियम (Inertia)";
      } else if (isAirplaneTopic) {
        sceneSubject = `Microscopic visualization of white titanium dioxide paint particles reflecting 99% of UV and solar infrared radiation waves away from fuselage`;
        dialogVoiceover = "सफेद रंग सूरज की 99% सोलर किरणों को वापस रिफ्लेक्ट कर देता है, जिससे करोड़ों रुपये का केबिन कूलिंग फ्यूल बचता है!";
        onScreenText = "99% सोलर रिफ्लेक्शन!";
      } else {
        sceneSubject = `Scientific breakdown revealing the primary mechanism, microscopic view of biological cells or atomic structures`;
        dialogVoiceover = "पहला मुख्य वैज्ञानिक कारण: यह प्रक्रिया इस प्राकृतिक सिद्धांत पर आधारित है जो सूक्ष्म स्तर पर काम करती है।";
        onScreenText = "कारण 1: वैज्ञानिक आधार";
      }
    } else if (i === sceneCount - 2) {
      // PENULTIMATE SCENE: THE CLIMAX / MIRACLE PROOF
      stageName = "Climax";
      sfxCue = "Triumphant riser swell + harmonic frequency chime";
      cameraDirection = "Dramatic 360-degree orbital rotation with shallow depth of field";

      if (isCloveTopic) {
        sceneSubject = `Photorealistic 3D molecular animation of Eugenol oil molecules neutralizing bacteria nerve pain receptors, split with historical Ayurvedic healer holding clove oil`;
        dialogVoiceover = "और लौंग में मौजूद Eugenol तेल सिर्फ 30 सेकंड में नसों के दर्द को सुन्न कर देता है—इसीलिए आधुनिक डेंटिस्ट भी इसका इस्तेमाल करते हैं!";
        onScreenText = "Eugenol = 30s में दर्द गायब!";
      } else if (isEarthTopic) {
        sceneSubject = `Massive 1000-foot tidal tsunami wave shifting from equator toward the Arctic pole, dramatic cinematic Hollywood disaster lighting`;
        dialogVoiceover = "भूमध्य रेखा का सारा समुद्री पानी ध्रुवों की तरफ भागेगा, जिससे 1000 फीट ऊंची सुनामी पूरी दुनिया में तबाही मचा देगी!";
        onScreenText = "1000 फीट की सुनामी!";
      } else if (isAirplaneTopic) {
        sceneSubject = `Close-up shot of aerospace engineers inspecting a white wing with laser scanner, tiny hairline oil crack instantly highlighted in bright neon green`;
        dialogVoiceover = "और सबसे बड़ी बात: सफेद सतह पर सूक्ष्म क्रैक्स और ऑयल लीकेज इंजीनियरों को सेकंडों में साफ दिख जाते हैं, जो सुरक्षा के लिए सबसे जरूरी है!";
        onScreenText = "तुरंत क्रैक डिटेक्शन!";
      } else {
        sceneSubject = `Peak scientific payoff shot showing the experiment result verified with clear triumphant evidence`;
        dialogVoiceover = "यह अंतिम प्रमाण साबित करता है कि प्रकृति के नियम कितने सुव्यवस्थित और चमत्कारी हैं!";
        onScreenText = "अंतिम वैज्ञानिक निष्कर्ष";
      }
    } else if (i === sceneCount - 1) {
      // FINAL SCENE: SEAMLESS ENDSCREEN BINGE CTA
      stageName = "End Binge CTA";
      sfxCue = "Crisp screen tap sound + playful chime";
      cameraDirection = "Medium smiling shot, ${charAnchor}pointing finger directly toward the right side of the screen";

      sceneSubject = `${charAnchor}smiling confidently directly at camera, gesturing pointing finger toward the right corner of the video frame where an interactive YouTube next-video card appears, cozy cinematic background with soft bokeh lights`;
      dialogVoiceover = isCloveTopic
        ? "तो अगली बार कोई लौंग को फल कहे, तो उसे ये सच जरूर बताएं! और हवाई जहाज सफेद क्यों होता है? स्क्रीन पर दिख रहे अगले वीडियो पर अभी क्लिक करें!"
        : "प्रकृति के ऐसे ही रोंगटे खड़े कर देने वाले विज्ञान रहस्यों के लिए चैनल को सब्सक्राइब करें और स्क्रीन पर दिख रहे अगले वीडियो पर अभी क्लिक करें!";
      onScreenText = "👉 अभी अगले वीडियो पर क्लिक करें!";
    } else {
      // MIDDLE STORY BEATS (Why it's harvested before bloom, experiments, etc.)
      stageName = i % 2 === 0 ? "Secret / Beat 2" : "Science Truth / Beat 3";
      sfxCue = "Soft whoosh transition + clock ticking";
      cameraDirection = "Smooth cinematic dolly sideways tracking with golden hour lighting";

      if (isCloveTopic) {
        sceneSubject = `Time-lapse transformation of a green clove bud about to burst into a vibrant pink blossom, suddenly farmer hand gently harvests it just in time before bloom in lush tropical orchard`;
        dialogVoiceover = "अगर किसान इसे खिलने दें, तो वो सुंदर गुलाबी फूल बन जाएगा। लेकिन खिलते ही इसका सारा जादुई सुगंधित तेल उड़ जाता है! इसीलिए इसे कली के रूप में ही तोड़ा जाता है।";
        onScreenText = "खिलने से पहले ही क्यों तोड़ते हैं?";
      } else if (isEarthTopic) {
        sceneSubject = `Atmospheric friction sparks flying across mountain ranges as continental plates experience tectonic seismic inertia`;
        dialogVoiceover = "धरती के अचानक रुकने से भयानक घर्षण पैदा होगा, जिससे हवा का तापमान सैकड़ों डिग्री बढ़ जाएगा और आसमान में आग के बवंडर उठेंगे!";
        onScreenText = "हजारों मील प्रति घंटा घर्षण!";
      } else if (isAirplaneTopic) {
        sceneSubject = `Industrial aircraft paint hangar showing automated robotic arms spraying 500 kilograms of white enamel paint onto a brand new Boeing fuselage`;
        dialogVoiceover = "एक विमान को रंगने में 500 किलो पेंट लगता है। सफेद रंग के अलावा कोई और रंग प्लेन का वजन और बढ़ा देता है, जिससे हर साल करोड़ों का फ्यूल जलता है!";
        onScreenText = "500 KG पेंट का खेल!";
      } else {
        sceneSubject = `Demonstration of the experimental process with clear graphic visual callouts and natural motion`;
        dialogVoiceover = `बीट ${i}: इस वैज्ञानिक तथ्य का सीधा असर हमारे रोजमर्रा के जीवन और समझ पर पड़ता है।`;
        onScreenText = `बीट ${i}: गहरा प्रभाव`;
      }
    }

    // Compose Full AI Video Prompt (Ready for Midjourney / Runway / Kling / Luma)
    const baseVisual = `${sceneSubject}, ${style.promptModifier} ${arFlag}`;
    const midjourney = `/imagine prompt: ${baseVisual} --no ${style.negativePrompt}`;
    const runwayMotion = `Camera movement: ${cameraDirection}. ${sceneSubject}. Aesthetic: ${style.name}, ${style.lightingPreference}. High visual coherence.`;

    scenes.push({
      sceneNumber: i + 1,
      timeRange,
      stageName,
      cameraDirection,
      aiVideoPrompt: baseVisual,
      midjourneyPrompt: midjourney,
      runwayMotionPrompt: runwayMotion,
      dialogVoiceover,
      onScreenText,
      sfxCue,
    });
  }

  const fullVoiceoverScript = scenes.map((s) => `[${s.timeRange}] (${s.stageName})\n${s.dialogVoiceover}`).join("\n\n");
  const totalWords = fullVoiceoverScript.split(/\s+/).filter(Boolean).length;
  const estimatedSpeakingMinutes = Number((totalWords / 140).toFixed(1));

  return {
    title,
    format,
    durationSeconds,
    aspectRatio,
    selectedStyle: style,
    recommendedStyle: recStyle,
    characterEnabled,
    character,
    totalScenes: scenes.length,
    scenes,
    fullVoiceoverScript,
    totalWords,
    estimatedSpeakingMinutes,
  };
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
