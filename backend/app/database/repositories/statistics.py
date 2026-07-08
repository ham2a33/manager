from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import Statistics
from app.database.repositories.base import BaseRepository


class StatisticsRepository(BaseRepository[Statistics]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Statistics)
