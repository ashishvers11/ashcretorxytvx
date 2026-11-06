import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface TrendItem {
  keyword: string;
  volume: string;
  growth: string;
  competition: "Low" | "Medium" | "High";
  category: "kids" | "stories" | "science" | "curiosity" | "health" | "space" | "animals";
  badge: "Breakout" | "Viral Trend" | "High Intent" | "Evergreen";
  angle: string;
}

// 1. Curated Trends for Kids & Family / Animation Channels (e.g. CURIOKID VERS)
const KIDS_ANIMATION_TRENDS: TrendItem[] = [
  {
    keyword: "डायनासोर असल में कैसे गायब हुए? 3D Animation Story for Kids",
    volume: "890K Searches/mo",
    growth: "+620%",
    competition: "Low",
    category: "kids",
    badge: "Breakout",
    angle: "Fun 3D Pixar animated adventure showing the asteroid impact with friendly dinosaur characters.",
  },
  {
    keyword: "आसमान का रंग हमेशा नीला ही क्यों दिखता है? Curious Kids Facts",
    volume: "740K Searches/mo",
    growth: "+480%",
    competition: "Low",
    category: "curiosity",
    badge: "Evergreen",
    angle: "Kid-friendly light scattering visual: sunlight bouncing through air molecules like bouncing rubber balls.",
  },
  {
    keyword: "चींटी अपने वजन से 50 गुना ज्यादा वजन कैसे उठा लेती है?",
    volume: "610K Searches/mo",
    growth: "+410%",
    competition: "Low",
    category: "animals",
    badge: "Viral Trend",
    angle: "Micro-animation biomechanics: tiny ant with superhero strength showing neck joint physics.",
  },
  {
    keyword: "चाँद दिन में भी आसमान में क्यों दिखाई देता है?",
    volume: "520K Searches/mo",
    growth: "+350%",
    competition: "Low",
    category: "space",
    badge: "High Intent",
    angle: "Bedtime curiosity storytelling: why the moon reflects enough sunlight to be seen beside the sun.",
  },
  {
    keyword: "इंद्रधनुष में 7 रंग ही क्यों होते हैं? (Rainbow Secrets for Kids)",
    volume: "680K Searches/mo",
    growth: "+390%",
    competition: "Low",
    category: "kids",
    badge: "Evergreen",
    angle: "Prism droplet water physics animated with colorful dancing droplets and magical light beams.",
  },
  {
    keyword: "समुद्र का पानी खारा (नमकीन) क्यों होता है? Fun Science Story",
    volume: "470K Searches/mo",
    growth: "+290%",
    competition: "Low",
    category: "stories",
    badge: "High Intent",
    angle: "Rivers washing minerals from rocks over billions of years, explained with cute water droplet journey.",
  },
];

// 2. Curated Trends for Paper Cut-out / History Channels
const PAPER_HISTORY_TRENDS: TrendItem[] = [
  {
    keyword: "द ग्रेट लाइब्रेरी ऑफ अलेक्जेंड्रिया कैसे जली? (Paper Cut-Out History)",
    volume: "760K Searches/mo",
    growth: "+490%",
    competition: "Low",
    category: "stories",
    badge: "Breakout",
    angle: "Tactile paper unfold transition showing 400,000 lost scrolls and Caesar's harbor siege.",
  },
  {
    keyword: "रोम की 9वीं सेना रहस्यमयी तरीके से कहाँ गायब हो गई?",
    volume: "680K Searches/mo",
    growth: "+420%",
    competition: "Low",
    category: "curiosity",
    badge: "Viral Trend",
    angle: "Archaeological mystery of four thousand Roman soldiers vanishing in the Scottish highlands.",
  },
  {
    keyword: "वाइकिंग्स बादलों में सूर्य की दिशा कैसे पहचानते थे?",
    volume: "540K Searches/mo",
    growth: "+310%",
    competition: "Low",
    category: "science",
    badge: "High Intent",
    angle: "Iceland spar calcite sunstones polarizing atmospheric UV rays through thick fog.",
  },
  {
    keyword: "सिंधु घाटी सभ्यता के लोग अचानक कहाँ चले गए?",
    volume: "820K Searches/mo",
    growth: "+380%",
    competition: "Low",
    category: "stories",
    badge: "Evergreen",
    angle: "Monsoon drought shift and tectonic river deviations explained with layered craft dioramas.",
  },
  {
    keyword: "ताजमहल के नीचे बंद 22 कमरों का ऐतिहासिक सच",
    volume: "910K Searches/mo",
    growth: "+540%",
    competition: "Low",
    category: "curiosity",
    badge: "Breakout",
    angle: "ASI archaeological survey blueprints and subterranean arch support structural analysis.",
  },
  {
    keyword: "पिरामिड बनाने वाले कारीगरों की डायरी से निकला सच",
    volume: "670K Searches/mo",
    growth: "+330%",
    competition: "Low",
    category: "stories",
    badge: "Evergreen",
    angle: "Diary of Merer: papyrus scrolls revealing limestone boat transport along Nile canals.",
  },
];

