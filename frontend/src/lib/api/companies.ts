import { apiClient } from "@/lib/api/client";
import type { CompanyResponse } from "@/lib/api/types";

// Maps to backend/app/api/v1/company.py -> GET /companies/{company_id}
export async function getCompany(companyId: string): Promise<CompanyResponse> {
  const { data } = await apiClient.get<CompanyResponse>(`/companies/${companyId}`);
  return data;
}

/**
 * TODO(backend): there is no PATCH/PUT /companies/{id} endpoint yet, and the
 * Company model (backend/app/database/models/domain.py) has no email, phone,
 * language, or prompt columns. The Settings > Company form is built against
 * this shape and will call this function once the backend exposes it.
 * Until then submitting the form is a no-op that surfaces a friendly notice.
 */
export interface CompanySettingsUpdate {
  name: string;
  email?: string;
  phone?: string;
  language?: string;
  prompt?: string;
}

export async function updateCompanySettings(
  _companyId: string,
  _payload: CompanySettingsUpdate
): Promise<never> {
  throw new Error(
    "NOT_IMPLEMENTED: backend has no PATCH /companies/{id} endpoint yet. See docs/07_API.md and app/api/v1/company.py."
  );
}
