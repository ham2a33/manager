import { ConversationListPanel } from "@/components/conversations/conversation-list-panel";

export default function ConversationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)] overflow-hidden rounded-none border border-border bg-white sm:-m-6 sm:rounded-xl sm:shadow-card">
      <ConversationListPanel />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
