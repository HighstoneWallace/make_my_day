import boto3

def generate_audio(text: str) -> bytes:
    client = boto3.client("polly", region_name="eu-central-1")

    # Truncate to 2500 chars to stay within Polly's limit
    # and keep briefings concise for audio
    truncated = text[:2500]

    response = client.synthesize_speech(
        Text=truncated,
        OutputFormat="mp3",
        VoiceId="Joanna",
        Engine="neural"
    )

    audio_stream = response["AudioStream"]
    return audio_stream.read()
