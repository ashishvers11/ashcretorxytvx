import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  channelTitle?: string;
  channelNiche?: string;
  visualStyle?: string;
  targetAudience?: string;
  history?: ChatMessage[];
}

export async function POST(request: Request) {
  try {
    const body: ChatRequestBody = await request.json();
    const {
      message = "",
      channelTitle = "Your Channel",
      channelNiche = "General Education & Facts",
      visualStyle = "Signature Aesthetic",
      targetAudience = "Curious Viewers",
      history = [],
    } = body;

    const trimmed = message.trim();
    if (!trimmed) {
      return NextResponse.json({ success: false, error: "Empty message" }, { status: 400 });
    }

    // 1. If GEMINI_API_KEY is configured in production environment, use live LLM
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const systemInstruction = `You are ASH Creator Studio's elite YouTube Content Strategist and Growth Copilot.
You are advising the creator of YouTube channel "${channelTitle}".
Channel Niche: ${channelNiche}
Visual Style: ${visualStyle}
Target Audience: ${targetAudience}

Guidelines:
1. Always give specific, high-retention, actionable YouTube advice tailored specifically to their niche and visual style.
2. Structure responses cleanly with markdown headings, bullet points, and high-impact phrasing.
3. Be encouraging, highly strategic, and analytical. Focus on CTR, audience retention curves, and algorithmic pacing.
4. Answer in the same language or tone (Hindi, Hinglish, or English) the user asked in.`;

        const contents = [
          ...history.slice(-6).map((h) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content }],
          })),
          {
            role: "user",
            parts: [{ text: trimmed }],
          },
        ];

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return NextResponse.json({ success: true, reply: candidateText, source: "gemini_live" });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini API call failed, falling back to Channel Intelligence Strategist:", geminiErr);
      }
    }

    // 2. Intelligent Channel-Aware Copilot Engine (Zero external dependencies required)
    const lower = trimmed.toLowerCase();
    let reply = "";

    if (lower.includes("30-day") || lower.includes("growth plan") || lower.includes("sprint") || lower.includes("plan")) {
      reply = `### 🚀 30-Day Growth Sprint for **${channelTitle}** (${channelNiche})

1. **Week 1 (Packaging & Identity Calibrations):**
   - Lock in your signature **${visualStyle}** style across all thumbnails so viewers instantly recognize your videos in recommendations.
   - Refine your channel bio with 3 primary search queries related to **${channelNiche}**.
   - Audit your top 3 videos and create a "Must Watch" featured playlist.

2. **Week 2 (Shorts-to-Longform Audience Funnel):**
   - Publish 2 high-energy 50-60s Shorts focusing on an irresistible curiosity hook.
   - In the pinned comment, link directly to your deep-dive breakdown with a compelling reason to click (*"For the full visual investigation, watch here"*).

3. **Week 3 (Micro-Payoff Script Architecture):**
   - Use the **ASH Script Studio** to ensure every video delivers its first fact within **0:08**, eliminating slow animated intro fluff.
   - Structure your script: *Hook (0-8s) -> Primary Misconception (8-25s) -> Deep Reveal (25-45s) -> Strategic Payoff (45-55s)*.

4. **Week 4 (Binge-Session Retargeting):**
   - Never say verbal goodbye phrases (*"Thanks for watching"*) that trigger audience drop-offs.
   - Instead, bridge directly into your next video: *"But that raises an even bigger question..."* and trigger End Screen cards!`;

    } else if (lower.includes("title") || lower.includes("idea") || lower.includes("topic") || lower.includes("concept")) {
      reply = `### 🎯 5 High-CTR Concepts Crafted for **${channelTitle}** (${visualStyle}):

1. **The Primary Misconception Hook:**
   - *"What 99% of People Get Wrong About [Core Subject]"*
   - **Strategy:** Challenges conventional belief within your niche, triggering high debate and initial clicks.

2. **The High-Stakes 'What If' Question:**
   - *"What Actually Happens If [Critical Event Occurs]?"*
   - **Strategy:** Piques intense curiosity through dynamic simulation and cause-and-effect storytelling.

3. **The Hidden Truth / Lost Artifact:**
   - *"The Secret History Behind [Familiar Daily Object or Place]"*
   - **Strategy:** Connects everyday objects to mind-blowing origins, perfect for **${visualStyle}** presentation.

4. **The Counter-Intuitive Reality:**
   - *"Why You Should Never [Common Habit] (Scientific Breakdown)"*
   - **Strategy:** High utility and loss-aversion psychology drives viral sharing on WhatsApp and social feeds.

5. **The Unsolved Mystery:**
   - *"The 100-Year Mystery That Experts Still Can't Explain"*
   - **Strategy:** Generates high watch time by withholding the ultimate scientific resolution until the final beat.`;

    } else if (lower.includes("drop") || lower.includes("retention") || lower.includes("30 second") || lower.includes("hook")) {
      reply = `### ⏱️ How to Eliminate Audience Drop-Off for **${channelTitle}**:

- **Cut the First 5 Seconds of Fluff:** Never introduce your channel name, logo sting, or greeting (*"Namaste dosto"*). Start speaking directly on the question promised in the thumbnail.
- **Visual Scene Cuts Every 3.5 Seconds:** In the **${visualStyle}** format, change the camera angle, add a subtle sound whoosh, or animate on-screen text to reset viewer attention.
- **The Information Gap Principle:** State a surprising fact in Beat 1, but explicitly withhold *how* or *why* it works until Beat 3. The human brain resists leaving unanswered questions.
- **Remove Verbal Exit Cues:** At the end of the video, cut straight from the final takeaway to the End Screen recommendation without slowing down your vocal cadence.`;

    } else if (lower.includes("ctr") || lower.includes("thumbnail") || lower.includes("click")) {
      reply = `### 🖼️ Thumbnail & CTR Masterclass for **${channelTitle}**:

1. **The 3-Element Rule:** A winning thumbnail contains only **3 visual focal points**:
   - 1 high-contrast subject (e.g., your primary visual asset or character anchor).
   - 1 emotion-provoking element (e.g., a bold arrow, magnifying glass, or glowing boundary).
   - Maximum **3 to 4 bold words** (never repeat your title verbatim).

2. **Mobile Readability Check (70%+ Viewers):**
   - Shrink your thumbnail to the size of a postage stamp. If the text or primary subject isn't readable in 1 second, simplify it!
   - Use our **Thumbnail Studio & Feed Simulator** to test contrast against YouTube's dark and light feeds.

3. **Color Contrast Against YouTube UI:**
   - YouTube's background is either pitch black (#0f0f0f) or bright white (#ffffff). Use warm golden amber, emerald cyan, or vibrant magenta outlines to pop off the feed.`;

    } else {
      reply = `Great strategic question for **${channelTitle}**! 

To maximize growth in the **${channelNiche}** space with your **${visualStyle}** presentation:

1. **Algorithmic Velocity:** YouTube prioritizes **Audience Satisfaction (AVD > 60%)** and **Initial Click Velocity (CTR > 7%)**. Focus your effort on the packaging and the first 30 seconds.
2. **Visual Consistency:** Because you use **${visualStyle}**, keep your lighting, color palette, and character anchors consistent so returning viewers instantly click when your video appears on their Home feed.
3. **Workflow Acceleration:** Use our **Script Studio** to generate your scene-by-scene production prompts and **Trend Research** to tap into live high-volume topics!

What specific aspect of your next video would you like to brainstorm or optimize right now?`;
    }

    return NextResponse.json({
      success: true,
      reply,
      source: "copilot_intelligence_engine",
    });
  } catch (err: any) {
    console.error("AI Assistant error:", err);
    return NextResponse.json({
      success: true,
      reply: "I am ready to assist your channel. Please ask any question regarding scriptwriting, packaging, or growth strategy!",
      source: "fallback",
    });
  }
}
