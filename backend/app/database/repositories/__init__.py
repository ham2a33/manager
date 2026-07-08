"""Repository package exports."""

from app.database.repositories.base import BaseRepository, StoreProtocol


class CompatibilityStore:
    def user_by_email(self, email: str):
        return None

    def conversations_for_company(self, company_id: str):
        return []

    def messages_for_conversation(self, conversation_id: str):
        return []

    def knowledge_for_company(self, company_id: str):
        return []


store = CompatibilityStore()


def get_store() -> CompatibilityStore:
    return store


from app.database.repositories.ai_provider import AIProviderRepository
from app.database.repositories.audit_log import AuditLogRepository
from app.database.repositories.channel import ChannelRepository
from app.database.repositories.client import ClientRepository
from app.database.repositories.company import CompanyRepository
from app.database.repositories.conversation import ConversationRepository
from app.database.repositories.knowledge import KnowledgeChunkRepository, KnowledgeRepository
from app.database.repositories.lead import LeadRepository
from app.database.repositories.message import MessageRepository
from app.database.repositories.statistics import StatisticsRepository
from app.database.repositories.subscription import SubscriptionRepository
from app.database.repositories.user import UserRepository

__all__ = [
    "AIProviderRepository",
    "AuditLogRepository",
    "BaseRepository",
    "ChannelRepository",
    "ClientRepository",
    "CompanyRepository",
    "ConversationRepository",
    "KnowledgeChunkRepository",
    "KnowledgeRepository",
    "LeadRepository",
    "MessageRepository",
    "StatisticsRepository",
    "StoreProtocol",
    "SubscriptionRepository",
    "UserRepository",
    "get_store",
    "store",
]
