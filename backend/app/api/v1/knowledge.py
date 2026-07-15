from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import current_context
from app.api.v1.schemas import (
    KnowledgeChunkResponse,
    KnowledgeChunkSearchResult,
    KnowledgeCreate,
    KnowledgeResponse,
    KnowledgeSearchRequest,
)
from app.database.database import get_session
from app.database.models.domain import KnowledgeDocument
from app.database.repositories.knowledge import KnowledgeRepository
from app.knowledge.extractors import SUPPORTED_EXTENSIONS, UnsupportedFileTypeError
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


@router.post("/upload", response_model=KnowledgeResponse, status_code=201)
async def upload_document(
    file: UploadFile,
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    """Upload a PDF/DOCX/TXT/MD file, extract its text, chunk it, and store it."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="File must have a filename")

    raw_bytes = await file.read()
    if not raw_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    try:
        document = await KnowledgeService(session).upload_document(
            context["tenant_id"], file.filename, raw_bytes
        )
    except UnsupportedFileTypeError:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Supported: {sorted(SUPPORTED_EXTENSIONS)}",
        )
    return document


@router.get("/search", response_model=list[KnowledgeChunkSearchResult])
async def search_chunks(
    q: str = Query(..., min_length=1),
    limit: int = Query(default=5, ge=1, le=50),
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    """Chunk-level Knowledge Base search (PostgreSQL ILIKE for now, Qdrant later)."""
    hits = await KnowledgeService(session).search_chunks(context["tenant_id"], q, limit)
    return [
        KnowledgeChunkSearchResult(document=hit.document, chunk=hit.chunk, score=hit.score)
        for hit in hits
    ]


@router.post("/search", response_model=list[KnowledgeResponse])
async def search(payload: KnowledgeSearchRequest, context=Depends(current_context), session: AsyncSession = Depends(get_session)):
    return await KnowledgeService(session).search(context["tenant_id"], payload.query, payload.limit)


@router.get("/{document_id}/chunks", response_model=list[KnowledgeChunkResponse])
async def get_document_chunks(
    document_id: str,
    context=Depends(current_context),
    session: AsyncSession = Depends(get_session),
):
    chunks = await KnowledgeService(session).get_chunks(context["tenant_id"], document_id)
    if chunks is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return chunks


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

