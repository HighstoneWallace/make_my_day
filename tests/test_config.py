import os
from unittest.mock import patch, MagicMock


def test_load_config_local_reads_env_vars():
    env = {
        "ENV": "local",
        "ANTHROPIC_API_KEY": "test-anthropic-key",
        "TELEGRAM_BOT_TOKEN": "test-bot-token",
        "TELEGRAM_CHAT_ID": "123456",
    }
    with patch.dict(os.environ, env, clear=False):
        from app.config import load_config
        config = load_config()
    assert config["anthropic_api_key"] == "test-anthropic-key"
    assert config["telegram_bot_token"] == "test-bot-token"
    assert config["telegram_chat_id"] == "123456"


def test_load_config_production_calls_ssm():
    mock_ssm = MagicMock()
    mock_ssm.get_parameter.return_value = {"Parameter": {"Value": "prod-secret"}}

    with patch("app.config.boto3.client", return_value=mock_ssm):
        with patch.dict(os.environ, {"ENV": "production"}, clear=False):
            from app.config import load_config
            config = load_config()

    assert config["anthropic_api_key"] == "prod-secret"
    assert config["telegram_bot_token"] == "prod-secret"
    assert config["telegram_chat_id"] == "prod-secret"


def test_get_parameter_calls_ssm_with_decryption():
    mock_ssm = MagicMock()
    mock_ssm.get_parameter.return_value = {"Parameter": {"Value": "secret-value"}}

    with patch("app.config.boto3.client", return_value=mock_ssm):
        from app.config import get_parameter
        result = get_parameter("/makemyday/some_key")

    assert result == "secret-value"
    mock_ssm.get_parameter.assert_called_once_with(
        Name="/makemyday/some_key", WithDecryption=True
    )


def test_get_parameter_without_decryption():
    mock_ssm = MagicMock()
    mock_ssm.get_parameter.return_value = {"Parameter": {"Value": "plain-value"}}

    with patch("app.config.boto3.client", return_value=mock_ssm):
        from app.config import get_parameter
        result = get_parameter("/makemyday/some_key", with_decryption=False)

    assert result == "plain-value"
    mock_ssm.get_parameter.assert_called_once_with(
        Name="/makemyday/some_key", WithDecryption=False
    )
