import { Badge } from "@/components/ui/badge";

const CHANNEL_LABELS: Record<string, string> = {
  telegram: "Telegram",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  website: "Website",
};

const CHANNEL_COLORS: Record<string, string> = {
  telegram: "bg-sky-50 text-sky-600 border-sky-100",
  instagram: "bg-pink-50 text-pink-600 border-pink-100",
  whatsapp: "bg-emerald-50 text-emerald-600 border-emerald-100",
  website: "bg-violet-50 text-violet-600 border-violet-100",
};

export function ChannelBadge({ channel }: { channel: string }) {
  return (
    <Badge variant="outline" className={CHANNEL_COLORS[channel] ?? ""}>
      {CHANNEL_LABELS[channel] ?? channel}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  if (status === "open") return <Badge variant="success">Открыт</Badge>;
  if (status === "closed") return <Badge variant="muted">Закрыт</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}
