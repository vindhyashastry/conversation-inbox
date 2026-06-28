"use client";

import { useEffect, useState } from "react";
import { ConversationCard } from "@/components/ConversationCard";
import { QueueRail } from "@/components/QueueRail";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Conversation } from "@/types/conversation";
import { sortConversation } from "@/lib/sortConversation";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [error, setError] = useState(false);
  const [actionState, setActionState] = useState<{
  status: "idle" | "pending" | "failed";
  failureCount: number;
} | null>(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await fetch("/api/conversations");
        if (!res.ok) throw new Error("Request failed");
        const data: Conversation[] = await res.json();
        setConversations(data);
      } catch {
        setError(true);
      }
    }

    loadConversations();
  }, []);

async function handleAction(id: string, action: "resolve" | "reassign") {
  setActionState({ status: "pending", failureCount: actionState?.failureCount ?? 0 });

  try {
    const res = await fetch(`/api/conversations/${id}/action`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      throw new Error("Action failed");
    }

    const refreshed = await fetch("/api/conversations");
    const data: Conversation[] = await refreshed.json();
    setConversations(data);
    setActionState(null);
  } catch {
    const currentFailures = (actionState?.failureCount ?? 0) + 1;

    if (currentFailures >= 2) {
      await fetch(`/api/conversations/${id}/flag-failure`, { method: "PATCH" });

      const refreshed = await fetch("/api/conversations");
      const data: Conversation[] = await refreshed.json();
      setConversations(data);
      setActionState(null);
    } else {
      setActionState({ status: "failed", failureCount: currentFailures });
    }
  }
}
async function handleSkip(id: string, reason: string) {
  await fetch(`/api/conversations/${id}/skip`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skipReason: reason }),
  });

  const refreshed = await fetch("/api/conversations");
  const data: Conversation[] = await refreshed.json();
  setConversations(data);
}

async function handleReset() {
  await fetch("/api/conversations/reset", { method: "POST" });
  const refreshed = await fetch("/api/conversations");
  const data: Conversation[] = await refreshed.json();
  setConversations(data);
}
// console.log(sortConversation(conversations).map((c) => c.customerName));
  if (error) {
    return <p className="p-8 text-sm text-red-600">Something went wrong loading conversations.</p>;
  }

  if (!conversations) {
    return <LoadingSkeleton />;
  }
const active = conversations.filter((c) => c.status === "queued" || c.status === "in_review");
const handled = conversations.filter((c) => c.status === "resolved" || c.status === "skipped");

const resolvedCount = handled.filter((c) => c.status === "resolved").length;
const skippedCount = handled.filter((c) => c.status === "skipped").length;

const sortedActive = sortConversation(active);
const activeConversation = sortedActive[0];
const upNext = sortedActive.slice(1);

// Queue Health: urgency breakdown counts
const criticalCount = active.filter((c) => c.urgencyScore >= 80).length;
const mediumCount = active.filter((c) => c.urgencyScore >= 50 && c.urgencyScore < 80).length;
const lowCount = active.filter((c) => c.urgencyScore < 50).length;
const totalActive = active.length;

  return (
    <main className="flex-1 flex flex-col bg-zinc-950 text-zinc-100 px-10 py-8 w-full">
      {/* Premium Dashboard Header Nav */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800/80 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.7)]" />
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              yellow.ai <span className="text-zinc-500 font-normal">|</span> <span className="text-zinc-300">Triage Inbox</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1 max-w-md">
            AI-escalated conversations, sorted by urgency. Act on the most critical one first ; The system handles prioritization so you don&apos;t have to.
          </p>
        </div>

        {/* Dashboard Status / Metrics Panel */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Queue Health Breakdown */}
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-2 shadow-md">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Queue Health</span>
            {totalActive > 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex h-2.5 w-24 rounded-full overflow-hidden bg-zinc-800">
                  {criticalCount > 0 && (
                    <div
                      className="bg-rose-500 transition-all duration-300"
                      style={{ width: `${(criticalCount / totalActive) * 100}%` }}
                    />
                  )}
                  {mediumCount > 0 && (
                    <div
                      className="bg-amber-400 transition-all duration-300"
                      style={{ width: `${(mediumCount / totalActive) * 100}%` }}
                    />
                  )}
                  {lowCount > 0 && (
                    <div
                      className="bg-indigo-400 transition-all duration-300"
                      style={{ width: `${(lowCount / totalActive) * 100}%` }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />{criticalCount}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{mediumCount}
                  </span>
                  <span className="flex items-center gap-1 text-indigo-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />{lowCount}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-400">Clear ✓</span>
            )}
          </div>

          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800/80 rounded-xl px-4 py-1.5 shadow-md text-xs font-semibold">
            <div className="text-zinc-400">
              Active: <span className="text-yellow-400 font-bold ml-0.5">{active.length}</span>
            </div>
            <div className="w-px h-3 bg-zinc-800" />
            <div className="text-zinc-400">
              Handled: <span className="text-white font-bold ml-0.5">{handled.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        <div className="flex-1 w-full min-w-0">
          {activeConversation ? (
            <ConversationCard
              conversation={activeConversation}
              actionState={actionState}
              onResolve={() => handleAction(activeConversation.id, "resolve")}
              onReassign={() => handleAction(activeConversation.id, "reassign")}
              onSkip={(reason) => handleSkip(activeConversation.id, reason)}
            />
          ) : (
            <EmptyState
              resolvedCount={resolvedCount}
              skippedCount={skippedCount}
              onReset={handleReset}
            />
          )}
        </div>
        <QueueRail upNext={upNext} handled={handled} />
      </div>

      {/* Keyboard Shortcut Legend */}
      <footer className="mt-10 border-t border-zinc-800/60 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-wider">Keyboard Shortcuts</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <kbd className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-sm">R</kbd>
              <span>Resolve</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-sm">A</kbd>
              <span>Reassign</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-sm">S</kbd>
              <span>Skip</span>
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1.5">
              <kbd className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-sm">1</kbd>
              <kbd className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-sm">2</kbd>
              <kbd className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-sm">3</kbd>
              <span>Skip reasons</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-sm">Esc</kbd>
              <span>Cancel</span>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}