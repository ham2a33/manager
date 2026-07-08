from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas import LoginRequest, LoginResponse
from app.core.security import create_access_token, verify_password
from app.database.database import get_session
from app.database.repositories.user import UserRepository

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_session)):
    user_repo = UserRepository(session)
    user = await user_repo.get_by_email(payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.id, tenant_id=user.company_id, role=user.role)
    return LoginResponse(access_token=token, company_id=user.company_id, role=user.role)

