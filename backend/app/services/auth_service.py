from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.config.database import db_helper
from app.schemas.auth_schema import UserRegister, UserLogin
from app.utils.password_handler import PasswordHandler
from app.utils.jwt_handler import JWTHandler
# pyrefly: ignore [missing-import]
from bson import ObjectId

class AuthService:
    @staticmethod
    async def register_user(user_data: UserRegister):
        # Normalize email address to lowercase
        email = user_data.email.lower()
        
        # Check if email exists
        existing_user = await db_helper.db.users.find_one({"email": email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists with this email address"
            )
            
        # Hash password and store user
        hashed_password = PasswordHandler.hash_password(user_data.password)
        new_user = {
            "name": user_data.name,
            "email": email,
            "password": hashed_password,
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc)
        }
        
        result = await db_helper.db.users.insert_one(new_user)
        user_id = str(result.inserted_id)
        
        # Generate token
        token = JWTHandler.create_access_token({"id": user_id})
        
        return {
            "token": token,
            "id": user_id,
            "name": new_user["name"],
            "email": new_user["email"]
        }

    @staticmethod
    async def login_user(login_data: UserLogin):
        email = login_data.email.lower()
        
        # Check if email exists
        user = await db_helper.db.users.find_one({"email": email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid credentials"
            )
            
        # Verify password
        if not PasswordHandler.verify_password(login_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid credentials"
            )
            
        user_id = str(user["_id"])
        
        # Generate token
        token = JWTHandler.create_access_token({"id": user_id})
        
        return {
            "token": token,
            "id": user_id,
            "name": user["name"],
            "email": user["email"]
        }
