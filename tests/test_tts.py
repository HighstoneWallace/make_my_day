from unittest.mock import patch, MagicMock
import io


@patch("app.tts.boto3.client")
def test_generate_audio_returns_bytes(mock_boto3_client):
    mock_polly = MagicMock()
    mock_boto3_client.return_value = mock_polly
    fake_audio = b"fake-mp3-bytes"
    mock_polly.synthesize_speech.return_value = {
        "AudioStream": io.BytesIO(fake_audio)
    }

    from app.tts import generate_audio
    result = generate_audio("Good morning!")

    assert result == fake_audio
    mock_polly.synthesize_speech.assert_called_once_with(
        Text="Good morning!",
        OutputFormat="mp3",
        VoiceId="Joanna",
        Engine="neural",
    )


@patch("app.tts.boto3.client")
def test_generate_audio_truncates_long_text(mock_boto3_client):
    mock_polly = MagicMock()
    mock_boto3_client.return_value = mock_polly
    mock_polly.synthesize_speech.return_value = {
        "AudioStream": io.BytesIO(b"audio")
    }

    long_text = "a" * 3000
    from app.tts import generate_audio
    generate_audio(long_text)

    call_kwargs = mock_polly.synthesize_speech.call_args[1]
    assert len(call_kwargs["Text"]) == 2500


@patch("app.tts.boto3.client")
def test_generate_audio_short_text_not_truncated(mock_boto3_client):
    mock_polly = MagicMock()
    mock_boto3_client.return_value = mock_polly
    mock_polly.synthesize_speech.return_value = {
        "AudioStream": io.BytesIO(b"audio")
    }

    short_text = "Hello!"
    from app.tts import generate_audio
    generate_audio(short_text)

    call_kwargs = mock_polly.synthesize_speech.call_args[1]
    assert call_kwargs["Text"] == short_text


@patch("app.tts.boto3.client")
def test_generate_audio_uses_correct_region(mock_boto3_client):
    mock_polly = MagicMock()
    mock_boto3_client.return_value = mock_polly
    mock_polly.synthesize_speech.return_value = {
        "AudioStream": io.BytesIO(b"audio")
    }

    from app.tts import generate_audio
    generate_audio("test")

    mock_boto3_client.assert_called_once_with("polly", region_name="eu-central-1")
