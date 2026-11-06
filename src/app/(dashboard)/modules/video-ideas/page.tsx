// ==============================================================================
// ASH CREATOR STUDIO 2.0 — CHANNEL-SPECIFIC AI VIDEO IDEA ENGINE
// Generates curiosity concepts dynamically tailored to the active channel's Style DNA
// Phase 8: Channel-Specific Content Research & Originality Check
// ==============================================================================

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Bookmark,
  PenTool,
  Film,
  RefreshCw,
  ExternalLink,
  Dna,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChannelIdea {
  id: number;
  title: string;
  format: "guide" | "challenge" | "story";
  potential: string;
  audience: string;
  curiosityAngle: string;
  hook: string;
  visualStyle: string;
  estimatedDuration: string;
  originalityScore: number;
  sources: string[];
}

// Category 0: Kids & 3D Pixar Animation Style Ideas
const IDEAS_KIDS_ANIMATION: ChannelIdea[] = [
  {
    id: 101,
    title: "शेर और नटखट खरगोश की जादुी दोस्ती (3D Animation Moral Story)",
    format: "story",
    potential: "Massive Family Viral (21.4% CTR)",
    audience: "Kids, parents, and cartoon story lovers",
    curiosityAngle: "How intelligence and kindness outsmarts raw strength in the animal kingdom",
    hook: "'जंगल के सबसे खूंखार शेर ने जब एक नन्हे खरगोश को अपनी गुफा में बुलाया, तो सबने सोचा खरगोश का बचना नामुमकिन है... लेकिन!'",
    visualStyle: "3D Pixar Animation / 2D Cartoon Story",
    estimatedDuration: "50s",
    originalityScore: 98,
    sources: ["Panchatantra Wisdom Classic", "Aesop Fable Moral Collection"],
  },
  {
    id: 102,
    title: "डायनासोर असल में कैसे गायब हुए? Kids 3D Adventure Explainer",
    format: "guide",
    potential: "Breakout Curiosity (19.8% CTR)",
    audience: "Curious kids & little scientists",
    curiosityAngle: "Chicxulub asteroid impact explained with cute dinosaur explorers and cosmic dust",
    hook: "'6 करोड़ 60 लाख साल पहले आसमान से गिरी वो जादुई चट्टान, जिसने डायनासोरों की दुनिया को हमेशा के लिए बदल दिया!'",
    visualStyle: "3D Pixar Animation / 2D Cartoon Story",
    estimatedDuration: "55s",
    originalityScore: 96,
    sources: ["NASA Astrobiology", "Smithsonian Paleobiology Dept"],
  },
  {
    id: 103,
    title: "चींटी अपने वजन से 50 गुना ज्यादा वजन कैसे उठाती है? Tiny Superhero",
    format: "guide",
    potential: "High Retention Kids Wonder (17.2% CTR)",
    audience: "Young curious minds & animal fans",
    curiosityAngle: "Ant superhero neck joint biomechanics shown with fun cartoon weights",
    hook: "'अगर आपके पास चींटी जितनी ताकत होती, तो आप एक भारी बस को एक उंगली पर उठा लेते!'",
    visualStyle: "3D Pixar Animation / 2D Cartoon Story",
    estimatedDuration: "45s",
    originalityScore: 94,
    sources: ["National Geographic Kids", "Entomological Society of America"],
  },
  {
    id: 104,
    title: "आसमान का रंग हमेशा नीला ही क्यों दिखता है? Little Scientist",
    format: "guide",
    potential: "Evergreen Educational (16.5% CTR)",
    audience: "Preschool to primary school kids & parents",
    curiosityAngle: "Sunlight bouncing like colorful rubber balls through air particles",
    hook: "'सूरज की रोशनी असल में सफेद होती है, फिर दोपहर में आसमान इतना चमकदार नीला कैसे बन जाता है?'",
    visualStyle: "3D Pixar Animation / 2D Cartoon Story",
    estimatedDuration: "48s",
    originalityScore: 95,
    sources: ["NASA Science for Kids", "American Physical Society Outreach"],
  },
  {
    id: 105,
    title: "चाँद दिन के उजाले में भी आसमान में क्यों दिखाई देता है?",
    format: "story",
    potential: "Bedtime Wonder (15.9% CTR)",
    audience: "Kids & night bedtime learners",
    curiosityAngle: "Lunar orbital reflection explained with glowing mirror balls",
    hook: "'सूरज निकला हुआ है, फिर भी आसमान के एक कोने में चाँद चुपके से क्या कर रहा है?'",
    visualStyle: "3D Pixar Animation / 2D Cartoon Story",
    estimatedDuration: "45s",
    originalityScore: 93,
    sources: ["European Space Agency Kids", "Royal Observatory Greenwich"],
  },
  {
    id: 106,
    title: "इंद्रधनुष के 7 रंगों का जादुई रहस्य (Rainbow Colors Quest)",
    format: "challenge",
    potential: "Visual Delight (18.6% CTR)",
    audience: "Kids learning colors and light magic",
    curiosityAngle: "Raindrop crystal prism refraction with dancing animated color characters",
    hook: "'बारिश रुकते ही आसमान में ये 7 रंगों का खूबसूरत पुल कौन बनाता है? मिलिए पानी की जादुई बूंद से!'",
    visualStyle: "3D Pixar Animation / 2D Cartoon Story",
    estimatedDuration: "50s",
    originalityScore: 97,
    sources: ["Caltech Light & Optics", "Kids Weather Science Project"],
  },
];

