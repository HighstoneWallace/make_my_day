import io
from unittest.mock import patch, MagicMock
from app.briefing.service import format_context, generate_briefing


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


@patch("app.briefing.service.anthropic.Anthropic")
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


@patch("app.briefing.service.boto3.client")
def test_generate_audio_returns_bytes(mock_boto3_client):
    mock_polly = MagicMock()
    mock_boto3_client.return_value = mock_polly
    fake_audio = b"fake-mp3-bytes"
    mock_polly.synthesize_speech.return_value = {
        "AudioStream": io.BytesIO(fake_audio)
    }

    from app.briefing.service import generate_audio
    result = generate_audio("Good morning!")

    assert result == fake_audio
    mock_polly.synthesize_speech.assert_called_once_with(
        Text="Good morning!",
        OutputFormat="mp3",
        VoiceId="Joanna",
        Engine="neural",
    )


@patch("app.briefing.service.boto3.client")
def test_generate_audio_truncates_long_text(mock_boto3_client):
    mock_polly = MagicMock()
    mock_boto3_client.return_value = mock_polly
    mock_polly.synthesize_speech.return_value = {
        "AudioStream": io.BytesIO(b"audio")
    }

    long_text = "a" * 3000
    from app.briefing.service import generate_audio
    generate_audio(long_text)

    call_kwargs = mock_polly.synthesize_speech.call_args[1]
    assert len(call_kwargs["Text"]) == 2500


@patch("app.briefing.service.boto3.client")
def test_generate_audio_short_text_not_truncated(mock_boto3_client):
    mock_polly = MagicMock()
    mock_boto3_client.return_value = mock_polly
    mock_polly.synthesize_speech.return_value = {
        "AudioStream": io.BytesIO(b"audio")
    }

    short_text = "Hello!"
    from app.briefing.service import generate_audio
    generate_audio(short_text)

    call_kwargs = mock_polly.synthesize_speech.call_args[1]
    assert call_kwargs["Text"] == short_text


@patch("app.briefing.service.boto3.client")
def test_generate_audio_uses_correct_region(mock_boto3_client):
    mock_polly = MagicMock()
    mock_boto3_client.return_value = mock_polly
    mock_polly.synthesize_speech.return_value = {
        "AudioStream": io.BytesIO(b"audio")
    }

    from app.briefing.service import generate_audio
    generate_audio("test")

    mock_boto3_client.assert_called_once_with("polly", region_name="eu-central-1")
