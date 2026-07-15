"""Chunking for the Knowledge Base RAG foundation.

Splits extracted document text into overlapping chunks of ~800-1000
characters. Chunks never cut a word in half, and prefer to end on a
sentence boundary so each chunk reads as a complete thought.
"""
from __future__ import annotations

import re

DEFAULT_CHUNK_SIZE = 1000
MIN_CHUNK_SIZE = 800
DEFAULT_OVERLAP = 150

_SENTENCE_END_RE = re.compile(r"[.!?…»\"]\s")


def _normalize_whitespace(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.strip() for line in text.split("\n")]
    text = "\n".join(lines)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _find_break_point(text: str, start: int, hard_end: int, min_end: int) -> int:
    """Find the best index in (min_end, hard_end] to end a chunk at.

    Prefers a sentence boundary, falls back to a whitespace boundary, and
    only cuts mid-word as a last resort (when the remaining text has no
    whitespace at all in range, e.g. a single very long token).
    """
    if hard_end >= len(text):
        return len(text)

    window = text[min_end:hard_end]

    best_sentence_break = None
    for match in _SENTENCE_END_RE.finditer(window):
        best_sentence_break = min_end + match.end()
    if best_sentence_break is not None:
        return best_sentence_break

    last_space = window.rfind(" ")
    if last_space != -1:
        return min_end + last_space + 1

    # No sentence or word boundary found in the window: extend forward to the
    # next whitespace so we never cut a word in half.
    next_space = text.find(" ", hard_end)
    if next_space == -1:
        return len(text)
    return next_space + 1


def chunk_text(
    text: str,
    size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_OVERLAP,
    min_size: int = MIN_CHUNK_SIZE,
) -> list[str]:
    text = _normalize_whitespace(text)
    if not text:
        return []

    chunks: list[str] = []
    start = 0
    length = len(text)

    while start < length:
        hard_end = min(start + size, length)
        min_end = min(start + min_size, length)

        if hard_end >= length:
            end = length
        else:
            end = _find_break_point(text, start, hard_end, min_end)
            if end <= start:
                end = hard_end

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        if end >= length:
            break

        next_start = end - overlap
        if next_start <= start:
            start = end
        else:
            # Snap forward to the next word boundary so the overlap never
            # starts mid-word.
            space_index = text.find(" ", next_start, end)
            start = space_index + 1 if space_index != -1 else end

    return chunks
