from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import (
    ChatRequest,
    ChatResponse,
    HealthResponse,
    RescuePlanResponse,
    RescueRequest,
    TaskBreakdownResponse,
    TaskRequest,
)
from services import generate_chat_reply, generate_rescue_plan, generate_task_breakdown

app = FastAPI(title="TaskPilot AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def log_routes():
    routes = [r.path for r in app.routes if hasattr(r, "methods")]
    print(f"TaskPilot AI routes: {routes}")


@app.get("/", response_model=HealthResponse)
def home():
    return HealthResponse(message="TaskPilot AI Backend Running")


@app.post("/task-breakdown", response_model=TaskBreakdownResponse)
def task_breakdown(data: TaskRequest):
    try:
        ai_breakdown = generate_task_breakdown(data)
        return TaskBreakdownResponse(task=data.task, ai_breakdown=ai_breakdown)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/rescue-plan", response_model=RescuePlanResponse)
def rescue_plan(data: RescueRequest):
    try:
        rescue_plan_text = generate_rescue_plan(data)
        return RescuePlanResponse(
            task=data.task,
            hours_remaining=data.hours_remaining,
            deadline=data.deadline,
            rescue_plan=rescue_plan_text,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/chat", response_model=ChatResponse)
def chat(data: ChatRequest):
    try:
        if not data.message.strip():
            raise HTTPException(status_code=422, detail="Message cannot be empty.")
        reply = generate_chat_reply(data)
        return ChatResponse(reply=reply)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
