from __future__ import annotations

from dataclasses import dataclass
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.repositories.company import CompanyRepository
from app.database.repositories.user import UserRepository
from app.database.repositories.client import ClientRepository
from app.database.repositories.conversation import ConversationRepository
from app.database.repositories.message import MessageRepository
from app.database.repositories.knowledge import KnowledgeRepository
from app.database.repositories.lead import LeadRepository
from app.database.repositories.subscription import SubscriptionRepository
from app.database.repositories.statistics import StatisticsRepository
from app.database.repositories.channel import ChannelRepository
from app.database.repositories.audit_log import AuditLogRepository
from app.database.repositories.ai_provider import AIProviderRepository


@dataclass
class UnitOfWork:
    session: AsyncSession

    def __post_init__(self) -> None:
        self.companies = CompanyRepository(self.session)
        self.users = UserRepository(self.session)
        self.clients = ClientRepository(self.session)
        self.conversations = ConversationRepository(self.session)
        self.messages = MessageRepository(self.session)
        self.knowledge = KnowledgeRepository(self.session)
        self.leads = LeadRepository(self.session)
        self.subscriptions = SubscriptionRepository(self.session)
        self.statistics = StatisticsRepository(self.session)
        self.channels = ChannelRepository(self.session)
        self.audit_logs = AuditLogRepository(self.session)
        self.ai_providers = AIProviderRepository(self.session)

    async def __aenter__(self) -> "UnitOfWork":
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        await self.session.rollback()
        await self.session.close()

    async def commit(self) -> None:
        await self.session.commit()

    async def rollback(self) -> None:
        await self.session.rollback()
