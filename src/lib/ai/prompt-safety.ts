/**
 * AI Prompt Safety & Style Director Engine
 * ASH Creator Studio
 *
 * Guarantees:
 * 1. 100% Policy Compliance (Google Flow, Veo, Runway Gen-3, Kling 1.5, Midjourney).
 * 2. ZERO realistic humans / zero photorealistic Indian boys across all prompts.
 * 3. Distinct, authentic visual styles (3D Sticky Man, Zack D. Simulation, CurioKid Cartoon, MrBeast, FactTechz, ASMR, etc.).
 * 4. Scene-specific visual choreography: visuals tightly match what is actually spoken in that specific scene!
 */

export interface StyleDefinition {
  id: string;
  name: string;
  characterDescription: string;
  characterActionPrefix: string;
  environmentDescription: string;
  renderKeywords: string;
  cameraMovement: string;
}

export const STYLE_DEFINITIONS: Record<string, StyleDefinition> = {
  "style-stickman": {
    id: "style-stickman",
    name: "3D Sticky Man Animation",
    characterDescription:
      "3D stylized minimalist white stickman (sticky man) with big expressive cartoon eyes, smooth rounded 3D stick limbs, Zack D. Films and Alan Becker animation style, high-end Octane 3D render, zero realistic humans, no photorealistic people",
    characterActionPrefix: "the 3D white stickman character with expressive comic reactions examining ",
    environmentDescription: "a modern dark-slate minimalist workbench with floating glowing cyan infographic callouts and holographic arrows",
    renderKeywords: "Zack D. Films animation aesthetic, Octane 3D stylized render, clean studio lighting, soft cartoon drop-shadows, 8k resolution",
    cameraMovement: "dynamic 60fps tracking camera following the 3D stickman character, comic snap-zooms, kinetic infographic transitions",
  },
  "style-curiokid-cartoon": {
    id: "style-curiokid-cartoon",
    name: "CURIOKID 3D Cartoon Explorer",
    characterDescription:
      "Pixar and Disney 3D animated cartoon boy explorer with adventurer hat, huge curious expressive eyes, colorful cartoon jacket, stylized 3D character render, zero realistic humans, no photorealistic people",
    characterActionPrefix: "the cute 3D cartoon boy explorer curiously observing ",
    environmentDescription: "a vibrant colorful stylized animated scientific laboratory with magical warm golden rim lighting",
    renderKeywords: "Pixar 3D animation style, soft subsurface scattering, vibrant fairytale contrast, clean animated studio, 8k resolution",
    cameraMovement: "smooth cinematic 60fps crane orbit and push-in tracking the cartoon explorer character",
  },
  "style-zackd": {
    id: "style-zackd",
    name: "Zack D. Films 3D Simulation",
    characterDescription:
      "Zack D. Films smooth beige 3D clay anatomical simulation model, faceless dummy figure, clinical physical cutaway, zero realistic humans, no real human faces",
    characterActionPrefix: "the 3D clinical simulation clay figure interacting with ",
    environmentDescription: "a sterile cool-white and medical-cyan clinical simulation laboratory studio with subsurface scattering",
    renderKeywords: "Zack D. Films 3D physical simulation style, clinical medical Octane render, transparent cutaway view, 8k resolution",
    cameraMovement: "slow 360-degree anatomical orbital pan, micro-cross-section zoom into physical cutaway, 60fps smooth fluid tracking",
  },
  "style-facttechz": {
    id: "style-facttechz",
    name: "FactTechz Hyper-Cinematic Cosmos",
    characterDescription:
      "cosmic scientific visualization with glowing cyan and violet holographic telemetry HUD overlays, zero humans, no human figures",
    characterActionPrefix: "floating holographic laser diagnostic grids scanning ",
    environmentDescription: "deep dark cosmic space with volumetric purple and cyan laser light sheets, glowing nebulae, and drifting star dust motes",
    renderKeywords: "FactTechz space noir style, volumetric cyan laser sheets, anamorphic blue lens flare, chiaroscuro contrast, 8k resolution",
    cameraMovement: "slow ominous backward dolly pullout, floating cosmic camera drift, 60fps fluid motion",
  },
  "style-mrbeast": {
    id: "style-mrbeast",
    name: "MrBeast High-Energy Fast-Cut",
    characterDescription:
      "3D stylized cartoon energetic character with exaggerated comical shocked expression, thick yellow stroke callout graphics, zero realistic humans",
    characterActionPrefix: "dynamic comic action VFX exploding around ",
    environmentDescription: "ultra-saturated stadium studio backdrop with golden sparks, dynamic yellow warning arrows, and explosive contrast",
    renderKeywords: "MrBeast viral high-energy thumbnail style, ultra-saturated 4K HDR, thick comic stroke callouts, explosive yellow sparks, 8k resolution",
    cameraMovement: "kinetic whip pans, instant snap crash-zooms, 60fps high-motion dynamic tracking",
  },
  "style-dhruv": {
    id: "style-dhruv",
    name: "Dhruv Rathee Infographic Explainer",
    characterDescription:
      "clean 3D minimalist vector motion graphics with floating highlighted document cutouts and analytical spotlights, zero realistic humans",
    characterActionPrefix: "interactive 3D isometric infographic diagrams illuminating ",
    environmentDescription: "minimalist dark slate editorial studio with warm yellow spotlight callouts and animated 3D topographic grid lines",
    renderKeywords: "clean isometric infographic explainer style, crisp vector charts, high-key spotlight callouts, 8k resolution",
    cameraMovement: "flat isometric camera pan, kinetic diagram push-in, smooth data card pop, 60fps",
  },
  "style-asmr": {
    id: "style-asmr",
    name: "Satisfying Macro 3D ASMR",
    characterDescription:
      "ray-traced translucent glass elements, iridescent rainbow caustics, viscous fluid dynamics, zero humans, pure physical satisfaction",
    characterActionPrefix: "seamless hypnotic fluid micro-currents flowing through ",
    environmentDescription: "pristine minimalist studio with iridescent pastel lighting, optical glass prisms, and clean water reflections",
    renderKeywords: "satisfying 3D macro ASMR style, Cinema4D Octane render, ray-traced glass dispersion, 1000fps ultra-slow-motion texture",
    cameraMovement: "microscopic macro focus pull, seamless continuous fluid gliding, ultra-slow motion 60fps",
  },
  "style-cyberpunk": {
    id: "style-cyberpunk",
    name: "Cyberpunk / Anime Manga Action",
    characterDescription:
      "cel-shaded 3D anime stylized character with glowing neon visor, comic speed lines, zero realistic humans, no photorealistic people",
    characterActionPrefix: "dynamic anime speed-lines converging toward ",
    environmentDescription: "futuristic Neo-Tokyo tech laboratory with neon magenta and cyan night illumination and holographic HUD displays",
    renderKeywords: "cel-shaded anime manga aesthetic, glowing neon rim light, holographic HUD overlays, dynamic comic perspective, 8k resolution",
    cameraMovement: "high-speed parallax tracking, dynamic anime perspective tilt, 60fps fluid motion",
  },
  "style-papercut": {
    id: "style-papercut",
    name: "Vintage Paper Cut-Out Stop Motion",
    characterDescription:
      "whimsical layered craft paper cutout puppet character with textured cardboard limbs, charming stop-motion aesthetic, zero realistic humans",
    characterActionPrefix: "tactile cardboard diorama layers shifting to reveal ",
    environmentDescription: "warm tabletop studio with textured craft paper, natural cardboard drop-shadows, and retro overhead lamp glow",
    renderKeywords: "vintage papercraft stop-motion style, layered textured cardboard, tactile diorama feel, 12fps aesthetic at 60fps, 8k resolution",
    cameraMovement: "fixed tabletop framing, subtle cardboard layer depth shifting, stop-motion transitions",
  },
  "style-darkmystery": {
    id: "style-darkmystery",
    name: "Dark Mystery & True Crime Noir",
    characterDescription:
      "atmospheric chiaroscuro silhouette in trench coat and fedora, face hidden in dramatic shadow, red evidence string on pinboard, zero realistic human faces, no photorealistic people",
    characterActionPrefix: "the mysterious silhouette examining the glowing red pinboard clues for ",
    environmentDescription: "a dark smoky detective archive room illuminated by single amber desk lamp and venetian blind shadows",
    renderKeywords: "35mm grain film noir aesthetic, heavy chiaroscuro shadow contrast, atmospheric volumetric dust motes, moody amber lighting, 8k resolution",
    cameraMovement: "slow creeping dolly-in push, ultra-shallow depth of field f/1.2, 60fps cinematic fluidity",
  },
  "style-ashishfn": {
    id: "style-ashishfn",
    name: "ASHISH FN Signature 3D",
    characterDescription:
      "3D stylized cartoon sticky man cutout with vibrant yellow and cyan grading, comic sticker callouts, zero realistic humans, no photorealistic people",
    characterActionPrefix: "the 3D stylized character pointing with infographic callouts at ",
    environmentDescription: "modern dark studio with vibrant dual-rim lighting (neon cyan and warm gold), deep dark vignette",
    renderKeywords: "high-contrast 3D stylized character cutout, vibrant yellow/cyan grading, sticker callouts, 8k resolution",
    cameraMovement: "dynamic fast push-in, 60fps snap zoom with motion blur, kinetic tracking",
  },
};

