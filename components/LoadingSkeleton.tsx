export function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8 animate-pulse">
      {/* Title & subtitle skeleton */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-6 mb-8">
        <div>
          <div className="h-7 w-56 bg-zinc-850 bg-zinc-800 rounded mb-2" />
          <div className="h-4 w-40 bg-zinc-800 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="h-8 w-24 bg-zinc-800 rounded-lg" />
          <div className="h-8 w-28 bg-zinc-800 rounded-lg" />
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Hero Card Skeleton */}
        <div className="flex-1 max-w-2xl rounded-2xl border border-zinc-900 bg-zinc-900 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 w-40 bg-zinc-800 rounded mb-2" />
              <div className="h-4 w-28 bg-zinc-800 rounded" />
            </div>
            <div className="h-12 w-12 bg-zinc-800 rounded-full" />
          </div>

          <div className="mt-8 space-y-3">
            <div className="h-3 w-32 bg-zinc-800 rounded" />
            <div className="h-5 w-full bg-zinc-800 rounded" />
            <div className="h-5 w-5/6 bg-zinc-800 rounded" />
          </div>

          <div className="mt-8 border-t border-zinc-850 border-zinc-800 pt-6 space-y-3">
            <div className="h-4 w-full bg-zinc-800 rounded" />
            <div className="h-4 w-11/12 bg-zinc-800 rounded" />
          </div>

          <div className="mt-8 flex gap-3">
            <div className="h-11 flex-1 bg-zinc-800 rounded-xl" />
            <div className="h-11 flex-1 bg-zinc-800 rounded-xl" />
            <div className="h-11 w-24 bg-zinc-800 rounded-xl" />
          </div>
        </div>

        {/* Side Rail Skeleton */}
        <div className="w-80 space-y-8">
          {/* Up Next section */}
          <div>
            <div className="h-4 w-28 bg-zinc-800 rounded mb-4" />
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/50 p-4 space-y-3">
                <div className="h-4 w-36 bg-zinc-800 rounded" />
                <div className="h-3.5 w-24 bg-zinc-800 rounded" />
              </div>
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/50 p-4 space-y-3">
                <div className="h-4 w-28 bg-zinc-800 rounded" />
                <div className="h-3.5 w-28 bg-zinc-800 rounded" />
              </div>
            </div>
          </div>

          {/* Handled section */}
          <div>
            <div className="h-4 w-24 bg-zinc-800 rounded mb-4" />
            <div className="space-y-3 opacity-40">
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/50 p-4 space-y-3">
                <div className="h-4 w-32 bg-zinc-800 rounded" />
                <div className="h-3.5 w-20 bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
