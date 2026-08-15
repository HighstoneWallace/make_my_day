import base64
import hashlib
import hmac
import json
import os
import time

SESSION_SECRET = os.getenv("SESSION_SECRET", "dev-insecure-secret-change-me")
SESSION_TTL_SECONDS = 60 * 60 * 24 * 30  # 30 days
PBKDF2_ITERATIONS = 260_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERATIONS)
    return base64.b64encode(salt + digest).decode()


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        raw = base64.b64decode(stored_hash.encode())
    except (ValueError, TypeError):
        return False
    salt, digest = raw[:16], raw[16:]
    candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERATIONS)
    return hmac.compare_digest(digest, candidate)


def _sign(body: str) -> str:
    return hmac.new(SESSION_SECRET.encode(), body.encode(), hashlib.sha256).hexdigest()


def create_session_token(payload: dict, ttl_seconds: int = SESSION_TTL_SECONDS) -> str:
    full_payload = {**payload, "exp": int(time.time()) + ttl_seconds}
    body = base64.urlsafe_b64encode(json.dumps(full_payload).encode()).decode().rstrip("=")
    return f"{body}.{_sign(body)}"


def verify_session_token(token: str) -> dict | None:
    try:
        body, signature = token.split(".", 1)
    except ValueError:
        return None
    if not hmac.compare_digest(signature, _sign(body)):
        return None
    try:
        padded = body + "=" * (-len(body) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded.encode()))
    except (ValueError, json.JSONDecodeError):
        return None
    if payload.get("exp", 0) < time.time():
        return None
    return payload
