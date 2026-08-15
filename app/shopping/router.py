from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.auth.dependencies import get_current_user
from app.shopping.service import create_item, delete_item, list_items, toggle_purchased

router = APIRouter()


class ShoppingItemCreate(BaseModel):
    name: str
    description: str = ""
    price_min: float | None = None
    price_max: float | None = None
    url: str = ""


@router.get("/api/shopping")
def get_items(user: dict = Depends(get_current_user)) -> list[dict]:
    return list_items(user["user_id"])


@router.post("/api/shopping", status_code=201)
def post_item(body: ShoppingItemCreate, user: dict = Depends(get_current_user)) -> dict:
    return create_item(user["user_id"], body.name, body.description, body.price_min, body.price_max, body.url)


@router.post("/api/shopping/{item_id}/toggle")
def post_toggle(item_id: str, user: dict = Depends(get_current_user)) -> dict:
    try:
        return toggle_purchased(user["user_id"], item_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/api/shopping/{item_id}", status_code=204)
def delete_item_endpoint(item_id: str, user: dict = Depends(get_current_user)) -> None:
    try:
        delete_item(user["user_id"], item_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
