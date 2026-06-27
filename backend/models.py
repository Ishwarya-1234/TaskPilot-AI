from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


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


# Task CRUD Models
class TaskCreate(BaseModel):
    title: str
    deadline: str
    priority: str = "Medium"
    status: str = "Todo"


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    deadline: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    deadline: str
    priority: str
    status: str
    created_at: str

    class Config:
        from_attributes = True


# Chat History Models
class ChatMessageCreate(BaseModel):
    role: str
    content: str


class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    timestamp: str

    class Config:
        from_attributes = True
