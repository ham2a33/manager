from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import ChannelRecord
from app.database.repositories.base import BaseRepository


class ChannelRepository(BaseRepository[ChannelRecord]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, ChannelRecord)
