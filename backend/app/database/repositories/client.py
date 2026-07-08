from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import Client
from app.database.repositories.base import BaseRepository


class ClientRepository(BaseRepository[Client]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Client)

    async def list_for_company(self, company_id: str) -> list[Client]:
        result = await self.session.execute(select(Client).where(Client.company_id == company_id))
        return list(result.scalars().all())
