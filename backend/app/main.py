from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.config.database import connect_db, close_db
from app.routes.auth_routes import router as auth_router
from app.routes.task_routes import router as task_router

# Use modern lifespan context manager for database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB Atlas
    connect_db()
    yield
    # Shutdown: Close database client
    close_db()

app = FastAPI(
    title="TaskFlow API",
    description="Modern, production-ready Python backend for the TaskFlow SaaS platform",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers with matching API path prefixes
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(task_router, prefix="/api/tasks", tags=["Tasks"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "TaskFlow Python API",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    # Standard hosting port configurations
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
