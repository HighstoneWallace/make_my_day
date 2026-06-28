from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.habits.service import create_habit, delete_habit, list_habits, toggle_completion

router = APIRouter()


class HabitCreate(BaseModel):
    name: str
    emoji: str = "⭐"
    goal_streak: int = 30


class ToggleRequest(BaseModel):
    date: str  # YYYY-MM-DD


@router.get("/api/habits")
def get_habits() -> list[dict]:
    return list_habits()


@router.post("/api/habits", status_code=201)
def post_habit(body: HabitCreate) -> dict:
    return create_habit(body.name, body.emoji, body.goal_streak)


@router.post("/api/habits/{habit_id}/toggle")
def post_toggle(habit_id: str, body: ToggleRequest) -> dict:
    try:
        return toggle_completion(habit_id, body.date)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/api/habits/{habit_id}", status_code=204)
def delete_habit_endpoint(habit_id: str) -> None:
    delete_habit(habit_id)
