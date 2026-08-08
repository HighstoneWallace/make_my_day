from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from prometheus_fastapi_instrumentator import Instrumentator

from app.briefing.router import router as briefing_router
from app.habits.router import router as habits_router
from app.shopping.router import router as shopping_router

app = FastAPI()

Instrumentator().instrument(app).expose(app)

app.include_router(briefing_router)
app.include_router(habits_router)
app.include_router(shopping_router)

@app.get("/", response_class=HTMLResponse)
def get_dashboard() -> str:
    """
    Serve the dashboard HTML page.
    This endpoint serves the main dashboard page of the application.
    It reads the HTML content from the 'frontend/index.html' file and returns it as a response.
    """
    with open("frontend/index.html") as f:
        return f.read()

@app.get("/health")
def health() -> dict[str, str]:
    """
    Health check endpoint.
    """
    return {"status": "ok"}