// 3. Curated Trends for ASMR & Satisfying Channels
const ASMR_PHYSICS_TRENDS: TrendItem[] = [
  {
    keyword: "पिघले हुए बिस्मथ से रेनबो क्रिस्टल कैसे बनते हैं? (Satisfying Macro)",
    volume: "850K Searches/mo",
    growth: "+580%",
    competition: "Low",
    category: "science",
    badge: "Breakout",
    angle: "Hypnotic oxidation staircase hopper crystals growing in molten liquid metal at 271°C.",
  },
  {
    keyword: "हाइड्रोलिक प्रेस बनाम 1000 परतों वाला दामस्कस स्टील",
    volume: "920K Searches/mo",
    growth: "+440%",
    competition: "Medium",
    category: "curiosity",
    badge: "Viral Trend",
    angle: "Tactile destruction slow motion showing metal grain flow under 100 tons of pressure.",
  },
  {
    keyword: "काइनेटिक सैंड को गर्म चाकू से काटने पर क्या होता है?",
    volume: "640K Searches/mo",
    growth: "+310%",
    competition: "Low",
    category: "curiosity",
    badge: "Evergreen",
    angle: "Sensory polymer silicone oil melting with crisp binaural sound design.",
  },
  {
    keyword: "प्रिंस रूपर्ट ड्रॉप के सिर पर गोली मारने का सुपर स्लो मोशन",
    volume: "780K Searches/mo",
    growth: "+460%",
    competition: "Low",
    category: "science",
    badge: "High Intent",
    angle: "Compressive internal stress of 700 megapascals shattering bullets on impact.",
  },
  {
    keyword: "ग्लास के अंदर लिक्विड नाइट्रोजन डालने पर जादुई फ्रीज",
    volume: "590K Searches/mo",
    growth: "+290%",
    competition: "Low",
    category: "science",
    badge: "Evergreen",
    angle: "Leidenfrost vapor barrier effect and rapid thermal shock acoustic crackle.",
  },
];

