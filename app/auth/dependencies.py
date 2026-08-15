from fastapi import HTTPException, Request

from app.auth.security import verify_session_token
from app.auth.service import _serialize, get_user_by_email

SESSION_COOKIE_NAME = "session"


def get_current_user(request: Request) -> dict:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = verify_session_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    item = get_user_by_email(payload["email"])
    if not item:
        raise HTTPException(status_code=401, detail="User not found")

    return _serialize(item)