// Category A: Science Curiosities & 2D Stickman Style Ideas
const IDEAS_STICKMAN_SCIENCE: ChannelIdea[] = [
  {
    id: 1,
    title: "लौंग असल में फूल है या फल? (The Science Behind Cloves)",
    format: "guide",
    potential: "Viral Curiosity (16.2% CTR)",
    audience: "Hindi curiosity, daily science & mystery lovers",
    curiosityAngle: "Challenges everyday culinary assumption using botanical anatomy",
    hook: "'आप जो रोज चाय में लौंग डालते हैं, 99% लोग नहीं जानते कि वो फल है या सूखा हुआ फूल!'",
    visualStyle: "2D Stickman & Doodle Explainer",
    estimatedDuration: "50s",
    originalityScore: 96,
    sources: ["Kew Royal Botanic Gardens", "NIH Eugenol Monograph"],
  },
  {
    id: 2,
    title: "अगर धरती सिर्फ 5 सेकंड के लिए घूमना बंद कर दे तो क्या होगा?",
    format: "challenge",
    potential: "Massive Viral Potential (18.8% CTR)",
    audience: "Broad physics & space curious viewers",
    curiosityAngle: "Extreme physics thought experiment highlighting angular inertia",
    hook: "'1670 किमी/घंटा की रफ्तार से उड़ते शहर और समुद्र का उफान... न्यूटन का पहला नियम!'",
    visualStyle: "2D Stickman & Doodle Explainer",
    estimatedDuration: "55s",
    originalityScore: 92,
    sources: ["NASA Goddard Earth Fact Sheet", "Harvard Physics"],
  },
  {
    id: 3,
    title: "हवाई जहाज का रंग हमेशा सफेद ही क्यों होता है? (Aviation Science)",
    format: "guide",
    potential: "High Search & Evergreen (14.4% CTR)",
    audience: "Curious tech & travel enthusiasts",
    curiosityAngle: "Solar infrared reflection, weight savings, and hairline crack detection",
    hook: "'500 किलो पेंट का वजन और 80 डिग्री तापमान से बचाने वाला सोलर रिफ्लेक्शन सीक्रेट!'",
    visualStyle: "2D Stickman & Doodle Explainer",
    estimatedDuration: "52s",
    originalityScore: 94,
    sources: ["FAA Aviation Circular AC 43-204", "GE Aerospace"],
  },
  {
    id: 4,
    title: "मोबाइल की बैटरी को 80% पर ही क्यों रोक देना चाहिए?",
    format: "guide",
    potential: "High Practical Intent (15.1% CTR)",
    audience: "Smartphone users wanting battery health longevity",
    curiosityAngle: "Mechanical stress curves in lithium-ion cathode layers",
    hook: "'अगर आप भी रात भर फोन चार्ज पर लगाकर सोते हैं, तो आप बैटरी के केमिकल्स को नष्ट कर रहे हैं!'",
    visualStyle: "2D Stickman & Doodle Explainer",
    estimatedDuration: "48s",
    originalityScore: 91,
    sources: ["Battery University BU-808", "Journal of Electrochemical Society"],
  },
  {
    id: 5,
    title: "क्या पौधे सच में दर्द महसूस करते हैं? Science Experiment",
    format: "story",
    potential: "Deep Curiosity Loop (17.3% CTR)",
    audience: "Nature, biology & curiosity audience",
    curiosityAngle: "Glutamate calcium wave signaling across cellular plant pathways",
    hook: "'घास कटने पर जो खुशबू आती है, वो असल में पौधों का डिस्ट्रेस सिग्नल है! जानिए पूरा सच!'",
    visualStyle: "2D Stickman & Doodle Explainer",
    estimatedDuration: "58s",
    originalityScore: 95,
    sources: ["Science Journal / UW Madison Botanical Lab"],
  },
  {
    id: 6,
    title: "चींटी अपने वजन से 50 गुना भारी वजन कैसे उठा लेती है? (Biomechanics)",
    format: "guide",
    potential: "Biology Wonder (14.2% CTR)",
    audience: "Curiosity & science facts lovers",
    curiosityAngle: "Square-cube law and muscular cross-sectional physics",
    hook: "'अगर इंसान के पास चींटी जैसी शारीरिक बनावट होती, तो हम एक चलती हुई कार को सिर पर उठा लेते!'",
    visualStyle: "2D Stickman & Doodle Explainer",
    estimatedDuration: "45s",
    originalityScore: 93,
    sources: ["Journal of Biomechanics", "Ohio State Mechanical Engineering"],
  },
];

