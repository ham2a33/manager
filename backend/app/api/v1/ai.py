from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas import AIRequest, AIResponse
from app.database.database import get_session
from app.services.ai_service import AIService

router = APIRouter()


@router.post("/complete", response_model=AIResponse)
async def complete(payload: AIRequest, session: AsyncSession = Depends(get_session)):
    return await AIService(session).answer(
        company_id=payload.company_id,
        prompt=payload.prompt,
        provider=payload.provider,
        model=payload.model,
    )

@router.get("/providers")
async def providers():
    return {
        "default": "mock",
        "available": ["mock", "openai", "claude", "gemini", "grok", "deepseek", "ollama"],
    }

