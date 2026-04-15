import datetime
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os

SCOPES = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/tasks.readonly"
]

def get_credentials():
    creds = None

    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)

        with open("token.json", "w") as token:
            token.write(creds.to_json())

    return creds


def get_todays_events():
    creds = get_credentials()
    service = build("calendar", "v3", credentials=creds)

    now = datetime.datetime.utcnow()
    start_of_day = now.replace(hour=0, minute=0, second=0).isoformat() + "Z"
    end_of_day = now.replace(hour=23, minute=59, second=59).isoformat() + "Z"

    result = service.events().list(
        calendarId="primary",
        timeMin=start_of_day,
        timeMax=end_of_day,
        singleEvents=True,
        orderBy="startTime"
    ).execute()

    events = result.get("items", [])
    return events

def get_tasks():
    creds = get_credentials()
    service = build("tasks", "v1", credentials=creds)

    tasklists = service.tasklists().list().execute()
    all_tasks = []

    for tasklist in tasklists.get("items", []):
        tasks = service.tasks().list(
            tasklist=tasklist["id"],
            showCompleted=False,
            showHidden=False
        ).execute()

        for task in tasks.get("items", []):
            all_tasks.append({
                "title": task.get("title", "Untitled task"),
                "tasklist": tasklist["title"],
                "due": task.get("due", None),
                "notes": task.get("notes", None)
            })

    return all_tasks


if __name__ == "__main__":
    events = get_todays_events()
    if not events:
        print("No events today")
    for event in events:
        start = event["start"].get("dateTime", event["start"].get("date"))
        print(f"{start} — {event['summary']}")
