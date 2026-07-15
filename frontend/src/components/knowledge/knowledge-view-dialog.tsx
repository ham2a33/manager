"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKnowledgeChunks } from "@/hooks/useKnowledge";
import type { KnowledgeResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export function KnowledgeViewDialog({
  document,
  onOpenChange,
}: {
  document: KnowledgeResponse | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: chunks, isLoading: chunksLoading } = useKnowledgeChunks(document?.id ?? null);

  return (
    <Dialog open={Boolean(document)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{document?.title}</DialogTitle>
            {document && document.source_type !== "manual" && (
              <Badge variant="secondary" className="uppercase">
                {document.source_type}
              </Badge>
            )}
          </div>
          <DialogDescription>
            {document &&
              `Добавлено ${formatDate(document.created_at)}${
                document.original_filename ? ` · ${document.original_filename}` : ""
              }`}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content">Текст</TabsTrigger>
            <TabsTrigger value="chunks">Чанки{chunks ? ` (${chunks.length})` : ""}</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ScrollArea className="h-96 rounded-lg border border-border bg-secondary/30 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{document?.content}</p>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chunks">
            <ScrollArea className="h-96 rounded-lg border border-border bg-secondary/30 p-4">
              {chunksLoading && (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              )}
              {!chunksLoading && chunks?.length === 0 && (
                <p className="text-sm text-muted-foreground">Чанки ещё не созданы.</p>
              )}
              <div className="space-y-3">
                {chunks?.map((chunk) => (
                  <div key={chunk.id} className="rounded-lg border border-border bg-background p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Чанк #{chunk.chunk_index}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {chunk.content.length} симв.
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{chunk.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
