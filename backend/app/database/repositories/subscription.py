from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import Subscription
from app.database.repositories.base import BaseRepository


class SubscriptionRepository(BaseRepository[Subscription]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Subscription)
