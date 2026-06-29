import uuid
from datetime import date
from decimal import Decimal

import boto3

TABLE_NAME = "makemyday-shopping"

_dynamodb = None


def _table():
    global _dynamodb
    if _dynamodb is None:
        _dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    return _dynamodb.Table(TABLE_NAME)


def list_items() -> list[dict]:
    response = _table().scan()
    items = []
    for item in response.get("Items", []):
        items.append(_serialize(item))
    items.sort(key=lambda i: i["created_at"])
    return items


def create_item(
    name: str,
    description: str = "",
    price_min: float | None = None,
    price_max: float | None = None,
    url: str = "",
) -> dict:
    item_id = str(uuid.uuid4())
    created_at = date.today().isoformat()
    record: dict = {
        "item_id": item_id,
        "name": name,
        "description": description,
        "url": url,
        "purchased": False,
        "created_at": created_at,
    }
    if price_min is not None:
        record["price_min"] = Decimal(str(price_min))
    if price_max is not None:
        record["price_max"] = Decimal(str(price_max))

    _table().put_item(Item=record)
    return _serialize(record)


def toggle_purchased(item_id: str) -> dict:
    table = _table()
    response = table.get_item(Key={"item_id": item_id})
    item = response.get("Item")
    if not item:
        raise ValueError(f"Item {item_id} not found")

    new_state = not item.get("purchased", False)
    table.update_item(
        Key={"item_id": item_id},
        UpdateExpression="SET purchased = :p",
        ExpressionAttributeValues={":p": new_state},
    )
    item["purchased"] = new_state
    return _serialize(item)


def delete_item(item_id: str) -> None:
    _table().delete_item(Key={"item_id": item_id})


def _serialize(item: dict) -> dict:
    price_min = item.get("price_min")
    price_max = item.get("price_max")
    return {
        "item_id": item["item_id"],
        "name": item["name"],
        "description": item.get("description", ""),
        "price_min": float(price_min) if price_min is not None else None,
        "price_max": float(price_max) if price_max is not None else None,
        "url": item.get("url", ""),
        "purchased": bool(item.get("purchased", False)),
        "created_at": item.get("created_at", ""),
    }
