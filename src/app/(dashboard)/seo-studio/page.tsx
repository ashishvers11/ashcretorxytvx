import { Search, Tag, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SeoStudioPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SEO Studio</h1>
          <p className="text-sm text-slate-400 mt-1">
            Algorithmic YouTube packaging: CTR titles, structured descriptions, keyword tags, and timestamps.
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 py-1">
          <Search className="h-3.5 w-3.5 text-brand-400" />
          Metadata Optimizer
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-400" />
              High-CTR Title Generation
            </CardTitle>
            <CardDescription>
              Generates 5 distinct psychological title angles (Curiosity, Numbered, Contrast, Search-Focused).
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            Select a generated script to populate optimized titles tested against high-performing YouTube search queries.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4 text-brand-400" />
              Tags & Description Architect
            </CardTitle>
            <CardDescription>
              Structured description with chapters, reference citations, and high-volume tags.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            Complies with YouTube algorithmic search guidelines and eliminates keyword stuffing.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
