from __future__ import annotations

from typing import Generic, Protocol, TypeVar, runtime_checkable

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase

ModelT = TypeVar("ModelT", bound=DeclarativeBase)


@runtime_checkable
class StoreProtocol(Protocol):
    def user_by_email(self, email: str) -> object: ...

    def conversations_for_company(self, company_id: str) -> list[object]: ...

    def knowledge_for_company(self, company_id: str) -> list[object]: ...


class BaseRepository(Generic[ModelT]):
    def __init__(self, session: AsyncSession, model_class: type[ModelT]) -> None:
        self.session = session
        self.model_class = model_class

    async def get_by_id(self, entity_id: str) -> ModelT | None:
        return await self.session.get(self.model_class, entity_id)

    async def list(self) -> list[ModelT]:
        result = await self.session.execute(select(self.model_class))
        return list(result.scalars().all())

    async def add(self, entity: ModelT) -> ModelT:
        self.session.add(entity)
        return entity

    async def delete(self, entity: ModelT) -> None:
        await self.session.delete(entity)
