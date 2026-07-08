"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompany } from "@/lib/api/companies";
import { useAuthStore } from "@/store/authStore";

export function useCompany() {
  const companyId = useAuthStore((state) => state.companyId);
  return useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(companyId as string),
    enabled: Boolean(companyId),
  });
}
