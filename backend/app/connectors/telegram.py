from app.connectors.base import ChannelConnector


class TelegramConnector(ChannelConnector):
    async def send_message(self, external_user_id: str, text: str) -> dict:
        return {"channel": "telegram", "external_user_id": external_user_id, "text": text}

