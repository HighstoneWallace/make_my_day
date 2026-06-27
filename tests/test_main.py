from unittest.mock import patch, MagicMock, mock_open
from fastapi.testclient import TestClient


@patch("app.main.generate_audio", return_value=b"fake-audio")
@patch("app.main.send_briefing")
@patch("app.main.generate_briefing", return_value="Good morning!")
@patch("app.main.get_tasks", return_value=[])
@patch("app.main.get_todays_events", return_value=[])
def test_get_briefing_returns_text(
    mock_events, mock_tasks, mock_briefing, mock_send, mock_audio
):
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/briefing")

    assert response.status_code == 200
    assert response.json() == {"briefing": "Good morning!"}
    mock_briefing.assert_called_once()
    mock_send.assert_called_once_with("Good morning!")


@patch("app.main.generate_audio", return_value=b"fake-audio")
@patch("app.main.send_briefing")
@patch("app.main.generate_briefing", return_value="Good morning!")
@patch("app.main.get_tasks", return_value=[])
@patch("app.main.get_todays_events", return_value=[])
def test_get_briefing_passes_events_and_tasks_to_briefing(
    mock_events, mock_tasks, mock_briefing, mock_send, mock_audio
):
    fake_events = [{"summary": "Standup", "start": {"dateTime": "2026-06-27T09:00:00"}}]
    fake_tasks = [{"title": "Report", "tasklist": "Work", "due": None}]
    mock_events.return_value = fake_events
    mock_tasks.return_value = fake_tasks

    from app.main import app
    client = TestClient(app)
    client.get("/api/briefing")

    mock_briefing.assert_called_once_with(fake_events, fake_tasks)


def test_health_returns_ok():
    from app.main import app
    client = TestClient(app)
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("app.main.generate_audio", return_value=b"fake-mp3-bytes")
@patch("app.main.send_briefing")
@patch("app.main.generate_briefing", return_value="Good morning!")
@patch("app.main.get_tasks", return_value=[])
@patch("app.main.get_todays_events", return_value=[])
def test_get_audio_returns_mp3_stream(
    mock_events, mock_tasks, mock_briefing, mock_send, mock_audio
):
    from app.main import app
    client = TestClient(app)
    response = client.get("/audio")

    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/mpeg"
    assert response.content == b"fake-mp3-bytes"


@patch("builtins.open", mock_open(read_data="<html><body>Dashboard</body></html>"))
def test_get_dashboard_returns_html():
    from app.main import app
    client = TestClient(app)
    response = client.get("/")

    assert response.status_code == 200
    assert "Dashboard" in response.text
    assert response.headers["content-type"].startswith("text/html")
