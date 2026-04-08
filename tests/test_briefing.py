from unittest.mock import patch, MagicMock
from app.briefing import format_events, generate_briefing


def test_format_events_with_events() -> None:
    '''
    Test that format_events correctly formats a list of events.
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
    result = format_events(events)
    assert first_event in result
    assert second_event in result


def test_format_events_empty():
    '''
    Test that format_events returns the correct message when no events are provided.
    '''
    result = format_events([])
    assert result == "No events scheduled for today."

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
    result = generate_briefing(events)

    assert "Good morning" in result
    mock_client.messages.create.assert_called_once()
