# MakeMyDay — Roadmap

A phased build plan. Each phase ends with a real, working deliverable — not just concepts learned.
Check off tasks as you complete them. Open a GitHub Issue for each phase before starting it.

---

## Phase 1 — Working script
**Goal:** MakeMyDay runs locally and produces a real AI briefing in the terminal.
**Duration:** Weeks 1–3 (~7–10h/week)

### Tasks
- [x] Set up Google Cloud project and enable Calendar API
- [ ] Obtain OAuth2 credentials and authenticate locally
- [ ] Write `calendar_client.py` — fetch today's events
- [ ] Obtain Anthropic API key
- [ ] Write `briefing.py` — send calendar events to Claude, receive briefing text
- [ ] Wire everything together in `main.py` — run script, see output in terminal
- [ ] Set up `.env` file for secrets (never commit this)
- [ ] Create `requirements.txt`
- [ ] Write first entry in `DEVLOG.md`

### Deliverable
Running `python app/main.py` prints a personalized morning briefing to the terminal.

### What you'll learn
- Google OAuth2 flow
- Making API calls in Python (requests / httpx)
- Prompt engineering with Claude
- Basic secret management with `.env`

---

## Phase 2 — Containerize + deploy + Telegram
**Goal:** MakeMyDay runs in the cloud and messages you on Telegram every morning.
**Duration:** Weeks 4–6

### Tasks
- [ ] Wrap script in FastAPI — add `GET /briefing` endpoint
- [ ] Write `Dockerfile`
- [ ] Run app locally with `docker build` + `docker run`
- [ ] Write `docker-compose.yml` (app + any future services)
- [ ] Create AWS Free Tier account
- [ ] Provision EC2 instance manually (t2.micro)
- [ ] SSH into instance, install Docker, deploy container
- [ ] Configure security group (open port 8000)
- [ ] Create Telegram bot via @BotFather
- [ ] Write `telegram_bot.py` — send briefing message on `/briefing` endpoint call
- [ ] Add cron job on EC2 to call the endpoint every morning at 8:00 AM

### Deliverable
Every morning at 8:00 AM, MakeMyDay sends you a Telegram message with your day's briefing.

### What you'll learn
- Docker: images, containers, volumes, port mapping
- FastAPI: routing, startup events
- Linux: systemd, cron, SSH, security groups
- Telegram Bot API

---

## Phase 3 — Infrastructure as Code
**Goal:** Tear down everything manual. Rebuild it entirely with Terraform.
**Duration:** Weeks 7–9

### Tasks
- [ ] Install Terraform locally
- [ ] Write `infra/main.tf` — EC2 instance, security group, key pair
- [ ] Write `infra/variables.tf` and `infra/outputs.tf`
- [ ] Set up S3 bucket for Terraform remote state
- [ ] Configure Terraform backend (S3 + DynamoDB for locking)
- [ ] Run `terraform destroy` on manually-created infra
- [ ] Run `terraform apply` — infra rebuilt from code
- [ ] Set up IAM role for EC2 (least privilege)
- [ ] Store secrets in AWS SSM Parameter Store (not .env on server)

### Deliverable
`terraform apply` provisions the entire MakeMyDay infrastructure from zero. `terraform destroy` tears it down cleanly. No manual clicking in AWS console.

### What you'll learn
- Terraform: providers, resources, state, modules, remote backends
- AWS IAM: roles, policies, least-privilege principle
- AWS SSM: secure secret management
- Infrastructure-as-code mindset

---

## Phase 4 — CI/CD + web dashboard
**Goal:** Every push to `main` deploys automatically. A web dashboard shows today's briefing.
**Duration:** Weeks 10–13

### Tasks
- [ ] Write `frontend/index.html` — simple dashboard showing today's briefing
- [ ] Add `GET /` route in FastAPI to serve the dashboard
- [ ] Add `GET /api/briefing` JSON endpoint for the frontend to call
- [ ] Write at least 2 pytest tests in `tests/test_briefing.py`
- [ ] Create `.github/workflows/deploy.yml`
- [ ] CI pipeline: run tests → build Docker image → push to ECR
- [ ] CD pipeline: SSH into EC2, pull new image, restart container
- [ ] Store secrets (API keys, SSH key) as GitHub Actions secrets
- [ ] Test the full pipeline: push a commit, watch it deploy

### Deliverable
Push to `main` → tests run → new version deployed automatically → dashboard updates. Zero manual deployment steps.

### What you'll learn
- GitHub Actions: workflows, jobs, steps, secrets
- Docker: registry (ECR), image tagging, pulling on server
- Testing mindset: why tests make deployment safe
- The inner loop of real DevOps work

---

## Phase 5 — Kubernetes + text-to-speech
**Goal:** MakeMyDay runs on Kubernetes and can read your briefing aloud.
**Duration:** Weeks 14–16+

### Tasks
- [ ] Write `app/tts.py` — generate audio from briefing text (AWS Polly or Piper TTS)
- [ ] Add `GET /audio` endpoint — returns MP3 of today's briefing
- [ ] Add audio player to web dashboard
- [ ] Set up local Kubernetes cluster with k3s (or use EKS)
- [ ] Write Kubernetes manifests: `Deployment`, `Service`, `Ingress`
- [ ] Set resource limits and requests on the pod
- [ ] Set up a namespace for MakeMyDay
- [ ] Store secrets as Kubernetes Secrets (not hardcoded)
- [ ] Deploy to cluster: `kubectl apply -f k8s/`
- [ ] Migrate from single EC2 to EKS (optional stretch goal)

### Deliverable
MakeMyDay runs on Kubernetes. The web dashboard has an audio player. You can explain to someone why Kubernetes is useful (and when it isn't).

### What you'll learn
- Kubernetes: pods, deployments, services, ingress, namespaces, resource management
- AWS Polly or open-source TTS
- The difference between "it works on Docker" and "it runs on k8s"

---

## Stretch goals (after Phase 5)

- [ ] Add evening summary — what did you accomplish today?
- [ ] Add weather to the briefing (OpenWeatherMap API)
- [ ] Add a `/task` endpoint to create Google Calendar events via Telegram
- [ ] Set up monitoring with Prometheus + Grafana
- [ ] Add HTTPS with Let's Encrypt / cert-manager
- [ ] Write a proper Helm chart for the Kubernetes deployment
- [ ] Multi-user support — share MakeMyDay with a friend or partner
- [ ] Brainstorm more functionality, like news, stock market review and so on

---

## How to use this roadmap

1. **Before starting a phase:** Open a GitHub Issue titled `Phase N — [name]`. This is your commitment.
2. **During a phase:** Tick off checkboxes as you go. Commit `ROADMAP.md` with each update.
3. **When stuck:** Paste the error + context into Claude.ai or a new chat. Don't sit stuck for more than 30 minutes.
4. **After finishing a phase:** Write a DEVLOG entry summarizing what you built and what surprised you.
5. **Minimum viable week:** When life is busy, just open the repo and make one small commit. Keep the habit alive.
