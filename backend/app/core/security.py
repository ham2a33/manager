from datetime import datetime, timedelta, timezone
from hashlib import sha256

from app.core.config import settings


def hash_password(password: str) -> str:
    return sha256(f"{settings.secret_key}:{password}".encode()).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash


def create_access_token(subject: str, tenant_id: str, role: str = "owner") -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = f"{subject}|{tenant_id}|{role}|{int(expires_at.timestamp())}"
    signature = sha256(f"{payload}|{settings.secret_key}".encode()).hexdigest()
    return f"{payload}|{signature}"


def decode_access_token(token: str) -> dict[str, str]:
    parts = token.split("|")
    if len(parts) != 5:
        raise ValueError("Invalid token")
    subject, tenant_id, role, expires_at, signature = parts
    payload = "|".join(parts[:4])
    expected = sha256(f"{payload}|{settings.secret_key}".encode()).hexdigest()
    if signature != expected:
        raise ValueError("Invalid signature")
    if int(expires_at) < int(datetime.now(timezone.utc).timestamp()):
        raise ValueError("Token expired")
    return {"sub": subject, "tenant_id": tenant_id, "role": role}

