class BackendClient:
    def __init__(self, base_url: str) -> None:
        self.base_url = base_url.rstrip("/")

    async def send_inbound_message(self, external_user_id: str, text: str) -> dict:
        return {
            "url": f"{self.base_url}/webhooks/telegram",
            "channel": "telegram",
            "external_user_id": external_user_id,
            "text": text,
        }

