from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas import WebhookMessage
from app.database.models.domain import ChannelType, Conversation, Message
from app.database.repositories.conversation import ConversationRepository
from app.database.repositories.message import MessageRepository


class WebhookService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def receive(self, payload: WebhookMessage) -> tuple[Conversation, Message]:
        external_id = f"{payload.channel}:{payload.external_user_id}"
        conversation_repository = ConversationRepository(self.session)
        message_repository = MessageRepository(self.session)
        conversations = await conversation_repository.list_for_company("demo-company")
        conversation = next((item for item in conversations if item.customer_external_id == external_id), None)
        if conversation is None:
            conversation = Conversation(
                company_id="demo-company",
                customer_external_id=external_id,
                channel=ChannelType(payload.channel),
            )
            self.session.add(conversation)
            await self.session.flush()
        message = Message(
            conversation_id=conversation.id,
            direction="inbound",
            sender="customer",
            text=payload.text,
        )
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        return conversation, message
