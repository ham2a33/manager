from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import AIProvider
from app.database.repositories.base import BaseRepository


class AIProviderRepository(BaseRepository[AIProvider]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, AIProvider)

    async def get_default(self) -> AIProvider | None:
        result = await self.session.execute(select(AIProvider).where(AIProvider.is_default.is_(True)))
        return result.scalar_one_or_none()