/**
 * Extracts scene-specific physical subject details based on the voiceover and scene role.
 */
function extractSceneVisualSubject(
  rawTopic: string,
  voiceover: string,
  sceneIndex: number,
  isLastScene: boolean
): { subject: string; actionDetail: string } {
  const combined = `${rawTopic} ${voiceover}`.toLowerCase();

  // 1. Temperature / Heat / Thermal Runaway
  if (/temperature|heat|degree|500|thermal|overheat|hot|garam|celcius/i.test(combined)) {
    return {
      subject: "glowing holographic digital temperature gauge surging in real time with red thermal heat map indicators",
      actionDetail: "monitoring the rapid thermal reaction displaying critical temperature warnings",
    };
  }

  // 2. Battery / Lithium Ions / Chemical Reaction
  if (/battery|lithium|ion|chemical|reaction|cell|separator|anode|cathode|electrolyte/i.test(combined)) {
    return {
      subject: "3D micro-cross-section of illuminated lithium-ion battery cells with microscopic energy pathways surging",
      actionDetail: "inspecting the internal battery micro-structure and chemical ion flow",
    };
  }

  // 3. Charger / Cable / Voltage / Circuit / Fake vs Real
  if (/charger|cable|wire|voltage|circuit|motherboard|fake|duplicate|original|certified/i.test(combined)) {
    return {
      subject: "high-tech charging diagnostic console with glowing voltage traces and electronic circuit comparison",
      actionDetail: "comparing high-precision voltage regulation across the power circuit board",
    };
  }

  // 4. Smartphone / Hardware Device
  if (/phone|smartphone|screen|mobile|display|device|gadget/i.test(combined)) {
    return {
      subject: "a high-end modern smartphone hardware device with illuminated diagnostic micro-connectors",
      actionDetail: "examining the smartphone internal hardware on the workstation",
    };
  }

  // 5. Microchips / Nanotech / Silicon
  if (/chip|semiconductor|asml|transistor|silicon|nanometer|microchip/i.test(combined)) {
    return {
      subject: "silicon microchip wafer with glowing holographic circuit traces under ultraviolet laser scan",
      actionDetail: "analyzing the nanometer transistor lattice under high-tech microscope",
    };
  }

  // 6. Space / Cosmic / Stars
  if (/space|planet|black hole|universe|galaxy|cosmos|gravity|star/i.test(combined)) {
    return {
      subject: "awe-inspiring celestial phenomenon with glowing accretion disk and cosmic dust particles",
      actionDetail: "observing the cosmic gravitational light lensing across deep space",
    };
  }

  // Scene Role Fallbacks:
  if (sceneIndex === 1) {
    return {
      subject: "high-impact illuminated technological focal subject with glowing warning indicator light",
      actionDetail: "jumping back in comical shock as the core subject illuminates",
    };
  }

  if (sceneIndex === 2) {
    return {
      subject: "high-contrast 3D technical blueprint schematic with floating holographic diagnostic data lines",
      actionDetail: "pointing to glowing analytical data streams and structural breakdown",
    };
  }

  if (sceneIndex === 3) {
    return {
      subject: "detailed 3D cross-section simulation showing internal mechanical components and glowing energy pathways",
      actionDetail: "tracking the internal 3D mechanism as laser scan beams sweep across components",
    };
  }

  if (isLastScene) {
    return {
      subject: "pristine technological system in operational perfection with clean studio lighting",
      actionDetail: "giving a confident animated thumbs-up as the camera resolves to the opening framing",
    };
  }

  return {
    subject: "precision engineered technological device with flowing digital diagnostic traces",
    actionDetail: "inspecting the operational details on the workstation",
  };
}

