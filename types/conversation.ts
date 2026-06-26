export type Conversation = {
    id: string;
    customerName: string;
    customerTier:"enterprise" | "standard";

    channel: "email" | "chat" | "voice";

    lastMessage: string;
    waitingSinceMinutes: number;

    urgencyScore: number;
    reason:string;

    status: "queued" |"in_review" | "resolved"|"skipped";

    previousFailureCount: number;
    skipReason?: string;
};