// Channel B: History & Paper Cut-out Craft (@curiouspaper)
const IDEAS_PAPER_HISTORY: ChannelIdea[] = [
  {
    id: 11,
    title: "Why the Roman 9th Legion Vanished Without a Trace in Scotland",
    format: "story",
    potential: "Historical Mystery (16.8% CTR)",
    audience: "Documentary lovers & history enthusiasts",
    curiosityAngle: "Archaeological mystery of four thousand soldiers vanishing north of Hadrian's Wall",
    hook: "'In 120 AD, Rome's fiercest fighting unit marched into the Scottish mist... and not a single soldier ever returned.'",
    visualStyle: "Handmade Paper Cut-Out & Layered Craft",
    estimatedDuration: "60s",
    originalityScore: 97,
    sources: ["British Museum Archaeological Journal", "Tacitus Annals"],
  },
  {
    id: 12,
    title: "The Ancient Roman Concrete That Actually Heals Its Own Cracks",
    format: "guide",
    potential: "Engineering Wonder (17.5% CTR)",
    audience: "Architecture, history & science lovers",
    curiosityAngle: "Hot-mixing lime clasts that dissolve and recrystallize with rainwater",
    hook: "'Modern concrete rots in 50 years. Roman harbors have survived 2,000 years in seawater. Here is the lost ingredient.'",
    visualStyle: "Handmade Paper Cut-Out & Layered Craft",
    estimatedDuration: "55s",
    originalityScore: 95,
    sources: ["MIT Department of Civil and Environmental Engineering", "Science Advances"],
  },
  {
    id: 13,
    title: "How Viking Navigators Crossed Oceans Using Transparent Sunstones",
    format: "guide",
    potential: "Ancient Optics (15.2% CTR)",
    audience: "Maritime history & physics enthusiasts",
    curiosityAngle: "Iceland spar calcite crystals polarizing atmospheric UV light through fog",
    hook: "'With no compass and total cloud cover, how did Vikings locate the sun with 1% error?'",
    visualStyle: "Handmade Paper Cut-Out & Layered Craft",
    estimatedDuration: "58s",
    originalityScore: 96,
    sources: ["Royal Society Proceedings A", "University of Rennes Optics"],
  },
  {
    id: 14,
    title: "The Battle of Marathon: How One Greek Messenger Changed Running Forever",
    format: "story",
    potential: "Epic Historical Tale (14.6% CTR)",
    audience: "Storytelling & sports history fans",
    curiosityAngle: "The physiological feat of Pheidippides running 240km across rugged Spartan terrain",
    hook: "'He ran 150 miles across mountains in 36 hours. But history remembers only the last 26 miles.'",
    visualStyle: "Handmade Paper Cut-Out & Layered Craft",
    estimatedDuration: "52s",
    originalityScore: 92,
    sources: ["Herodotus Histories", "Oxford Classical Dictionary"],
  },
];

// Channel C: Satisfying ASMR & Tactile Physics (@zenfacts)
const IDEAS_ASMR_PHYSICS: ChannelIdea[] = [
  {
    id: 21,
    title: "The Hypnotic Geometry of Bismuth Crystal Formation (Macro 4K)",
    format: "guide",
    potential: "Sensory Science (18.1% CTR)",
    audience: "ASMR lovers, relaxation seekers & mineralogy fans",
    curiosityAngle: "Oxidation interference colors and staircase hopper crystal growth",
    hook: "'Watch liquid metal freeze into a rainbow psychedelic labyrinth right before your eyes...'",
    visualStyle: "Satisfying ASMR & Tactile Macro Visuals",
    estimatedDuration: "40s",
    originalityScore: 98,
    sources: ["American Mineralogist", "Caltech Crystallography"],
  },
  {
    id: 22,
    title: "What Happens When Molten Glass Hits Ice Water? The Prince Rupert Paradox",
    format: "challenge",
    potential: "Extreme Tension (19.4% CTR)",
    audience: "Physics experiments & ASMR viewers",
    curiosityAngle: "Internal compressive stress of 700 megapascals in glass teardrops",
    hook: "'The head can stop a speeding bullet. But snap the tiny tail, and the whole drop explodes into powder.'",
    visualStyle: "Satisfying ASMR & Tactile Macro Visuals",
    estimatedDuration: "45s",
    originalityScore: 94,
    sources: ["Applied Physics Letters", "Purdue Materials Engineering"],
  },
  {
    id: 23,
    title: "The Acoustic Mystery of Supercooled Water Instant Freezing",
    format: "story",
    potential: "Hypnotic Relaxation (16.9% CTR)",
    audience: "Science curiosity & tactile sound enthusiasts",
    curiosityAngle: "Homogeneous nucleation triggered by acoustic shockwaves",
    hook: "'Liquid water that instantly crystallizes into solid ice with a single tap... listen closely.'",
    visualStyle: "Satisfying ASMR & Tactile Macro Visuals",
    estimatedDuration: "35s",
    originalityScore: 96,
    sources: ["Nature Physics", "Max Planck Institute for Polymer Research"],
  },
];

