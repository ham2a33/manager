from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import current_context
from app.api.v1.schemas import ClientCreate, ClientResponse, ClientUpdate
from app.database.database import get_session
from app.database.models.domain import Client
from app.database.repositories.client import ClientRepository

router = APIRouter()


@router.get("", response_model=list[ClientResponse])
async def list_clients(context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    repository = ClientRepository(session)
    return await repository.list_for_company(context["tenant_id"])


@router.post("", response_model=ClientResponse, status_code=201)
async def create_client(
    payload: ClientCreate,
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    client = Client(
        company_id=context["tenant_id"],
        external_user_id=payload.external_user_id,
        channel=payload.channel,
        phone=payload.phone,
        email=payload.email,
        full_name=payload.full_name,
    )
    session.add(client)
    await session.commit()
    await session.refresh(client)
    return client


@router.patch("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: str,
    payload: ClientUpdate,
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    repository = ClientRepository(session)
    client = await repository.get_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    if client.company_id != context["tenant_id"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    if payload.external_user_id is not None:
        client.external_user_id = payload.external_user_id
    if payload.channel is not None:
        client.channel = payload.channel
    if payload.phone is not None:
        client.phone = payload.phone
    if payload.email is not None:
        client.email = payload.email
    if payload.full_name is not None:
        client.full_name = payload.full_name

    await session.commit()
    await session.refresh(client)
    return client


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(
    client_id: str,
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    repository = ClientRepository(session)
    client = await repository.get_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    if client.company_id != context["tenant_id"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    await session.delete(client)
    await session.commit()
