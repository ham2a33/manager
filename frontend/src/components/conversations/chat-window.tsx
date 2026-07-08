"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChannelBadge, StatusBadge } from "@/components/shared/badges";
import { MessageBubble } from "@/components/conversations/message-bubble";
import {
  useConversation,
  useConversationMessages,
  useSendMessage,
  useSummarizeConversation,
} from "@/hooks/useConversations";
import { initialsFromText } from "@/lib/utils";

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const { data: conversation, isLoading: conversationLoading } = useConversation(conversationId);
  const { data: messages, isLoading: messagesLoading } = useConversationMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const summarize = useSummarizeConversation(conversationId);

  const [text, setText] = useState("");
  const [useAI, setUseAI] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage.mutate(
      { text, sender: "agent", use_ai: useAI },
      {
        onSuccess: () => setText(""),
      }
    );
  };

  if (conversationLoading) {
    return (
      <div className="flex flex-1 flex-col p-6">
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Диалог не найден
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-secondary/20">
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initialsFromText(conversation.customer_external_id)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{conversation.customer_external_id}</p>
            <div className="mt-1 flex items-center gap-2">
              <ChannelBadge channel={conversation.channel} />
              <StatusBadge status={conversation.status} />
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => summarize.mutate()}
          disabled={summarize.isPending}
        >
          {summarize.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Обновить резюме
        </Button>
      </div>

      {conversation.summary && (
        <div className="border-b border-border bg-amber-50/60 px-6 py-2 text-xs text-amber-800">
          <span className="font-medium">Резюме: </span>
          {conversation.summary}
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-6 py-6 scrollbar-thin">
        {messagesLoading &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-2/3" />)}

        {!messagesLoading && (messages?.length ?? 0) === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Сообщений пока нет</p>
        )}

        {messages?.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <div className="border-t border-border bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch id="use-ai" checked={useAI} onCheckedChange={setUseAI} />
            <Label htmlFor="use-ai" className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Ответить через AI
            </Label>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Введите сообщение..."
            className="min-h-[44px] flex-1 resize-none"
          />
          <Button onClick={handleSend} disabled={sendMessage.isPending || !text.trim()} size="icon">
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
