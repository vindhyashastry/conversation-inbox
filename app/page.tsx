import { ConversationCard } from "@/components/ConversationCard";
import { QueueRail } from "@/components/QueueRail";
import { mockConversations } from "@/mocks/conversation";

export default function Home() {
  const activeConversation = mockConversations[0];
  const upNext = mockConversations.slice(1);

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <h1 className="text-lg font-semibold text-zinc-900 mb-1">Conversation Inbox</h1>
      <p className="text-sm text-zinc-500 mb-6">
        {mockConversations.length} conversations need you
      </p>

      <div className="flex gap-6 items-start">
        <ConversationCard conversation={activeConversation} />
        <QueueRail conversations={upNext} />
      </div>
    </main>
  );
}