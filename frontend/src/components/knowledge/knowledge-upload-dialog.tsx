"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UploadCloud } from "lucide-react";
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
import { useCreateKnowledgeDocument } from "@/hooks/useKnowledge";

const schema = z.object({
  title: z.string().min(1, "Введите название документа"),
  content: z.string().min(1, "Содержимое не может быть пустым"),
});

type FormValues = z.infer<typeof schema>;

export function KnowledgeUploadDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createDocument = useCreateKnowledgeDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", content: "" },
  });

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    setValue("content", text);
    if (!file.name) return;
    setValue("title", file.name.replace(/\.[^/.]+$/, ""));
  };

  const onSubmit = (values: FormValues) => {
    createDocument.mutate(values, {
      onSuccess: () => {
        reset();
        setFileName(null);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Загрузить документ</DialogTitle>
          <DialogDescription>
            Backend хранит знания как текст (<code>POST /knowledge</code> принимает только{" "}
            <code>title</code> и <code>content</code>) — файл читается в браузере и его текст
            отправляется как содержимое.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Файл (.txt, .md)</Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-secondary/70"
            >
              <UploadCloud className="h-4 w-4" />
              {fileName ?? "Нажмите, чтобы выбрать файл"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,text/plain,text/markdown"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input id="title" placeholder="Например: Часто задаваемые вопросы" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Содержимое</Label>
            <Textarea id="content" rows={6} placeholder="Текст документа..." {...register("content")} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createDocument.isPending}>
              {createDocument.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Загрузить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
