class MockAIProvider:
    def complete(self, prompt: str, context: str = "") -> str:
        if context:
            return f"Based on the knowledge base: {context[:180]} Answer: {prompt}"
        return f"AI draft response: {prompt}"

