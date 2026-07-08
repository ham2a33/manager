from pathlib import Path


class LocalStorage:
    def __init__(self, root: str = ".storage") -> None:
        self.root = Path(root)
        self.root.mkdir(exist_ok=True)

    def save_text(self, key: str, content: str) -> Path:
        path = self.root / key
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

