from unittest.mock import patch, mock_open
from fastapi.testclient import TestClient


def test_health_returns_ok():
    from app.main import app
    client = TestClient(app)
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("builtins.open", mock_open(read_data="<html><body>Dashboard</body></html>"))
def test_get_dashboard_returns_html():
    from app.main import app
    client = TestClient(app)
    response = client.get("/")

    assert response.status_code == 200
    assert "Dashboard" in response.text
    assert response.headers["content-type"].startswith("text/html")
