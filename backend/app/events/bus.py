from collections import defaultdict
from collections.abc import Callable


class EventBus:
    def __init__(self) -> None:
        self.handlers: dict[str, list[Callable[[dict], None]]] = defaultdict(list)

    def subscribe(self, event_name: str, handler: Callable[[dict], None]) -> None:
        self.handlers[event_name].append(handler)

    def publish(self, event_name: str, payload: dict) -> None:
        for handler in self.handlers[event_name]:
            handler(payload)


event_bus = EventBus()

