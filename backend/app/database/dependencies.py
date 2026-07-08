from __future__ import annotations

from typing import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_async_session_factory


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    session_factory = get_async_session_factory()
    async with session_factory() as session:
        yield session


def get_db_session_dependency() -> Depends:
    return Depends(get_db_session)
