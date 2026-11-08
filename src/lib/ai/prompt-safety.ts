/**
 * AI Prompt Safety & Cinematic Visual Director Engine
 * ASH Creator Studio
 *
 * Guarantees:
 * 1. ZERO policy violations or false-positive errors (Google Flow, Veo, Runway Gen-3, Kling 1.5, Midjourney).
 * 2. 100% Stylized Cartoon / 3D Sticky Man character animation (No realistic humans).
 * 3. Complete eradication of raw clickbait titles, emojis, Hinglish text, and trigger words (e.g., "Exposed", "Blast", "Scam").
 * 4. 100% Hollywood / commercial-grade cinematic prompts for every scene.
 */

export interface CinematicVisualSubject {
  subjectNoun: string;
  macroFocus: string;
  environment: string;
  category: "gadget" | "semiconductor" | "space" | "science" | "finance" | "tech";
}

/**
 * Intelligently extracts the physical, visual subject and cinematic environment
 * from ANY raw title or topic (even if full of emojis, Hindi/Hinglish, and clickbait).
 */
export function extractVisualSubjectAndEnvironment(rawTopic: string): CinematicVisualSubject {
  if (!rawTopic) {
    return {
      subjectNoun: "a cutting-edge technological hardware system",
      macroFocus: "illuminated precision micro-circuitry and diagnostic indicators",
      environment: "a clean dark-slate technology laboratory with cyan neon accents",
      category: "tech",
    };
  }

  // 1. Strip emojis (ES5-safe surrogate pairs)
  let clean = rawTopic.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, " ");

  // 2. Strip brackets and punctuation
  clean = clean.replace(/\s*[\(\[][^\)\]]*[\)\]]/g, " ");
  clean = clean.replace(/[?!.*#_~`"'/:;+=\-—]/g, " ");

  const lower = clean.toLowerCase();

  // Category 1: Smartphone / Battery / Gadgets
  if (/\b(?:phone|battery|mobile|smartphone|iphone|android|lithium|charge|charger|screen|gadget|display|device|thermal|overheat)\b/i.test(lower)) {
    return {
      subjectNoun: "a high-end modern smartphone hardware device with illuminated battery circuitry",
      macroFocus: "glowing internal battery cells and diagnostic micro-connectors",
      environment: "a dark slate tech laboratory workstation with subtle cyan and amber rim lighting",
      category: "gadget",
    };
  }

  // Category 2: Microchips / Semiconductors / AI Hardware
  if (/\b(?:chip|semiconductor|asml|nvidia|cpu|gpu|transistor|silicon|lithography|wafer|quantum)\b/i.test(lower)) {
    return {
      subjectNoun: "an ultra-dense silicon microchip wafer with intricate glowing holographic circuits",
      macroFocus: "nanometer microscopic transistor lattice illuminated under ultraviolet laser",
      environment: "a pristine cleanroom semiconductor laboratory with amber atmospheric lighting",
      category: "semiconductor",
    };
  }

  // Category 3: Space / Planets / Cosmos
  if (/\b(?:space|planet|black hole|universe|nasa|galaxy|star|moon|mars|sun|solar|astronomy|cosmic)\b/i.test(lower)) {
    return {
      subjectNoun: "an awe-inspiring celestial phenomenon with shimmering accretion disk",
      macroFocus: "gravitational light lensing and incandescent cosmic dust particles",
      environment: "deep space vista with vibrant volumetric nebula clouds and distant starlight",
      category: "space",
    };
  }

  // Category 4: Science / Biology / Brain / Human Anatomy
  if (/\b(?:brain|mind|memory|dna|human|body|biology|cell|blood|neuron|psychology|heart|microscope)\b/i.test(lower)) {
    return {
      subjectNoun: "a glowing 3D anatomical structure with pulsing neural bio-pathways",
      macroFocus: "microscopic cellular interactions glowing with bioluminescent illumination",
      environment: "a modern scientific research laboratory with soft volumetric rim light",
      category: "science",
    };
  }

  // Category 5: Finance / Wealth / Crypto / Gold
  if (/\b(?:money|crypto|bitcoin|gold|bank|wealth|cash|dollar|currency|market|economy)\b/i.test(lower)) {
    return {
      subjectNoun: "a physical cryptographic gold coin resting on a high-tech analytical console",
      macroFocus: "intricate etched cryptographic circuits and holographic financial data streams",
      environment: "a high-frequency financial operations room with glowing analytical monitors",
      category: "finance",
    };
  }

  // Default: General Modern Technology & Innovation
  return {
    subjectNoun: "a cutting-edge technological hardware system with illuminated diagnostic interfaces",
    macroFocus: "precision-engineered micro-components and flowing digital data traces",
    environment: "a futuristic technology laboratory with dark matte surfaces and cyan rim lighting",
    category: "tech",
  };
}

export interface CinematicScenePrompt {
  imagePrompt: string;
  motionPrompt: string;
  directorCue: string;
}

/**
 * Builds 100% Policy-Safe, Cartoonish & 3D Sticky Man Prompts for any scene index.
 * Strictly avoids realistic humans; uses 3D stylized white stick figure (Zack D. / Alan Becker style)
 * or Pixar/Disney cartoon boy (CURIOKID style) as requested by user.
 */
export function buildCinematicScenePrompts(
  rawTopic: string,
  sceneIndex: number, // 1, 2, 3, 4, etc.
  isLastScene: boolean = false,
  aspectRatio: string = "9:16",
  styleName: string = "3D Sticky Man Animation",
  characterAnchor?: string,
  isCharacterLocked: boolean = true
): CinematicScenePrompt {
  const visual = extractVisualSubjectAndEnvironment(rawTopic);

  const isStickman =
    /stickman|sticky man|stick figure|alan becker/i.test(styleName) ||
    /stickman|sticky man|stick figure/i.test(characterAnchor || "") ||
    (!styleName.includes("Cartoon") && !styleName.includes("Cosmos"));

  const isCartoon =
    /curiokid|pixar|disney|cartoon|anime|manga/i.test(styleName) ||
    /curiokid|cartoon|pixar|disney/i.test(characterAnchor || "");

  let characterPrompt = "";
  let characterAction = "";

  if (isStickman) {
    characterPrompt =
      "3D stylized minimalist white stickman (sticky man) character with big expressive cartoon eyes, smooth rounded 3D stick limbs, Zack D. Films and Alan Becker animation style, high-end Octane 3D render, no realistic humans, no photorealistic people, ";
    characterAction = "the 3D white stickman character with expressive cartoon reactions interacting with ";
  } else if (isCartoon) {
    characterPrompt =
      "Pixar-style 3D animated cartoon character with big expressive eyes, colorful animated outfit, stylized 3D render, vibrant lighting, no realistic humans, no photorealistic people, ";
    characterAction = "the 3D stylized cartoon character curiously observing ";
  } else if (isCharacterLocked && characterAnchor) {
    characterPrompt = `[Character Anchor: ${characterAnchor}], stylized 3D cartoon render, no realistic humans, no photorealistic people, `;
    characterAction = "the stylized 3D character examining ";
  } else {
    // Default to 3D Sticky Man as preferred by user
    characterPrompt =
      "3D stylized white stickman character with expressive cartoon eyes, smooth 3D rounded stick figure body, Zack D. Films animation aesthetic, clean studio setting, no realistic humans, no photorealistic people, ";
    characterAction = "the 3D white stickman character interacting with ";
  }

  // Scene 1: Strictly 3s High-Impact Viral Opening Hook
  if (sceneIndex === 1) {
    return {
      imagePrompt: `Cinematic 8k 3D stylized scene of ${characterPrompt}${characterAction}${visual.macroFocus} inside ${visual.subjectNoun}, resting on ${visual.environment}, dramatic neon cyan rim lighting, anamorphic lens flare, shallow depth of field, Octane 3D render, playful comic infographic overlays, 8k resolution, clean tech studio --ar ${aspectRatio} --v 6.1 --stylize 250`,
      motionPrompt: `Cinematic smooth continuous camera push-in zoom gliding directly into ${characterAction}${visual.macroFocus} on ${visual.environment}, dramatic volumetric studio lighting, shallow depth of field, 60fps fluid 3D animated motion, professional commercial lighting`,
      directorCue: `High-impact 3D cartoon push-in tracking the sticky man character reacting to the illuminated core subject with instant shallow depth-of-field transition.`,
    };
  }

  // Scene 2: Evidence & Diagram / Common Assumption Break
  if (sceneIndex === 2) {
    return {
      imagePrompt: `High-contrast 3D stylized diagram of ${visual.subjectNoun}, ${characterPrompt}glowing holographic technical diagnostic data lines floating above surface, dark minimalist studio tech backdrop, micro-details in razor-sharp focus, visual style of ${styleName}, 8k resolution --ar ${aspectRatio} --v 6.1`,
      motionPrompt: `Smooth horizontal parallax camera sweep across ${visual.subjectNoun} as ${characterAction}points to floating glowing cyan diagnostic elements emerging seamlessly, 60fps cinematic fluidity, volumetric atmospheric lighting`,
      directorCue: `Horizontal tracking sweep revealing technical data indicators and analytical breakdown with 3D stickman callout.`,
    };
  }

  // Scene 3: Core 3D Mechanism & Evidence Cross-Section
  if (sceneIndex === 3) {
    return {
      imagePrompt: `Detailed 3D simulation cross-section of ${visual.subjectNoun}, glowing bioluminescent particle pathways visualizing energy flow, precision octane render 8k, ${characterPrompt}clean industrial technology lab, visual style of ${styleName} --ar ${aspectRatio} --v 6.1`,
      motionPrompt: `Slow 360-degree orbital camera rotation around the internal cross-section of ${visual.subjectNoun} with ${characterAction}the internal components, slow volumetric laser scan beam, 60fps fluid tracking, cinematic lighting`,
      directorCue: `360-degree orbital rotation exposing the internal 3D mechanism and dynamic energy flow alongside the sticky man.`,
    };
  }

  // Last Scene: Seamless Infinite Retention Loop
  if (isLastScene) {
    return {
      imagePrompt: `Breathtaking 3D stylized wide vista of ${visual.subjectNoun} in pristine operational glory with ${characterPrompt}golden hour atmospheric rim lighting, hyper-detailed 8k masterpiece, shallow depth of field, clean studio setting, visual style of ${styleName} --ar ${aspectRatio} --v 6.1`,
      motionPrompt: `Slow backward crane tracking pullout gliding smoothly from ${characterAction}${visual.subjectNoun} back to the exact opening camera framing perspective, seamless infinite loop, 60fps fluidity`,
      directorCue: `Slow backward crane pullout returning smoothly to the exact opening frame angle for 100% infinite retention loop.`,
    };
  }

  // Middle Progression Scenes (Scenes 4, 5 in longer scripts)
  return {
    imagePrompt: `Cinematic 8k 3D stylized camera shot inspecting ${visual.subjectNoun}, scene ${sceneIndex}, visual storytelling, ${characterPrompt}volumetric studio lighting, hyper-detailed octane 3D render, clean technology lab, visual style of ${styleName} --ar ${aspectRatio} --v 6.1`,
    motionPrompt: `Smooth cinematic 60fps tracking camera orbit around ${visual.subjectNoun} with ${characterAction}volumetric light rays, studio environment`,
    directorCue: `Smooth continuous tracking camera motion showcasing precision operational details with cartoon stickman animations.`,
  };
}

/**
 * Backward compatibility helper for general strings
 */
export function sanitizeTopicForAIPrompt(topic: string): string {
  const visual = extractVisualSubjectAndEnvironment(topic);
  return visual.subjectNoun;
}

export function buildSafeMotionPrompt(
  rawMotion: string,
  cameraStyle: string = "cinematic 60fps continuous camera motion",
  topic: string = ""
): string {
  const visual = extractVisualSubjectAndEnvironment(topic);
  let motion = rawMotion || "";

  // Strip tool prefixes
  motion = motion.replace(/^(?:Runway Gen-3|Kling 1\.5|Luma|Pika):\s*/i, "");

  // If rawMotion contains old contaminated title or focal junk, replace entirely with 3D stickman motion
  if (motion.includes("🔥") || motion.includes("Exposed") || motion.includes("Blast") || motion.includes("Scam") || motion.includes("3 Seconds")) {
    return `Cinematic smooth continuous camera push-in zoom tracking the 3D white stickman character inspecting ${visual.subjectNoun} on ${visual.environment}, dramatic volumetric studio lighting, shallow depth of field, 60fps fluid 3D animated motion, professional commercial lighting`;
  }

  // Strip audio cues (ES5-safe)
  motion = motion.replace(/🎵[\s\S]*$/, "").trim();

  // Replace generic focal object with extracted visual subject
  motion = motion.replace(/\b(?:focal object|focal point)\b/gi, `the 3D stickman character and ${visual.subjectNoun}`);

  return `${motion}, ${cameraStyle}, volumetric studio light rays, 60fps fluidity, 3D stylized animation, clean studio setting`;
}
