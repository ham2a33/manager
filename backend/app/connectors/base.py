from abc import ABC, abstractmethod


class ChannelConnector(ABC):
    @abstractmethod
    async def send_message(self, external_user_id: str, text: str) -> dict:
        raise NotImplementedError

