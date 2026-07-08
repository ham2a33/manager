import { MessagesSquare } from "lucide-react";

export default function ConversationsIndexPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
        <MessagesSquare className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Выберите диалог слева</p>
        <p className="text-xs">или создайте новый, чтобы начать переписку</p>
      </div>
    </div>
  );
}
