import os
import sys
import json
from pathlib import Path

# Add backend directory to sys.path so app modules import cleanly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app.agents.classifier import classification_agent
from app.agents.planner import planner_agent

def main():
    # 1. Read input from /aikart/input.json or AIKART_INPUT env var
    input_data = {}
    input_path = Path("/aikart/input.json")

    if input_path.exists():
        try:
            with open(input_path, "r", encoding="utf-8") as f:
                input_data = json.load(f)
        except Exception as e:
            print(f"Error reading /aikart/input.json: {e}", file=sys.stderr)

    if not input_data:
        env_input = os.environ.get("AIKART_INPUT")
        if env_input:
            try:
                input_data = json.loads(env_input)
            except Exception as e:
                print(f"Error parsing AIKART_INPUT env var: {e}", file=sys.stderr)

    # Fallbacks if input is missing or empty
    user_input = input_data.get("user_input") or input_data.get("topic") or input_data.get("query")
    event_category = input_data.get("event_category", "Child Birth / Newborn")

    if not user_input:
        user_input = f"I need help with {event_category}"

    # 2. Run Classification Agent
    classification = classification_agent.classify(user_input)
    event_type = classification.event_type

    # If classified as UNKNOWN, fallback based on selected category dropdown
    if event_type.value == "UNKNOWN":
        if "death" in event_category.lower() or "demise" in event_category.lower():
            from app.models.schemas import EventType
            event_type = EventType.DEATH_IN_FAMILY
        elif "senior" in event_category.lower():
            from app.models.schemas import EventType
            event_type = EventType.SENIOR_CITIZEN
        else:
            from app.models.schemas import EventType
            event_type = EventType.CHILD_BIRTH

    # 3. Run Planner Agent to generate journey tasks
    tasks = planner_agent.create_journey_tasks(event_type, context={})

    # 4. Build Markdown Response
    md_lines = []
    md_lines.append(f"# 🏛️ Life Event Concierge Report")
    md_lines.append(f"**Life Event Identified:** {event_type.value.replace('_', ' ').title()}")
    md_lines.append(f"**Confidence:** {int(classification.confidence * 100)}%")
    md_lines.append(f"**User Request:** *\"{user_input}\"*\n")
    md_lines.append("---")
    md_lines.append("## 📋 Recommended Action Plan & Checklist\n")

    for i, t in enumerate(tasks, 1):
        md_lines.append(f"### {i}. {t.title}")
        md_lines.append(f"- **Description:** {t.description}")
        md_lines.append(f"- **Priority:** `{t.priority}`")
        md_lines.append(f"- **Reason:** {t.reason}")
        if t.required_documents:
            md_lines.append(f"- **Required Documents:** {', '.join(t.required_documents)}")
        if t.next_action:
            md_lines.append(f"- **Next Step:** {t.next_action}")
        md_lines.append("")

    md_lines.append("---")
    md_lines.append("*Generated automatically by Life Event Concierge Agent via aiKart Sandbox.*")

    markdown_response = "\n".join(md_lines)

    # 5. Output shape required by aiKart spec
    output_payload = {
        "format": "markdown",
        "response": markdown_response
    }

    # Write output to /aikart/output.json (or local fallbacks)
    output_path = Path("/aikart/output.json")
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(output_payload, f, indent=2)
        print("Successfully wrote /aikart/output.json")
    except Exception as e:
        print(f"Error writing /aikart/output.json: {e}", file=sys.stderr)
        # Fallback to local file for testing
        with open("output.json", "w", encoding="utf-8") as f:
            json.dump(output_payload, f, indent=2)

    sys.exit(0)

if __name__ == "__main__":
    main()
