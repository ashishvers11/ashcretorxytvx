"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Tag,
  FileText,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Hash,
  Layers,
  BarChart2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GeneratedSEOResult } from "@/lib/ai/provider";

export default function SeoStudioPage() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "Dinosaur extinction mystery";

  const [topic, setTopic] = useState<string>(initialTopic);
  const [videoFormat, setVideoFormat] = useState<"shorts" | "longform">("shorts");
  const [generating, setGenerating] = useState(false);
  const [seoResult, setSeoResult] = useState<GeneratedSEOResult | null>(null);

  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const handleGenerateSEO = async () => {
    if (!topic.trim()) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/studio/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          videoFormat,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSeoResult(data.seo);
        setSelectedTitle(data.seo.title);
      }
    } catch (err) {
      console.error("Failed to generate SEO:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string, type: "title" | "desc" | "tags") => {
    navigator.clipboard.writeText(text);
    if (type === "title") {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else if (type === "desc") {
      setCopiedDesc(true);
      setTimeout(() => setCopiedDesc(false), 2000);
    } else {
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Search className="h-6 w-6 text-brand-400" />
            <span>SEO Studio &amp; Metadata Architect</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Algorithmic YouTube packaging: High-CTR titles, structured descriptions, keyword tags, and search intent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/thumbnail-studio?topic=${encodeURIComponent(topic)}`}>
            <Button variant="primary" size="sm" className="gap-1.5 text-xs">
              <span>Next: Thumbnail Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Input Console */}
      <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">Video Topic or Title</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Why airplane windows have tiny holes"
              className="bg-slate-950 border-slate-800 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">Format</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setVideoFormat("shorts")}
                className={`py-2 rounded-lg border text-center font-medium transition-all ${
                  videoFormat === "shorts"
                    ? "border-brand-500 bg-brand-500/10 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                Shorts (9:16)
              </button>
              <button
                type="button"
                onClick={() => setVideoFormat("longform")}
                className={`py-2 rounded-lg border text-center font-medium transition-all ${
                  videoFormat === "longform"
                    ? "border-brand-500 bg-brand-500/10 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                Longform (16:9)
              </button>
            </div>
          </div>

          <div>
            <Button
              variant="primary"
              onClick={handleGenerateSEO}
              disabled={generating || !topic.trim()}
              className="w-full gap-2 text-xs font-semibold"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Optimizing Metadata...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate SEO Package</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* SEO Results View */}
      {seoResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 5 High-CTR Title Variations (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-400" />
                <span>5 High-CTR Title Angles</span>
              </h3>
              <span className="text-xs text-slate-500">Tested for YouTube Browse Feed</span>
            </div>

            <div className="space-y-2.5">
              {seoResult.generated_titles?.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTitle(item.title)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTitle === item.title
                      ? "border-brand-500 bg-brand-500/10 text-white shadow-sm"
                      : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-brand-400">{item.angle}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-emerald-400 font-bold">{item.ctrScore}% CTR Score</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item.title, "title");
                        }}
                        className="h-6 px-1.5 text-[10px]"
                      >
                        {copiedTitle && selectedTitle === item.title ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold">{item.title}</h4>
                  <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-3">
                    <span>{item.title.length} characters</span>
                    <span className={item.title.length <= 60 ? "text-emerald-400" : "text-amber-400"}>
                      {item.title.length <= 60 ? "Optimal mobile cutoff (≤60)" : "May truncate on small phones"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Analysis Card */}
            <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-4 space-y-2.5">
              <h4 className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1.5">
                <BarChart2 className="h-3.5 w-3.5 text-brand-400" />
                <span>Algorithmic Quality Diagnostics</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Readability Grade</span>
                  <span className="font-bold text-white">{seoResult.quality_analysis.readabilityGrade}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Power Words</span>
                  <span className="font-bold text-emerald-400">{seoResult.quality_analysis.powerWordDensity}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Structured Description & Tags (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Description Card */}
            <Card className="border-slate-800 bg-surface-900/90 shadow-xl overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-400" />
                  <span className="text-sm font-bold text-white">Algorithmic Structured Description</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(seoResult.description, "desc")}
                  className="h-7 text-xs gap-1.5"
                >
                  {copiedDesc ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedDesc ? "Copied" : "Copy Description"}</span>
                </Button>
              </div>

              <CardContent className="pt-4">
                <textarea
                  readOnly
                  value={seoResult.description}
                  rows={8}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none select-all resize-none"
                />
              </CardContent>
            </Card>

            {/* Keyword Tags & Hashtags Card */}
            <Card className="border-slate-800 bg-surface-900/90 shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-bold text-white">Keyword Tags for YouTube Studio</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(seoResult.tags.join(", "), "tags")}
                  className="h-7 text-xs gap-1.5"
                >
                  {copiedTags ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedTags ? "Copied" : "Copy Tags CSV"}</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {seoResult.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800/60">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                  <Hash className="h-3.5 w-3.5 text-brand-400" />
                  <span>Optimal Hashtags:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {seoResult.hashtags?.map((hash, i) => (
                    <span key={i} className="text-xs font-mono text-brand-400 font-medium">
                      {hash}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 bg-surface-900/40 p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4 border border-brand-500/20">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No SEO Package Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            Generate 5 tested psychological title angles, structured descriptions with chapter timestamps, and
            comma-separated tags ready to paste into YouTube Studio.
          </p>
          <Button variant="primary" onClick={handleGenerateSEO} className="gap-2 text-xs">
            <Sparkles className="h-4 w-4" />
            <span>Generate Default SEO Package</span>
          </Button>
        </Card>
      )}
    </div>
  );
}
