/**
 * These types mirror the backend API contracts under backend/app/api/v1/schemas.py.
 */

export type ChannelType = "telegram" | "instagram" | "whatsapp" | "website";

// ---- auth.py / schemas.py ----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  company_id: string;
  role: string;
}

// ---- company.py ----
export interface CompanyResponse {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  status?: string;
  email?: string | null;
  phone?: string | null;
  language?: string | null;
  ai_prompt?: string | null;
  created_at: string;
  updated_at?: string | null;
}

// ---- conversation.py ----
export interface ConversationCreate {
  customer_external_id: string;
  channel: ChannelType;
  text: string;
}

export interface ConversationResponse {
  id: string;
  company_id: string;
  customer_external_id: string;
  channel: string;
  status: string;
  ai_enabled: boolean;
  summary: string;
  created_at: string;
  updated_at: string;
}

// ---- message.py ----
export interface MessageCreate {
  text: string;
  sender?: string;
  use_ai?: boolean;
}

export interface MessageResponse {
  id: string;
  conversation_id: string;
  direction: "inbound" | "outbound" | string;
  sender: string;
  text: string;
  created_at: string;
}

// ---- ai.py ----
export interface AIRequest {
  prompt: string;
  provider?: string;
  model?: string;
  company_id?: string;
}

export interface AIResponse {
  provider: string;
  model: string;
  answer: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
}

export interface AIProvidersResponse {
  default: string;
  available: string[];
}

// ---- knowledge.py ----
export interface KnowledgeCreate {
  title: string;
  content: string;
}

export interface KnowledgeSearchRequest {
  query: string;
  limit?: number;
}

export type KnowledgeSourceType = "manual" | "pdf" | "docx" | "txt" | "md";

export interface KnowledgeResponse {
  id: string;
  title: string;
  content: string;
  source_type: KnowledgeSourceType;
  original_filename: string | null;
  created_at: string;
}

export interface KnowledgeChunkResponse {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  created_at: string;
}

export interface KnowledgeChunkSearchResult {
  document: KnowledgeResponse;
  chunk: KnowledgeChunkResponse;
  score: number;
}

// ---- statistics.py ----
export interface StatisticsOverview {
  conversations: number;
  messages: number;
  open_conversations: number;
}

// ---- subscription.py ----
export interface SubscriptionCurrent {
  plan: string;
  status: string;
  limits: {
    conversations: number;
    knowledge_documents: number;
  };
}

// ---- webhooks.py ----
export interface WebhookMessage {
  channel: ChannelType;
  external_user_id: string;
  text: string;
}

export interface ClientRecord {
  id: string;
  company_id: string;
  external_user_id: string;
  channel: string;
  phone: string | null;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}
