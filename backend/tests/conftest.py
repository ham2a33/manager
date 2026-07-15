import asyncio

import pytest

from app.database.database import run_migrations, seed_demo_data


@pytest.fixture(scope="session", autouse=True)
def _ensure_database_ready():
    """Run Alembic migrations and seed demo data once for the whole test session.

    Some tests instantiate `TestClient(app)` without a `with` block, which
    means FastAPI's lifespan (and therefore `run_migrations`/`seed_demo_data`)
    never fires for them. This fixture makes the test database ready
    regardless of how individual tests construct their client.
    """
    asyncio.run(run_migrations())
    asyncio.run(seed_demo_data())
