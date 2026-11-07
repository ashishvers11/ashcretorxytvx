import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <Card className="border-slate-800 bg-surface-900/90 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Sign in to your Studio</CardTitle>
        <CardDescription>
          Enter your creator credentials to manage your YouTube workflow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-400 mb-1.5 block">
            Email Address
          </label>
          <div className="relative">
            <Input type="email" placeholder="creator@example.com" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">
              Password
            </label>
          </div>
          <Input type="password" placeholder="••••••••" />
        </div>
        <Button variant="primary" className="w-full gap-2 mt-2">
          Sign In
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-800/80 pt-4 text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-brand-400 hover:text-brand-300 font-semibold ml-1">
          Create account
        </Link>
      </CardFooter>
    </Card>
  );
}
