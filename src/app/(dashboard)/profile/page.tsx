import { User, Youtube, Shield, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Creator Profile</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your creator account, connected YouTube channels, and intelligence settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1 text-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 text-2xl font-bold shadow-xl shadow-brand-500/20">
            <User className="h-10 w-10" />
          </div>
          <h3 className="text-base font-bold text-white">Creator Account</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">ASH Creator Studio Pro</p>
          <Badge variant="outline" className="text-xs">
            Tier: Active Creator
          </Badge>
        </Card>

        <Card className="p-6 md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-semibold text-white text-sm">
              <Youtube className="h-4 w-4 text-red-500" />
              Connected YouTube Channel
            </div>
            <Badge variant="secondary">1 Channel Connected</Badge>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Channel Intelligence DNA is isolated to prevent cross-channel style contamination between different creator formats.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Button variant="outline" size="sm">
              Manage Credentials
            </Button>
            <Button variant="secondary" size="sm">
              Sync Channel Profile
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
