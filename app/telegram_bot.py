import os
import httpx
from dotenv import load_dotenv
from app.config import load_config

load_dotenv()
config = load_config()
TELEGRAM_BOT_TOKEN = config["telegram_bot_token"]
TELEGRAM_CHAT_ID = config["telegram_chat_id"]

def send_briefing(briefing_text: str):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": briefing_text,
        "parse_mode": "Markdown"
    }
    response = httpx.post(url, json=payload)
    response.raise_for_status()
    return response.json()
