"""Knowledge Base file upload foundation: document source metadata and chunk indexing.

Revision ID: 57408e289bb5
Revises: 9cc8d894d7a7
Create Date: 2026-07-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "57408e289bb5"
down_revision = "9cc8d894d7a7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "knowledge_documents",
        sa.Column("source_type", sa.String(length=20), nullable=False, server_default="manual"),
    )
    op.add_column(
        "knowledge_documents",
        sa.Column("original_filename", sa.String(length=255), nullable=True),
    )

    op.add_column(
        "knowledge_chunks",
        sa.Column("chunk_index", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "knowledge_chunks",
        sa.Column("company_id", sa.String(length=36), nullable=True),
    )
    op.execute(
        """
        UPDATE knowledge_chunks
        SET company_id = knowledge_documents.company_id
        FROM knowledge_documents
        WHERE knowledge_chunks.document_id = knowledge_documents.id
        """
    )
    op.alter_column("knowledge_chunks", "company_id", nullable=False)
    op.create_foreign_key(
        "fk_knowledge_chunks_company_id",
        "knowledge_chunks",
        "companies",
        ["company_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_index("ix_knowledge_chunks_company_id", "knowledge_chunks", ["company_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_knowledge_chunks_company_id", table_name="knowledge_chunks")
    op.drop_constraint("fk_knowledge_chunks_company_id", "knowledge_chunks", type_="foreignkey")
    op.drop_column("knowledge_chunks", "company_id")
    op.drop_column("knowledge_chunks", "chunk_index")
    op.drop_column("knowledge_documents", "original_filename")
    op.drop_column("knowledge_documents", "source_type")
