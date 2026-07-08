"use client";

import { Send, MessageCircle, Instagram } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TodoBackendNotice } from "@/components/shared/todo-backend-notice";

const CHANNELS = [
  {
    key: "telegram",
    name: "Telegram",
    icon: Send,
    color: "text-sky-600 bg-sky-50",
    field: "Bot Token",
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "text-emerald-600 bg-emerald-50",
    field: "Business API ключ",
  },
  {
    key: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-600 bg-pink-50",
    field: "Page Access Token",
  },
] as const;

export function ChannelSettings() {
  return (
    <div className="space-y-4">
      <TodoBackendNotice>
        TODO(backend): модель <code>ChannelRecord</code> существует в{" "}
        <code>app/database/models/domain.py</code>, но нет ни одного роута для чтения/сохранения
        настроек каналов (нет <code>GET/POST /channels</code>). Формы ниже показывают целевой UI и
        задизейблены до появления эндпоинтов — см. <code>src/lib/api/channels.ts</code>. Входящие
        сообщения уже принимаются через существующий <code>POST /webhooks/{"{channel}"}</code>.
      </TodoBackendNotice>

      {CHANNELS.map((channel) => {
        const Icon = channel.icon;
        return (
          <Card key={channel.key}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${channel.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle>{channel.name}</CardTitle>
                  <CardDescription>Webhook: /webhooks/{channel.key}</CardDescription>
                </div>
              </div>
              <Badge variant="muted">Не настроено</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>{channel.field}</Label>
                <Input placeholder="Пока недоступно" disabled />
              </div>
              <div className="flex justify-end">
                <Button size="sm" disabled title="Нет API для сохранения настроек канала">
                  Подключить
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
