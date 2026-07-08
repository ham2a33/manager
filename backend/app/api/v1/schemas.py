from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    company_id: str
    role: str


class CompanyResponse(BaseModel):
    id: str
    name: str
    created_at: datetime


class ConversationCreate(BaseModel):
    customer_external_id: str
    channel: Literal["telegram", "instagram", "whatsapp", "website"]
    text: str = Field(min_length=1)


class ConversationResponse(BaseModel):
    id: str
    company_id: str
    customer_external_id: str
    channel: str
    status: str
    ai_enabled: bool
    summary: str
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):
    text: str = Field(min_length=1)
    sender: str = "agent"
    use_ai: bool = False


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    direction: str
    sender: str
    text: str
    created_at: datetime


class AIRequest(BaseModel):
    prompt: str
    provider: str = "mock"
    model: str = "mock-support"
    company_id: str = "demo-company"


class AIResponse(BaseModel):
    provider: str
    model: str
    answer: str
    input_tokens: int
    output_tokens: int
    estimated_cost_usd: float


class KnowledgeCreate(BaseModel):
    title: str
    content: str


class KnowledgeSearchRequest(BaseModel):
    query: str
    limit: int = 5


class KnowledgeResponse(BaseModel):
    id: str
    title: str
    content: str
    created_at: datetime


class WebhookMessage(BaseModel):
    channel: Literal["telegram", "instagram", "whatsapp", "website"]
    external_user_id: str
    text: str

