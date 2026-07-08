"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createKnowledgeDocument, listKnowledge, searchKnowledge } from "@/lib/api/knowledge";
import type { KnowledgeCreate } from "@/lib/api/types";

export function useKnowledgeList() {
  return useQuery({
    queryKey: ["knowledge"],
    queryFn: listKnowledge,
  });
}

export function useCreateKnowledgeDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: KnowledgeCreate) => createKnowledgeDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    },
  });
}

export function useKnowledgeSearch() {
  return useMutation({
    mutationFn: (query: string) => searchKnowledge({ query, limit: 5 }),
  });
}