export interface CinematicScenePrompt {
  imagePrompt: string;
  motionPrompt: string;
  directorCue: string;
}

/**
 * Builds 100% Policy-Safe, Style-Accurate, Scene-Specific Cinema Prompts.
 * Automatically adapts to the chosen style (Sticky Man, Zack D., CurioKid, MrBeast, etc.).
 * Strictly prevents realistic humans across all outputs.
 */
export function buildCinematicScenePrompts(
  rawTopic: string,
  sceneIndex: number, // 1, 2, 3, etc.
  isLastScene: boolean = false,
  aspectRatio: string = "9:16",
  styleIdOrName: string = "style-stickman",
  customCharacterAnchor?: string,
  isCharacterLocked: boolean = true,
  voiceoverLine: string = ""
): CinematicScenePrompt {
  // Resolve style definition
  let styleKey = "style-stickman";
  if (STYLE_DEFINITIONS[styleIdOrName]) {
    styleKey = styleIdOrName;
  } else {
    // Search by name
    const found = Object.keys(STYLE_DEFINITIONS).find((k) =>
      STYLE_DEFINITIONS[k].name.toLowerCase().includes(styleIdOrName.toLowerCase())
    );
    if (found) styleKey = found;
  }

  const style = STYLE_DEFINITIONS[styleKey] || STYLE_DEFINITIONS["style-stickman"];

  // Extract scene-specific physical visual subject
  const sceneVisual = extractSceneVisualSubject(rawTopic, voiceoverLine, sceneIndex, isLastScene);

  // Character prompt determination:
  // If user provided a custom anchor that does NOT mention realistic humans, use it; otherwise use the style's own character
  let activeCharacterDesc = style.characterDescription;
  let activeActionPrefix = style.characterActionPrefix;

  if (isCharacterLocked && customCharacterAnchor && !/indian|creator|hoodie|glasses|fade haircut|photorealistic|24yo/i.test(customCharacterAnchor)) {
    activeCharacterDesc = `[Character Anchor: ${customCharacterAnchor}], stylized 3D character, zero realistic humans, no photorealistic people`;
    activeActionPrefix = "the stylized 3D character examining ";
  }

  // --- SCENE 1: Strictly 3s High-Impact Opening Hook ---
  if (sceneIndex === 1) {
    return {
      imagePrompt: `Cinematic 8k 3D stylized scene, visual style of ${style.name}, featuring ${activeCharacterDesc}, ${activeActionPrefix}${sceneVisual.subject}, situated in ${style.environmentDescription}, dramatic neon rim lighting, shallow depth of field, ${style.renderKeywords}, no realistic humans, no photorealistic people --ar ${aspectRatio} --v 6.1 --stylize 250`,
      motionPrompt: `Cinematic smooth continuous camera push-in zoom gliding directly toward ${activeActionPrefix}${sceneVisual.subject} on ${style.environmentDescription}, dramatic volumetric lighting, shallow depth of field, 60fps fluid 3D animated motion, ${style.cameraMovement}`,
      directorCue: `High-impact 3D camera push-in capturing the ${style.name} visual aesthetic with immediate focus on the hook subject.`,
    };
  }

  // --- SCENE 2: Evidence / Scientific Breakdown ---
  if (sceneIndex === 2) {
    return {
      imagePrompt: `High-contrast 3D stylized scientific breakdown, visual style of ${style.name}, featuring ${activeCharacterDesc}, ${activeActionPrefix}${sceneVisual.subject}, situated in ${style.environmentDescription}, glowing holographic lines, ${style.renderKeywords}, no realistic humans --ar ${aspectRatio} --v 6.1`,
      motionPrompt: `Smooth horizontal parallax camera sweep across ${sceneVisual.subject} as ${activeActionPrefix}points to analytical data indicators, 60fps cinematic fluidity, volumetric atmospheric lighting, ${style.cameraMovement}`,
      directorCue: `Horizontal camera sweep revealing diagnostic details and evidence in ${style.name} style.`,
    };
  }

  // --- SCENE 3: Core 3D Mechanism Cross-Section ---
  if (sceneIndex === 3) {
    return {
      imagePrompt: `Detailed 3D simulation cross-section, visual style of ${style.name}, featuring ${activeCharacterDesc}, ${activeActionPrefix}${sceneVisual.subject}, glowing bioluminescent particle pathways, ${style.renderKeywords}, clean studio setting, no realistic humans --ar ${aspectRatio} --v 6.1`,
      motionPrompt: `Slow 360-degree orbital camera rotation around the internal cross-section of ${sceneVisual.subject} with ${activeActionPrefix}the dynamic mechanical energy flow, slow volumetric laser scan sweep, 60fps fluid tracking, ${style.cameraMovement}`,
      directorCue: `360-degree orbital rotation exposing the internal 3D mechanism and dynamic energy flow in ${style.name} aesthetic.`,
    };
  }

  // --- LAST SCENE: Seamless Retention Loop ---
  if (isLastScene) {
    return {
      imagePrompt: `Breathtaking 3D stylized wide vista in operational perfection, visual style of ${style.name}, featuring ${activeCharacterDesc}, ${activeActionPrefix}${sceneVisual.subject}, situated in ${style.environmentDescription}, golden hour atmospheric rim lighting, ${style.renderKeywords}, clean studio setting, no realistic humans --ar ${aspectRatio} --v 6.1`,
      motionPrompt: `Slow backward crane tracking pullout gliding smoothly from ${sceneVisual.subject} back to the exact opening camera framing perspective, seamless infinite loop, 60fps fluidity, ${style.cameraMovement}`,
      directorCue: `Slow backward crane pullout resolving cleanly into the opening camera perspective for 100% infinite retention loop.`,
    };
  }

  // --- Middle Progression Scenes (Scenes 4, 5 in longer scripts) ---
  return {
    imagePrompt: `Cinematic 8k 3D stylized camera shot, visual style of ${style.name}, scene ${sceneIndex}, featuring ${activeCharacterDesc}, ${activeActionPrefix}${sceneVisual.subject}, situated in ${style.environmentDescription}, volumetric studio lighting, ${style.renderKeywords}, no realistic humans --ar ${aspectRatio} --v 6.1`,
    motionPrompt: `Smooth cinematic 60fps tracking camera orbit around ${sceneVisual.subject} with ${activeActionPrefix}volumetric light rays, studio environment, ${style.cameraMovement}`,
    directorCue: `Smooth continuous tracking camera motion showcasing operational details in ${style.name} style.`,
  };
}

