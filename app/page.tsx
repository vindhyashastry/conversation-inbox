"use client";

import { useEffect, useState } from "react";
import { ConversationCard } from "@/components/ConversationCard";
import { QueueRail } from "@/components/QueueRail";
import { Conversation } from "@/types/conversation";
import { sortConversation } from "@/lib/sortConversation";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [error, setError] = useState(false);

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
// console.log(sortConversation(conversations).map((c) => c.customerName));
  if (error) {
    return <p className="p-8 text-sm text-red-600">Something went wrong loading conversations.</p>;
  }

  if (!conversations) {
    return <p className="p-8 text-sm text-zinc-500">Loading conversations...</p>;
  }

  const sorted = sortConversation(conversations);
  const activeConversation = sorted[0];
  const upNext = sorted.slice(1);

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <h1 className="text-lg font-semibold text-zinc-900 mb-1">Conversation Inbox</h1>
      <p className="text-sm text-zinc-500 mb-6">
        {conversations.length} conversations need you
      </p>

      <div className="flex gap-6 items-start">
        <ConversationCard conversation={activeConversation} />
        <QueueRail conversations={upNext} />
      </div>
    </main>
  );
}