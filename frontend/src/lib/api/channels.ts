import { apiClient } from "@/lib/api/client";

export interface ChannelConfig {
  id: string;
  company_id: string;
  platform: "telegram" | "whatsapp" | "instagram";
  external_id: string | null;
  status: "connected" | "disconnected";
  created_at: string;
  updated_at: string;
}

export async function listChannels(): Promise<ChannelConfig[]> {
  const { data } = await apiClient.get<ChannelConfig[]>("/channels");
  return data;
}

export async function createChannel(payload: {
  platform: string;
  external_id?: string | null;
  status?: string;
}): Promise<ChannelConfig> {
  const { data } = await apiClient.post<ChannelConfig>("/channels", payload);
  return data;
}

export async function updateChannel(
  id: string,
  payload: { platform?: string; external_id?: string | null; status?: string }
): Promise<ChannelConfig> {
  const { data } = await apiClient.patch<ChannelConfig>(`/channels/${id}`, payload);
  return data;
}

export async function deleteChannel(id: string): Promise<void> {
  await apiClient.delete(`/channels/${id}`);
}
