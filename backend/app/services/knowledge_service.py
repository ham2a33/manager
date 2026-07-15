from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import KnowledgeChunk, KnowledgeDocument
from app.database.repositories.knowledge import (
    ChunkSearchHit,
    KnowledgeChunkRepository,
    KnowledgeRepository,
)
from app.knowledge.chunking import chunk_text
from app.knowledge.extractors import extract_text


class KnowledgeService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def search(self, company_id: str, query: str, limit: int = 5) -> list[KnowledgeDocument]:
        """Legacy document-level search (kept for the existing /knowledge/search endpoint)."""
        terms = {term.lower() for term in query.split() if term}
        repository = KnowledgeRepository(self.session)
        documents = await repository.list_for_company(company_id)
        scored: list[tuple[int, KnowledgeDocument]] = []
        for document in documents:
            haystack = f"{document.title} {document.content}".lower()
            score = sum(1 for term in terms if term in haystack)
            if score:
                scored.append((score, document))
        return [document for _, document in sorted(scored, key=lambda item: item[0], reverse=True)[:limit]]

    async def search_chunks(self, company_id: str, query: str, limit: int = 5) -> list[ChunkSearchHit]:
        """Chunk-level search using PostgreSQL ILIKE.

        This is the foundation for future RAG: swap this repository call for
        a Qdrant similarity search later without touching the API layer.
        """
        chunk_repository = KnowledgeChunkRepository(self.session)
        return await chunk_repository.search(company_id, query, limit)

    async def get_chunks(self, company_id: str, document_id: str) -> list[KnowledgeChunk] | None:
        repository = KnowledgeRepository(self.session)
        document = await repository.get_for_company(document_id, company_id)
        if document is None:
            return None
        chunk_repository = KnowledgeChunkRepository(self.session)
        return await chunk_repository.list_for_document(document_id, company_id)

    async def upload_document(self, company_id: str, filename: str, raw_bytes: bytes) -> KnowledgeDocument:
        """Extract text from an uploaded file, chunk it, and persist everything.

        Supported types: pdf, docx, txt, md. Raises
        `app.knowledge.extractors.UnsupportedFileTypeError` for anything else.
        """
        source_type, text = extract_text(filename, raw_bytes)
        title = filename.rsplit(".", 1)[0] or filename

        document = KnowledgeDocument(
            company_id=company_id,
            title=title,
            content=text,
            source_type=source_type,
            original_filename=filename,
        )
        self.session.add(document)
        await self.session.flush()  # assign document.id before creating chunks

        chunks = [
            KnowledgeChunk(
                document_id=document.id,
                company_id=company_id,
                chunk_index=index,
                content=content,
            )
            for index, content in enumerate(chunk_text(text))
        ]
        chunk_repository = KnowledgeChunkRepository(self.session)
        await chunk_repository.add_many(chunks)

        await self.session.commit()
        await self.session.refresh(document)
        return document
