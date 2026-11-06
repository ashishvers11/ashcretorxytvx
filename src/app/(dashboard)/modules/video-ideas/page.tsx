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
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Idea {
  id: number;
  title: string;
  format: "challenge" | "guide" | "story";
  potential: string;
  audience: string;
  hook: string;
  estimatedViews: string;
}

const INITIAL_EDUCATION_IDEAS: Idea[] = [
  {
    id: 1,
    title: "लौंग असल में फूल है या फल? (The Science Behind Cloves)",
    format: "guide",
    potential: "Viral Mystery Potential (15.4% CTR)",
    audience: "Hindi curiosity, daily science & mystery lovers",
    hook: "'आप जो रोज चाय में लौंग डालते हैं, 99% लोग नहीं जानते कि वो फल है या सूखा हुआ फूल!'",
    estimatedViews: "250K - 700K",
  },
  {
    id: 2,
    title: "अगर धरती सिर्फ 5 सेकंड के लिए घूमना बंद कर दे तो क्या होगा?",
    format: "challenge",
    potential: "Massive Viral Potential (18.2% CTR)",
    audience: "Broad science fiction, astronomy & physics curious viewers",
    hook: "'1670 किमी/घंटा की रफ्तार से उड़ते शहर और 1000 फीट ऊंची सुनामी... न्यूटन का पहला नियम!'",
    estimatedViews: "500K - 1.2M",
  },
  {
    id: 3,
    title: "हवाई जहाज का रंग हमेशा सफेद ही क्यों होता है? (Aviation Science)",
    format: "guide",
    potential: "High Search & Evergreen (13.6% CTR)",
    audience: "Curious tech & travel enthusiasts",
    hook: "'500 किलो पेंट का वजन और 80 डिग्री तापमान से बचाने वाला सोलर रिफ्लेक्शन सीक्रेट!'",
    estimatedViews: "180K - 450K",
  },
  {
    id: 4,
    title: "मोबाइल की बैटरी को 80% पर ही क्यों रोक देना चाहिए?",
    format: "guide",
    potential: "High Practical Intent (14.8% CTR)",
    audience: "Smartphone users wanting battery health longevity",
    hook: "'अगर आप भी रात भर फोन चार्ज पर लगाकर सोते हैं, तो आप बैटरी के केमिकल्स को नष्ट कर रहे हैं!'",
    estimatedViews: "300K - 850K",
  },
  {
    id: 5,
    title: "क्या पौधे सच में दर्द महसूस करते हैं? Science Experiment",
    format: "story",
    potential: "Deep Curiosity Loop (16.9% CTR)",
    audience: "Nature, biology & psychology audience",
    hook: "'घास कटने पर जो खुशबू आती है, वो असल में पौधों की चीख है! जानिए ग्लूटामेट तरंगों का सच!'",
    estimatedViews: "400K - 950K",
  },
  {
    id: 6,
    title: "आसमान में तारे क्यों टिमटिमाते हैं? 60-Second Explanation",
    format: "guide",
    potential: "Evergreen Search (11.2% CTR)",
    audience: "Students, science facts learners & Shorts viewers",
    hook: "'अंतरिक्ष में तारे कभी नहीं टिमटिमाते! तो धरती से देखने पर ऐसा क्यों दिखता है?'",
    estimatedViews: "120K - 320K",
  },
];

const FRESH_EDUCATION_IDEAS_POOL: Idea[] = [
  {
    id: 7,
    title: "चींटी अपने वजन से 50 गुना भारी वजन कैसे उठा लेती है? (Biomechanics)",
    format: "guide",
    potential: "Biology Wonder (13.9% CTR)",
    audience: "Curiosity & science lovers",
    hook: "'अगर इंसान के पास चींटी जैसी शक्ति होती, तो हम एक चलती हुई कार को सिर पर उठा लेते!'",
    estimatedViews: "220K - 600K",
  },
  {
    id: 8,
    title: "अगर सूरज 8 मिनट के लिए गायब हो जाए, तो धरती पर क्या होगा?",
    format: "challenge",
    potential: "Mega Viral Space Hook (19.1% CTR)",
    audience: "Astrophysics & universe mysteries",
    hook: "'8 मिनट 20 सेकंड तक किसी को पता भी नहीं चलेगा... फिर अचानक गुरुत्वाकर्षण खत्म!'",
    estimatedViews: "600K - 1.8M",
  },
  {
    id: 9,
    title: "आईने में हमारा चेहरा उल्टा क्यों दिखता है? The Optical Mystery",
    format: "story",
    potential: "Mind-Bending Optics (15.5% CTR)",
    audience: "Psychology & physics curious viewers",
    hook: "'आईना बाएँ को दायाँ करता है, लेकिन ऊपर को नीचे क्यों नहीं करता? कभी सोचा है?'",
    estimatedViews: "350K - 800K",
  },
  {
    id: 10,
    title: "नींद में हमें गिरने का झटका क्यों महसूस होता है? (Hypnic Jerk Explained)",
    format: "story",
    potential: "Universal Relatability (17.4% CTR)",
    audience: "Everyone who sleeps & biology enthusiasts",
    hook: "'जब आपका दिमाग सोचता है कि आप मर रहे हैं, तो वो पूरे शरीर को एक इलेक्ट्रिक शॉक भेजता है!'",
    estimatedViews: "450K - 1.1M",
  },
];

