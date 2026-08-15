from decimal import Decimal
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.auth.dependencies import get_current_user
from app.main import app

TEST_USER = {"user_id": "user-1", "email": "test@example.com", "name": "Test", "avatar_url": None, "created_at": "2026-06-01"}


@pytest.fixture(autouse=True)
def _authenticated():
    app.dependency_overrides[get_current_user] = lambda: TEST_USER
    yield
    app.dependency_overrides.pop(get_current_user, None)


client = TestClient(app)


# ── service-level helpers ────────────────────────────────────────────────────

def _make_dynamo_item(
    item_id="abc-123",
    user_id="user-1",
    name="Headphones",
    description="Noise cancelling",
    price_min=None,
    price_max=None,
    url="https://example.com",
    purchased=False,
    created_at="2026-06-29",
):
    item = {
        "item_id": item_id,
        "user_id": user_id,
        "name": name,
        "description": description,
        "url": url,
        "purchased": purchased,
        "created_at": created_at,
    }
    if price_min is not None:
        item["price_min"] = Decimal(str(price_min))
    if price_max is not None:
        item["price_max"] = Decimal(str(price_max))
    return item


def _mock_table(items=None, get_item=None):
    table = MagicMock()
    table.scan.return_value = {"Items": items or []}
    if get_item is not None:
        table.get_item.return_value = {"Item": get_item}
    return table


# ── service unit tests ───────────────────────────────────────────────────────

@patch("app.shopping.service._table")
def test_list_items_empty(mock_table_fn):
    mock_table_fn.return_value = _mock_table([])
    from app.shopping.service import list_items
    assert list_items("user-1") == []


@patch("app.shopping.service._table")
def test_list_items_returns_sorted_by_created_at(mock_table_fn):
    items = [
        _make_dynamo_item(item_id="b", name="B", created_at="2026-06-29"),
        _make_dynamo_item(item_id="a", name="A", created_at="2026-06-28"),
    ]
    mock_table_fn.return_value = _mock_table(items)
    from app.shopping.service import list_items
    result = list_items("user-1")
    assert result[0]["item_id"] == "a"
    assert result[1]["item_id"] == "b"


@patch("app.shopping.service._table")
def test_list_items_serializes_price(mock_table_fn):
    items = [_make_dynamo_item(price_min=10, price_max=50)]
    mock_table_fn.return_value = _mock_table(items)
    from app.shopping.service import list_items
    result = list_items("user-1")
    assert result[0]["price_min"] == 10.0
    assert result[0]["price_max"] == 50.0


@patch("app.shopping.service._table")
def test_list_items_no_price_returns_none(mock_table_fn):
    items = [_make_dynamo_item()]
    mock_table_fn.return_value = _mock_table(items)
    from app.shopping.service import list_items
    result = list_items("user-1")
    assert result[0]["price_min"] is None
    assert result[0]["price_max"] is None


@patch("app.shopping.service._table")
def test_create_item_puts_to_dynamo(mock_table_fn):
    table = _mock_table()
    mock_table_fn.return_value = table
    from app.shopping.service import create_item
    result = create_item("user-1", "Keyboard", "Mechanical", 80.0, 150.0, "https://shop.com")
    table.put_item.assert_called_once()
    call_item = table.put_item.call_args[1]["Item"]
    assert call_item["name"] == "Keyboard"
    assert call_item["user_id"] == "user-1"
    assert call_item["description"] == "Mechanical"
    assert float(call_item["price_min"]) == 80.0
    assert float(call_item["price_max"]) == 150.0
    assert call_item["url"] == "https://shop.com"
    assert call_item["purchased"] is False
    assert result["purchased"] is False


@patch("app.shopping.service._table")
def test_create_item_without_price(mock_table_fn):
    table = _mock_table()
    mock_table_fn.return_value = table
    from app.shopping.service import create_item
    result = create_item("user-1", "Book")
    assert result["price_min"] is None
    assert result["price_max"] is None
    call_item = table.put_item.call_args[1]["Item"]
    assert "price_min" not in call_item
    assert "price_max" not in call_item


@patch("app.shopping.service._table")
def test_toggle_purchased_true_to_false(mock_table_fn):
    dynamo_item = _make_dynamo_item(purchased=True)
    table = _mock_table(get_item=dynamo_item)
    mock_table_fn.return_value = table
    from app.shopping.service import toggle_purchased
    result = toggle_purchased("user-1", "abc-123")
    assert result["purchased"] is False
    table.update_item.assert_called_once()


