# 🌅 Make my day

> A personal AI morning briefing system — because your day deserves a proper intro.

Morgen is a self-hosted daily assistant that wakes up before you do. It reads your Google Calendar, passes your schedule to Claude AI, and delivers a personalized morning briefing via Telegram, a web dashboard, and spoken audio. Built from scratch as a DevOps learning project — touching cloud infrastructure, containers, CI/CD, and Kubernetes.

---

## What it does

Every morning between 7:30–9:00 AM, Morgen:

1. Fetches your events from Google Calendar
2. Asks Claude AI to write a personalized, encouraging briefing
3. Sends it to you via **Telegram**
4. Displays it on a **web dashboard**
5. (Phase 5) Reads it aloud via **text-to-speech**

If you have tasks scheduled, it tells you what's coming. If the day is clear, it encourages you to get things done anyway.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  AWS (Terraform-managed)             │
│                                                     │
│  ┌──────────────┐     ┌──────────────────────────┐  │
│  │  Scheduler   │────▶│    Python / FastAPI       │  │
│  │  (cron job)  │     │    backend                │  │
│  └──────────────┘     └────────────┬─────────────┘  │
│                                    │                 │
│  ┌──────────────┐                  ▼                 │
│  │Google Calendar│────▶   ┌─────────────────┐       │
│  │   API        │         │   Claude AI API  │       │
│  └──────────────┘         └────────┬────────┘       │
│                                    │                 │
│              ┌─────────────────────┼──────────────┐  │
│              ▼                     ▼              ▼  │
│       ┌────────────┐  ┌──────────────────┐  ┌──────┐│
│       │ Telegram   │  │  Web dashboard   │  │ TTS  ││
│       │    bot     │  │   (FastAPI +     │  │audio ││
│       └────────────┘  │    HTML/JS)      │  └──────┘│
│                       └──────────────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Language | Python 3.12 |
| Web framework | FastAPI |
| AI | Anthropic Claude API |
| Calendar | Google Calendar API |
| Messaging | Telegram Bot API |
| TTS | AWS Polly (Phase 5) |
| Container | Docker |
| Cloud | AWS (EC2 → EKS) |
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Orchestration | Kubernetes (Phase 5) |

---

## Project structure

```
morgen/
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── calendar_client.py   # Google Calendar integration
│   ├── briefing.py          # Claude AI briefing generation
│   ├── telegram_bot.py      # Telegram delivery
│   └── tts.py               # Text-to-speech (Phase 5)
├── frontend/
│   └── index.html           # Web dashboard
├── infra/
│   ├── main.tf              # Terraform entry point
│   ├── variables.tf
│   └── outputs.tf
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline
├── k8s/                     # Kubernetes manifests (Phase 5)
├── tests/
│   └── test_briefing.py
├── Dockerfile
├── docker-compose.yml
├── ROADMAP.md
├── DEVLOG.md
└── README.md
```

---

## Getting started (Phase 1)

### Prerequisites

- Python 3.12+
- A Google Cloud project with Calendar API enabled
- An Anthropic API key
- A Telegram bot token (from @BotFather)

### Local setup

```bash
git clone https://github.com/YOUR_USERNAME/morgen.git
cd morgen

python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Fill in your keys in .env

python app/main.py
```

### Environment variables

```env
ANTHROPIC_API_KEY=your_key_here
GOOGLE_CALENDAR_CREDENTIALS=path/to/credentials.json
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id
```

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the full phase-by-phase plan.

---

## Dev log

See [DEVLOG.md](./DEVLOG.md) for a running log of sessions and progress.

---

## Why this project exists

I'm a systems engineer (mechatronics background) learning DevOps and modern cloud infrastructure. This project is designed to touch every layer of a real production system — from a Python script all the way to Kubernetes — while building something I'll actually use every day.

---

## License

MIT
