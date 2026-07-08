from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import current_context
from app.database.database import get_session
from app.database.repositories.conversation import ConversationRepository
from app.database.repositories.message import MessageRepository

router = APIRouter()


@router.get("/overview")
async def overview(context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    conversation_repository = ConversationRepository(session)
    message_repository = MessageRepository(session)
    conversations = await conversation_repository.list_for_company(context["tenant_id"])
    message_count = sum(len(await message_repository.list_for_conversation(item.id)) for item in conversations)
    return {
        "conversations": len(conversations),
        "messages": message_count,
        "open_conversations": len([item for item in conversations if item.status == "open"]),
    }

