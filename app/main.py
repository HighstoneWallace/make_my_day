from fastapi import FastAPI
from fastapi.responses import HTMLResponse, StreamingResponse
from app.calendar_client import get_todays_events, get_tasks
from app.briefing import generate_briefing
from app.telegram_bot import send_briefing
from app.tts import generate_audio
import io

app = FastAPI()

@app.get("/api/briefing")
def get_briefing_json() -> dict:
    events = get_todays_events()
    tasks = get_tasks()
    briefing = generate_briefing(events, tasks)
    send_briefing(briefing)
    return {"briefing": briefing}

@app.get("/", response_class=HTMLResponse)
def get_dashboard() -> str:
    with open("frontend/index.html") as f:
        return f.read()

@app.get("/audio")
def get_audio() -> StreamingResponse:
    events = get_todays_events()
    tasks = get_tasks()
    briefing = generate_briefing(events, tasks)
    audio_bytes = generate_audio(briefing)
    return StreamingResponse(
        io.BytesIO(audio_bytes),
        media_type="audio/mpeg",
        headers={"Content-Disposition": "inline; filename=briefing.mp3"}
    )
