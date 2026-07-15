"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createKnowledgeDocument,
  getKnowledgeChunks,
  listKnowledge,
  searchKnowledge,
  searchKnowledgeChunks,
  uploadKnowledgeDocument,
} from "@/lib/api/knowledge";
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

export function useUploadKnowledgeDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadKnowledgeDocument(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    },
  });
}

export function useKnowledgeChunks(documentId: string | null) {
  return useQuery({
    queryKey: ["knowledge", documentId, "chunks"],
    queryFn: () => getKnowledgeChunks(documentId as string),
    enabled: Boolean(documentId),
  });
}

export function useKnowledgeSearch() {
  return useMutation({
    mutationFn: (query: string) => searchKnowledge({ query, limit: 5 }),
  });
}

export function useKnowledgeChunkSearch() {
  return useMutation({
    mutationFn: (query: string) => searchKnowledgeChunks(query, 10),
  });
}
