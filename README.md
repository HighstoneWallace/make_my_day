# 🌅 MakeMyDay

> A personal AI morning briefing system with a purpose to assist you and make you day and it's planning easier and more pleasant.

MakeMyDay is a self-hosted web-app which is used as a personal storage and assistant in various ways. It reads your Google Calendar and your tasks, passes your data to Claude AI, and delivers a personalized morning briefing via Telegram, a web dashboard, or spoken audio. It has a habit tracker inside the web-app. It stores the long-term shopping items. Built from scratch as a DevOps learning project. Touching cloud infrastructure, containers, CI/CD, and Kubernetes.

---

## What it does

1. Fetches your events and tasks from Google Calendar
2. Asks Claude AI to write a personalized, encouraging briefing
3. Displays the briefing
4. Stores the shopping list, with an option to add and delete items, add links and prices to them
5. Contains habit tracker with an option to add and delete habits

The goal of this project is to create a web dashboard to improve tracking of various parts of life all in one app. At the same time, to learn DevOps principles and infrastructure.

---

## Architecture

```
<placeholder for later, when the planning is done>
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
| Cloud | AWS (EC2 → EKS) [Might be replaced with a home lab with raspberry pi]|
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Orchestration | Kubernetes (maybe local only) |
| Monitoring | Grafana & Prometheus |

---

## Project structure

```
MakeMyDay/
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
│   └── unit-tests
├── Dockerfile
├── docker-compose.yml
├── ROADMAP.md
└── README.md
```

---

### Prerequisites

- Python 3.12+
- A Google Cloud project with Calendar API enabled
- An Anthropic API key
- A Telegram bot token (from @BotFather)

### Local setup

```bash
git clone https://github.com/HighstoneWallace/make_my_day.git
cd make_my_day

python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env

python app/main.py
```
---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the full phase-by-phase plan.

---

## Why this project exists

I'm a systems engineer (mechatronics background) learning DevOps and modern cloud infrastructure. This project is designed to touch every layer of a real production system: from a Python script all the way to Kubernetes, while building something I'll actually use every day.

---

## License

MIT
