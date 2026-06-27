import { http, HttpResponse, delay } from "msw";
import { mockConversations } from "./conversation";

export const handlers = [
  http.get("/api/conversations", async () => {
    await delay(300);
    return HttpResponse.json(mockConversations);
  }),
];