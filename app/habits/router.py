from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.auth.dependencies import get_current_user
from app.habits.service import create_habit, delete_habit, list_habits, toggle_completion

router = APIRouter()


class HabitCreate(BaseModel):
    name: str
    emoji: str = "⭐"
    goal_streak: int = 30


class ToggleRequest(BaseModel):
    date: str  # YYYY-MM-DD


@router.get("/api/habits")
def get_habits(user: dict = Depends(get_current_user)) -> list[dict]:
    return list_habits(user["user_id"])


@router.post("/api/habits", status_code=201)
def post_habit(body: HabitCreate, user: dict = Depends(get_current_user)) -> dict:
    return create_habit(user["user_id"], body.name, body.emoji, body.goal_streak)


@router.post("/api/habits/{habit_id}/toggle")
def post_toggle(habit_id: str, body: ToggleRequest, user: dict = Depends(get_current_user)) -> dict:
    try:
        return toggle_completion(user["user_id"], habit_id, body.date)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/api/habits/{habit_id}", status_code=204)
def delete_habit_endpoint(habit_id: str, user: dict = Depends(get_current_user)) -> None:
    try:
        delete_habit(user["user_id"], habit_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
