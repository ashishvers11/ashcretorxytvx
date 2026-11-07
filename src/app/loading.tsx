export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-surface-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-500" />
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Loading Studio...
        </span>
      </div>
    </div>
  );
}