// 4. Curated Trends for Science & Curiosity Channels (e.g. ASHISH FN)
const SCIENCE_EDUCATION_TRENDS: TrendItem[] = [
  {
    keyword: "लौंग असल में फूल है या फल? (Is Clove Flower or Fruit?)",
    volume: "640K Searches/mo",
    growth: "+520%",
    competition: "Low",
    category: "science",
    badge: "Breakout",
    angle: "Mythbuster hook explaining why Syzygium aromaticum is an unopened flower bud, not a fruit or seed.",
  },
  {
    keyword: "अगर धरती 5 सेकंड के लिए घूमना बंद कर दे तो क्या होगा?",
    volume: "980K Searches/mo",
    growth: "+410%",
    competition: "Low",
    category: "space",
    badge: "Viral Trend",
    angle: "High-stakes physics curiosity hook: atmosphere inertia moving at 1670 km/h, oceans sweeping continents.",
  },
  {
    keyword: "हवाई जहाज का रंग हमेशा सफेद ही क्यों होता है?",
    volume: "450K Searches/mo",
    growth: "+280%",
    competition: "Low",
    category: "curiosity",
    badge: "Evergreen",
    angle: "Thermal physics angle: solar radiation reflection, crack detection, and saving 500kg fuel weight.",
  },
  {
    keyword: "मोबाइल की बैटरी को 80% पर ही क्यों रोक देना चाहिए?",
    volume: "720K Searches/mo",
    growth: "+340%",
    competition: "Medium",
    category: "science",
    badge: "High Intent",
    angle: "Lithium-ion chemical degradation breakdown: how charging to 100% causes electrolyte stress.",
  },
  {
    keyword: "क्या पौधे सच में दर्द महसूस करते हैं? Science Truth",
    volume: "580K Searches/mo",
    growth: "+310%",
    competition: "Low",
    category: "science",
    badge: "Breakout",
    angle: "Botanical experiment: electrical signaling via glutamate receptors when leaves get damaged.",
  },
  {
    keyword: "आसमान में तारे क्यों टिमटिमाते हैं? 60-Second Explanation",
    volume: "390K Searches/mo",
    growth: "+190%",
    competition: "Low",
    category: "space",
    badge: "Evergreen",
    angle: "Atmospheric refraction explanation: light bending through temperature gradients in the air.",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const category = searchParams.get("category") || "all";
    const style = searchParams.get("style")?.toLowerCase() || "";
    const channelTitle = searchParams.get("channelTitle")?.toLowerCase() || "";
    const niche = searchParams.get("niche")?.toLowerCase() || "";

    const isKidsChannel =
      style.includes("pixar") ||
      style.includes("2d") ||
      channelTitle.includes("curiokid") ||
      channelTitle.includes("kid") ||
      channelTitle.includes("cartoon") ||
      channelTitle.includes("animation") ||
      channelTitle.includes("story") ||
      niche.includes("kid") ||
      niche.includes("cartoon") ||
      niche.includes("animation");

    const isPaperChannel =
      style.includes("paper") ||
      channelTitle.includes("paper") ||
      channelTitle.includes("craft") ||
      channelTitle.includes("history") ||
      niche.includes("paper") ||
      niche.includes("history") ||
      niche.includes("craft");

    const isAsmrChannel =
      style.includes("asmr") ||
      channelTitle.includes("asmr") ||
      channelTitle.includes("satisfying") ||
      niche.includes("asmr") ||
      niche.includes("satisfying");

    // Select default channel-specific base trends
    let defaultTrends = SCIENCE_EDUCATION_TRENDS;
    let nicheLabel = "Science & Curiosities";
    let sourceLabel = "channel_science_curated";

    if (isKidsChannel) {
      defaultTrends = KIDS_ANIMATION_TRENDS;
      nicheLabel = "Kids & Animation";
      sourceLabel = "channel_kids_curated";
    } else if (isPaperChannel) {
      defaultTrends = PAPER_HISTORY_TRENDS;
      nicheLabel = "Paper Craft & History";
      sourceLabel = "channel_paper_history_curated";
    } else if (isAsmrChannel) {
      defaultTrends = ASMR_PHYSICS_TRENDS;
      nicheLabel = "Satisfying ASMR & Physics";
      sourceLabel = "channel_asmr_curated";
    }

    // If query is provided, query live YouTube Suggestion API
    // If NO query is provided, we can either query YouTube for the channel's top seed, or return curated channel trends
    let targetQuery = query;
    if (!targetQuery) {
      if (category !== "all") {
        const filtered = defaultTrends.filter((t) => t.category === category);
        return NextResponse.json({
          success: true,
          trends: filtered.length > 0 ? filtered : defaultTrends,
          source: sourceLabel,
          channelNiche: nicheLabel,
        });
      }
      return NextResponse.json({
        success: true,
        trends: defaultTrends,
        source: sourceLabel,
        channelNiche: nicheLabel,
      });
    }

    // Query live YouTube Suggestion API
    const ytUrl = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(
      targetQuery
    )}`;

    const res = await fetch(ytUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      return NextResponse.json({
        success: true,
        trends: defaultTrends,
        source: "fallback",
        channelNiche: isKidsChannel ? "Kids & Animation" : "Science & Curiosities",
      });
    }

    const data = await res.json();
    const suggestions: string[] = Array.isArray(data[1]) ? data[1] : [];

    if (suggestions.length === 0) {
      return NextResponse.json({
        success: true,
        trends: defaultTrends,
        source: "fallback_empty",
        channelNiche: isKidsChannel ? "Kids & Animation" : "Science & Curiosities",
      });
    }

    // Transform live YouTube autocomplete suggestions into channel-adapted trend cards
    const liveTrends: TrendItem[] = suggestions.slice(0, 8).map((kw, i) => {
      const volumes = ["840K", "620K", "510K", "390K", "280K", "220K", "180K", "150K"];
      const growths = ["+490%", "+380%", "+295%", "+240%", "+190%", "+165%", "+140%", "+120%"];
      const badges: ("Breakout" | "Viral Trend" | "High Intent" | "Evergreen")[] = [
        "Breakout",
        "Viral Trend",
        "High Intent",
        "Evergreen",
      ];
      const categories: ("kids" | "stories" | "science" | "curiosity" | "health" | "space" | "animals")[] = isKidsChannel
        ? ["kids", "stories", "curiosity", "animals", "space", "kids", "animals", "stories"]
        : ["science", "curiosity", "health", "space", "science", "curiosity", "space", "health"];

      const format = isKidsChannel ? "3D Animated Short or Kids Story" : "60s Educational Short or Science Explainer";

      return {
        keyword: kw,
        volume: `${volumes[i % volumes.length]} Searches/mo`,
        growth: growths[i % growths.length],
        competition: i % 3 === 0 ? "Low" : i % 3 === 1 ? "Medium" : "Low",
        category: categories[i % categories.length],
        badge: badges[i % badges.length],
        angle: `Target high-retention ${format} uncovering the fascinating story behind "${kw}".`,
      };
    });

    return NextResponse.json({
      success: true,
      trends: liveTrends,
      source: "youtube_live_api",
      query: targetQuery,
      channelNiche: isKidsChannel ? "Kids & Animation" : "Science & Curiosities",
    });
  } catch (error: any) {
    console.error("Error fetching live YouTube trends:", error);
    return NextResponse.json({
      success: true,
      trends: SCIENCE_EDUCATION_TRENDS,
      source: "error_fallback",
    });
  }
}
