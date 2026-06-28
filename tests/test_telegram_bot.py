from unittest.mock import patch, MagicMock
import httpx
import pytest


@patch("app.notifications.telegram_bot.httpx.post")
def test_send_briefing_posts_to_correct_url(mock_post):
    mock_response = MagicMock()
    mock_response.json.return_value = {"ok": True}
    mock_post.return_value = mock_response

    from app.notifications.telegram_bot import send_briefing
    result = send_briefing("Good morning!")

    assert mock_post.called
    call_url = mock_post.call_args[0][0]
    assert "api.telegram.org" in call_url
    assert "sendMessage" in call_url


@patch("app.notifications.telegram_bot.httpx.post")
def test_send_briefing_includes_text_in_payload(mock_post):
    mock_response = MagicMock()
    mock_response.json.return_value = {"ok": True}
    mock_post.return_value = mock_response

    from app.notifications.telegram_bot import send_briefing
    send_briefing("Stand-up at 9am.")

    payload = mock_post.call_args[1]["json"]
    assert payload["text"] == "Stand-up at 9am."
    assert payload["parse_mode"] == "Markdown"


@patch("app.notifications.telegram_bot.httpx.post")
def test_send_briefing_returns_json_response(mock_post):
    expected = {"ok": True, "result": {"message_id": 42}}
    mock_response = MagicMock()
    mock_response.json.return_value = expected
    mock_post.return_value = mock_response

    from app.notifications.telegram_bot import send_briefing
    result = send_briefing("Hello")

    assert result == expected


@patch("app.notifications.telegram_bot.httpx.post")
def test_send_briefing_raises_on_http_error(mock_post):
    mock_response = MagicMock()
    mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
        "400 Bad Request", request=MagicMock(), response=MagicMock()
    )
    mock_post.return_value = mock_response

    from app.notifications.telegram_bot import send_briefing
    with pytest.raises(httpx.HTTPStatusError):
        send_briefing("Hello")
