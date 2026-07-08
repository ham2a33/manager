from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import ChannelRecord
from app.database.repositories.base import BaseRepository


class ChannelRepository(BaseRepository[ChannelRecord]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ChannelRecord)

    async def list_for_company(self, company_id: str) -> list[ChannelRecord]:
        result = await self.session.execute(select(ChannelRecord).where(ChannelRecord.company_id == company_id))
        return list(result.scalars().all())
