"use client";

import { useEffect, useState } from "react";
import { ConversationCard } from "@/components/ConversationCard";
import { QueueRail } from "@/components/QueueRail";
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
// console.log(sortConversation(conversations).map((c) => c.customerName));
  if (error) {
    return <p className="p-8 text-sm text-red-600">Something went wrong loading conversations.</p>;
  }

  if (!conversations) {
    return <p className="p-8 text-sm text-zinc-500">Loading conversations...</p>;
  }
const active = conversations.filter((c) => c.status === "queued" || c.status === "in_review");
const handled = conversations.filter((c) => c.status === "resolved" || c.status === "skipped");

const sortedActive = sortConversation(active);
const activeConversation = sortedActive[0];
const upNext = sortedActive.slice(1);

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <h1 className="text-lg font-semibold text-zinc-900 mb-1">Conversation Inbox</h1>
      <p className="text-sm text-zinc-500 mb-6">
        {conversations.length} conversations need you
      </p>

      <div className="flex gap-6 items-start">
<ConversationCard
  conversation={activeConversation}
  actionState={actionState}
  onResolve={() => handleAction(activeConversation.id, "resolve")}
  onReassign={() => handleAction(activeConversation.id, "reassign")}
onSkip={(reason) => handleSkip(activeConversation.id, reason)}
/>
       <QueueRail upNext={upNext} handled={handled} />
      </div>
    </main>
  );
}