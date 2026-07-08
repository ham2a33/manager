"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { KnowledgeResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export function KnowledgeViewDialog({
  document,
  onOpenChange,
}: {
  document: KnowledgeResponse | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(document)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{document?.title}</DialogTitle>
          <DialogDescription>
            {document && `Добавлено ${formatDate(document.created_at)}`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 rounded-lg border border-border bg-secondary/30 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{document?.content}</p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
