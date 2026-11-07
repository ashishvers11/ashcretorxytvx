import { Youtube, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ChannelAuditPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Channel Audit</h1>
          <p className="text-sm text-slate-400 mt-1">
            Authoritative channel intelligence powered by the official YouTube Data & Analytics API.
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
          OAuth 2.0 Integration
        </Badge>
      </div>

      <Card className="border-dashed border-slate-800 bg-surface-900/40 p-8 text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
          <Youtube className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Connect Your YouTube Channel</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Authorize read-only access to import live subscriber velocity, top performing videos, and baseline analytics without generating simulated sample values.
        </p>
        <Button variant="primary" className="gap-2">
          <Youtube className="h-4 w-4" />
          Authorize Channel via Google
        </Button>
      </Card>
    </div>
  );
}
