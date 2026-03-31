from fastapi import FastAPI
from app.calendar_client import get_todays_events
from app.briefing import generate_briefing

app = FastAPI()

@app.get("/briefing")
def get_briefing():
    events = get_todays_events()
    briefing = generate_briefing(events)
    return {"briefing": briefing}