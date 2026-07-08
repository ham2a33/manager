import { apiClient } from "@/lib/api/client";
import type { SubscriptionCurrent } from "@/lib/api/types";

// Maps to backend/app/api/v1/subscription.py -> GET /subscriptions/current
export async function getCurrentSubscription(): Promise<SubscriptionCurrent> {
  const { data } = await apiClient.get<SubscriptionCurrent>("/subscriptions/current");
  return data;
}
