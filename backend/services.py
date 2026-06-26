import os

import google.generativeai as genai
from dotenv import load_dotenv

from models import ChatMessage, ChatRequest, RescueRequest, TaskRequest

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


def generate_task_breakdown(data: TaskRequest) -> str:
    prompt = f"""
    You are an expert project planner.

    Task: {data.task}
    Deadline: {data.deadline}
    Available Hours: {data.hours}

    Break the task into subtasks.

    Return ONLY valid JSON.

    Format:
    {{
      "subtasks":[
        {{
          "title":"...",
          "hours":0,
          "priority":"High"
        }}
      ]
    }}

    Do not add markdown.
    Do not add explanations.
    Return only JSON.
    """
    response = model.generate_content(prompt)
    return response.text


def generate_rescue_plan(data: RescueRequest) -> str:
    prompt = f"""
    You are Deadline Guardian, an emergency productivity coach for students and hackathon teams.

    A user is in deadline crisis:
    - Task: {data.task}
    - Hours remaining: {data.hours_remaining}
    - Deadline: {data.deadline}

    Create an emergency rescue plan that helps them finish on time.

    Return ONLY valid JSON in this exact format:
    {{
      "emergency_action_plan": [
        {{
          "step": 1,
          "action": "Immediate action to take",
          "duration_hours": 0.5
        }}
      ],
      "minimum_viable_strategy": {{
        "summary": "One paragraph on the smallest shippable outcome",
        "must_complete": ["Critical item 1", "Critical item 2"],
        "scope_to_cut": ["Non-essential item 1", "Non-essential item 2"]
      }},
      "time_allocation": [
        {{
          "block": "Phase name",
          "hours": 1,
          "activities": "What to focus on in this block"
        }}
      ]
    }}

    Rules:
    - Total duration_hours across emergency_action_plan should not exceed {data.hours_remaining} hours.
    - Total hours in time_allocation should equal {data.hours_remaining} hours.
    - Be ruthless about scope cuts when time is tight.
    - Do not add markdown.
    - Do not add explanations.
    - Return only JSON.
    """
    response = model.generate_content(prompt)
    return response.text


def _format_chat_history(history: list[ChatMessage]) -> str:
    if not history:
        return "No previous messages."

    lines = []
    for msg in history[-10:]:
        role = "User" if msg.role == "user" else "Coach"
        lines.append(f"{role}: {msg.content}")
    return "\n".join(lines)


def generate_chat_reply(data: ChatRequest) -> str:
    history_text = _format_chat_history(data.history)
    prompt = f"""
    You are TaskPilot AI, a friendly and practical productivity coach for students and hackathon teams.
    Help users prioritize tasks, beat deadlines, stay focused, and reduce overwhelm.
    Keep answers concise, actionable, and encouraging. Use bullet points when helpful.

    Conversation so far:
    {history_text}

    User: {data.message}

    Respond as the productivity coach:
    """
    response = model.generate_content(prompt)
    return response.text.strip()
