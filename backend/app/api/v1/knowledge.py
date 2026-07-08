from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import current_context
from app.api.v1.schemas import KnowledgeCreate, KnowledgeResponse, KnowledgeSearchRequest
from app.database.database import get_session
from app.database.models.domain import KnowledgeDocument
from app.database.repositories.knowledge import KnowledgeRepository
from app.services.knowledge_service import KnowledgeService

router = APIRouter()


@router.get("", response_model=list[KnowledgeResponse])
async def list_documents(context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    repository = KnowledgeRepository(session)
    return await repository.list_for_company(context["tenant_id"])


@router.post("", response_model=KnowledgeResponse, status_code=201)
async def create_document(payload: KnowledgeCreate, context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    document = KnowledgeDocument(
        company_id=context["tenant_id"],
        title=payload.title,
        content=payload.content,
    )
    session.add(document)
    await session.commit()
    await session.refresh(document)
    return document


@router.post("/search", response_model=list[KnowledgeResponse])
async def search(payload: KnowledgeSearchRequest, context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    return await KnowledgeService(session).search(context["tenant_id"], payload.query, payload.limit)


@router.delete("/{document_id}", status_code=204)
async def delete_document(document_id: str, context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    repository = KnowledgeRepository(session)
    document = await repository.get_by_id(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Knowledge document not found")
    if document.company_id != context["tenant_id"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    await session.delete(document)
    await session.commit()

