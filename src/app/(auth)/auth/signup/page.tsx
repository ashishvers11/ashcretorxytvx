import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <Card className="border-slate-800 bg-surface-900/90 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Create your Creator Account</CardTitle>
        <CardDescription>
          Get started with AI trend research and cinematic video production.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400 mb-1.5 block">
            Full Name
          </label>
          <Input type="text" placeholder="Creator Name" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400 mb-1.5 block">
            Email Address
          </label>
          <Input type="email" placeholder="creator@example.com" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400 mb-1.5 block">
            Password
          </label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <Button variant="primary" className="w-full gap-2 mt-2">
          <Sparkles className="h-4 w-4" />
          Create Account
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4 text-xs text-slate-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-semibold ml-1">
          Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
