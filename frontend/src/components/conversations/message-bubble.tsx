import { Sparkles } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { MessageResponse } from "@/lib/api/types";

export function MessageBubble({ message }: { message: MessageResponse }) {
  const isOutbound = message.direction === "outbound";
  const isAI = message.sender === "ai";

  return (
    <div className={cn("flex w-full", isOutbound ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-soft animate-fade-in",
          isOutbound
            ? isAI
              ? "rounded-br-sm bg-violet-600 text-white"
              : "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-secondary text-secondary-foreground"
        )}
      >
        {isAI && (
          <div className="mb-1 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-white/70">
            <Sparkles className="h-3 w-3" /> AI ответ
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        <p
          className={cn(
            "mt-1 text-[10px]",
            isOutbound ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {formatDate(message.created_at)}
        </p>
      </div>
    </div>
  );
}
