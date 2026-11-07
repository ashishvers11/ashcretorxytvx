import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-surface-950 px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-400 mb-4">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-2">404 — Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        The creator studio route you are looking for does not exist or has been relocated.
      </p>
      <Link href="/dashboard">
        <Button variant="primary" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
