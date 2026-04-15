from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from app.calendar_client import get_todays_events, get_tasks
from app.briefing import generate_briefing
from app.telegram_bot import send_briefing

app = FastAPI()

@app.get("/api/briefing")
def get_briefing_json():
    events = get_todays_events()
    tasks = get_tasks()
    briefing = generate_briefing(events, tasks)
    send_briefing(briefing)
    return {"briefing": briefing}

@app.get("/", response_class=HTMLResponse)
def get_dashboard():
    with open("frontend/index.html") as f:
        return f.read()