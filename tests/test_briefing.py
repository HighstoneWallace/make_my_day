from unittest.mock import patch, MagicMock
from app.briefing import format_context, generate_briefing


def test_format_context_with_events() -> None:
    '''
    Test that format_context correctly formats a list of events.
    '''
    first_event = "Yoga"
    second_event = "Lunch"
    events = [
        {
            "summary": first_event,
            "start": {"dateTime": "2026-04-08T09:00:00"}
        },
        {
            "summary": second_event,
            "start": {"dateTime": "2026-04-08T12:00:00"}
        }
    ]
    tasks = []
    result = format_context(events, tasks)
    assert first_event in result
    assert second_event in result


def test_format_events_empty():
    '''
    Test that format_context returns the correct message when no events are provided.
    '''
    result = format_context([], [])
    assert "No calendar events scheduled for today." in result
    assert "No pending tasks." in result

@patch("app.briefing.anthropic.Anthropic")
def test_generate_briefing_calls_api(mock_anthropic):
    '''
    Test that generate_briefing calls the Anthropic API with the correct parameters.
    '''
    mock_client = MagicMock()
    mock_anthropic.return_value = mock_client
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text="Good morning! You have a busy day ahead.")]
    )

    events = [{"summary": "Standup", "start": {"dateTime": "2026-04-08T09:00:00"}}]
    tasks = [{"title": "Write report", "tasklist": "My Tasks", "due": None, "notes": None}]
    result = generate_briefing(events, tasks)
    assert "Good morning" in result
    mock_client.messages.create.assert_called_once()
