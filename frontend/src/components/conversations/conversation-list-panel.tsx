"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChannelBadge, StatusBadge } from "@/components/shared/badges";
import { useConversationsList } from "@/hooks/useConversations";
import { cn, formatDate, initialsFromText } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NewConversationDialog } from "@/components/conversations/new-conversation-dialog";

export function ConversationListPanel() {
  const params = useParams<{ id?: string }>();
  const activeId = params?.id;
  const { data: conversations, isLoading } = useConversationsList();
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    const list = [...(conversations ?? [])].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    if (!query.trim()) return list;
    const lower = query.toLowerCase();
    return list.filter(
      (c) => c.customer_external_id.toLowerCase().includes(lower) || c.channel.includes(lower)
    );
  }, [conversations, query]);

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-white sm:w-80 lg:w-96">
      <div className="space-y-3 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Диалоги</h2>
          <Button size="icon" variant="secondary" onClick={() => setDialogOpen(true)} title="Новый диалог">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по клиенту или каналу"
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-border p-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}

        {!isLoading && filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Ничего не найдено</p>
        )}

        {filtered.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/conversations/${conversation.id}`}
            className={cn(
              "flex items-start gap-3 border-b border-border p-4 transition-colors hover:bg-accent",
              activeId === conversation.id && "bg-accent"
            )}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initialsFromText(conversation.customer_external_id)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{conversation.customer_external_id}</p>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {formatDate(conversation.updated_at)}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {conversation.summary || "Нет резюме диалога"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <ChannelBadge channel={conversation.channel} />
                <StatusBadge status={conversation.status} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <NewConversationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
