from fastapi import APIRouter, status
from app.schemas.auth_schema import UserRegister, UserLogin, LoginResponse
from app.services.auth_service import AuthService

router = APIRouter()

# API routes must map exactly to frontend expectations
@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    return await AuthService.register_user(user_data)

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(login_data: UserLogin):
    return await AuthService.login_user(login_data)
