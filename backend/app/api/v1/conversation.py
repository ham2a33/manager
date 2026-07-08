from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import current_context
from app.api.v1.schemas import ConversationCreate, ConversationResponse, MessageResponse
from app.database.database import get_session
from app.database.models.domain import ChannelType, Conversation, Message
from app.database.repositories.conversation import ConversationRepository
from app.database.repositories.message import MessageRepository
from app.services.conversation_service import ConversationService

router = APIRouter()


@router.get("", response_model=list[ConversationResponse])
async def list_conversations(context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    repository = ConversationRepository(session)
    return await repository.list_for_company(context["tenant_id"])


@router.post("", response_model=ConversationResponse, status_code=201)
async def create_conversation(payload: ConversationCreate, context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    conversation = Conversation(
        company_id=context["tenant_id"],
        customer_external_id=payload.customer_external_id,
        channel=ChannelType(payload.channel),
    )
    message = Message(
        conversation_id=conversation.id,
        direction="inbound",
        sender="customer",
        text=payload.text,
    )
    session.add(conversation)
    session.add(message)
    await session.commit()
    await session.refresh(conversation)
    return conversation


@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(conversation_id: str, session: AsyncSession = Depends(get_session)):
    repository = ConversationRepository(session)
    conversation = await repository.get_by_id(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.get("/{conversation_id}/messages", response_model=list[MessageResponse])
async def list_messages(conversation_id: str, session: AsyncSession = Depends(get_session)):
    repository = MessageRepository(session)
    return await repository.list_for_conversation(conversation_id)


@router.post("/{conversation_id}/summary")
async def summarize_conversation(conversation_id: str, session: AsyncSession = Depends(get_session)):
    repository = ConversationRepository(session)
    conversation = await repository.get_by_id(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"summary": await ConversationService(session).summarize(conversation_id)}

