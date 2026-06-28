import uuid
from datetime import date, timedelta

import boto3

TABLE_NAME = "makemyday-habits"

_dynamodb = None


def _table():
    global _dynamodb
    if _dynamodb is None:
        _dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    return _dynamodb.Table(TABLE_NAME)


def _calculate_current_streak(completions: set[str]) -> int:
    streak = 0
    check = date.today()
    while True:
        if check.isoformat() in completions:
            streak += 1
            check -= timedelta(days=1)
        elif streak == 0 and (check + timedelta(days=1)).isoformat() in completions:
            # allow streak that ended yesterday to still show
            check -= timedelta(days=1)
        else:
            break
        if streak > 365:
            break
    return streak


def list_habits() -> list[dict]:
    response = _table().scan()
    habits = []
    for item in response.get("Items", []):
        completions: set[str] = set(item.get("completions", []))
        goal_streak = int(item.get("goal_streak", 30))
        current_streak = _calculate_current_streak(completions)
        habits.append({
            "habit_id": item["habit_id"],
            "name": item["name"],
            "emoji": item.get("emoji", "⭐"),
            "goal_streak": goal_streak,
            "current_streak": current_streak,
            "completions": sorted(completions),
            "created_at": item.get("created_at", ""),
        })
    habits.sort(key=lambda h: h["created_at"])
    return habits


def create_habit(name: str, emoji: str = "⭐", goal_streak: int = 30) -> dict:
    habit_id = str(uuid.uuid4())
    created_at = date.today().isoformat()
    # DynamoDB does not allow empty sets, so omit completions on creation
    _table().put_item(Item={
        "habit_id": habit_id,
        "name": name,
        "emoji": emoji,
        "goal_streak": goal_streak,
        "created_at": created_at,
    })
    return {
        "habit_id": habit_id,
        "name": name,
        "emoji": emoji,
        "goal_streak": goal_streak,
        "current_streak": 0,
        "completions": [],
        "created_at": created_at,
    }


def toggle_completion(habit_id: str, date_str: str) -> dict:
    table = _table()
    response = table.get_item(Key={"habit_id": habit_id})
    item = response.get("Item")
    if not item:
        raise ValueError(f"Habit {habit_id} not found")

    completions: set[str] = set(item.get("completions", []))
    if date_str in completions:
        completions.discard(date_str)
        table.update_item(
            Key={"habit_id": habit_id},
            UpdateExpression="DELETE completions :d",
            ExpressionAttributeValues={":d": {date_str}},
        )
    else:
        completions.add(date_str)
        table.update_item(
            Key={"habit_id": habit_id},
            UpdateExpression="ADD completions :d",
            ExpressionAttributeValues={":d": {date_str}},
        )

    current_streak = _calculate_current_streak(completions)
    return {
        "habit_id": habit_id,
        "done": date_str in completions,
        "current_streak": current_streak,
        "completions": sorted(completions),
    }


def delete_habit(habit_id: str) -> None:
    _table().delete_item(Key={"habit_id": habit_id})
