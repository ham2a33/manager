from fastapi.testclient import TestClient

from app.main import app


def test_login_and_conversation_flow():
    client = TestClient(app)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "owner@example.com", "password": "password"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}", "x-tenant-id": "demo-company"}
    created = client.post(
        "/api/v1/conversations",
        json={
            "customer_external_id": "telegram:42",
            "channel": "telegram",
            "text": "Need help with setup",
        },
        headers=headers,
    )
    assert created.status_code == 201
    conversation_id = created.json()["id"]
    ai_message = client.post(
        f"/api/v1/messages/{conversation_id}",
        json={"text": "Reply with setup details", "use_ai": True},
        headers=headers,
    )
    assert ai_message.status_code == 201
    assert ai_message.json()["sender"] == "ai"

