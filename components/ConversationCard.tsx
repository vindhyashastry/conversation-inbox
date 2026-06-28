import { Conversation } from "@/types/conversation";
import { useState, useEffect } from "react";

type ActionState = {
  status: "idle" | "pending" | "failed";
  failureCount: number;
} | null;

type ConversationCardProps = {
  conversation: Conversation;
  actionState: ActionState;
  onResolve: () => void;
  onReassign: () => void;
  onSkip: (reason: string) => void;
};

export function ConversationCard({
  conversation,
  actionState,
  onResolve,
  onReassign,
  onSkip,
}: ConversationCardProps) {
  const isPending = actionState?.status === "pending";
  const isFailed = actionState?.status === "failed";
  const [isPickingSkipReason, setIsPickingSkipReason] = useState(false);

  useEffect(() => {
    if (!conversation || isPending) return;

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (isPickingSkipReason) {
        if (event.key === "1") {
          event.preventDefault();
          onSkip("not my area");
          setIsPickingSkipReason(false);
        } else if (event.key === "2") {
          event.preventDefault();
          onSkip("need more context");
          setIsPickingSkipReason(false);
        } else if (event.key === "3") {
          event.preventDefault();
          onSkip("escalating further");
          setIsPickingSkipReason(false);
        } else if (event.key === "Escape") {
          event.preventDefault();
          setIsPickingSkipReason(false);
        }
      } else {
        if (event.key === "r" || event.key === "R") {
          event.preventDefault();
          onResolve();
        } else if (event.key === "a" || event.key === "A") {
          event.preventDefault();
          onReassign();
        } else if (event.key === "s" || event.key === "S") {
          event.preventDefault();
          setIsPickingSkipReason(true);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [conversation, isPending, isPickingSkipReason, onResolve, onReassign, onSkip]);

  if (!conversation) return null;

  // Urgency classification helper
  function getUrgencyLabel(score: number) {
    if (score >= 80) return "Critical Priority";
    if (score >= 50) return "Medium Priority";
    return "Low Priority";
  }

  // Channel helper
  function getChannelIcon(channel: "chat" | "email" | "voice") {
    switch (channel) {
      case "chat":
        return (
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case "email":
        return (
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "voice":
        return (
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
    }
  }

  // Customer Tier helper
  function getTierBadge(tier: "enterprise" | "standard") {
    if (tier === "enterprise") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.05)]">
          👑 Enterprise
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-xs font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/50 px-2.5 py-0.5 rounded-full">
        Standard
      </span>
    );
  }

  return (
    <div className="flex-1 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl relative overflow-hidden transition-all duration-200 animate-slide-in">
      {/* Glow background accents */}
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-yellow-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-indigo-500/5 blur-3xl" />

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <p className="text-xl font-bold text-white tracking-tight">{conversation.customerName}</p>
            {getTierBadge(conversation.customerTier)}
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-sm text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
              {getChannelIcon(conversation.channel)}
              <span className="capitalize">{conversation.channel}</span>
            </span>
          </div>
        </div>

        Urgency Score Pill Badge
        <div className="flex flex-col items-end gap-1">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs bg-zinc-950/80 shadow-sm ${
            conversation.urgencyScore >= 80
              ? "text-rose-400 border-rose-500/20"
              : conversation.urgencyScore >= 50
              ? "text-amber-300 border-amber-500/20"
              : "text-indigo-400 border-indigo-500/20"
          }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                conversation.urgencyScore >= 80
                  ? "bg-rose-400"
                  : conversation.urgencyScore >= 50
                  ? "bg-amber-400"
                  : "bg-indigo-400"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                conversation.urgencyScore >= 80
                  ? "bg-rose-500"
                  : conversation.urgencyScore >= 50
                  ? "bg-amber-500"
                  : "bg-indigo-500"
              }`}></span>
            </span>
            <span>Urgency Score: {conversation.urgencyScore}</span>
          </div>
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mr-1">
            {getUrgencyLabel(conversation.urgencyScore)}
          </span>
        </div>
      </div>

      {/* Linear Urgency Progress Meter (Spacious & Clean) */}
      <div className="mt-5 bg-zinc-950/40 border border-zinc-800/50 rounded-xl p-3.5 shadow-inner">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Priority Level Gauge
          </span>
          <span className={`font-bold ${
            conversation.urgencyScore >= 80 ? "text-rose-400" : conversation.urgencyScore >= 50 ? "text-amber-300" : "text-indigo-400"
          }`}>{conversation.urgencyScore}% urgency</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden relative shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              conversation.urgencyScore >= 80
                ? "bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                : conversation.urgencyScore >= 50
                ? "bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                : "bg-gradient-to-r from-indigo-500 to-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            }`}
            style={{ width: `${conversation.urgencyScore}%` }}
          />
        </div>
      </div>

      {/* Why This One is First (Alert Callout) */}
      <div className="mt-6 rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4 flex gap-3 items-start shadow-inner">
        <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs font-bold text-yellow-400/90 uppercase tracking-widest">
            Priority Escalation Reason
          </p>
          <p className="mt-1.5 text-sm text-zinc-300 font-medium leading-relaxed">{conversation.reason}</p>
        </div>
      </div>

      {/* Customer message container */}
      <div className="mt-6 border-t border-zinc-800/80 pt-6">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Customer&apos;s Last Message</p>
        <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800/60 shadow-inner relative overflow-hidden group hover:border-zinc-700 transition-colors">
          {/* <div className="absolute top-2 right-2 text-[10px] font-mono text-zinc-700 select-none">MSG_BODY</div> */}
          <p className="text-sm font-mono text-zinc-300 leading-relaxed italic pr-8">
            &quot;{conversation.lastMessage}&quot;
          </p>
        </div>
      </div>

      {/* Error Callout */}
      {isFailed && (
        <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex gap-3 items-center">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm font-semibold text-red-400">
            Action failed. Please retry resolve/reassign below.
          </p>
        </div>
      )}

      {/* Action Row */}
      {isPickingSkipReason ? (
        <div className="mt-8 flex flex-col gap-4 border-t border-zinc-800/80 pt-6 animate-fade-in">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Choose a skip reason
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                onSkip("not my area");
                setIsPickingSkipReason(false);
              }}
              className="btn-entrance btn-entrance-1 btn-glow group relative rounded-xl border border-zinc-700/60 px-4 py-3.5 text-sm font-semibold text-zinc-300 bg-gradient-to-b from-zinc-900 to-zinc-950 hover:from-zinc-800 hover:to-zinc-900 hover:text-white hover:border-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-1 focus:ring-offset-zinc-900 active:scale-[0.97]"
            >
              <span className="flex flex-col items-center gap-2">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-amber-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span>Not my area</span>
                <kbd className="bg-zinc-800/80 px-2 py-0.5 rounded-md text-[10px] text-zinc-500 border border-zinc-700/50 font-mono group-hover:text-amber-400/70 group-hover:border-amber-500/20 transition-colors">1</kbd>
              </span>
            </button>
            <button
              onClick={() => {
                onSkip("need more context");
                setIsPickingSkipReason(false);
              }}
              className="btn-entrance btn-entrance-2 btn-glow group relative rounded-xl border border-zinc-700/60 px-4 py-3.5 text-sm font-semibold text-zinc-300 bg-gradient-to-b from-zinc-900 to-zinc-950 hover:from-zinc-800 hover:to-zinc-900 hover:text-white hover:border-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-1 focus:ring-offset-zinc-900 active:scale-[0.97]"
            >
              <span className="flex flex-col items-center gap-2">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span>Need context</span>
                <kbd className="bg-zinc-800/80 px-2 py-0.5 rounded-md text-[10px] text-zinc-500 border border-zinc-700/50 font-mono group-hover:text-blue-400/70 group-hover:border-blue-500/20 transition-colors">2</kbd>
              </span>
            </button>
            <button
              onClick={() => {
                onSkip("escalating further");
                setIsPickingSkipReason(false);
              }}
              className="btn-entrance btn-entrance-3 btn-glow group relative rounded-xl border border-zinc-700/60 px-4 py-3.5 text-sm font-semibold text-zinc-300 bg-gradient-to-b from-zinc-900 to-zinc-950 hover:from-zinc-800 hover:to-zinc-900 hover:text-white hover:border-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-1 focus:ring-offset-zinc-900 active:scale-[0.97]"
            >
              <span className="flex flex-col items-center gap-2">
                <svg className="w-5 h-5 text-zinc-500 group-hover:text-rose-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span>Escalate</span>
                <kbd className="bg-zinc-800/80 px-2 py-0.5 rounded-md text-[10px] text-zinc-500 border border-zinc-700/50 font-mono group-hover:text-rose-400/70 group-hover:border-rose-500/20 transition-colors">3</kbd>
              </span>
            </button>
          </div>
          <button
            onClick={() => setIsPickingSkipReason(false)}
            className="group flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-200 self-center transition-all duration-200 focus:outline-none mt-1 px-4 py-2 rounded-lg hover:bg-zinc-800/50"
          >
            <svg className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
            <kbd className="bg-zinc-800/80 px-1.5 py-0.5 rounded-md text-[10px] text-zinc-600 border border-zinc-700/50 font-mono group-hover:text-zinc-400 transition-colors">Esc</kbd>
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-zinc-800/80 pt-6">
        
          <button
            onClick={onResolve}
            disabled={isPending}
            className="btn-entrance btn-entrance-1 btn-glass group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-3.5 text-sm font-bold text-white hover:bg-white/[0.18] hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-300 active:scale-[0.97] shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Working…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {isFailed ? "Retry Resolve" : "Resolve"}
                <kbd className="bg-white/10 px-1.5 py-0.5 rounded-md text-[10px] font-mono border border-white/15 text-white/70">R</kbd>
              </span>
            )}
          </button>

          {/* Reassign — Secondary */}
          <button
            onClick={onReassign}
            disabled={isPending}
            className="btn-entrance btn-entrance-2 btn-glow group relative rounded-xl border border-zinc-700/60 px-5 py-3.5 text-sm font-semibold text-zinc-300 bg-gradient-to-b from-zinc-900 to-zinc-950 hover:from-zinc-800 hover:to-zinc-900 hover:text-white hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-1 focus:ring-offset-zinc-900 transition-all duration-200 active:scale-[0.97]"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Working…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                {isFailed ? "Retry Reassign" : "Reassign"}
                <kbd className="bg-zinc-800/80 px-1.5 py-0.5 rounded-md text-[10px] text-zinc-500 font-mono border border-zinc-700/50 group-hover:text-zinc-300 transition-colors">A</kbd>
              </span>
            )}
          </button>

          {/* Skip — Tertiary */}
          <button
            onClick={() => setIsPickingSkipReason(true)}
            disabled={isPending}
            className="btn-entrance btn-entrance-3 btn-glow group relative rounded-xl border border-zinc-700/60 px-5 py-3.5 text-sm font-semibold text-zinc-400 bg-gradient-to-b from-zinc-900 to-zinc-950 hover:from-zinc-800 hover:to-zinc-900 hover:text-zinc-200 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-1 focus:ring-offset-zinc-900 transition-all duration-200 active:scale-[0.97]"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811V8.69zM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061a1.125 1.125 0 01-1.683-.977V8.69z" />
              </svg>
              Skip
              <kbd className="bg-zinc-800/80 px-1.5 py-0.5 rounded-md text-[10px] text-zinc-500 font-mono border border-zinc-700/50 group-hover:text-zinc-300 transition-colors">S</kbd>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}