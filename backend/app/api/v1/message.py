from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas import MessageCreate, MessageResponse
from app.database.database import get_session
from app.database.models.domain import Message
from app.database.repositories.conversation import ConversationRepository
from app.services.ai_service import AIService

router = APIRouter()


@router.post("/{conversation_id}", response_model=MessageResponse, status_code=201)
async def create_message(conversation_id: str, payload: MessageCreate, session: AsyncSession = Depends(get_session)):
    conversation_repo = ConversationRepository(session)
    conversation = await conversation_repo.get_by_id(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    text = payload.text
    sender = payload.sender
    direction = "outbound"
    if payload.use_ai:
        ai_response = await AIService(session).answer(conversation.company_id, payload.text)
        text = ai_response.answer
        sender = "ai"
    message = Message(
        conversation_id=conversation_id,
        direction=direction,
        sender=sender,
        text=text,
    )
    session.add(message)
    await session.commit()
    await session.refresh(message)
    return message

