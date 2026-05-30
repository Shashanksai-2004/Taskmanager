# TaskFlow Python API (FastAPI)

Welcome to the TaskFlow Python Backend! This modern backend has been migrated from Node.js/Express to **FastAPI** to showcase advanced python architectural concepts, clean dependency injection, and scalable asynchronous database integration.

---

## 🏗️ Architecture & Folder Structure

This project uses a clean **Service Layer Architecture** to isolate routing layers from complex business operations:

```txt
backend/
├── app/
│   ├── main.py                 # FastAPI Application configuration & lifespans
│   ├── config/
│   │   ├── database.py         # Async Motor MongoClient helper
│   │   └── settings.py         # Pydantic Settings management (env loads)
│   ├── middleware/
│   │   └── auth_middleware.py  # Dependency-injected JWT Authorization security
│   ├── routes/
│   │   ├── auth_routes.py      # Auth routers (Login / Register endpoints)
│   │   └── task_routes.py      # Tasks CRUD routers
│   ├── services/
│   │   ├── auth_service.py     # Auth business logic (registration and hashing)
│   │   └── task_service.py     # Task CRUD business logic (scoped user validation)
│   ├── schemas/
│   │   ├── auth_schema.py      # Pydantic strict data models for Auth
│   │   └── task_schema.py      # Pydantic models & Aliased responses for tasks
│   └── utils/
│       ├── jwt_handler.py      # JWT creation/verification utilities
│       └── password_handler.py # Bcrypt pass verification utilities
├── requirements.txt            # Python dependencies
└── .env                        # Local environmental variables
```

---

## ⚡ Tech Stack Specs

* **Core Framework**: `FastAPI` (Modern, fast, ASGI-native)
* **ASGI Server**: `Uvicorn` (High performance ASGI server)
* **Database Driver**: `Motor` (Official asynchronous Python driver for MongoDB)
* **Data Validations**: `Pydantic v2` (Fast validation powered by Rust under the hood)
* **Security & Auth**: `python-jose`, `passlib` with `bcrypt` (secure JWTs & salted password hashing)

---

## 🔑 Key Interview Talking Points

### 1. Asynchronous Event-Driven Flow (ASGI vs WSGI)
* **Explanation**: Express.js is naturally non-blocking and single-threaded. FastAPI uses standard Python `async/await` syntax built on ASGI (Asynchronous Server Gateway Interface) instead of old WSGI (like Flask). This enables FastAPI to handle thousands of concurrent operations in a single thread via the asyncio event loop—making it incredibly memory efficient.

### 2. Dependency Injection for Security
* **Explanation**: In standard frameworks, route protection relies on chain middleware. FastAPI handles this via `Depends()`. For example, `get_current_user` extracts the JWT token, contacts MongoDB, verifies the user, and serves it as a clean local variable directly to protected endpoints (`current_user: dict = Depends(get_current_user)`). This isolates testing, simplifies routing, and makes route authorization easily readable.

### 3. Database Scoping (Multi-Tenant Access Control)
* **Explanation**: The database uses MongoDB Atlas. To ensure multi-tenant security, the task database queries are strictly hardcoded to include the authenticated user ID: `db.tasks.find({"user": user_id})`. Users can never access, modify, or delete cards belonging to other accounts.

### 4. Interactive OpenAPI Docs
* **Explanation**: FastAPI parses our standard Pydantic validation schemas and automatically hosts interactive Swagger documentation at `/docs` and `/redoc`. This accelerates development testing and enables rapid demonstrations.

---

## 🚀 Setup & Execution Guide

### 1. Configure the Virtual Environment
Create a virtual environment inside your project:
```bash
python -m venv venv
```

Activate it:
* **Windows**: `venv\Scripts\Activate.ps1`
* **macOS/Linux**: `source venv/bin/activate`

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Launch Development Server
```bash
uvicorn app.main:app --reload --port 5000
```
The API is now running on **http://localhost:5000** and is fully integrated with your React frontend! Open **http://localhost:5000/docs** to test the API directly.
