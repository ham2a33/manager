from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repositories.message import MessageRepository
from app.database.repositories.conversation import ConversationRepository


class ConversationService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def summarize(self, conversation_id: str) -> str:
        message_repo = MessageRepository(self.session)
        conversation_repo = ConversationRepository(self.session)
        messages = await message_repo.list_for_conversation(conversation_id)
        summary = " ".join(message.text for message in messages[-5:])
        conversation = await conversation_repo.get_by_id(conversation_id)
        if conversation is None:
            raise ValueError("Conversation not found")
        conversation.summary = summary[:500]
        return conversation.summary

