from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import Message
from app.database.repositories.base import BaseRepository


class MessageRepository(BaseRepository[Message]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Message)

    async def list_for_conversation(self, conversation_id: str) -> list[Message]:
        result = await self.session.execute(select(Message).where(Message.conversation_id == conversation_id))
        return list(result.scalars().all())