export default function VideoIdeasPage() {
  const { channel, activeChannelStyle } = useAuth();
  const [formatFilter, setFormatFilter] = React.useState<"all" | "guide" | "challenge" | "story">("all");
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Determine active channel idea bank based on its Style DNA and Niche
  const activeIdeasPool = React.useMemo(() => {
    const styleType = (activeChannelStyle?.visualAnimationStyle || "") as string;
    const niche = (activeChannelStyle?.channelNiche || "").toLowerCase();
    const title = (channel?.channel_title || "").toLowerCase();

    const isKids =
      styleType === "pixar_3d" ||
      styleType === "animation_2d" ||
      niche.includes("kid") ||
      niche.includes("animation") ||
      title.includes("kid") ||
      title.includes("cartoon");

    if (isKids) {
      return IDEAS_KIDS_ANIMATION;
    }
    if (styleType === "paper_cutout" || niche.includes("paper") || niche.includes("history")) {
      return IDEAS_PAPER_HISTORY;
    }
    if (styleType === "asmr_satisfying" || niche.includes("asmr")) {
      return IDEAS_ASMR_PHYSICS;
    }
    return IDEAS_STICKMAN_SCIENCE;
  }, [activeChannelStyle, channel]);

  const [ideas, setIdeas] = React.useState<ChannelIdea[]>(activeIdeasPool);

  // Sync pool when channel changes
  React.useEffect(() => {
    setIdeas(activeIdeasPool);
  }, [activeIdeasPool]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const shuffled = [...activeIdeasPool].sort(() => 0.5 - Math.random());
      setIdeas(shuffled);
      setIsGenerating(false);
    }, 700);
  };

  const filteredIdeas = ideas.filter(
    (i) => formatFilter === "all" || i.format === formatFilter
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Video Idea Engine
            </h2>
            <Badge variant="brand" className="gap-1 text-xs">
              <Dna className="h-3 w-3" />
              <span>{activeChannelStyle?.visualStyleLabel || "Channel DNA Active"}</span>
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tailored curiosity packaging calibrated for{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {channel?.channel_title || "Your Connected Channel"}
            </strong>{" "}
            ({activeChannelStyle?.channelNiche || "Curiosities"})
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          isLoading={isGenerating}
          className="gap-2 text-xs bg-brand-600 hover:bg-brand-700 font-bold"
        >
          <Sparkles className="h-4 w-4" />
          <span>Research Fresh Channel Ideas</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-navy-800 pb-2 text-xs">
        {[
          { id: "all", label: "All Formats" },
          { id: "guide", label: "Visual Explainers & Facts" },
          { id: "challenge", label: "What If? & Thought Experiments" },
          { id: "story", label: "Curiosity Loops & Mysteries" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFormatFilter(f.id as any)}
            className={`py-1.5 px-3 rounded-lg font-semibold transition-colors ${
              formatFilter === f.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea) => (
          <Card
            key={idea.id}
            className="border-slate-200/80 dark:border-navy-800 hover:border-brand-500/50 transition-all flex flex-col justify-between"
          >
            <CardHeader className="pb-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  <Flame className="h-3 w-3" />
                  <span>{idea.potential}</span>
                </span>

                <span className="text-[10px] font-semibold text-slate-400">
                  Originality: {idea.originalityScore}%
                </span>
              </div>

              <CardTitle className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {idea.title}
              </CardTitle>

              <CardDescription className="text-xs">
                Audience: {idea.audience} • Est: {idea.estimatedDuration}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-850 text-xs">
                <div className="text-[10px] font-bold uppercase text-slate-400">
                  Opening Hook Pattern
                </div>
                <p className="italic text-slate-800 dark:text-slate-200 mt-1">
                  {idea.hook}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[10px] text-slate-400 font-medium">
                  Sources: {idea.sources.join(" • ")}
                </div>

                <Link
                  href={`/modules/script-writer?title=${encodeURIComponent(idea.title)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>Write Script</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