@patch("app.shopping.service._table")
def test_toggle_purchased_false_to_true(mock_table_fn):
    dynamo_item = _make_dynamo_item(purchased=False)
    table = _mock_table(get_item=dynamo_item)
    mock_table_fn.return_value = table
    from app.shopping.service import toggle_purchased
    result = toggle_purchased("user-1", "abc-123")
    assert result["purchased"] is True


@patch("app.shopping.service._table")
def test_toggle_purchased_not_found(mock_table_fn):
    table = MagicMock()
    table.get_item.return_value = {}
    mock_table_fn.return_value = table
    from app.shopping.service import toggle_purchased
    with pytest.raises(ValueError, match="not found"):
        toggle_purchased("user-1", "missing-id")


@patch("app.shopping.service._table")
def test_toggle_purchased_wrong_owner(mock_table_fn):
    dynamo_item = _make_dynamo_item(user_id="someone-else")
    table = _mock_table(get_item=dynamo_item)
    mock_table_fn.return_value = table
    from app.shopping.service import toggle_purchased
    with pytest.raises(ValueError, match="not found"):
        toggle_purchased("user-1", "abc-123")


@patch("app.shopping.service._table")
def test_delete_item_calls_dynamo(mock_table_fn):
    table = _mock_table(get_item=_make_dynamo_item())
    mock_table_fn.return_value = table
    from app.shopping.service import delete_item
    delete_item("user-1", "abc-123")
    table.delete_item.assert_called_once_with(Key={"item_id": "abc-123"})


@patch("app.shopping.service._table")
def test_delete_item_wrong_owner_raises(mock_table_fn):
    table = _mock_table(get_item=_make_dynamo_item(user_id="someone-else"))
    mock_table_fn.return_value = table
    from app.shopping.service import delete_item
    with pytest.raises(ValueError, match="not found"):
        delete_item("user-1", "abc-123")
    table.delete_item.assert_not_called()


# ── API / router tests ───────────────────────────────────────────────────────

def test_shopping_requires_auth():
    app.dependency_overrides.pop(get_current_user, None)
    res = client.get("/api/shopping")
    assert res.status_code == 401
    app.dependency_overrides[get_current_user] = lambda: TEST_USER


@patch("app.shopping.service._table")
def test_get_shopping_returns_list(mock_table_fn):
    items = [_make_dynamo_item()]
    mock_table_fn.return_value = _mock_table(items)
    res = client.get("/api/shopping")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["name"] == "Headphones"
    assert data[0]["url"] == "https://example.com"


@patch("app.shopping.service._table")
def test_post_shopping_creates_item(mock_table_fn):
    table = _mock_table()
    mock_table_fn.return_value = table
    res = client.post("/api/shopping", json={
        "name": "Monitor",
        "description": "4K display",
        "price_min": 200.0,
        "price_max": 400.0,
        "url": "https://monitor.com",
    })
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Monitor"
    assert data["price_min"] == 200.0
    assert data["price_max"] == 400.0
    assert data["purchased"] is False


@patch("app.shopping.service._table")
def test_post_shopping_minimal(mock_table_fn):
    table = _mock_table()
    mock_table_fn.return_value = table
    res = client.post("/api/shopping", json={"name": "Coffee"})
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Coffee"
    assert data["price_min"] is None
    assert data["price_max"] is None
    assert data["url"] == ""


@patch("app.shopping.service._table")
def test_post_shopping_missing_name_returns_422(mock_table_fn):
    mock_table_fn.return_value = _mock_table()
    res = client.post("/api/shopping", json={"description": "no name"})
    assert res.status_code == 422


@patch("app.shopping.service._table")
def test_toggle_endpoint_success(mock_table_fn):
    dynamo_item = _make_dynamo_item(purchased=False)
    table = _mock_table(get_item=dynamo_item)
    mock_table_fn.return_value = table
    res = client.post("/api/shopping/abc-123/toggle")
    assert res.status_code == 200
    assert res.json()["purchased"] is True


@patch("app.shopping.service._table")
def test_toggle_endpoint_not_found(mock_table_fn):
    table = MagicMock()
    table.get_item.return_value = {}
    mock_table_fn.return_value = table
    res = client.post("/api/shopping/no-such-id/toggle")
    assert res.status_code == 404


@patch("app.shopping.service._table")
def test_delete_endpoint_returns_204(mock_table_fn):
    table = _mock_table(get_item=_make_dynamo_item())
    mock_table_fn.return_value = table
    res = client.delete("/api/shopping/abc-123")
    assert res.status_code == 204
    table.delete_item.assert_called_once_with(Key={"item_id": "abc-123"})
