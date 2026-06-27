import { http, HttpResponse, delay } from "msw";
import { mockConversations } from "./conversation";
import { Conversation } from "@/types/conversation";

// MSW's own mutable copy — this is now the "source of truth" while the app is running.
// A fresh copy is made from the original mock data so re-running the dev server resets it.
let conversations: Conversation[] = [...mockConversations];

export const handlers = [
  http.get("/api/conversations", async () => {
    await delay(300);
    return HttpResponse.json(conversations);
  }),
  http.patch("/api/conversations/:id/action", async ({ params, request }) => {
  await delay(300);

  const body = await request.json() as { action: "resolve" | "reassign" };
  const { id } = params;

  const shouldFail = Math.random() < 0.3;

  if (shouldFail) {
    return new HttpResponse(null, { status: 500 });
  }

  const newStatus = body.action === "resolve" ? "resolved" : "in_review";

  conversations = conversations.map((c) =>
    c.id === id ? { ...c, status: newStatus } : c
  );

  return HttpResponse.json({ success: true, id, status: newStatus });
}),
http.patch("/api/conversations/:id/flag-failure", async ({ params }) => {
  await delay(150);
  const { id } = params;

  conversations = conversations.map((c) =>
    c.id === id ? { ...c, previousFailureCount: c.previousFailureCount + 1 } : c
  );

  return HttpResponse.json({ success: true });
}),
http.patch("/api/conversations/:id/skip", async ({ params, request }) => {
  await delay(200);

  const body = await request.json() as { skipReason: string };
  const { id } = params;

  conversations = conversations.map((c) =>
    c.id === id ? { ...c, status: "skipped", skipReason: body.skipReason } : c
  );

  return HttpResponse.json({ success: true });
}),
];