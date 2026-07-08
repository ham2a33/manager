from __future__ import annotations

from app.core.security import hash_password
from app.database.models.domain import (
    Channel,
    Company,
    Conversation,
    KnowledgeDocument,
    Message,
    User,
)
from app.database.repositories.base import StoreProtocol


class RepositoryError(RuntimeError):
    """Raised when the repository is used in an invalid state."""


class MemoryStore(StoreProtocol):
    def __init__(self) -> None:
        self.companies: dict[str, Company] = {}
        self.users: dict[str, User] = {}
        self.conversations: dict[str, Conversation] = {}
        self.messages: dict[str, Message] = {}
        self.knowledge_documents: dict[str, KnowledgeDocument] = {}
        self.seed()

    def seed(self) -> None:
        company = Company(id="demo-company", name="Demo Company")
        user = User(
            id="demo-user",
            email="owner@example.com",
            password_hash=hash_password("password"),
            company_id=company.id,
            role="owner",
        )
        conversation = Conversation(
            id="demo-conversation",
            company_id=company.id,
            customer_external_id="telegram:1001",
            channel=Channel.telegram,
            summary="Customer asked about pricing and setup.",
        )
        message = Message(
            id="demo-message",
            conversation_id=conversation.id,
            direction="inbound",
            sender="customer",
            text="How much does setup cost?",
        )
        doc = KnowledgeDocument(
            id="demo-knowledge",
            company_id=company.id,
            title="Pricing",
            content="Setup is free for the MVP plan. Paid plans include priority support.",
        )
        self.companies[company.id] = company
        self.users[user.id] = user
        self.conversations[conversation.id] = conversation
        self.messages[message.id] = message
        self.knowledge_documents[doc.id] = doc

    def user_by_email(self, email: str) -> User | None:
        return next((user for user in self.users.values() if user.email == email), None)

    def conversations_for_company(self, company_id: str) -> list[Conversation]:
        return [item for item in self.conversations.values() if item.company_id == company_id]

    def messages_for_conversation(self, conversation_id: str) -> list[Message]:
        return [item for item in self.messages.values() if item.conversation_id == conversation_id]

    def knowledge_for_company(self, company_id: str) -> list[KnowledgeDocument]:
        return [item for item in self.knowledge_documents.values() if item.company_id == company_id]


store = MemoryStore()
