from app.database.models import Base
from app.database.session import get_engine


def test_database_layer_exposes_sqlalchemy_base_and_engine():
    engine = get_engine()
    assert engine is not None
    assert Base.metadata is not None
    assert "companies" in Base.metadata.tables
