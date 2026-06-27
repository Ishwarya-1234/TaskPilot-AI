import sqlite3
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from models import (
    ChatRequest,
    ChatResponse,
    HealthResponse,
    RescuePlanResponse,
    RescueRequest,
    TaskBreakdownResponse,
    TaskRequest,
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    ChatMessageCreate,
    ChatMessageResponse,
)
from services import generate_chat_reply, generate_rescue_plan, generate_task_breakdown

app = FastAPI(title="TaskPilot AI", version="1.0.0")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "tasks.db")


def get_db_connection():
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn




def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            deadline TEXT,
            priority TEXT DEFAULT 'Medium',
            status TEXT DEFAULT 'Todo',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()
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


# Task CRUD Endpoints
@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC")
        tasks = cursor.fetchall()
        conn.close()
        return [dict(task) for task in tasks]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO tasks (title, deadline, priority, status, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (task.title, task.deadline, task.priority, task.status, datetime.now().isoformat())
        )
        conn.commit()
        task_id = cursor.lastrowid
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        new_task = cursor.fetchone()
        conn.close()
        return dict(new_task)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verify task exists
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        existing_task = cursor.fetchone()
        if not existing_task:
            conn.close()
            raise HTTPException(status_code=404, detail="Task not found")

        # Build dynamic update query
        update_fields = []
        values = []
        if task.title is not None:
            update_fields.append("title = ?")
            values.append(task.title)
        if task.deadline is not None:
            update_fields.append("deadline = ?")
            values.append(task.deadline)
        if task.priority is not None:
            update_fields.append("priority = ?")
            values.append(task.priority)
        if task.status is not None:
            update_fields.append("status = ?")
            values.append(task.status)

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        values.append(task_id)
        query = f"UPDATE tasks SET {', '.join(update_fields)} WHERE id = ?"
        cursor.execute(query, values)
        conn.commit()

        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        updated_task = cursor.fetchone()
        conn.close()

        if not updated_task:
            raise HTTPException(status_code=404, detail="Task not found")

        return dict(updated_task)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        task = cursor.fetchone()
        if not task:
            conn.close()
            raise HTTPException(status_code=404, detail="Task not found")

        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()
        conn.close()
        return {"message": "Task deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# Chat History Endpoints
@app.get("/chat-history", response_model=list[ChatMessageResponse])
def get_chat_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM chat_history ORDER BY timestamp ASC")
        messages = cursor.fetchall()
        conn.close()
        return [dict(msg) for msg in messages]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/chat-history", response_model=ChatMessageResponse)
def save_chat_message(message: ChatMessageCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Use frontend-provided timestamp if available, otherwise use server time
        timestamp = message.timestamp if message.timestamp else datetime.now().isoformat()
        cursor.execute(
            """
            INSERT INTO chat_history (role, content, timestamp)
            VALUES (?, ?, ?)
            """,
            (message.role, message.content, timestamp)
        )
        conn.commit()
        msg_id = cursor.lastrowid
        cursor.execute("SELECT * FROM chat_history WHERE id = ?", (msg_id,))
        new_message = cursor.fetchone()
        conn.close()
        return dict(new_message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.delete("/chat-history")
def clear_chat_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM chat_history")
        conn.commit()
        conn.close()
        return {"message": "Chat history cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
