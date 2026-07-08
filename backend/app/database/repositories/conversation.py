from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import Conversation
from app.database.repositories.base import BaseRepository


class ConversationRepository(BaseRepository[Conversation]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Conversation)

    async def list_for_company(self, company_id: str) -> list[Conversation]:
        result = await self.session.execute(select(Conversation).where(Conversation.company_id == company_id))
        return list(result.scalars().all())
