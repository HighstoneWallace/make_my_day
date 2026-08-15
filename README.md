# MakeMyDays

**Live:** [makemydays.cc](https://makemydays.cc)

> A personal AI morning briefing system with a purpose to assist you and make you day and it's planning easier and more pleasant.

MakeMyDays is a self-hosted web-app which is used as a personal assistant and organizer. It covers multiple areas of your life and ensures an easy and intuitive tracking of your tasks, calendars, budget, etc. 
It can read your Google Calendar entries and the tasks from it, track your habits, organize your budget, keep track of your spendings and your shopping lists.
Built from scratch as a DevOps learning project. Touching cloud infrastructure, containers, CI/CD, Kubernetes and monitoring.

---

## What it does

1. WebApp as a central hub for your life
2. AI functions to help you organize your day
3. Stores important information for multiple purposes

The goal of this project is to create a web dashboard to improve tracking of various parts of life all in one app. At the same time, to learn DevOps principles and infrastructure.

---

## Architecture

```
Browser → Cloudflare Tunnel → Raspberry Pi 3B+
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
               FastAPI app     Prometheus      Grafana
                    │               │               │
              Google Calendar   node-exporter   Dashboards
              Anthropic Claude
              AWS Polly
              AWS SSM
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
| Cloud | AWS (EC2 → EKS) [Replaced with a Raspberry Pi 3B+ for cost optimization purposes]|
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Orchestration | Kubernetes (maybe local only) |
| Monitoring | Grafana & Prometheus |

---

## Project structure

```
Will be updated soon
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
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env

python app/main.py
```
---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the full phase-by-phase plan.

---

## Why this project exists

I'm a systems engineer (mechatronics background) learning DevOps and modern cloud infrastructure. This project is designed to touch every layer of a real production system: from a Python script all the way to Kubernetes and monitoring, while building something I'll actually use every day.

---

## Key Engineering Decisions

- **Raspberry Pi over EC2** -> migrated from AWS EC2 to a self-hosted Pi 
  to eliminate ongoing cloud costs while maintaining full functionality
- **Cloudflare Tunnel** -> provides public HTTPS access without port 
  forwarding or a static IP, with free SSL termination
- **SSM Parameter Store** -> all secrets managed in AWS SSM, never stored 
  on disk or in environment files
- **Multi-platform Docker builds** -> images built for both amd64 and arm64 
  so the same ECR image runs on both CI runners and the Pi

## License
MIT
