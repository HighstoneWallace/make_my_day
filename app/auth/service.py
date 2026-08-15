import uuid
from datetime import date

import boto3

from app.auth.security import hash_password, verify_password

TABLE_NAME = "makemydays-users"

_dynamodb = None


def _table():
    global _dynamodb
    if _dynamodb is None:
        _dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    return _dynamodb.Table(TABLE_NAME)


def _serialize(item: dict) -> dict:
    return {
        "user_id": item["user_id"],
        "email": item["email"],
        "name": item.get("name", ""),
        "avatar_url": item.get("avatar_url"),
        "created_at": item.get("created_at", ""),
    }


def get_user_by_email(email: str) -> dict | None:
    response = _table().get_item(Key={"email": email.strip().lower()})
    return response.get("Item")


def create_user(email: str, password: str, name: str) -> dict:
    email = email.strip().lower()
    if get_user_by_email(email):
        raise ValueError("An account with this email already exists")

    record = {
        "email": email,
        "user_id": str(uuid.uuid4()),
        "name": name.strip(),
        "password_hash": hash_password(password),
        "created_at": date.today().isoformat(),
    }
    _table().put_item(Item=record)
    return _serialize(record)


def authenticate_user(email: str, password: str) -> dict:
    item = get_user_by_email(email)
    if not item or not verify_password(password, item["password_hash"]):
        raise ValueError("Invalid email or password")
    return _serialize(item)


def update_profile(email: str, name: str | None = None, avatar_url: str | None = None) -> dict:
    item = get_user_by_email(email)
    if not item:
        raise ValueError("User not found")

    updates: dict = {}
    if name is not None and name.strip():
        updates["name"] = name.strip()
    if avatar_url is not None:
        updates["avatar_url"] = avatar_url

    if updates:
        _table().update_item(
            Key={"email": item["email"]},
            UpdateExpression="SET " + ", ".join(f"{k} = :{k}" for k in updates),
            ExpressionAttributeValues={f":{k}": v for k, v in updates.items()},
        )
        item.update(updates)

    return _serialize(item)
