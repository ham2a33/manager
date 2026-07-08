import asyncio
import os

from services.backend_client import BackendClient


async def main() -> None:
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000/api/v1")
    client = BackendClient(backend_url)
    print({"bot": "ai-manager-telegram", "configured": bool(token), "backend": client.base_url})


if __name__ == "__main__":
    asyncio.run(main())

