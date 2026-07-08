from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.domain import KnowledgeDocument
from app.database.repositories.knowledge import KnowledgeRepository


class KnowledgeService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def search(self, company_id: str, query: str, limit: int = 5) -> list[KnowledgeDocument]:
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

