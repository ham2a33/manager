from fastapi.testclient import TestClient

from app.main import app


def test_company_clients_channels_knowledge_and_settings_endpoints():
    client = TestClient(app)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "owner@example.com", "password": "password"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]
    company_id = login.json()["company_id"]
    headers = {"Authorization": f"Bearer {token}"}

    company_patch = client.patch(
        f"/api/v1/companies/{company_id}",
        json={
            "name": "Demo Company Updated",
            "email": "hello@example.com",
            "phone": "+123456789",
            "language": "ru",
            "ai_prompt": "Be concise",
        },
        headers=headers,
    )
    assert company_patch.status_code == 200
    assert company_patch.json()["name"] == "Demo Company Updated"
    assert company_patch.json()["email"] == "hello@example.com"

    client_post = client.post(
        "/api/v1/clients",
        json={
            "external_user_id": "telegram:99",
            "channel": "telegram",
            "phone": "+1000000",
            "email": "customer@example.com",
            "full_name": "Jane Doe",
        },
        headers=headers,
    )
    assert client_post.status_code == 201
    client_id = client_post.json()["id"]

    clients_list = client.get("/api/v1/clients", headers=headers)
    assert clients_list.status_code == 200
    assert any(item["id"] == client_id for item in clients_list.json())

    channel_post = client.post(
        "/api/v1/channels",
        json={"platform": "telegram", "external_id": "abc123", "status": "connected"},
        headers=headers,
    )
    assert channel_post.status_code == 201
    channel_id = channel_post.json()["id"]

    channels_list = client.get("/api/v1/channels", headers=headers)
    assert channels_list.status_code == 200
    assert any(item["id"] == channel_id for item in channels_list.json())

    knowledge_post = client.post(
        "/api/v1/knowledge",
        json={"title": "Ops", "content": "Operational notes"},
        headers=headers,
    )
    assert knowledge_post.status_code == 201
    knowledge_id = knowledge_post.json()["id"]

    knowledge_delete = client.delete(f"/api/v1/knowledge/{knowledge_id}", headers=headers)
    assert knowledge_delete.status_code == 204

    settings_get = client.get("/api/v1/settings", headers=headers)
    assert settings_get.status_code == 200
    assert settings_get.json()["company_id"] == company_id

    settings_patch = client.patch(
        "/api/v1/settings",
        json={"language": "en", "ai_prompt": "Always answer politely"},
        headers=headers,
    )
    assert settings_patch.status_code == 200
    assert settings_patch.json()["language"] == "en"
    assert settings_patch.json()["ai_prompt"] == "Always answer politely"
