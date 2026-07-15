from __future__ import annotations

from dataclasses import dataclass

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

    async def get_for_company(self, document_id: str, company_id: str) -> KnowledgeDocument | None:
        result = await self.session.execute(
            select(KnowledgeDocument).where(
                KnowledgeDocument.id == document_id,
                KnowledgeDocument.company_id == company_id,
            )
        )
        return result.scalar_one_or_none()


@dataclass
class ChunkSearchHit:
    document: KnowledgeDocument
    chunk: KnowledgeChunk
    score: float


class KnowledgeChunkRepository(BaseRepository[KnowledgeChunk]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, KnowledgeChunk)

    async def list_for_document(self, document_id: str, company_id: str) -> list[KnowledgeChunk]:
        result = await self.session.execute(
            select(KnowledgeChunk)
            .where(
                KnowledgeChunk.document_id == document_id,
                KnowledgeChunk.company_id == company_id,
            )
            .order_by(KnowledgeChunk.chunk_index)
        )
        return list(result.scalars().all())

    async def add_many(self, chunks: list[KnowledgeChunk]) -> list[KnowledgeChunk]:
        for chunk in chunks:
            self.session.add(chunk)
        return chunks

    async def search(self, company_id: str, query: str, limit: int = 5) -> list[ChunkSearchHit]:
        """Plain PostgreSQL ILIKE search across chunk content.

        This is the MVP search strategy. It is intentionally isolated behind
        this repository method so it can later be swapped for a Qdrant
        similarity search without touching the service or API layer.
        """
        like_pattern = f"%{query.strip()}%"
        result = await self.session.execute(
            select(KnowledgeChunk, KnowledgeDocument)
            .join(KnowledgeDocument, KnowledgeChunk.document_id == KnowledgeDocument.id)
            .where(
                KnowledgeChunk.company_id == company_id,
                KnowledgeChunk.content.ilike(like_pattern),
            )
            .order_by(KnowledgeChunk.created_at.desc())
            .limit(limit)
        )
        hits: list[ChunkSearchHit] = []
        terms = [term.lower() for term in query.split() if term]
        for chunk, document in result.all():
            haystack = chunk.content.lower()
            score = (
                sum(1 for term in terms if term in haystack) / len(terms)
                if terms
                else 1.0
            )
            hits.append(ChunkSearchHit(document=document, chunk=chunk, score=round(score, 4)))
        hits.sort(key=lambda hit: hit.score, reverse=True)
        return hits
