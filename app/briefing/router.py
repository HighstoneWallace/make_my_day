from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.briefing.service import create_briefing, create_briefing_audio

router = APIRouter()

@router.get("/api/briefing")
def get_briefing_json() -> dict:
    """
    Get the briefing as a JSON response, based on the user's calendar events and tasks for today.
    The briefing is generated using the Claude API and sent to the user via Telegram.
    """
    return create_briefing()

@router.get("/api/briefing/audio")
def get_briefing_audio() -> StreamingResponse:
    """
    Get the briefing as an audio response, based on the user's calendar events and tasks for today.
    The briefing is generated using the Claude API and sent to the user via Telegram.
    """
    return create_briefing_audio()
