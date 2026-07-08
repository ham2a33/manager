from app.connectors.base import ChannelConnector


class WhatsAppConnector(ChannelConnector):
    async def send_message(self, external_user_id: str, text: str) -> dict:
        return {"channel": "whatsapp", "external_user_id": external_user_id, "text": text}

