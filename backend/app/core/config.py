from functools import lru_cache

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except Exception:  # pragma: no cover
    BaseSettings = object
    SettingsConfigDict = dict


class Settings(BaseSettings):
    app_name: str = "AI Manager"
    app_env: str = "local"
    app_debug: bool = True
    api_prefix: str = "/api/v1"
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 1440
    database_url: str = "postgresql+asyncpg://manager:manager@localhost:5432/manager"
    test_database_url: str = "postgresql+asyncpg://manager_test:manager_test@localhost:5433/manager_test"
    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = "http://localhost:6333"
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "manager"
    minio_secret_key: str = "manager-secret"
    default_ai_provider: str = "mock"
    telegram_bot_token: str = ""

    if hasattr(BaseSettings, "model_config"):
        model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

