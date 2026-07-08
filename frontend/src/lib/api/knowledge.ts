import { apiClient } from "@/lib/api/client";
import type { KnowledgeCreate, KnowledgeResponse, KnowledgeSearchRequest } from "@/lib/api/types";

// Maps to backend/app/api/v1/knowledge.py -> GET /knowledge
export async function listKnowledge(): Promise<KnowledgeResponse[]> {
  const { data } = await apiClient.get<KnowledgeResponse[]>("/knowledge");
  return data;
}

// POST /knowledge
// NOTE: the backend only accepts { title, content } text (KnowledgeCreate in
// schemas.py). There is no multipart/file upload route - documents are
// stored as plain text rows (backend/app/database/models/domain.py ->
// KnowledgeDocument.content: Text). The Knowledge page reads the uploaded
// file's text content client-side and sends it as `content` here.
export async function createKnowledgeDocument(
  payload: KnowledgeCreate
): Promise<KnowledgeResponse> {
  const { data } = await apiClient.post<KnowledgeResponse>("/knowledge", payload);
  return data;
}

// POST /knowledge/search
export async function searchKnowledge(
  payload: KnowledgeSearchRequest
): Promise<KnowledgeResponse[]> {
  const { data } = await apiClient.post<KnowledgeResponse[]>("/knowledge/search", payload);
  return data;
}

/**
 * TODO(backend): there is no DELETE /knowledge/{id} endpoint in
 * app/api/v1/knowledge.py yet. Wire this up once it exists.
 */
export async function deleteKnowledgeDocument(_id: string): Promise<never> {
  throw new Error(
    "NOT_IMPLEMENTED: backend has no DELETE /knowledge/{id} endpoint yet. See app/api/v1/knowledge.py."
  );
}
