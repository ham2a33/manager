from typing import Optional
from uuid import UUID

from fastapi import Depends, Header, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.database.database import get_session
from app.database.repositories.company import CompanyRepository


def _looks_like_uuid(value: Optional[str]) -> bool:
    if not value:
        return False
    try:
        UUID(value)
    except (ValueError, TypeError):
        return False
    return True


async def _resolve_tenant_id(session: AsyncSession, tenant_id: Optional[str]) -> Optional[str]:
    if not tenant_id:
        return None
    if _looks_like_uuid(tenant_id):
        return tenant_id

    company_repo = CompanyRepository(session)
    company = await company_repo.get_by_slug(tenant_id)
    return company.id if company else None


async def current_context(
    request: Request,
    authorization: Optional[str] = Header(default=None),
    session: AsyncSession = Depends(get_session),
):
    raw_tenant_id = getattr(request.state, "tenant_id", None)
    if not authorization:
        resolved_tenant_id = await _resolve_tenant_id(session, raw_tenant_id)
        return {"sub": "anonymous", "tenant_id": resolved_tenant_id or raw_tenant_id, "role": "guest"}

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth scheme")

    try:
        context = decode_access_token(token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    resolved_tenant_id = await _resolve_tenant_id(session, context.get("tenant_id"))
    if resolved_tenant_id:
        context["tenant_id"] = resolved_tenant_id
    return context
