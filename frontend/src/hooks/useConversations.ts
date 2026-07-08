"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  getConversation,
  listConversations,
  listMessages,
  summarizeConversation,
} from "@/lib/api/conversations";
import { sendMessage } from "@/lib/api/messages";
import type { ConversationCreate, MessageCreate } from "@/lib/api/types";

export function useConversationsList() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
    refetchInterval: 15000,
  });
}

export function useConversation(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => getConversation(conversationId as string),
    enabled: Boolean(conversationId),
  });
}

export function useConversationMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => listMessages(conversationId as string),
    enabled: Boolean(conversationId),
    refetchInterval: 5000,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConversationCreate) => createConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MessageCreate) => sendMessage(conversationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", conversationId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSummarizeConversation(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => summarizeConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", conversationId] });
    },
  });
}