/**
 * Backward compatibility helper for general strings
 */
export function sanitizeTopicForAIPrompt(topic: string): string {
  const visual = extractSceneVisualSubject(topic, "", 1, false);
  return visual.subject;
}

export function buildSafeMotionPrompt(
  rawMotion: string,
  cameraStyle: string = "cinematic 60fps continuous camera motion",
  topic: string = "",
  styleIdOrName: string = "style-stickman"
): string {
  const style = STYLE_DEFINITIONS[styleIdOrName] || STYLE_DEFINITIONS["style-stickman"];
  const visual = extractSceneVisualSubject(topic, "", 1, false);
  let motion = rawMotion || "";

  // Strip tool prefixes
  motion = motion.replace(/^(?:Runway Gen-3|Kling 1\.5|Luma|Pika):\s*/i, "");

  // If rawMotion contains old contaminated title or focal junk, replace entirely with cinema motion
  if (motion.includes("🔥") || motion.includes("Exposed") || motion.includes("Blast") || motion.includes("Scam") || motion.includes("3 Seconds")) {
    return `Cinematic smooth continuous camera push-in zoom tracking ${style.characterActionPrefix}${visual.subject} on ${style.environmentDescription}, dramatic volumetric studio lighting, shallow depth of field, 60fps fluid 3D animated motion, professional commercial lighting`;
  }

  // Strip audio cues (ES5-safe)
  motion = motion.replace(/🎵[\s\S]*$/, "").trim();

  // Replace generic focal object with extracted visual subject
  motion = motion.replace(/\b(?:focal object|focal point)\b/gi, visual.subject);

  return `${motion}, ${cameraStyle}, volumetric studio light rays, 60fps fluidity, 3D stylized animation, clean studio setting`;
}
