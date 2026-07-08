import { apiClient } from "@/lib/api/client";
import type { MessageCreate, MessageResponse } from "@/lib/api/types";

// Maps to backend/app/api/v1/message.py -> POST /messages/{conversation_id}
// When payload.use_ai is true, the backend generates the reply via AIService
// and stores it with sender="ai" - the frontend does not call /ai/complete
// directly for chat replies, it just sets use_ai and lets the backend do it.
export async function sendMessage(
  conversationId: string,
  payload: MessageCreate
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(`/messages/${conversationId}`, payload);
  return data;
}
