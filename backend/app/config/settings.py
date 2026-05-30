import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Support relative or absolute file paths for local dev and hosting
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

class Settings(BaseSettings):
    PORT: int = 5000
    MONGO_URI: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        case_sensitive = True

settings = Settings()
