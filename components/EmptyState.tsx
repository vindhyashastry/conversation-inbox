type EmptyStateProps = {
  resolvedCount: number;
  skippedCount: number;
  onReset?: () => void;
};

export function EmptyState({ resolvedCount, skippedCount, onReset }: EmptyStateProps) {
  return (
    <div className="flex-1 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl relative overflow-hidden animate-slide-in">
      {/* Decorative gradient glowing backing */}
      <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-yellow-500/5 blur-3xl" />

      {/* Icon with glowing pulse */}
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/10 opacity-75"></span>
        <svg
          className="relative h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-white tracking-tight">All caught up!</h2>
      <p className="mt-3 text-sm text-zinc-400 max-w-sm mx-auto">
        There are no more escalated support conversations in the triage stream. Excellent work!
      </p>

      {/* Session Stats */}
      <div className="mt-10 border-t border-zinc-800/80 pt-8 max-w-md mx-auto">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Shift Triage Summary
        </h3>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-zinc-950/40 p-5 border border-zinc-800/60 shadow-inner group hover:border-emerald-500/30 transition-all duration-200">
            <p className="text-3xl font-extrabold text-emerald-400 tracking-tight group-hover:scale-105 transition-transform duration-200">{resolvedCount}</p>
            <p className="text-xs text-zinc-500 font-medium mt-2 uppercase tracking-wider">Resolved</p>
          </div>
          <div className="rounded-xl bg-zinc-950/40 p-5 border border-zinc-800/60 shadow-inner group hover:border-zinc-700 transition-all duration-200">
            <p className="text-3xl font-extrabold text-zinc-300 tracking-tight group-hover:scale-105 transition-transform duration-200">{skippedCount}</p>
            <p className="text-xs text-zinc-500 font-medium mt-2 uppercase tracking-wider">Skipped</p>
          </div>
        </div>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="btn-shimmer group relative mt-10 inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 px-6 py-3 text-sm font-bold text-zinc-950 hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400 shadow-lg shadow-yellow-500/15 hover:shadow-yellow-500/25 active:scale-[0.97] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          <svg
            className="h-4.5 w-4.5 group-hover:rotate-180 transition-transform duration-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
            />
          </svg>
          Reset Demo Queue
        </button>
      )}
    </div>
  );
}