export default function VideoIdeasPage() {
  const { channel } = useAuth();
  const [ideas, setIdeas] = React.useState<Idea[]>(INITIAL_EDUCATION_IDEAS);
  const [formatFilter, setFormatFilter] = React.useState<"all" | "challenge" | "guide" | "story">("all");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [savedIdeas, setSavedIdeas] = React.useState<number[]>([]);

  // Load saved ideas from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("ash_saved_ideas");
      if (stored) {
        setSavedIdeas(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Rotate pool ideas into list
      const combined = [...FRESH_EDUCATION_IDEAS_POOL, ...INITIAL_EDUCATION_IDEAS];
      const shuffled = combined.sort(() => 0.5 - Math.random()).slice(0, 6);
      setIdeas(shuffled);
      setIsGenerating(false);
    }, 1000);
  };

  const toggleSave = (id: number) => {
    setSavedIdeas((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("ash_saved_ideas", JSON.stringify(next));
      return next;
    });
  };

  const filteredIdeas = ideas.filter(
    (i) => formatFilter === "all" || i.format === formatFilter
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Video Idea Engine
            </h2>
            <Badge variant="brand">Education & Science</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Formulated high-CTR curiosity packaging concepts calibrated for{" "}
            <strong className="text-slate-800 dark:text-slate-200">@ashishfn</strong> (Science & Facts)
          </p>
        </div>

        <Button onClick={handleGenerate} isLoading={isGenerating} className="gap-2 text-xs bg-brand-500 hover:bg-brand-600">
          <Sparkles className="h-4 w-4" />
          <span>Generate Fresh Science Ideas</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-navy-800 pb-2 text-xs">
        {[
          { id: "all", label: "All Formats" },
          { id: "guide", label: "Science Explainers & Facts" },
          { id: "challenge", label: "What If? & Thought Experiments" },
          { id: "story", label: "Psychological & Biology Mysteries" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFormatFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              formatFilter === f.id
                ? "bg-brand-500 text-white font-semibold shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-900"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Idea Cards */}
      <div className="space-y-4">
        {filteredIdeas.map((idea) => {
          const isSaved = savedIdeas.includes(idea.id);

          return (
            <Card
              key={idea.id}
              className="border-slate-200/80 dark:border-navy-800 hover:border-brand-500/40 transition-all duration-200 p-5 sm:p-6 bg-white dark:bg-navy-900"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="brand" className="text-[10px]">
                      {idea.potential}
                    </Badge>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Est. Reach: {idea.estimatedViews}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {idea.title}
                  </h3>

                  <div className="rounded-lg bg-slate-50 dark:bg-navy-950 p-3 border border-slate-100 dark:border-navy-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Target Opening Hook (First 5 Seconds):
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium">
                      {idea.hook}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Target Audience: <strong className="text-slate-700 dark:text-slate-300">{idea.audience}</strong>
                  </p>
                </div>

                {/* Actions: Direct link to Script Writer */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 self-end sm:self-start">
                  <Link href={`/modules/script-writer?title=${encodeURIComponent(idea.title)}`}>
                    <Button size="sm" className="gap-1.5 text-xs bg-brand-500 hover:bg-brand-600 font-bold">
                      <Film className="h-3.5 w-3.5" />
                      <span>Create AI Video Prompts</span>
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSave(idea.id)}
                    className={`gap-1.5 text-xs ${
                      isSaved ? "text-brand-500 border-brand-500 font-bold" : ""
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>{isSaved ? "Saved ✓" : "Save Idea"}</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
