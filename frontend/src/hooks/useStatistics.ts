"use client";

import { useQuery } from "@tanstack/react-query";
import { getStatisticsOverview } from "@/lib/api/statistics";
import { getCurrentSubscription } from "@/lib/api/subscriptions";

export function useStatisticsOverview() {
  return useQuery({
    queryKey: ["statistics", "overview"],
    queryFn: getStatisticsOverview,
    refetchInterval: 20000,
  });
}

export function useCurrentSubscription() {
  return useQuery({
    queryKey: ["subscriptions", "current"],
    queryFn: getCurrentSubscription,
  });
}
