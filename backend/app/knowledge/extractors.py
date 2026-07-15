"""Text extraction for Knowledge Base document uploads.

Each supported file type has its own extractor function behind a common
interface: `extract(raw_bytes: bytes) -> str`. `extract_text` dispatches to
the right extractor based on the file extension.

No OpenAI / embeddings / vector store code lives here - this module only
turns an uploaded file into plain text so it can be chunked and stored in
PostgreSQL.
"""
from __future__ import annotations

import io

SUPPORTED_EXTENSIONS = {"pdf", "docx", "txt", "md"}


class UnsupportedFileTypeError(ValueError):
    """Raised when the uploaded file extension is not supported."""


def _extension_from_filename(filename: str) -> str:
    if "." not in filename:
        raise UnsupportedFileTypeError(f"File '{filename}' has no extension")
    return filename.rsplit(".", 1)[-1].lower()


def extract_pdf(raw_bytes: bytes) -> str:
    from PyPDF2 import PdfReader

    reader = PdfReader(io.BytesIO(raw_bytes))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages)


def extract_docx(raw_bytes: bytes) -> str:
    from docx import Document

    document = Document(io.BytesIO(raw_bytes))
    paragraphs = [paragraph.text for paragraph in document.paragraphs]
    return "\n".join(paragraphs)


def extract_txt(raw_bytes: bytes) -> str:
    return raw_bytes.decode("utf-8", errors="replace")


def extract_md(raw_bytes: bytes) -> str:
    return raw_bytes.decode("utf-8", errors="replace")


_EXTRACTORS = {
    "pdf": extract_pdf,
    "docx": extract_docx,
    "txt": extract_txt,
    "md": extract_md,
}


def extract_text(filename: str, raw_bytes: bytes) -> tuple[str, str]:
    """Extract plain text from an uploaded file.

    Returns a tuple of (source_type, text).
    """
    extension = _extension_from_filename(filename)
    if extension not in _EXTRACTORS:
        raise UnsupportedFileTypeError(
            f"Unsupported file type '.{extension}'. Supported: {sorted(SUPPORTED_EXTENSIONS)}"
        )
    text = _EXTRACTORS[extension](raw_bytes)
    return extension, text
