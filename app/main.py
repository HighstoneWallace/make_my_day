from fastapi import FastAPI
from app.calendar_client import get_todays_events
from app.briefing import generate_briefing
from app.telegram_bot import send_briefing

app = FastAPI()

@app.get("/briefing")
def get_briefing():
    events = get_todays_events()
    briefing = generate_briefing(events)
    send_briefing(briefing)
    return {"briefing": briefing}