import io

from docx import Document
from fastapi.testclient import TestClient

from app.knowledge.chunking import chunk_text
from app.main import app


def _auth_headers(client: TestClient) -> dict:
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "owner@example.com", "password": "password"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}", "x-tenant-id": "demo-company"}


def _build_pdf_bytes(lines: list[str]) -> bytes:
    from reportlab.pdfgen import canvas

    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer)
    y = 720
    for line in lines:
        pdf.drawString(72, y, line)
        y -= 20
    pdf.save()
    return buffer.getvalue()


def _build_docx_bytes(paragraphs: list[str]) -> bytes:
    buffer = io.BytesIO()
    document = Document()
    for paragraph in paragraphs:
        document.add_paragraph(paragraph)
    document.save(buffer)
    return buffer.getvalue()


def test_chunking_respects_size_bounds_and_never_splits_words():
    text = ("Первое предложение содержит важную информацию про доставку. " * 10) + (
        "Второе предложение описывает условия оплаты подробно и ясно. " * 15
    )
    chunks = chunk_text(text)
    assert len(chunks) >= 1
    reconstructed_words = set(text.split())
    for chunk in chunks:
        assert len(chunk) <= 1000
        for word in chunk.split():
            assert word.strip(".,!?") == "" or word.strip(".,!?") in {
                w.strip(".,!?") for w in reconstructed_words
            }
    # No chunk should start or end mid-word (i.e. trimmed chunk has no leading/trailing partial fragments)
    for chunk in chunks:
        assert chunk == chunk.strip()


def test_upload_txt_document_creates_document_and_chunks():
    with TestClient(app) as client:
        headers = _auth_headers(client)
        content = ("Настройка бота бесплатна на MVP тарифе. " * 60).encode("utf-8")
        files = {"file": ("faq.txt", content, "text/plain")}

        response = client.post("/api/v1/knowledge/upload", files=files, headers=headers)
        assert response.status_code == 201
        body = response.json()
        assert body["title"] == "faq"
        assert body["source_type"] == "txt"
        assert body["original_filename"] == "faq.txt"
        document_id = body["id"]

        chunks_response = client.get(f"/api/v1/knowledge/{document_id}/chunks", headers=headers)
        assert chunks_response.status_code == 200
        chunks = chunks_response.json()
        assert len(chunks) >= 1
        assert chunks[0]["chunk_index"] == 0
        assert chunks == sorted(chunks, key=lambda c: c["chunk_index"])


def test_upload_docx_document_extracts_paragraph_text():
    with TestClient(app) as client:
        headers = _auth_headers(client)
        docx_bytes = _build_docx_bytes(
            [
                "Политика возврата средств компании.",
                "Возврат обрабатывается в течение 5 рабочих дней после одобрения заявки.",
            ]
        )
        files = {
            "file": (
                "refund_policy.docx",
                docx_bytes,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        }

        response = client.post("/api/v1/knowledge/upload", files=files, headers=headers)
        assert response.status_code == 201
        body = response.json()
        assert body["source_type"] == "docx"
        assert "Возврат обрабатывается" in body["content"]


def test_upload_pdf_document_extracts_text():
    with TestClient(app) as client:
        headers = _auth_headers(client)
        pdf_bytes = _build_pdf_bytes(
            [
                "Refund policy: refunds are processed within 5 business days.",
                "Contact support at help@example.com for assistance.",
            ]
        )
        files = {"file": ("policy.pdf", pdf_bytes, "application/pdf")}

        response = client.post("/api/v1/knowledge/upload", files=files, headers=headers)
        assert response.status_code == 201
        body = response.json()
        assert body["source_type"] == "pdf"
        assert "Refund policy" in body["content"]


def test_upload_rejects_unsupported_file_type():
    with TestClient(app) as client:
        headers = _auth_headers(client)
        files = {"file": ("image.png", b"not-a-real-png", "image/png")}

        response = client.post("/api/v1/knowledge/upload", files=files, headers=headers)
        assert response.status_code == 400


def test_chunk_search_finds_uploaded_content():
    with TestClient(app) as client:
        headers = _auth_headers(client)
        content = (
            "Уникальная-фраза-для-поиска-12345 находится в этом документе базы знаний. " * 5
        ).encode("utf-8")
        files = {"file": ("search_target.txt", content, "text/plain")}
        upload = client.post("/api/v1/knowledge/upload", files=files, headers=headers)
        assert upload.status_code == 201

        search_response = client.get(
            "/api/v1/knowledge/search",
            params={"q": "Уникальная-фраза-для-поиска-12345"},
            headers=headers,
        )
        assert search_response.status_code == 200
        results = search_response.json()
        assert len(results) >= 1
        assert "Уникальная-фраза-для-поиска-12345" in results[0]["chunk"]["content"]
        assert results[0]["document"]["id"] == upload.json()["id"]
        assert 0 <= results[0]["score"] <= 1


def test_get_chunks_for_missing_document_returns_404():
    with TestClient(app) as client:
        headers = _auth_headers(client)
        response = client.get("/api/v1/knowledge/does-not-exist/chunks", headers=headers)
        assert response.status_code == 404
