import { Conversation } from "@/types/conversation";

type QueueRailProps = {
  conversations: Conversation[];
};

export function QueueRail({ conversations }: QueueRailProps) {
  return (
    <div className="flex flex-col gap-2 w-56">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <p className="text-sm font-medium text-zinc-800">{conversation.customerName}</p>
          <p className="text-xs text-zinc-500">{conversation.waitingSinceMinutes} min · {conversation.channel}</p>
        </div>
      ))}
    </div>
  );
}