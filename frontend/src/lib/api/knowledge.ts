import { apiClient } from "@/lib/api/client";
import type { KnowledgeCreate, KnowledgeResponse, KnowledgeSearchRequest } from "@/lib/api/types";

export async function listKnowledge(): Promise<KnowledgeResponse[]> {
  const { data } = await apiClient.get<KnowledgeResponse[]>("/knowledge");
  return data;
}

export async function createKnowledgeDocument(
  payload: KnowledgeCreate
): Promise<KnowledgeResponse> {
  const { data } = await apiClient.post<KnowledgeResponse>("/knowledge", payload);
  return data;
}

export async function searchKnowledge(
  payload: KnowledgeSearchRequest
): Promise<KnowledgeResponse[]> {
  const { data } = await apiClient.post<KnowledgeResponse[]>("/knowledge/search", payload);
  return data;
}

export async function deleteKnowledgeDocument(id: string): Promise<void> {
  await apiClient.delete(`/knowledge/${id}`);
}
