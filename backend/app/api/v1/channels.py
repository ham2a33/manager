from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import current_context
from app.api.v1.schemas import ChannelCreate, ChannelResponse, ChannelUpdate
from app.database.database import get_session
from app.database.models.domain import ChannelRecord
from app.database.repositories.channel import ChannelRepository

router = APIRouter()


@router.get("", response_model=list[ChannelResponse])
async def list_channels(context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    repository = ChannelRepository(session)
    return await repository.list_for_company(context["tenant_id"])


@router.post("", response_model=ChannelResponse, status_code=201)
async def create_channel(
    payload: ChannelCreate,
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    channel = ChannelRecord(
        company_id=context["tenant_id"],
        platform=payload.platform,
        external_id=payload.external_id,
        status=payload.status or "connected",
    )
    session.add(channel)
    await session.commit()
    await session.refresh(channel)
    return channel


@router.patch("/{channel_id}", response_model=ChannelResponse)
async def update_channel(
    channel_id: str,
    payload: ChannelUpdate,
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    repository = ChannelRepository(session)
    channel = await repository.get_by_id(channel_id)
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    if channel.company_id != context["tenant_id"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    if payload.platform is not None:
        channel.platform = payload.platform
    if payload.external_id is not None:
        channel.external_id = payload.external_id
    if payload.status is not None:
        channel.status = payload.status

    await session.commit()
    await session.refresh(channel)
    return channel


@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_channel(
    channel_id: str,
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    repository = ChannelRepository(session)
    channel = await repository.get_by_id(channel_id)
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    if channel.company_id != context["tenant_id"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    await session.delete(channel)
    await session.commit()
