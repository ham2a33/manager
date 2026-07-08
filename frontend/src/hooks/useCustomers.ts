"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listCustomers } from "@/lib/api/customers";

export interface DerivedCustomer {
  key: string;
  customer_external_id: string;
  channel: string;
  conversations_count: number;
  last_activity: string;
  last_status: string;
}

export function useCustomers() {
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: listCustomers,
  });

  const customers = useMemo<DerivedCustomer[]>(() => {
    const data = customersQuery.data ?? [];
    return data.map((customer) => ({
      key: customer.id,
      customer_external_id: customer.external_user_id,
      channel: customer.channel,
      conversations_count: 1,
      last_activity: customer.updated_at,
      last_status: "open",
    }));
  }, [customersQuery.data]);

  return {
    customers,
    isLoading: customersQuery.isLoading,
    isError: customersQuery.isError,
  };
}
