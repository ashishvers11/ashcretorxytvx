/**
 * AI Prompt Safety & Policy Guardrails
 * ASH Creator Studio
 *
 * Ensures all generated Image and Video prompts comply 100% with:
 * - Google Flow (Veo / VideoFX / Imagen 3) strict safety policies
 * - Runway Gen-3 / Kling 1.5 / Luma Dream Machine moderation
 * - Midjourney v6.1 / FLUX.1 content filters
 *
 * Prevents false-positive flags like "violates policies about sexual content"
 * caused by bare-chested 3D humanoid mannequins or trigger words like "EXPOSED".
 */

export function sanitizeTopicForAIPrompt(topic: string): string {
  if (!topic) return "technology and hardware innovation";
  let s = topic.trim();

  // 1. Strip surrogate pairs and emoji ranges compatible with ES5
  s = s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, " ");

  // 2. Strip clickbait time/countdown prefixes like "3 Seconds Mein" or "Shocking:"
  s = s.replace(/^\d+\s*(?:Seconds?|Sec|Mins?|Minutes?)\s*(?:Mein|Me|In)?\s*/i, "");
  s = s.replace(/^(?:The Untold Truth Behind:\s*|Shocking:\s*|Why\s+|What If\s+|The Real Truth About\s+)/i, "");

  // 3. Replace safety filter false-positive triggers
  // "EXPOSED" is the #1 trigger for Google Flow's "sexual content / indecent exposure" filter!
  s = s.replace(/\b(?:exposed|exposing|exposure)\b/gi, "revealed");
  s = s.replace(/\b(?:blast|blasting|explode|explosion)\b/gi, "thermal reaction");
  s = s.replace(/\b(?:scam|scams|fraud)\b/gi, "case study");
  s = s.replace(/\b(?:kill|killing|murder|death|dead)\b/gi, "critical failure");
  s = s.replace(/\b(?:naked|bare|nude|shirtless|torso|skin)\b/gi, "fully clothed");

  // 4. Strip bracketed noise, trailing marks, and special chars
  s = s.replace(/\s*[\(\[][^\)\]]*[\)\]]/g, " ").trim();
  s = s.replace(/[?!.*#_~`"']+/g, " ").trim();
  s = s.replace(/\s+/g, " ");

  return s || "modern technology analysis";
}

export interface SafePromptOptions {
  topic: string;
  sceneIndex?: number;
  visualDirection?: string;
  styleName?: string;
  aspectRatio?: string;
  characterAnchor?: string;
  isCharacterLocked?: boolean;
}

/**
 * Builds 100% Policy-Safe Image Prompt for Midjourney v6.1 / FLUX 8K / Google Imagen 3
 * Always enforces modest, fully-clothed subjects or clean gadget focus to eliminate false NSFW flags.
 */
export function buildSafeImagePrompt({
  topic,
  sceneIndex = 1,
  visualDirection,
  styleName = "Cinematic 3D",
  aspectRatio = "9:16",
  characterAnchor,
  isCharacterLocked = true,
}: SafePromptOptions): string {
  const cleanSubject = sanitizeTopicForAIPrompt(topic);
  const anchor =
    isCharacterLocked && characterAnchor
      ? `[Character Anchor: ${characterAnchor}, fully clothed in modern dark tech hoodie, professional attire, no bare skin], `
      : "fully clothed tech presenter wearing dark hoodie, professional laboratory setting, no nudity, ";

  const contextDirection = visualDirection
    ? sanitizeTopicForAIPrompt(visualDirection)
    : `photorealistic laboratory inspection of ${cleanSubject}`;

  return `Cinematic 8k photorealistic scene of ${cleanSubject}, ${contextDirection}, ${anchor}visual style of ${styleName}, dramatic neon rim lighting, octane 3D render, hyper-detailed, clean tech environment --ar ${aspectRatio} --v 6.1 --stylize 250`;
}

/**
 * Builds 100% Policy-Safe Video Motion Prompt for Google Flow (Veo), Runway Gen-3, and Kling 1.5.
 * Strictly visual camera and object dynamics, free from audio cues or policy-sensitive words.
 */
export function buildSafeMotionPrompt(
  rawMotion: string,
  cameraStyle = "cinematic 60fps continuous camera motion",
  cleanTopic = "device"
): string {
  let motion = rawMotion || "";

  // Strip tool prefixes (e.g., "Runway Gen-3: ", "Kling 1.5: ")
  motion = motion.replace(/^(?:Runway Gen-3|Kling 1\.5|Luma|Pika):\s*/i, "");

  // Sanitize trigger words
  motion = motion.replace(/\b(?:blast|exploding|explosion)\b/gi, "rapid glow reaction");
  motion = motion.replace(/\b(?:exposed|exposing)\b/gi, "revealed");
  motion = motion.replace(/\b(?:focal object)\b/gi, `focal ${cleanTopic || "technology device"}`);

  // Strip audio or music cues if accidentally attached (ES5 compatible without /s flag)
  motion = motion.replace(/🎵[\s\S]*$/, "").trim();

  return `${motion}, ${cameraStyle}, volumetric studio light rays, 60fps fluidity, cinematic composition, laboratory setting`;
}
