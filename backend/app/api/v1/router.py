from fastapi import APIRouter

from app.api.v1 import (
    ai,
    auth,
    channels,
    clients,
    company,
    conversation,
    health,
    knowledge,
    message,
    settings,
    statistics,
    subscription,
    webhooks,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(company.router, prefix="/companies", tags=["companies"])
api_router.include_router(conversation.router, prefix="/conversations", tags=["conversations"])
api_router.include_router(message.router, prefix="/messages", tags=["messages"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(channels.router, prefix="/channels", tags=["channels"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(statistics.router, prefix="/statistics", tags=["statistics"])
api_router.include_router(subscription.router, prefix="/subscriptions", tags=["subscriptions"])

