from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import KnowledgeDocument, KnowledgeChunk
from app.database.repositories.base import BaseRepository


class KnowledgeRepository(BaseRepository[KnowledgeDocument]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, KnowledgeDocument)

    async def list_for_company(self, company_id: str) -> list[KnowledgeDocument]:
        result = await self.session.execute(
            select(KnowledgeDocument).where(KnowledgeDocument.company_id == company_id)
        )
        return list(result.scalars().all())


class KnowledgeChunkRepository(BaseRepository[KnowledgeChunk]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, KnowledgeChunk)
