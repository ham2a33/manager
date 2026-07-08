import { ChatWindow } from "@/components/conversations/chat-window";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatWindow conversationId={id} />;
}
