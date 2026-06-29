from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.shopping.service import create_item, delete_item, list_items, toggle_purchased

router = APIRouter()


class ShoppingItemCreate(BaseModel):
    name: str
    description: str = ""
    price_min: float | None = None
    price_max: float | None = None
    url: str = ""


@router.get("/api/shopping")
def get_items() -> list[dict]:
    return list_items()


@router.post("/api/shopping", status_code=201)
def post_item(body: ShoppingItemCreate) -> dict:
    return create_item(body.name, body.description, body.price_min, body.price_max, body.url)


@router.post("/api/shopping/{item_id}/toggle")
def post_toggle(item_id: str) -> dict:
    try:
        return toggle_purchased(item_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/api/shopping/{item_id}", status_code=204)
def delete_item_endpoint(item_id: str) -> None:
    delete_item(item_id)
