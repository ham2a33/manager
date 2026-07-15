"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateKnowledgeDocument, useUploadKnowledgeDocument } from "@/hooks/useKnowledge";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"];

const manualSchema = z.object({
  title: z.string().min(1, "Введите название документа"),
  content: z.string().min(1, "Содержимое не может быть пустым"),
});

type ManualFormValues = z.infer<typeof manualSchema>;

function isAcceptedFile(file: File) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function KnowledgeUploadDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const uploadDocument = useUploadKnowledgeDocument();
  const createDocument = useCreateKnowledgeDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualFormValues>({
    resolver: zodResolver(manualSchema),
    defaultValues: { title: "", content: "" },
  });

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
      setFileError(null);
      uploadDocument.reset();
    }
    onOpenChange(nextOpen);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!isAcceptedFile(file)) {
      setFileError(`Поддерживаются только ${ACCEPTED_EXTENSIONS.join(", ")}`);
      return;
    }
    setFileError(null);
    uploadDocument.mutate(file, {
      onSuccess: () => handleClose(false),
    });
  };

  const onManualSubmit = (values: ManualFormValues) => {
    createDocument.mutate(values, {
      onSuccess: () => handleClose(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Загрузить документ</DialogTitle>
          <DialogDescription>
            Файл разбирается на backend: PDF/DOCX парсятся, текст режется на чанки и сохраняется в
            базе знаний.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="file">
          <TabsList>
            <TabsTrigger value="file">Файл</TabsTrigger>
            <TabsTrigger value="text">Текст вручную</TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center text-sm transition-colors cursor-pointer ${
                dragActive
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary/70"
              }`}
            >
              {uploadDocument.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Загружаем и разбиваем на чанки...
                </>
              ) : (
                <>
                  <UploadCloud className="h-5 w-5" />
                  <span>Перетащите файл сюда или нажмите, чтобы выбрать</span>
                  <span className="text-xs">PDF, DOCX, TXT, MD</span>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {fileError && <p className="mt-2 text-xs text-destructive">{fileError}</p>}
            {uploadDocument.isError && (
              <p className="mt-2 text-xs text-destructive">
                Не удалось загрузить файл. Проверьте формат и попробуйте снова.
              </p>
            )}
          </TabsContent>

          <TabsContent value="text">
            <form onSubmit={handleSubmit(onManualSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  placeholder="Например: Часто задаваемые вопросы"
                  {...register("title")}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Содержимое</Label>
                <Textarea id="content" rows={6} placeholder="Текст документа..." {...register("content")} />
                {errors.content && (
                  <p className="text-xs text-destructive">{errors.content.message}</p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={createDocument.isPending}>
                  {createDocument.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  Сохранить
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
