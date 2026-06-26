# TaskPilot AI

AI-powered productivity app for hackathon teams. Plan tasks with Gemini, survive deadline crunch with Deadline Guardian, and chat with an AI productivity coach.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Recharts
- **Backend:** FastAPI, Gemini 2.5 Flash
- **AI:** Google Generative AI

## Project Structure

```
TaskPilot AI/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── models.py        # Pydantic request/response models
│   ├── services.py      # Gemini integration
│   ├── requirements.txt
│   └── .env             # GEMINI_API_KEY (create this)
├── frontend/
│   └── src/
│       ├── components/  # Navbar, Sidebar, StatCard, TaskCard, etc.
│       ├── context/     # TaskContext (React state)
│       ├── layouts/     # DashboardLayout
│       ├── pages/       # Landing, Dashboard, Tasks, Planner, Rescue, Chat, Analytics
│       ├── routes/      # AppRoutes
│       └── services/    # API client, parsers, mock data
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
GEMINI_API_KEY=your_api_key_here
```

Start the server:

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Verify: http://127.0.0.1:8000/docs

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

The Vite dev server proxies `/api/*` → `http://127.0.0.1:8000/*` to avoid CORS issues.

## API Endpoints

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
| `/dashboard` | Dashboard (mock stats) |
| `/tasks` | Task management (React state) |
| `/planner` | AI Planner (Gemini) |
| `/rescue` | Deadline Guardian (Gemini) |
| `/chat` | AI Chat (Gemini) |
| `/analytics` | Analytics charts (mock data) |

## Troubleshooting

**Port 8000 already in use:**

```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Backend shows 404 for `/rescue-plan`:** Restart uvicorn after pulling latest code.

**Frontend can't reach backend:** Restart both servers. Use http://localhost:5173 (not 5174).
