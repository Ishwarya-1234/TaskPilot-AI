from pydantic import BaseModel, Field


class TaskRequest(BaseModel):
    task: str
    deadline: str
    hours: int


class TaskBreakdownResponse(BaseModel):
    task: str
    ai_breakdown: str


class RescueRequest(BaseModel):
    task: str
    hours_remaining: float
    deadline: str


class RescuePlanResponse(BaseModel):
    task: str
    hours_remaining: float
    deadline: str
    rescue_plan: str


class ChatMessage(BaseModel):
    role: str = Field(description="user or assistant")
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str


class HealthResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    error: str
