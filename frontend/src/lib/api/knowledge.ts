import { apiClient } from "@/lib/api/client";
import type {
  KnowledgeChunkResponse,
  KnowledgeChunkSearchResult,
  KnowledgeCreate,
  KnowledgeResponse,
  KnowledgeSearchRequest,
} from "@/lib/api/types";

export async function listKnowledge(): Promise<KnowledgeResponse[]> {
  const { data } = await apiClient.get<KnowledgeResponse[]>("/knowledge");
  return data;
}

// POST /knowledge (manual text entry: title + content)
export async function createKnowledgeDocument(
  payload: KnowledgeCreate
): Promise<KnowledgeResponse> {
  const { data } = await apiClient.post<KnowledgeResponse>("/knowledge", payload);
  return data;
}

// POST /knowledge/upload (multipart/form-data)
// Backend extracts text (PDF/DOCX/TXT/MD), chunks it, and stores document + chunks.
export async function uploadKnowledgeDocument(file: File): Promise<KnowledgeResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<KnowledgeResponse>("/knowledge/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// GET /knowledge/{id}/chunks
export async function getKnowledgeChunks(documentId: string): Promise<KnowledgeChunkResponse[]> {
  const { data } = await apiClient.get<KnowledgeChunkResponse[]>(
    `/knowledge/${documentId}/chunks`
  );
  return data;
}

// POST /knowledge/search (legacy document-level search, kept for compatibility)
export async function searchKnowledge(
  payload: KnowledgeSearchRequest
): Promise<KnowledgeResponse[]> {
  const { data } = await apiClient.post<KnowledgeResponse[]>("/knowledge/search", payload);
  return data;
}

// GET /knowledge/search?q=&limit= (chunk-level ILIKE search; foundation for future Qdrant search)
export async function searchKnowledgeChunks(
  query: string,
  limit = 5
): Promise<KnowledgeChunkSearchResult[]> {
  const { data } = await apiClient.get<KnowledgeChunkSearchResult[]>("/knowledge/search", {
    params: { q: query, limit },
  });
  return data;
}

export async function deleteKnowledgeDocument(id: string): Promise<void> {
  await apiClient.delete(`/knowledge/${id}`);
}
