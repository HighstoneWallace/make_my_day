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

### 02.04.2026
**Time spent:** 0.5 hours
**What I did:** Created docker-compose, set-up ssh, updated roadmap and started looking into terraform
**What broke:** Accidentally changed the roadmap file before pulling from the remote
**What I fixed:** Merged the versions with git pull --rebase origin main
**Next session goal:** Cronjob and Terraform, maybe extend the functionality already

### 07.04.2026
**Time spent:** 3 hours
**What I did:** installed terraform, created tf-files, initiated the infrastracture with it. Then deleted it and created it again with backend in aws-s3 storage (terraform state file to keep it safe and not in repository). Created S3 storage with DynamoDB, where the state file is stored. Created SSM-Parameters, from where my EC2 instance will get the secrets. Created a role in IAM and assigned it to EC2 instance. With this role, the secrets are available with read-only access. Updated code to use SSM instead of local files.
**What broke:** Terraform installed on ec2 instance. Then locally but with different docker-repo
**What I fixed:** Deleted it and installed locally and changed the main.tf to install the correct version of docker
**Next session goal:** Web dashboard

### 08.04.2026
**Time spent:** 1 hour
**What I did:** Wrote tests for briefing.py, set up the testing environment and installed python linter. Ran the tests
**What broke:** pytest worked with terminal call and not with the right click -> run tests with coverage.
**What I fixed:** Installed pytest-cov, added .vscode/settings.json
**Next session goal:** CI/CD for testing, web dashboard

### 12.04.2026
**Time spent:** 1 hour
**What I did:** Fixing Github Actions problems
**What broke:** deploy workflow did not work properly
**What I fixed:** IAM role was not added to ec2 instance
**Next session goal:** Web dashboard

### 19.04.2026
**Time spent:** 3 hour
**What I did:** Web dashboard, CI/CD workflows are created
**What broke:** deploy didnt work as planned
**What I fixed:** Authentication problems
**Next session goal:** Cronjob and K8s

### 21.04.2026
**Time spent:** 3 hours
**What I did:** Fixing authentication problems with anthropic API, adding cronjob to terraform main script
**What broke:** Authentication with anthropic API
**What I fixed:** The code was broken: no load_config was called
**Next session goal:** Web dashboard