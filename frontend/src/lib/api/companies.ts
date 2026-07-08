import { apiClient } from "@/lib/api/client";
import type { CompanyResponse } from "@/lib/api/types";

export async function getCompany(companyId: string): Promise<CompanyResponse> {
  const { data } = await apiClient.get<CompanyResponse>(`/companies/${companyId}`);
  return data;
}

export interface CompanySettingsUpdate {
  name?: string;
  email?: string;
  phone?: string;
  language?: string;
  prompt?: string;
  ai_prompt?: string;
}

export async function updateCompanySettings(
  companyId: string,
  payload: CompanySettingsUpdate
): Promise<CompanyResponse> {
  const { data } = await apiClient.patch<CompanyResponse>(`/companies/${companyId}`, payload);
  return data;
}
