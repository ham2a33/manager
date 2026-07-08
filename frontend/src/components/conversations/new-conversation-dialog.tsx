"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useCreateConversation } from "@/hooks/useConversations";

const schema = z.object({
  customer_external_id: z.string().min(1, "Укажите идентификатор клиента"),
  channel: z.enum(["telegram", "instagram", "whatsapp", "website"]),
  text: z.string().min(1, "Введите первое сообщение"),
});

type FormValues = z.infer<typeof schema>;

export function NewConversationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const createConversation = useCreateConversation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customer_external_id: "", channel: "website", text: "" },
  });

  const onSubmit = (values: FormValues) => {
    createConversation.mutate(values, {
      onSuccess: (conversation) => {
        reset();
        onOpenChange(false);
        router.push(`/conversations/${conversation.id}`);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый диалог</DialogTitle>
          <DialogDescription>
            Создаёт диалог через POST /conversations, как если бы клиент написал первым.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_external_id">Идентификатор клиента</Label>
            <Input
              id="customer_external_id"
              placeholder="например, telegram id или телефон"
              {...register("customer_external_id")}
            />
            {errors.customer_external_id && (
              <p className="text-xs text-destructive">{errors.customer_external_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Канал</Label>
            <Controller
              control={control}
              name="channel"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Первое сообщение</Label>
            <Textarea id="text" placeholder="Здравствуйте, хочу узнать про..." {...register("text")} />
            {errors.text && <p className="text-xs text-destructive">{errors.text.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createConversation.isPending}>
              {createConversation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Создать
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
