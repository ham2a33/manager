"""Add optional company settings columns."""

from alembic import op
import sqlalchemy as sa


revision = "20260708000000"
down_revision = "9cc8d894d7a7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("companies", sa.Column("email", sa.String(length=255), nullable=True))
    op.add_column("companies", sa.Column("phone", sa.String(length=64), nullable=True))
    op.add_column("companies", sa.Column("language", sa.String(length=50), nullable=True, server_default="en"))
    op.add_column("companies", sa.Column("ai_prompt", sa.Text(), nullable=True, server_default=""))


def downgrade() -> None:
    op.drop_column("companies", "ai_prompt")
    op.drop_column("companies", "language")
    op.drop_column("companies", "phone")
    op.drop_column("companies", "email")
