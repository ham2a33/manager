from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas import CompanyResponse
from app.database.database import get_session
from app.database.repositories.company import CompanyRepository

router = APIRouter()


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: str, session: AsyncSession = Depends(get_session)):
    repository = CompanyRepository(session)
    company = await repository.get_by_id(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

