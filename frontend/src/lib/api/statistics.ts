import { apiClient } from "@/lib/api/client";
import type { StatisticsOverview } from "@/lib/api/types";

// Maps to backend/app/api/v1/statistics.py -> GET /statistics/overview
// This is the ONLY statistics endpoint that exists today. It does not
// return a customers count or a time series, only these three totals.
export async function getStatisticsOverview(): Promise<StatisticsOverview> {
  const { data } = await apiClient.get<StatisticsOverview>("/statistics/overview");
  return data;
}
