"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Copy,
  CheckCircle2,
  Sliders,
  Tag,
  Hash,
  FileText,
  TrendingUp,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

function SeoStudioContent() {
  const { channel, activeChannelStyle } = useAuth();
  const searchParams = useSearchParams();
  const titleFromUrl = searchParams.get("title");

  const channelBrand = channel?.channel_title || "Creator Channel";
  const channelHandle = channel?.custom_url ? `@${channel.custom_url}` : channelBrand;

  const [titleInput, setTitleInput] = React.useState(
    titleFromUrl || (activeChannelStyle?.popularTopics?.[0] || "Why Are Most Airplanes Painted White? (Aviation Science)")
  );

  const [descriptionInput, setDescriptionInput] = React.useState(
    `इस वीडियो में जानिए इसके पीछे का असली सच! क्या आप जानते हैं कि 99% लोग इसका गलत जवाब देते हैं? 

📌 वीडियो के महत्वपूर्ण भाग (TIMESTAMPS):
0:00 - मुख्य सवाल और हुक (The Big Hook)
0:15 - प्राथमिक संदर्भ और पृष्ठभूमि (Context)
1:10 - मुख्य तथ्य और रहस्य (Core Reveal)
2:20 - वैज्ञानिक और ऐतिहासिक विश्लेषण (Deep Dive)
3:45 - प्रमुख खोज और निष्कर्ष (Takeaway)

🔔 चैनल (${channelHandle}) को सब्सक्राइब करें और हर हफ्ते नए और रोचक वीडियो देखें!

#Shorts #Viral #Facts #Education #Explore`
  );

  const [tags, setTags] = React.useState<string[]>([
    "viral facts hindi",
    "curiosity facts",
    "daily life curiosities",
    "interesting facts in hindi",
    "amazing knowledge hindi",
    "educational shorts hindi",
    ...(channel?.channel_title ? [channel.channel_title.toLowerCase()] : []),
  ]);

  const [newTagInput, setNewTagInput] = React.useState("");
  const [copiedTags, setCopiedTags] = React.useState(false);
  const [copiedDesc, setCopiedDesc] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Sync title with URL
  React.useEffect(() => {
    if (titleFromUrl && titleFromUrl !== titleInput) {
      setTitleInput(titleFromUrl);
      generateMetadata(titleFromUrl);
    }
  }, [titleFromUrl]);

  const generateMetadata = (titleText: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const cleanKeyword = titleText.replace(/[?()]/g, "").trim();
      const styleLabel = activeChannelStyle?.visualStyleLabel || "educational";
      const brandTag = channel?.channel_title ? [channel.channel_title.toLowerCase()] : [];
      const newTags = [
        cleanKeyword.toLowerCase(),
        `${cleanKeyword.toLowerCase()} in hindi`,
        `${cleanKeyword.toLowerCase()} facts`,
        ...brandTag,
        `${styleLabel.toLowerCase()} video`,
        "knowledge breakdown",
        "viral curiosity",
        "educational shorts",
        "amazing facts hindi",
      ];
      setTags(newTags);

      setDescriptionInput(
        `${titleText}

इस वीडियो में जानिए इसके पीछे का असली सच! 99% लोग इसके बारे में पूरी तरह गलत जानकारी रखते हैं। 

📌 TIMESTAMPS:
0:00 - Opening Hook & Premise
0:15 - Background Context
1:10 - Core Fact Reveal
2:30 - Deep Scientific & Historical Analysis
3:45 - Key Discovery & Practical Takeaway
4:30 - Conclusion

🔔 Subscribe to ${channelBrand} (${channel?.custom_url ? `https://youtube.com/@${channel.custom_url}` : "YouTube"}): हर हफ्ते नए ज्ञानवर्धक और रोचक वीडियो!

#${channelBrand.replace(/[^a-zA-Z0-9]/g, "")} #Trending #Shorts #Facts #Curiosity #Education`
      );
      setIsGenerating(false);
    }, 800);
  };

  // Title analytics
  const titleLength = titleInput.length;
  const isLengthGood = titleLength >= 35 && titleLength <= 75;
  const hasPowerWords = /(सच|रहस्य|हैरान|truth|science|secret|why|कैसे|क्यों|क्या)/i.test(titleInput);
  const titleScore = Math.min(
    100,
    (isLengthGood ? 45 : 30) + (hasPowerWords ? 40 : 20) + (titleInput.includes("?") ? 15 : 10)
  );

  const handleCopyTags = () => {
    navigator.clipboard.writeText(tags.join(", "));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleCopyDesc = () => {
    navigator.clipboard.writeText(descriptionInput);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    if (!tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
    }
    setNewTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              SEO Studio & Metadata Optimizer
            </h2>
            <Badge variant="brand">Education & Facts</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate high-ranking Hindi & English YouTube tags and descriptions calibrated for <strong className="text-slate-800 dark:text-slate-200">{channel?.channel_title || "your channel"}</strong>
          </p>
        </div>

        <Link href={`/modules/script-writer?title=${encodeURIComponent(titleInput)}`}>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <span>Open in Script Writer</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Title Scorer */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-6 space-y-4 bg-white dark:bg-navy-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Title Power & SEO Scorer
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates curiosity hook, length, search keyword placement, and CTR density
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-brand-500">
              {titleScore}
            </span>
            <span className="text-xs text-slate-400">/ 100 SEO Score</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Paste or write your video title..."
            className="text-sm font-semibold flex-1"
          />
          <Button
            onClick={() => generateMetadata(titleInput)}
            isLoading={isGenerating}
            className="gap-1.5 text-xs bg-brand-500 hover:bg-brand-600 font-bold shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>⚡ Generate SEO Tags</span>
          </Button>
        </div>

        {/* Real-time Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="rounded-lg border border-slate-200 dark:border-navy-800 p-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Length Check</span>
              <span className={isLengthGood ? "text-emerald-500" : "text-amber-500"}>
                {titleLength} / 70 chars
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isLengthGood
                ? "Perfect length. Won't get cut off on YouTube mobile app."
                : "Aim for 40-70 characters for best CTR visibility."}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-navy-800 p-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Curiosity / Power Triggers</span>
              <span className={hasPowerWords ? "text-emerald-500" : "text-amber-500"}>
                {hasPowerWords ? "Detected ✓" : "Add 'सच', 'रहस्य' or 'Why'"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Curiosity words create a high-CTR emotional gap in search results.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-navy-800 p-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Question Mark Hook</span>
              <span className={titleInput.includes("?") ? "text-emerald-500" : "text-slate-400"}>
                {titleInput.includes("?") ? "Present (?)" : "Optional"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Questions increase viewer engagement and click propensity by 22%.
            </p>
          </div>
        </div>
      </Card>

      {/* Description Generator */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-6 space-y-3 bg-white dark:bg-navy-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Optimized YouTube Description (with Timestamps)
            </h3>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyDesc}
            className="gap-1.5 text-xs"
          >
            {copiedDesc ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedDesc ? "Copied!" : "Copy Description"}</span>
          </Button>
        </div>

        <textarea
          rows={9}
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono leading-relaxed"
        />
      </Card>

      {/* Tags Generator */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-6 space-y-4 bg-white dark:bg-navy-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-brand-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Target YouTube Search Tags ({tags.length} Active Tags)
              </h3>
              <p className="text-xs text-slate-400">
                Click any tag to remove it, or use the form below to add custom keywords
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyTags}
            className="gap-1.5 text-xs shrink-0"
          >
            {copiedTags ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedTags ? "Tags Copied!" : "Copy All Tags (CSV)"}</span>
          </Button>
        </div>

        {/* Add custom tag */}
        <form onSubmit={handleAddTag} className="flex gap-2">
          <Input
            placeholder="Add specific science keyword or creator tag..."
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            className="text-xs"
          />
          <Button type="submit" size="sm" className="gap-1.5 text-xs shrink-0">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Tag</span>
          </Button>
        </form>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((t) => (
            <span
              key={t}
              onClick={() => removeTag(t)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-500 cursor-pointer transition-colors"
              title="Click to remove tag"
            >
              <span>{t}</span>
              <span className="text-[10px] text-slate-400 hover:text-red-500">×</span>
            </span>
          ))}
        </div>
      </Card>

      {/* PRD Section 7 -> 8 Workflow Handoff */}
      <Card className="border-pink-500/30 bg-pink-50/20 dark:bg-pink-950/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span>SEO Packaging Completed</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Metadata ready. Next step: Generate high-CTR thumbnail concepts and test on the mobile feed simulator.
          </p>
        </div>

        <Link
          href={`/modules/thumbnail-studio?title=${encodeURIComponent(titleInput)}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <span>Continue to Thumbnail Studio</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </Card>
    </div>
  );
}

export default function SeoStudioPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading SEO Studio...</div>}>
      <SeoStudioContent />
    </React.Suspense>
  );
}
