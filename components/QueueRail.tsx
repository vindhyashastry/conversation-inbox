import { Conversation } from "@/types/conversation";

type QueueRailProps = {
  upNext: Conversation[];
  handled: Conversation[];
};

export function QueueRail({ upNext, handled }: QueueRailProps) {
  // Channel icon helper
  function getChannelIcon(channel: "chat" | "email" | "voice") {
    switch (channel) {
      case "chat":
        return (
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case "email":
        return (
          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "voice":
        return (
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
    }
  }

  return (
    <div className="flex gap-5 shrink-0">
      {/* Up Next Column */}
      <div className="w-64">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
          Up Next ({upNext.length})
        </h3>
        <div className="flex flex-col gap-2.5">
          {upNext.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 px-4 py-6 text-center text-xs text-zinc-500 font-medium">
              No pending conversations.
            </div>
          ) : (
            upNext.map((conversation) => (
              <div
                key={conversation.id}
                className="rounded-xl border border-yellow-500/50 bg-zinc-900 px-4 py-3 shadow-md hover:border-yellow-400 transition-all duration-200 hover:-translate-y-0.5 group animate-slide-in"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {conversation.customerName}
                  </p>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      conversation.urgencyScore >= 80
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : conversation.urgencyScore >= 50
                        ? "bg-amber-400/10 text-amber-300 border border-amber-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    }`}
                  >
                    {conversation.urgencyScore}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-2.5 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850">
                    {getChannelIcon(conversation.channel)}
                    <span className="capitalize">{conversation.channel}</span>
                  </span>
                  <span>Waiting {conversation.waitingSinceMinutes}m</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Handled Column */}
      <div className="w-64">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
          Handled ({handled.length})
        </h3>
        <div className="flex flex-col gap-2.5">
          {handled.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 px-4 py-6 text-center text-xs text-zinc-500 font-medium">
              No handled conversations yet.
            </div>
          ) : (
            handled.map((conversation) => (
              <div
                key={conversation.id}
                className="rounded-xl border border-yellow-500/30 bg-zinc-950/60 px-4 py-3 opacity-55 hover:opacity-85 hover:border-yellow-500/50 transition-all duration-200 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-zinc-400">{conversation.customerName}</p>
                  {conversation.status === "resolved" ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      ✓ Resolved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                      ↷ Skipped
                    </span>
                  )}
                </div>
                {conversation.status === "skipped" && conversation.skipReason && (
                  <p className="text-[11px] font-medium text-zinc-500 mt-2 italic pl-2.5 border-l border-zinc-800">
                    Reason: {conversation.skipReason}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}