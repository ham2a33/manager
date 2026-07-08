from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas import WebhookMessage
from app.database.database import get_session
from app.services.webhook_service import WebhookService

router = APIRouter()


@router.post("/{channel}")
async def receive_webhook(channel: str, payload: WebhookMessage, session: AsyncSession = Depends(get_session)):
    conversation, message = await WebhookService(session).receive(payload)
    return {
        "accepted": True,
        "channel": channel,
        "conversation_id": conversation.id,
        "message_id": message.id,
    }

