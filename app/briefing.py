import anthropic
import os
from dotenv import load_dotenv
from app.config import load_config

load_dotenv()

def format_context(events, tasks):
    lines = []
    if events:
        lines.append("Calendar events for today:")
        for event in events:
            start = event["start"].get("dateTime", event["start"].get("date"))
            summary = event.get("summary", "Untitled event")
            lines.append(f"- {start}: {summary}")
    else:
        lines.append("No calendar events scheduled for today.")

    lines.append("")

    if tasks:
        lines.append("Pending tasks:")
        for task in tasks:
            due = f" (due: {task['due'][:10]})" if task['due'] else ""
            lines.append(f"  - [{task['tasklist']}] {task['title']}{due}")
    else:
        lines.append("No pending tasks.")

    return "\n".join(lines)


def generate_briefing(events, tasks):
    config = load_config()

    client = anthropic.Anthropic(api_key=config["anthropic_api_key"])

    context = format_context(events, tasks)

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="""You are a personal morning assistant. Your job is to give the user 
        a brief, encouraging morning briefing based on their calendar and tasks. 
        Be warm but concise. No bullet points — write in natural flowing sentences. 
        End with one short motivational thought.""",
        messages=[
            {
                "role": "user",
                "content": f"Here is my context for today:\n{context}\n\nPlease give me my morning briefing."
            }
        ]
    )

    return message.content[0].text

