from app.database.repositories import get_store, store
from app.database.repositories.base import StoreProtocol


def test_repository_store_is_exposed_from_package():
    assert store is get_store()
    assert hasattr(store, "user_by_email")
    assert hasattr(store, "conversations_for_company")
    assert hasattr(store, "knowledge_for_company")


def test_memory_store_matches_repository_protocol():
    assert isinstance(get_store(), StoreProtocol)
