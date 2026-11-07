import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col justify-center items-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/dashboard" className="flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              ASH CREATOR STUDIO
            </span>
          </Link>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            AI YouTube Creator Growth Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
