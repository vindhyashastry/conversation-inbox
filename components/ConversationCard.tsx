import { Conversation } from "@/types/conversation";

type ConversationCardProps = {
  conversation: Conversation;
};

export function ConversationCard({ conversation }: ConversationCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 max-w-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-zinc-900">{conversation.customerName}</p>
          <p className="text-sm text-zinc-500">{conversation.customerTier} · {conversation.channel}</p>
        </div>
        <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
          {conversation.waitingSinceMinutes} min
        </span>
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
          Why this one's first
        </p>
        <p className="mt-1 text-sm text-zinc-800">{conversation.reason}</p>
      </div>
      <div className="mt-4 border-t border-zinc-100 pt-4">
  <p className="text-sm text-zinc-700 italic">"{conversation.lastMessage}"</p>
</div>

{/* buttons */}
<div className="mt-5 flex gap-2">
  <button className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
    Resolve · R
  </button>
  <button className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700">
    Reassign · A
  </button>
  <button className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-500">
    Skip · S
  </button>
</div>
    </div>
  );
}