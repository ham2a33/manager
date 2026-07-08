from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path
from typing import AsyncIterator

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.core.security import hash_password
from app.database.models.domain import Company, KnowledgeDocument, User


def _to_async_database_url(database_url: str) -> str:
    if database_url.startswith("postgresql+psycopg2://"):
        return database_url.replace("postgresql+psycopg2://", "postgresql+asyncpg://", 1)
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return database_url


def _to_sync_database_url(database_url: str) -> str:
    if database_url.startswith("postgresql+asyncpg://"):
        return database_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://", 1)
    return database_url


def get_alembic_database_url() -> str:
    return _to_sync_database_url(settings.database_url)


async_engine: AsyncEngine = create_async_engine(
    _to_async_database_url(settings.database_url),
    echo=False,
    future=True,
    poolclass=NullPool,
)
async_session_factory = async_sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)


async def run_migrations() -> None:
    project_root = Path(__file__).resolve().parents[3]
    alembic_config = project_root / "alembic.ini"
    if not alembic_config.exists():
        raise FileNotFoundError("alembic.ini not found")

    env = os.environ.copy()
    env.setdefault("PYTHONPATH", str(project_root / "backend"))
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=str(project_root),
        env=env,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Alembic migration failed: {result.stderr or result.stdout}")


async def get_session() -> AsyncIterator[AsyncSession]:
    async with async_session_factory() as session:
        yield session


async def seed_demo_data() -> None:
    async with async_session_factory() as session:
        company = await session.scalar(select(Company).where(Company.slug == "demo-company"))
        if company is None:
            company = Company(name="Demo Company", slug="demo-company", description="Seeded demo company")
            session.add(company)
            await session.flush()

        user = await session.scalar(select(User).where(User.email == "owner@example.com"))
        if user is None:
            user = User(
                email="owner@example.com",
                password_hash=hash_password("password"),
                company_id=company.id,
                role="owner",
            )
            session.add(user)

        document = await session.scalar(select(KnowledgeDocument).where(KnowledgeDocument.company_id == company.id))
        if document is None:
            session.add(
                KnowledgeDocument(
                    company_id=company.id,
                    title="Setup",
                    content="Setup is free for the MVP plan. Paid plans include priority support.",
                )
            )

        await session.commit()


async def get_session() -> AsyncIterator[AsyncSession]:
    async with async_session_factory() as session:
        yield session


def get_async_engine() -> AsyncEngine:
    return async_engine


def get_async_session_factory() -> async_sessionmaker[AsyncSession]:
    return async_session_factory
