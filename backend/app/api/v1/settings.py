from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import current_context
from app.api.v1.schemas import SettingsResponse, SettingsUpdate
from app.database.database import get_session
from app.database.repositories.company import CompanyRepository

router = APIRouter()


@router.get("", response_model=SettingsResponse)
async def get_settings(context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    repository = CompanyRepository(session)
    company = await repository.get_by_id(context["tenant_id"])
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return SettingsResponse(
        company_id=company.id,
        name=company.name,
        email=company.email,
        phone=company.phone,
        language=company.language,
        ai_prompt=company.ai_prompt,
    )


@router.patch("", response_model=SettingsResponse)
async def update_settings(
    payload: SettingsUpdate,
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    repository = CompanyRepository(session)
    company = await repository.get_by_id(context["tenant_id"])
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    if payload.name is not None:
        company.name = payload.name
    if payload.email is not None:
        company.email = payload.email
    if payload.phone is not None:
        company.phone = payload.phone
    if payload.language is not None:
        company.language = payload.language
    if payload.ai_prompt is not None:
        company.ai_prompt = payload.ai_prompt
    if payload.prompt is not None:
        company.ai_prompt = payload.prompt

    await session.commit()
    await session.refresh(company)
    return SettingsResponse(
        company_id=company.id,
        name=company.name,
        email=company.email,
        phone=company.phone,
        language=company.language,
        ai_prompt=company.ai_prompt,
    )
