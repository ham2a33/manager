import { apiClient } from "@/lib/api/client";
import type { AIProvidersResponse, AIRequest, AIResponse } from "@/lib/api/types";

// Maps to backend/app/api/v1/ai.py -> POST /ai/complete
export async function completeWithAI(payload: AIRequest): Promise<AIResponse> {
  const { data } = await apiClient.post<AIResponse>("/ai/complete", payload);
  return data;
}

// GET /ai/providers
export async function listAIProviders(): Promise<AIProvidersResponse> {
  const { data } = await apiClient.get<AIProvidersResponse>("/ai/providers");
  return data;
}
