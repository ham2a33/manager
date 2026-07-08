"use client";

import { useMemo } from "react";
import { useConversationsList } from "@/hooks/useConversations";
import type { ConversationResponse } from "@/lib/api/types";

export interface DerivedCustomer {
  key: string;
  customer_external_id: string;
  channel: string;
  conversations_count: number;
  last_activity: string;
  last_status: string;
}

/**
 * TODO(backend): swap this for a real `useQuery(["clients"], listCustomers)`
 * once GET /clients ships (see src/lib/api/customers.ts). For now we derive
 * a customer list by grouping the existing /conversations payload by
 * (customer_external_id, channel), which is the only place the backend
 * currently surfaces "who is talking to us".
 */
export function useCustomers() {
  const conversationsQuery = useConversationsList();

  const customers = useMemo<DerivedCustomer[]>(() => {
    const data = conversationsQuery.data ?? [];
    const grouped = new Map<string, DerivedCustomer>();

    data.forEach((conversation: ConversationResponse) => {
      const key = `${conversation.customer_external_id}__${conversation.channel}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.conversations_count += 1;
        if (new Date(conversation.updated_at) > new Date(existing.last_activity)) {
          existing.last_activity = conversation.updated_at;
          existing.last_status = conversation.status;
        }
      } else {
        grouped.set(key, {
          key,
          customer_external_id: conversation.customer_external_id,
          channel: conversation.channel,
          conversations_count: 1,
          last_activity: conversation.updated_at,
          last_status: conversation.status,
        });
      }
    });

    return Array.from(grouped.values()).sort(
      (a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
    );
  }, [conversationsQuery.data]);

  return {
    customers,
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
  };
}
