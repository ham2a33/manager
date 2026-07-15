"use client";

import { useState } from "react";
import { FileText, Eye, Trash2, Search, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useKnowledgeList, useKnowledgeSearch } from "@/hooks/useKnowledge";
import { KnowledgeUploadDialog } from "@/components/knowledge/knowledge-upload-dialog";
import { KnowledgeViewDialog } from "@/components/knowledge/knowledge-view-dialog";
import { formatDate } from "@/lib/utils";
import { deleteKnowledgeDocument } from "@/lib/api/knowledge";
import type { KnowledgeResponse } from "@/lib/api/types";

export function KnowledgeList() {
  const queryClient = useQueryClient();
  const { data: documents, isLoading } = useKnowledgeList();
  const knowledgeSearch = useKnowledgeSearch();
  const [query, setQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewing, setViewing] = useState<KnowledgeResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const results = knowledgeSearch.data;
  const list = query.trim() && results ? results : documents ?? [];

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length > 1) {
      knowledgeSearch.mutate(value);
    }
  };

  const handleDelete = async (docId: string) => {
    setDeletingId(docId);
    try {
      await deleteKnowledgeDocument(docId);
      await queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Поиск по базе знаний"
            className="pl-8"
          />
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Загрузить документ
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          <FileText className="h-6 w-6" />
          Документов пока нет
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((doc) => (
          <Card key={doc.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] text-muted-foreground">{formatDate(doc.created_at)}</span>
                  {doc.source_type !== "manual" && (
                    <Badge variant="secondary" className="uppercase">
                      {doc.source_type}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="line-clamp-1 text-sm font-semibold">{doc.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{doc.content}</p>
              </div>
              <div className="mt-auto flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewing(doc)}>
                  <Eye className="h-3.5 w-3.5" /> Просмотр
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => void handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <KnowledgeUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <KnowledgeViewDialog document={viewing} onOpenChange={(open) => !open && setViewing(null)} />
    </div>
  );
}
