# TaskPilot AI

AI-powered productivity app with persistent task storage and AI-powered features. Plan tasks with Gemini, survive deadline crunch with Deadline Guardian, and chat with an AI productivity coach.

## Features

- **Persistent Task Storage**: SQLite database for task persistence across sessions
- **AI Productivity Coach**: Chat with timestamps, history persistence, and suggested prompts
- **Task Management**: Full CRUD operations with priority, status, and deadline tracking
- **AI Planner**: Break down complex tasks into subtasks using Gemini AI
- **Deadline Guardian**: Get rescue plans when deadlines are approaching
- **Dashboard**: Real-time stats, charts, and widgets
- **Export & Print**: Export tasks to CSV and print task lists

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Recharts, react-hot-toast
- **Backend:** FastAPI, SQLite
- **AI:** Google Generative AI (Gemini 2.5 Flash)

## Project Structure

```
TaskPilot AI/
├── backend/
│   ├── main.py          # FastAPI routes, database
│   ├── models.py        # Pydantic request/response models
│   ├── services.py      # Gemini integration
│   ├── requirements.txt
│   └── .env             # Environment variables
├── frontend/
│   └── src/
│       ├── components/  # Navbar, Sidebar, StatCard, TaskCard, etc.
│       ├── context/     # TaskContext (React state)
│       ├── layouts/     # DashboardLayout
│       ├── pages/       # Landing, Dashboard, Tasks, Planner, Rescue, Chat, Analytics
│       ├── routes/      # AppRoutes
│       └── services/    # API client
```

## Setup

### 1. Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:

```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=tasks.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Start the server:

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Verify: http://127.0.0.1:8000/docs (FastAPI auto-generated API documentation)

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

The Vite dev server proxies `/api/*` → `http://127.0.0.1:8000/*` to avoid CORS issues.

## API Endpoints

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |

### Chat History
| Method | Path | Description |
|--------|------|-------------|
| GET | `/chat-history` | Get chat history |
| POST | `/chat-history` | Save chat message |
| DELETE | `/chat-history` | Clear chat history |

### AI Features
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/task-breakdown` | AI task planner |
| POST | `/rescue-plan` | Deadline Guardian rescue plan |
| POST | `/chat` | AI productivity coach |

## Pages

| Route | Page |
|-------|------|
| `/` | Landing |
| `/dashboard` | Dashboard with real-time stats |
| `/tasks` | Task management with export/print |
| `/planner` | AI Planner (Gemini) |
| `/rescue` | Deadline Guardian (Gemini) |
| `/chat` | AI Chat with history |
| `/analytics` | Analytics charts |

## Environment Variables

### Backend (.env)
- `GEMINI_API_KEY`: Required for AI features
- `DATABASE_URL`: Path to SQLite database (default: tasks.db)
- `CORS_ORIGINS`: Comma-separated list of allowed origins

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (optional, defaults to /api in dev)

## Database Schema

### Tasks Table
- `id`: Primary key
- `title`: Task title
- `deadline`: Task deadline
- `priority`: Task priority (High/Medium/Low)
- `status`: Task status (Todo/In Progress/Done)
- `created_at`: Timestamp

### Chat History Table
- `id`: Primary key
- `role`: Message role (user/assistant)
- `content`: Message content
- `timestamp`: Timestamp

## Troubleshooting

**Port 8000 already in use:**

```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Backend shows 404 for `/rescue-plan`:** Restart uvicorn after pulling latest code.

**Frontend can't reach backend:** Restart both servers. Use http://localhost:5173 (not 5174).

**Database locked:** Close all database connections and restart the backend server.

## Security Notes

- Use HTTPS in production
- Store environment variables securely
- Never commit `.env` files to version control
