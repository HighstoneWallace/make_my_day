import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def get_parameter(name: str, with_decryption: bool = True) -> str:
    client = boto3.client("ssm", region_name="eu-central-1")
    response = client.get_parameter(Name=name, WithDecryption=with_decryption)
    return response["Parameter"]["Value"]

def load_config():
    # Fall back to .env for local development
    if os.getenv("ENV") == "production":
        return {
            "anthropic_api_key": get_parameter("/makemyday/anthropic_api_key"),
            "telegram_bot_token": get_parameter("/makemyday/telegram_bot_token"),
            "telegram_chat_id": get_parameter("/makemyday/telegram_chat_id"),
        }
    else:
        return {
            "anthropic_api_key": os.getenv("ANTHROPIC_API_KEY"),
            "telegram_bot_token": os.getenv("TELEGRAM_BOT_TOKEN"),
            "telegram_chat_id": os.getenv("TELEGRAM_CHAT_ID"),
        }