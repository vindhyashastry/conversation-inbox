import { Conversation } from "@/types/conversation";

type QueueRailProps = {
  upNext: Conversation[];
  handled: Conversation[];
};

export function QueueRail({ upNext, handled }: QueueRailProps) {
  return (
    <div className="flex flex-col gap-2 w-56">
      {upNext.map((conversation) => (
        <div key={conversation.id} className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <p className="text-sm font-medium text-zinc-800">{conversation.customerName}</p>
          <p className="text-xs text-zinc-500">{conversation.waitingSinceMinutes} min · {conversation.channel}</p>
        </div>
      ))}

      {handled.length > 0 && (
        <>
          <p className="text-xs text-zinc-400 uppercase tracking-wide mt-3">Handled</p>
          {handled.map((conversation) => (
            <div key={conversation.id} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 opacity-60">
              <p className="text-sm font-medium text-zinc-600">{conversation.customerName}</p>
              <p className="text-xs text-zinc-400">
                {conversation.status === "resolved" ? "Resolved" : `Skipped · ${conversation.skipReason}`}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}