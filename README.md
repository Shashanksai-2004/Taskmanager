# TaskFlow — Smart Task Manager

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react" />
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=flat&logo=fastapi" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=flat&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens" />
</p>

---

## Overview

**TaskFlow** is a full-stack Task Manager application built with a **React 18 + Vite** frontend and a **Python FastAPI** backend connected to **MongoDB Atlas**. Authenticated users can manage their personal tasks across three Kanban stages — **Todo**, **In Progress**, and **Done** — with full drag-and-drop support and a sleek dark-themed UI.

---

## Features

- ✅ User Registration & Login with JWT authentication
- ✅ Persistent login state (localStorage)
- ✅ Create, Read, Update, Delete tasks
- ✅ Kanban board with 3 columns (Todo → In Progress → Done)
- ✅ **Drag & Drop** to move tasks between stages
- ✅ Progress tracker showing task completion percentage
- ✅ Loading states on all async operations
- ✅ Toast notifications for all user actions
- ✅ Full form validation (frontend + backend)
- ✅ Protected routes (unauthenticated users redirected to login)
- ✅ Responsive — works on mobile, tablet, and desktop
- ✅ Dark mode UI with glassmorphism effects

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI library |
| Vite | 5 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| React Router DOM | v6 | Client-side routing |
| Axios | 1.7 | HTTP client |
| React Hot Toast | 2.4 | Notification toasts |
| Context API | — | Global auth state management |
| @hello-pangea/dnd | 16 | Drag & drop Kanban support |
| Framer Motion | 12 | Animations & transitions |
| Lucide React | — | Icon set |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Runtime |
| FastAPI | 0.110+ | Async web framework |
| Uvicorn | 0.28+ | ASGI server |
| Motor | 3.3+ | Async MongoDB driver |
| Pydantic v2 | 2.6+ | Data validation & schemas |
| pydantic-settings | 2.2+ | Environment config via `.env` |
| python-jose | 3.3+ | JWT creation & verification |
| passlib + bcrypt | — | Secure password hashing |
| python-dotenv | 1.0+ | `.env` file loading |

### Database

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted NoSQL database (free tier) |

---

## Project Structure

```
task-manager/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI: Navbar, TaskCard, TaskColumn, TaskModal, Loader
│   │   ├── context/          # AuthContext — global user auth state
│   │   ├── pages/            # Route-level pages: Login, Register, Dashboard
│   │   ├── services/         # Axios API wrappers (authService, taskService)
│   │   └── utils/            # Axios instance with baseURL & interceptors
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/
    ├── app/
    │   ├── config/           # settings.py (env vars), database.py (Motor client)
    │   ├── middleware/        # JWT auth dependency (FastAPI Depends)
    │   ├── models/           # Pydantic models for DB documents
    │   ├── routes/           # auth_routes.py, task_routes.py
    │   ├── schemas/          # Request/response schemas (auth_schema, task_schema)
    │   ├── services/         # Business logic (auth_service.py, task_service.py)
    │   ├── utils/            # Helper utilities
    │   └── main.py           # FastAPI app entry point, CORS, lifespan handler
    ├── requirements.txt
    └── .env
```

---

## Installation

### Prerequisites

- **Python** ≥ 3.10
- **Node.js** ≥ 18 and **npm** ≥ 9
- A **MongoDB Atlas** account (free tier works perfectly)

---

### Backend Setup

```bash
cd task-manager/backend

# Create and activate a virtual environment
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example or create .env manually (see Environment Variables section)

# Start the development server with hot-reload
uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
```

The API will be live at `http://localhost:5000`.  
Interactive API docs (Swagger UI) will be at `http://localhost:5000/docs`.

---

### Frontend Setup

```bash
cd task-manager/frontend

# Install dependencies
npm install

# Configure environment
# Create/edit .env: set VITE_API_URL to your backend URL
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start the dev server
npm run dev

# Build for production
npm run build
```

The frontend will be live at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

> **Production tip:** Set `VITE_API_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com/api`).

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT token | Public |

### Tasks (`/api/tasks`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks` | Fetch all tasks for the logged-in user | ✅ Required |
| POST | `/api/tasks` | Create a new task | ✅ Required |
| PUT | `/api/tasks/{id}` | Update task (title, description, stage) | ✅ Required |
| DELETE | `/api/tasks/{id}` | Delete a task by ID | ✅ Required |

Full interactive documentation with request/response schemas is available at `/docs` (Swagger UI) or `/redoc` (ReDoc).

---

## Assumptions

The following assumptions were made during design and development:

1. **Single-user task ownership** — Tasks are strictly scoped to the creating user via `user_id`. There is no shared task or team feature.

2. **Fixed Kanban stages** — Task stages are a closed enum: `todo`, `in_progress`, `done`. No custom stages are supported to keep the data model simple and the UI predictable.

3. **No email verification** — Registration is immediate. Email confirmation was excluded to reduce infrastructure complexity (no SMTP server required).

4. **MongoDB as primary store** — Given the flexible, schema-light nature of tasks (description is optional, stages change), a document store is more suitable than a relational DB.

5. **Token stored in localStorage** — The JWT is persisted in `localStorage` for simplicity in a single-page application context. This means the session survives page refreshes without a round-trip to the server.

6. **Token expiry is 24 hours (1440 minutes)** — After expiry, users must re-authenticate. No refresh token flow is implemented.

