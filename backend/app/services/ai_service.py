from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession

from app.providers.ai.mock import MockAIProvider


@dataclass
class AIResult:
    provider: str
    model: str
    answer: str
    input_tokens: int
    output_tokens: int
    estimated_cost_usd: float


class AIService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.provider = MockAIProvider()

    async def answer(
        self,
        company_id: str,
        prompt: str,
        provider: str = "mock",
        model: str = "mock-support",
    ) -> AIResult:
        from app.database.repositories.knowledge import KnowledgeRepository

        knowledge_repo = KnowledgeRepository(self.session)
        knowledge = await knowledge_repo.list_for_company(company_id)
        context = "\n".join(document.content for document in knowledge[:3])
        answer = self.provider.complete(prompt=prompt, context=context)
        input_tokens = len((prompt + context).split())
        output_tokens = len(answer.split())
        return AIResult(
            provider=provider,
            model=model,
            answer=answer,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            estimated_cost_usd=round((input_tokens + output_tokens) * 0.000001, 6),
        )

