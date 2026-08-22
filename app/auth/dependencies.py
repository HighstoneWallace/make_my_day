import os

from fastapi import HTTPException, Request, Response

from app.auth.security import create_session_token, verify_session_token
from app.auth.service import _serialize, get_user_by_email

SESSION_COOKIE_NAME = "session"
COOKIE_SECURE = os.getenv("ENV") == "production"


def set_session_cookie(response: Response, user: dict) -> None:
    # No max_age/expires: the browser drops the cookie when the session ends
    # (browser fully closed). The token's own "exp" enforces the inactivity
    # timeout while the browser session is still open.
    token = create_session_token({"user_id": user["user_id"], "email": user["email"]})
    response.set_cookie(
        SESSION_COOKIE_NAME,
        token,
        httponly=True,
        samesite="lax",
        secure=COOKIE_SECURE,
    )


def get_current_user(request: Request, response: Response) -> dict:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = verify_session_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    item = get_user_by_email(payload["email"])
    if not item:
        raise HTTPException(status_code=401, detail="User not found")

    user = _serialize(item)
    set_session_cookie(response, user)  # slide the idle timeout forward on activity
    return user
