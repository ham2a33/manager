import { apiClient } from "@/lib/api/client";
import type { ClientRecord } from "@/lib/api/types";

export async function listCustomers(): Promise<ClientRecord[]> {
  const { data } = await apiClient.get<ClientRecord[]>("/clients");
  return data;
}
