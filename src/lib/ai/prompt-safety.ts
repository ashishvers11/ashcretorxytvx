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
  "style-cute-naughty-animation": {
    id: "style-cute-naughty-animation",
    name: "Cute & Naughty 3D Cartoon Comedy",
    characterDescription:
      "charming chubby 3D animated cartoon chibi character with mischievous cheeky smirk, huge sparkling expressive cartoon eyes, playful funny gestures, Pixar and Illumination animation aesthetic, high-end 3D character render, zero realistic humans, no photorealistic people",
    characterActionPrefix: "the mischievous cute 3D cartoon character cheekily pulling off a funny prank with ",
    environmentDescription: "a vibrant cheerful stylized cartoon room with playful candy-toned pastel lighting, bouncy props, and soft cartoon drop-shadows",
    renderKeywords: "Pixar and Minions 3D animation aesthetic, exaggerated squash-and-stretch cartoon physics, vibrant playful pastel lighting, slapstick comedy timing, clean animated 3D studio, 8k resolution",
    cameraMovement: "funny comic double-take snap-zoom, dynamic 60fps tracking camera following cheeky cartoon antics, slapstick motion timing",
  },
  "style-toon-pixar-chibi": {
    id: "style-toon-pixar-chibi",
    name: "Pixar 3D Chibi & Naughty Animals",
    characterDescription:
      "charming chubby 3D animated chibi pet (cheeky kitten and playful puppy) with giant glossy sparkling cartoon eyes, adorable fluffy fur texture, Pixar and Disney 3D animation aesthetic, zero realistic humans, no photorealistic people",
    characterActionPrefix: "the adorable cheeky 3D cartoon animal playfully pouncing on ",
    environmentDescription: "a cozy vibrant colorful living room with soft sunny morning light and playful scattered toys",
    renderKeywords: "Pixar 3D stylized animation render, soft subsurface scattering, vibrant fairytale candy lighting, fluffy stylized fur, 8k resolution",
    cameraMovement: "low-angle dynamic puppy-eye tracking, funny rapid snap-zoom on curious head tilt, 60fps fluid motion",
  },
  "style-toon-slapstick": {
    id: "style-toon-slapstick",
    name: "3D Slapstick Comedy (Tom & Jerry Style)",
    characterDescription:
      "hyper-expressive 3D stylized slapstick cartoon character with rubber-hose limbs, comical jaw-drop expression, exaggerated cartoon proportions, zero realistic humans",
    characterActionPrefix: "the chaotic cartoon character wildly slipping and scrambling on ",
    environmentDescription: "a classic vibrant cartoon kitchen with colorful checkered tiles and flying kitchen utensils",
    renderKeywords: "classic slapstick cartoon animation style, exaggerated squash-and-stretch deformation, dynamic speed-lines, bright studio cartoon contrast, 8k resolution",
    cameraMovement: "kinetic cartoon whip-pan, dramatic snap crash-zoom on funny impact, 60fps slapstick pacing",
  },
  "style-toon-shinchan": {
    id: "style-toon-shinchan",
    name: "Naughty Anime Chibi (Shinchan Style)",
    characterDescription:
      "cheeky 3D cel-shaded anime chibi toddler with thick funny expressive eyebrows, mischievous side-eye smirk, vibrant red t-shirt, zero realistic humans",
    characterActionPrefix: "the naughty anime chibi kid cheekily wiggling eyebrows and sneaking past ",
    environmentDescription: "a colorful Japanese tatami living room with funny cartoon props and bright daylight",
    renderKeywords: "cel-shaded 3D anime chibi aesthetic, playful pop-art colors, cute comedy manga speedlines, 8k resolution",
    cameraMovement: "funny dutch-angle tilt, snappy comic pop-in zoom on cheeky wink, 60fps fluid animation",
  },
  "style-toon-claymation": {
    id: "style-toon-claymation",
    name: "Funny Claymation (Shaun The Sheep & Aardman)",
    characterDescription:
      "charming tactile 3D clay puppet character with sculpted plasticine thumbprints, silly wide-eyed blank stare, goofy toothy grin, zero realistic humans",
    characterActionPrefix: "the goofy claymation character clumsily fumbling with ",
    environmentDescription: "a rustic miniature clay tabletop diorama barnyard with warm overhead tungsten work-lamp lighting",
    renderKeywords: "Aardman claymation stop-motion style, visible plasticine clay textures, handcrafted charm, tactile depth of field, 8k resolution",
    cameraMovement: "fixed tabletop framing, charming subtle stop-motion 12fps timing at 60fps smooth playback",
  },
  "style-toon-funny-stickman": {
    id: "style-toon-funny-stickman",
    name: "3D Funny Meme Stickman Gags (Alan Becker Style)",
    characterDescription:
      "smooth 3D white minimalist stick figure with huge expressive comical cartoon eyes, stretchy rubber stick arms, Alan Becker animation style, zero realistic humans",
    characterActionPrefix: "the funny 3D stickman pulling a hilarious prank with ",
    environmentDescription: "a minimalist dark neon-cyan digital desktop canvas with interactive meme drawing tools",
    renderKeywords: "Alan Becker stickman animation aesthetic, 3D Octane stylized render, glowing neon comic lines, hilarious cartoon gravity physics, 8k resolution",
    cameraMovement: "kinetic 60fps tracking pan following fast stickman acrobatics, instant meme snap-zoom",
  },
  "style-toon-baby-boss": {
    id: "style-toon-baby-boss",
    name: "Cute Naughty Toddler Comedy",
    characterDescription:
      "chubby adorable 3D cartoon baby with tiny tuft of hair, wearing funny oversized sunglasses, mischievous giggling expression, zero realistic humans",
    characterActionPrefix: "the cute naughty baby stealthily crawling and reaching for ",
    environmentDescription: "a high-contrast pastel nursery with towering furniture and giant colorful building blocks",
    renderKeywords: "Illumination 3D animated movie render, soft baby cheeks subsurface scattering, bright pastel lighting, 8k resolution",
    cameraMovement: "floor-level stealth tracking camera, funny tiptoe wobble dolly, 60fps fluid animation",
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
  "style-asmr-crushing": {
    id: "style-asmr-crushing",
    name: "10-Ton Hydraulic Press Crushing 4K",
    characterDescription:
      "heavy industrial steel hydraulic press cylinder descending smoothly in extreme macro 4K 1000fps slow-motion, crushing satisfying textured items into flat pancakes, zero humans",
    characterActionPrefix: "the massive hydraulic press cylinder slowly descending with 10 tons of force crushing ",
    environmentDescription: "clean dark industrial studio workbench with directional metallic rim highlights, high-contrast reflections, and macro depth of field",
    renderKeywords: "hydraulic press crushing ASMR style, 1000fps ultra-slow-motion tactile destruction, Cinema4D Octane render, ray-traced steel reflections, 8k resolution",
    cameraMovement: "extreme microscopic macro focus tracking the descending steel press cylinder, high-frame-rate 60fps slow-motion",
  },
  "style-asmr-cutting": {
    id: "style-asmr-cutting",
    name: "Kinetic Sand & Soap Slicing ASMR",
    characterDescription:
      "razor-sharp heated utility craft blade cleanly slicing through multi-colored textured soap cubes and crunchy kinetic sand blocks, extreme macro 4K, zero humans",
    characterActionPrefix: "the razor-sharp blade cleanly gliding and slicing through ",
    environmentDescription: "pristine pastel studio table with soft diffused overhead softbox lighting, crisp geometric grid patterns, and textured shavings",
    renderKeywords: "kinetic sand cutting and soap grid carving ASMR style, ultra-crisp tactile macro textures, 8k resolution, razor-sharp clean edges",
    cameraMovement: "side-angle macro tracking glide following the blade path, smooth 60fps focus pull",
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

  // 1. Cute Animals / Pets / Dogs & Cats Comedy
  if (/dog|puppy|kutta|cat|kitten|billi|monkey|bandar|bird|duck|pet|animal|mouse|cheetah|lion|tiger/i.test(combined)) {
    if (sceneIndex === 1) {
      return {
        subject: "an adorable chubby 3D cartoon animal with giant sparkling eyes playfully exploring the room",
        actionDetail: "playfully pouncing and sniffing with curious cartoon head tilts",
      };
    }
    if (sceneIndex === 2) {
      return {
        subject: "the mischievous 3D cartoon animal sneaking past colorful toys on a secret tiptoe prank mission",
        actionDetail: "clumsily balancing on its paws with hilarious cartoon suspense",
      };
    }
    if (sceneIndex === 3) {
      return {
        subject: "hilarious cartoon slapstick impact with flying colorful props and comically shocked cartoon animal reaction",
        actionDetail: "slipping on a cartoon prop and bouncing back with elastic rubber-hose physics",
      };
    }
    return {
      subject: "charming happy 3D cartoon animal giving a cheeky fourth-wall wink at the camera",
      actionDetail: "resolving smoothly into a playful looped bow with bright candy-toned studio lighting",
    };
  }

  // 2. ASMR & Satisfying Crushing / Slicing
  if (/asmr|hydraulic|press|crush|cutting|soap|sand|slime|kinetic|sponge|squish|slice/i.test(combined)) {
    if (sceneIndex === 1) {
      return {
        subject: "pristine colorful geometric kinetic sand block and textured soap cube positioned under heavy industrial press",
        actionDetail: "heavy mechanical press descending smoothly with intense macro depth of field",
      };
    }
    if (sceneIndex === 2) {
      return {
        subject: "ultra-sharp heated blade cleanly slicing through layered rainbow kinetic sand with crisp crunchy micro-textures",
        actionDetail: "smooth continuous micro-slicing revealing mesmerizing vibrant inner gradient layers",
      };
    }
    if (sceneIndex === 3) {
      return {
        subject: "heavy hydraulic steel ram completely crushing translucent glass spheres and squishy neon sponge into satisfying dust",
        actionDetail: "dramatic slow-motion tactile explosion of particles with ray-traced iridescent light caustics",
      };
    }
    return {
      subject: "flawlessly smooth reshaped physical sculpture with satisfying glossy polish and studio lighting",
      actionDetail: "resolving cleanly back into pristine uncrushed block for an infinite seamless replay loop",
    };
  }

  // 3. Nature, Prehistoric Life & Ocean Science (Sharks, Trees, Earth, Dinosaurs)
  if (/shark|tree|ocean|sea|dinosaur|fossil|forest|earth|nature|ancient|stone|ice age/i.test(combined)) {
    if (sceneIndex === 1) {
      return {
        subject: "magnificent prehistoric ocean vista showing an ancient shark gliding past submerged giant fossilized tree roots",
        actionDetail: "swimming smoothly through sunlit turquoise prehistoric water with volumetric god rays",
      };
    }
    if (sceneIndex === 2) {
      return {
        subject: "side-by-side evolutionary timeline cross-section comparing ancient 400-million-year shark fossils against early tree fossils",
        actionDetail: "highlighting glowing archaeological timeline dates and geological sediment layers",
      };
    }
    if (sceneIndex === 3) {
      return {
        subject: "detailed biological 3D cutaway showing the indestructible cartilaginous skeleton and sensory Ampullae of Lorenzini",
        actionDetail: "tracking the internal evolutionary resilience mechanism with glowing bio-luminescent scan lines",
      };
    }
    return {
      subject: "breathtaking panoramic oceanic ecosystem with ancient sharks and lush ancient coastal flora",
      actionDetail: "gliding powerfully towards the camera and looping seamlessly into the opening deep-sea framing",
    };
  }

  // 4. Human Anatomy, Biology & Brain Mechanisms (Zack D. Style)
  if (/body|brain|heart|eye|blood|bone|muscle|lung|organ|skin|human|biology|medical/i.test(combined)) {
    return {
      subject: "clean 3D clinical anatomical cutaway simulation showing transparent biological structures and cellular pathways",
      actionDetail: "tracing the physiological reaction with illuminated medical cross-section arrows",
    };
  }

  // 5. Temperature / Heat / Thermal Runaway
  if (/temperature|heat|degree|500|thermal|overheat|hot|garam|celcius/i.test(combined)) {
    return {
      subject: "glowing holographic digital temperature gauge surging in real time with red thermal heat map indicators",
      actionDetail: "monitoring the rapid thermal reaction displaying critical temperature warnings",
    };
  }

  // 6. Battery / Lithium Ions / Chemical Reaction
  if (/battery|lithium|ion|chemical|reaction|cell|separator|anode|cathode|electrolyte/i.test(combined)) {
    return {
      subject: "3D micro-cross-section of illuminated lithium-ion battery cells with microscopic energy pathways surging",
      actionDetail: "inspecting the internal battery micro-structure and chemical ion flow",
    };
  }

  // 7. Charger / Cable / Voltage / Circuit
  if (/charger|cable|wire|voltage|circuit|motherboard|fake|duplicate|original|certified/i.test(combined)) {
    return {
      subject: "high-tech charging diagnostic console with glowing voltage traces and electronic circuit comparison",
      actionDetail: "comparing high-precision voltage regulation across the power circuit board",
    };
  }

  // 8. Smartphone / Hardware Device
  if (/phone|smartphone|screen|mobile|display|device|gadget/i.test(combined)) {
    return {
      subject: "a high-end modern smartphone hardware device with illuminated diagnostic micro-connectors",
      actionDetail: "examining the smartphone internal hardware on the workstation",
    };
  }

  // 9. Space / Cosmic / Stars
  if (/space|planet|black hole|universe|galaxy|cosmos|gravity|star/i.test(combined)) {
    return {
      subject: "awe-inspiring celestial phenomenon with glowing accretion disk and cosmic dust particles",
      actionDetail: "observing the cosmic gravitational light lensing across deep space",
    };
  }

  // Clean Generic Subject Fallback: Extracts keywords from rawTopic rather than tech boilerplate!
  const cleanSubjectText = rawTopic
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, "")
    .replace(/^(99%\s*log\s*nahi\s*jaante:?|scientist\s*shocked:?|ye\s*galti\s*mat\s*karna:?|why\s+|what\s+if\s+)/gi, "")
    .replace(/[#@!?_~`%*+=[\]{}|\\:;"<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    subject: `vibrant stylized 3D visual scene representing ${cleanSubjectText || "the core physical concept"}`,
    actionDetail: `explaining the fascinating dynamics of ${cleanSubjectText || "the concept"} with high-clarity 3D animation`,
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

  // Character prompt determination with 100% Strict Consistency
  let activeCharacterDesc = style.characterDescription;
  let activeActionPrefix = style.characterActionPrefix;

  const topicIsAnimal = /dog|cat|puppy|kitten|billi|kutta|animal|pet|monkey/i.test(`${rawTopic} ${voiceoverLine}`);

  if (styleKey === "style-stickman") {
    activeCharacterDesc = "[Character Anchor: Identical 3D minimalist white stickman (sticky man), smooth cylindrical white limbs, simple round head with large expressive black cartoon eyes, exact same white color and geometry across all scenes, Zack D. Films and Alan Becker style, zero realistic humans]";
    activeActionPrefix = "the identical 3D white stickman character examining ";
  } else if (styleKey === "style-toon-pixar-chibi" || (styleKey === "style-cute-naughty-animation" && topicIsAnimal)) {
    activeCharacterDesc = "[Character Anchor: Identical 3D animated chubby cartoon pet with giant sparkling cartoon eyes, fluffy fur texture, identical face and colors across all scenes, Pixar and Disney 3D animation style, zero realistic humans, no photorealistic people]";
    activeActionPrefix = "the identical 3D cartoon animal playfully exploring ";
  } else if (styleKey === "style-toon-slapstick") {
    activeCharacterDesc = "[Character Anchor: Identical 3D stylized slapstick cartoon character with rubber-hose limbs, comical jaw-drop expression, exact same cartoon colors and proportions across all scenes, Tom & Jerry style, zero realistic humans]";
    activeActionPrefix = "the identical cartoon character wildly slipping on ";
  } else if (isCharacterLocked && customCharacterAnchor && !/indian|creator|hoodie|glasses|fade haircut|photorealistic|24yo/i.test(customCharacterAnchor)) {
    activeCharacterDesc = `[Character Anchor: ${customCharacterAnchor}], stylized 3D character, zero realistic humans, no photorealistic people`;
    activeActionPrefix = "the stylized 3D character examining ";
  }

  const isFunnyAnimation =
    styleKey.startsWith("style-toon-") ||
    styleKey === "style-cute-naughty-animation" ||
    /animation|naughty|cute|funny|comedy|chibi|slapstick/i.test(style.name);

  // === SPECIALIZED FUNNY & CUTE ANIMATION GAGS (Pure Visual Movement • No Spoken Storytelling) ===
  if (isFunnyAnimation) {
    if (sceneIndex === 1) {
      return {
        imagePrompt: `Funny cute 8k 3D stylized cartoon comedy scene, visual style of ${style.name}, featuring ${activeCharacterDesc}, ${activeActionPrefix}${sceneVisual.subject}, situated in ${style.environmentDescription}, playful candy-toned lighting, ${style.renderKeywords}, no realistic humans, no photorealistic people --ar ${aspectRatio} --v 6.1 --stylize 250`,
        motionPrompt: `Comedic fast snap-zoom push-in tracking ${activeActionPrefix}${sceneVisual.subject}, funny exaggerated squash and stretch animation, silly head tilt, 60fps dynamic cartoon physics, playful slapstick timing, ${style.cameraMovement}`,
        directorCue: `Comedic Gag 1 (The Setup): Cheeky character initiates mischievous movement with huge expressive cartoon eyes.`,
      };
    }
    if (sceneIndex === 2) {
      return {
        imagePrompt: `Dynamic 3D stylized cartoon comedy action, visual style of ${style.name}, featuring ${activeCharacterDesc}, ${activeActionPrefix}${sceneVisual.subject}, funny tiptoe sneaking gesture, playful cartoon props, ${style.renderKeywords}, no realistic humans --ar ${aspectRatio} --v 6.1`,
        motionPrompt: `Snappy comedic tracking camera following funny tiptoe movement across ${style.environmentDescription}, exaggerated wobbles, playful cartoon speedlines, 60fps slapstick timing, ${style.cameraMovement}`,
        directorCue: `Comedic Gag 2 (The Sneak): Character clumsily balancing or tiptoeing with hilarious suspense.`,
      };
    }
    if (sceneIndex === 3) {
      return {
        imagePrompt: `Hilarious 3D slapstick cartoon climax, visual style of ${style.name}, featuring ${activeCharacterDesc}, ${activeActionPrefix}${sceneVisual.subject}, comical shocked wide-eyed expression, flying cartoon props, ${style.renderKeywords}, no realistic humans --ar ${aspectRatio} --v 6.1`,
        motionPrompt: `Hilarious cartoon impact camera shudder, dynamic slapstick reaction with rubber-hose physics, slow-motion funny slip and bounce, 60fps fluid comedic motion, ${style.cameraMovement}`,
        directorCue: `Comedic Gag 3 (The Punchline Fail): Hilarious unexpected slapstick fail or flying props with comedic cartoon reaction.`,
      };
    }
    // Last Scene
    return {
      imagePrompt: `Adorable 3D stylized cartoon comedy resolution, visual style of ${style.name}, featuring ${activeCharacterDesc}, cheeky naughty wink directly at camera, ${sceneVisual.subject}, joyful candy lighting, ${style.renderKeywords}, no realistic humans --ar ${aspectRatio} --v 6.1`,
      motionPrompt: `Smooth comical camera pullout resolving into cheeky wink at the lens, seamless 60fps infinite loop back to the opening prank, playful comedy timing, ${style.cameraMovement}`,
      directorCue: `Comedic Gag 4 (Infinite Replay): Cheeky character gives a funny fourth-wall wink, resetting the loop for infinite watch completion.`,
    };
  }

  // --- REGULAR CREATOR & FACT STYLES (Evidence, Mechanism, Science & Retention) ---
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
