import { Conversation } from "@/types/conversation";
import { useState } from "react";

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

      {isFailed && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
          <p className="text-sm text-red-700">
            That didn't go through. Want to try again?
          </p>
        </div>
      )}

      {isPickingSkipReason ? (
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-xs text-zinc-500">Why are you skipping this one?</p>
          <div className="flex gap-2">
            <button
              onClick={() => onSkip("not my area")}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700"
            >
              Not my area
            </button>
            <button
              onClick={() => onSkip("need more context")}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700"
            >
              Need more context
            </button>
            <button
              onClick={() => onSkip("escalating further")}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700"
            >
              Escalating further
            </button>
          </div>
          <button
            onClick={() => setIsPickingSkipReason(false)}
            className="text-xs text-zinc-400 self-start"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="mt-5 flex gap-2">
          <button
            onClick={onResolve}
            disabled={isPending}
            className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isPending ? "Working..." : isFailed ? "Retry Resolve · R" : "Resolve · R"}
          </button>
          <button
            onClick={onReassign}
            disabled={isPending}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50"
          >
            {isPending ? "Working..." : isFailed ? "Retry Reassign · A" : "Reassign · A"}
          </button>
          <button
            onClick={() => setIsPickingSkipReason(true)}
            disabled={isPending}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-500 disabled:opacity-50"
          >
            Skip · S
          </button>
        </div>
      )}
    </div>
  );
}