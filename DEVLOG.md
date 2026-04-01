# MakeMyDay — Dev Log

A running log of every session. One entry per session. Date + what happened.
This file is your progress proof and your future portfolio story.

---

## Template

```
### YYYY-MM-DD
**Time spent:** X hours
**What I did:** ...
**What broke:** ...
**What I fixed:** ...
**Next session goal:** ...
```

---

## Log

### 27.03.2026 — Project kickoff
**Time spent:** 1 hour
**What I did:** Created the repo, wrote README.md and ROADMAP.md, set up project structure. Used Claude AI for assistance. Set up the environent in VSC
**What broke:** Nothing yet.
**What I fixed:** N/A
**Next session goal:** Study the plan and start with the phase 1.


### 30.03.2026 - First steps
**Time spent:** 2 hours
**What I did:** Created a skeleton of the project, set up the venv-environment, installed packages, recorded the requirements, created a google-cloud project, created OAuth2 credentials and saved into credentials.json. Watched a video about OAuth and how exactly it works. Created a calendar_client.py, set it up and gave permission for the API calls.
**What broke:** Too early to break anything.
**What I fixed:** Too early to fix.
**Next session goal:** briefing.py with Anthropic API key to get a morning briefing


### 31.03.2026
**Time spent:** 1.5 hours
**What I did:** Created briefing.py and main.py. Bought credits for API calls (5 USD). Tested main.py with some random entries in my calendar -> works for now, pretty simple and dry, but good for the first attempt without any tuning.
Replaced script in main with FastAPI-Server, installed packages in my venv and recorded them into requirements.txt again.
Replaced the get_briefing code with the first output hardcoded to avoid any unnecessary API calls and tokens waste.
**What broke:** Nothing
**What I fixed:** import from app-module didnt work -> added init and call the main script with "-m" parameter
**Next session goal:** Docker


### 01.04.2026
**Time spent:** 3 hours
**What I did:** Created Dockerfile, .dockerignore, telegram_bot.py. Created EC2 instance, set it up and installed everything there. Copied my env and secrets there, cloned the repo and started docker container. Set up a telegram bot. 
**What broke:** Forgot how to set up github account
**What I fixed:** Created ssh-key on ec2 machine and added it to github account
**Next session goal:** Cronjob and Terraform, maybe extend the functionality already