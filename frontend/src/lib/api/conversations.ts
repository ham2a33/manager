import { apiClient } from "@/lib/api/client";
import type { ConversationCreate, ConversationResponse, MessageResponse } from "@/lib/api/types";

// Maps to backend/app/api/v1/conversation.py -> GET /conversations
export async function listConversations(): Promise<ConversationResponse[]> {
  const { data } = await apiClient.get<ConversationResponse[]>("/conversations");
  return data;
}

// POST /conversations
export async function createConversation(
  payload: ConversationCreate
): Promise<ConversationResponse> {
  const { data } = await apiClient.post<ConversationResponse>("/conversations", payload);
  return data;
}

// GET /conversations/{conversation_id}
export async function getConversation(conversationId: string): Promise<ConversationResponse> {
  const { data } = await apiClient.get<ConversationResponse>(`/conversations/${conversationId}`);
  return data;
}

// GET /conversations/{conversation_id}/messages
export async function listMessages(conversationId: string): Promise<MessageResponse[]> {
  const { data } = await apiClient.get<MessageResponse[]>(
    `/conversations/${conversationId}/messages`
  );
  return data;
}

// POST /conversations/{conversation_id}/summary
export async function summarizeConversation(conversationId: string): Promise<{ summary: string }> {
  const { data } = await apiClient.post<{ summary: string }>(
    `/conversations/${conversationId}/summary`
  );
  return data;
}