7. **All API routes require a valid Bearer token** except `/api/auth/register` and `/api/auth/login`.

8. **CORS is explicitly configured** — The backend whitelists the frontend origin (`http://localhost:5173` in dev, configurable via `FRONTEND_URL` in production).

9. **Passwords are never stored in plaintext** — `bcrypt` with `passlib` is used for hashing at registration and verification at login.

---

## Tradeoffs & Technical Decisions

### 1. Python + FastAPI over Node.js + Express

**Decision:** Migrated the backend to Python/FastAPI with Motor (async MongoDB driver).

**Rationale:**
- FastAPI provides automatic OpenAPI/Swagger documentation out of the box — zero extra setup.
- Pydantic v2 gives strong, declarative request/response validation with clear error messages.
- Motor enables fully async database operations, which is critical for a non-blocking API server.
- Type safety is enforced end-to-end via Python type hints, reducing runtime bugs.

**Tradeoff:** Requires a Python runtime and `venv` setup instead of a single `npm install`. Slightly higher barrier to entry for JS-only developers.

---

### 2. JWT Stored in localStorage (not httpOnly cookies)

**Decision:** The access token is stored in the browser's `localStorage`.

**Rationale:**
- Works cleanly in a pure SPA without needing backend cookie-handling logic.
- Simplifies Axios setup — token is attached via an `Authorization: Bearer` header interceptor.

**Tradeoff:** Vulnerable to XSS attacks if a malicious script runs in the same origin. For production-grade, high-security apps, `httpOnly` cookies would be the preferred approach since JavaScript cannot access them.

---

### 3. React Context API over Redux / Zustand

**Decision:** Global auth state is managed with React's built-in Context API + `useReducer`.

**Rationale:**
- The app has a single global state concern: whether a user is logged in and their token.
- Redux adds boilerplate (actions, reducers, store, selectors) that isn't justified at this scale.
- Context API is built into React, requires no extra dependency.

**Tradeoff:** For a larger app with complex cross-cutting state (filters, notifications, user preferences), Redux Toolkit or Zustand would be more maintainable. Context API can cause unnecessary re-renders if not structured carefully.

---

### 4. Optimistic UI Updates for Drag & Drop

**Decision:** When a task is dragged between columns, the UI updates immediately before the API call completes.

**Rationale:**
- Instant visual feedback dramatically improves perceived performance.
- The board feels smooth and responsive rather than waiting for a round trip.

**Tradeoff:** If the API call fails (e.g., network error), the card must be rolled back to its original position. Error handling reverts the state, but there is a brief moment of "incorrect" UI.

---

### 5. Motor (Async) over PyMongo (Sync)

**Decision:** Used `motor` (async MongoDB driver) instead of the standard `pymongo`.

**Rationale:**
- FastAPI is an async framework built on `asyncio`/Starlette. Blocking sync I/O calls inside async route handlers would negate the async benefits and starve the event loop.
- Motor is the official async wrapper for PyMongo and integrates seamlessly with `await`.

**Tradeoff:** Slightly more complex code patterns (all DB calls require `await`). Motor's API is intentionally close to PyMongo's, so the learning curve is minimal.

---

### 6. MongoDB Atlas (Cloud) over a Local MongoDB Instance

**Decision:** The database is hosted on MongoDB Atlas (free tier M0 cluster).

**Rationale:**
- Zero setup for the database itself — no local MongoDB installation required.
- Free tier is sufficient for development and small-scale production.
- Built-in replication, backups, and monitoring via the Atlas dashboard.

**Tradeoff:** Requires an internet connection to run the app locally. Cold-start latency on the free tier can occasionally be slow (~1–2 seconds on first connection).

---

### 7. Vite over Create React App (CRA)

**Decision:** Frontend is scaffolded and built with Vite 5.

**Rationale:**
- Vite uses native ES modules and esbuild for near-instant Hot Module Replacement (HMR).
- Build output is significantly smaller and faster than CRA's webpack-based output.
- CRA is now deprecated/unmaintained by the React team.

**Tradeoff:** Slightly different project structure and configuration conventions compared to CRA. Environment variables must be prefixed with `VITE_` instead of `REACT_APP_`.

---

## Future Improvements

- [ ] Task priorities: Low / Medium / High
- [ ] Due dates with calendar date picker
- [ ] Search & filtering by title, stage, or priority
- [ ] Refresh token support to extend sessions without re-login
- [ ] Switch JWT to httpOnly cookies for improved security
- [ ] Task assignments for team/collaborative mode
- [ ] Email notifications for overdue tasks
- [ ] Activity log / audit trail per task
- [ ] File attachments on tasks
- [ ] Dark/Light mode toggle
- [ ] Pagination or infinite scroll for large task lists
- [ ] Unit and integration tests (pytest for backend, Vitest for frontend)

---

## Deployment

### Backend (Render)

1. Push the project to a GitHub repository
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `FRONTEND_URL`

### Frontend (Vercel)

1. Push the project to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy — Vercel handles the Vite build automatically

---

## Live Links

- 🌐 **Frontend**: `https://taskflow.vercel.app` *(replace with your deployed URL)*
- 🔌 **Backend API**: `https://taskflow-api.onrender.com` *(replace with your deployed URL)*
- 📄 **API Docs (Swagger)**: `https://taskflow-api.onrender.com/docs`

---

*Built with ❤️ using React 18 + FastAPI + MongoDB Atlas*
