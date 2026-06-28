from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.briefing.calendar_client import get_formatted_events, get_tasks
from app.briefing.service import create_briefing, create_briefing_audio

router = APIRouter()


@router.get("/api/events")
def get_events() -> list[dict]:
    return get_formatted_events()


@router.get("/api/tasks")
def get_tasks_endpoint() -> list[dict]:
    return get_tasks()


@router.get("/api/briefing")
def get_briefing_json() -> dict:
    return create_briefing()


@router.get("/api/briefing/audio")
def get_briefing_audio() -> StreamingResponse:
    return create_briefing_audio()
