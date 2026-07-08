"use client";

import { useEffect, useState } from "react";
import { Send, MessageCircle, Instagram } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createChannel, listChannels, updateChannel } from "@/lib/api/channels";
import type { ChannelConfig } from "@/lib/api/channels";

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
  const queryClient = useQueryClient();
  const [channels, setChannels] = useState<Record<string, ChannelConfig | null>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void (async () => {
      const data = await listChannels();
      const map: Record<string, ChannelConfig | null> = {};
      const valuesMap: Record<string, string> = {};
      data.forEach((channel) => {
        map[channel.platform] = channel;
        valuesMap[channel.platform] = channel.external_id ?? "";
      });
      CHANNELS.forEach((channel) => {
        if (!map[channel.key]) {
          map[channel.key] = null;
        }
        if (!valuesMap[channel.key]) {
          valuesMap[channel.key] = "";
        }
      });
      setChannels(map);
      setValues(valuesMap);
    })();
  }, []);

  const handleSave = async (platform: string) => {
    const existing = channels[platform];
    const value = values[platform] ?? "";
    setSaving((prev) => ({ ...prev, [platform]: true }));
    try {
      if (existing) {
        await updateChannel(existing.id, { external_id: value || null, status: value ? "connected" : "disconnected" });
      } else {
        const created = await createChannel({ platform, external_id: value || null, status: value ? "connected" : "disconnected" });
        setChannels((prev) => ({ ...prev, [platform]: created }));
      }
      await queryClient.invalidateQueries({ queryKey: ["channels"] });
    } finally {
      setSaving((prev) => ({ ...prev, [platform]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {CHANNELS.map((channel) => {
        const Icon = channel.icon;
        const config = channels[channel.key];
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
              <Badge variant={config?.status === "connected" ? "success" : "muted"}>
                {config?.status === "connected" ? "Подключено" : "Не настроено"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>{channel.field}</Label>
                <Input
                  value={values[channel.key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [channel.key]: e.target.value }))}
                  placeholder="Введите значение"
                />
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => void handleSave(channel.key)} disabled={saving[channel.key]}>
                  {saving[channel.key] ? "Сохранение..." : config ? "Сохранить" : "Подключить"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
