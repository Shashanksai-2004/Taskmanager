# TaskFlow — Smart Task Manager

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=flat&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens" />
</p>

---

## Overview

**TaskFlow** is a full-stack Task Manager application with a beautiful dark-themed Kanban board. Authenticated users can manage their tasks across three stages: **Todo**, **In Progress**, and **Done**, with full drag-and-drop support.

---

## Features

- ✅ User Registration & Login with JWT authentication
- ✅ Persistent login state (localStorage)
- ✅ Create, Read, Update, Delete tasks
- ✅ Kanban board with 3 columns (Todo → In Progress → Done)
- ✅ **Drag & Drop** to move tasks between stages
- ✅ Progress tracker showing completion percentage
- ✅ Loading states on all async operations
- ✅ Toast notifications for all user actions
- ✅ Full form validation (frontend + backend)
- ✅ Protected routes (unauthenticated users redirected to login)
- ✅ Responsive — works on mobile, tablet, desktop
- ✅ Dark mode UI with glassmorphism effects

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool & dev server |
| Tailwind CSS 3 | Styling |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| Context API | State management |
| @hello-pangea/dnd | Drag & drop |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin requests |
| dotenv | Environment config |

---

## Installation

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A MongoDB Atlas account (free tier works)

---

### Backend Setup

```bash
cd task-manager/backend

# Install dependencies
npm install

# Configure environment
# Edit .env and set your values (see Environment Variables section)

# Start development server
npm run dev

# OR start production server
npm start
```

---

### Frontend Setup

```bash
cd task-manager/frontend

# Install dependencies
npm install

# Configure environment
# Edit .env: set VITE_API_URL to your backend URL

# Start development server
npm run dev

# Build for production
npm run build
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user, returns JWT | Public |

### Tasks

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks` | Get all tasks for logged-in user | ✅ Required |
| POST | `/api/tasks` | Create a new task | ✅ Required |
| PUT | `/api/tasks/:id` | Update task (title, description, stage) | ✅ Required |
| DELETE | `/api/tasks/:id` | Delete task by ID | ✅ Required |

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

> For production, set `VITE_API_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com/api`)

---

## Assumptions

- Each user manages only their own tasks — tasks are scoped by user ID at the database level.
- JWT tokens expire after 7 days; users must re-login after expiry.
- Task stages are a fixed set: `Todo`, `In Progress`, `Done`.
- No email verification is required for registration.

---

## Tradeoffs

| Decision | Rationale |
|---|---|
| JWT in localStorage | Simple and works well for SPAs; for higher security apps, use httpOnly cookies |
| Context API over Redux | Sufficient for this scale; avoids over-engineering |
| Optimistic DnD updates | Better UX — instant visual feedback, rolled back on error |
| MongoDB Atlas | Zero-config cloud hosting, generous free tier |
| Vite over CRA | Faster HMR, smaller bundles, modern default |

---

## Future Improvements

- [ ] Task priorities (Low / Medium / High)
- [ ] Due dates with calendar picker
- [ ] Search and filtering by title/stage
- [ ] Task assignments (team mode)
- [ ] Email notifications for due tasks
- [ ] Activity log / audit trail
- [ ] File attachments
- [ ] Dark/Light mode toggle
- [ ] Pagination or infinite scroll for large task lists

---

## Deployment Instructions

### Backend (Render)

1. Push backend to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`

### Frontend (Vercel)

1. Push frontend to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy — Vercel handles the build automatically

---

## Live Links

- 🌐 **Frontend**: `https://taskflow.vercel.app` *(replace with your URL)*
- 🔌 **Backend API**: `https://taskflow-api.onrender.com` *(replace with your URL)*

---

## Project Structure

```
task-manager/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── context/        # Auth context (global state)
│   │   ├── services/       # API service functions
│   │   └── utils/          # Axios instance
│   └── vite.config.js
│
└── backend/
    ├── config/             # DB connection
    ├── controllers/        # Business logic
    ├── middleware/         # JWT auth middleware
    ├── models/             # Mongoose schemas
    └── routes/             # Express routes
```

---

*Built with ❤️ using React + Node.js + MongoDB*
