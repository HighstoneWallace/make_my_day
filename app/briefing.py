import anthropic
from dotenv import load_dotenv
from app.config import load_config

load_dotenv()

def format_events(events):
    if not events:
        return "No events scheduled for today."
    lines = []
    for event in events:
        start = event["start"].get("dateTime", event["start"].get("date"))
        summary = event.get("summary", "Untitled event")
        lines.append(f"- {start}: {summary}")
    return "\n".join(lines)


def generate_briefing(events):
    
    config = load_config()
    client = anthropic.Anthropic(api_key=config["anthropic_api_key"])
    
    events_text = format_events(events)
    
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="""You are a personal morning assistant. Your job is to give the user 
        a brief, encouraging morning briefing based on their calendar. 
        Be warm but concise. No bullet points — write in natural flowing sentences. 
        End with one short motivational thought.""",
        messages=[
            {
                "role": "user",
                "content": f"Here are my events for today:\n{events_text}\n\nPlease give me my morning briefing."
            }
        ]
    )

    return message.content[0].text
    
    '''
    example_briefing = """--- YOUR MORNING BRIEFING ---
    Good morning! ☀️ Here's what your Tuesday looks like: 
    You've got a workshop check to take care of at some point today, so it's worth getting that sorted earlier rather than later to keep the rest of your day flowing smoothly.
    Then this evening you have a Preply lesson with Stefano G. at 5:00 PM — a great chance to invest in your language skills! Right after at 6:30 PM, you have your Vitamin D reminder, so don't forget to take that. It's a nicely balanced day — a task to handle, some learning, and a little self-care. Small, consistent steps are what real progress is made of. You've got this! 💪"""
    return example_briefing
    '''
