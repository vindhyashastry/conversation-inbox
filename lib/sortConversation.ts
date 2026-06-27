import { Conversation } from "@/types/conversation";

const ENTERPRISE_TIEBREAKER_BOOST = 5;

function getSortScore(conversation: Conversation): number {
  const tierBoost = conversation.customerTier === "enterprise" ? ENTERPRISE_TIEBREAKER_BOOST : 0;
  return conversation.urgencyScore + tierBoost;
}

export function sortConversation(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => getSortScore(b) - getSortScore(a));
  
}
// TEMP: manual check, remove after confirming
import { mockConversations } from "@/mocks/conversation";
console.log(
  sortConversation(mockConversations).map((c) => `${c.customerName} (${c.customerTier}, score ${c.urgencyScore})`)
);