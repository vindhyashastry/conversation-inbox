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
];